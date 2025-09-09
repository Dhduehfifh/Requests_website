// prerender.mjs — 使用 serve + Puppeteer 预渲染多页面（无 waitForTimeout）
import { spawn } from 'node:child_process'
import fs from 'fs-extra'
import path from 'node:path'
import http from 'node:http'
import puppeteer from 'puppeteer'

const PREVIEW_DIR = fs.existsSync('dist') ? 'dist' : (fs.existsSync('build') ? 'build' : null)
if (!PREVIEW_DIR) {
  console.error('❌ 找不到构建目录 dist/ 或 build/，请先 npm run build')
  process.exit(1)
}
const OUT_DIR  = path.resolve('static-export')
const HOST     = '127.0.0.1'
const PORT     = 5050
const START    = `http://${HOST}:${PORT}`

const MAX_PAGES = 50     // 最大抓取页数
const WAIT_MS   = 1000   // 进入页面后再等一会儿
const ROOT_SEL  = '#root'// React 根节点（按你项目改）

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function waitHttpOk(url, timeoutMs=8000, interval=200){
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const req = http.get(url, res => {
        if (res.statusCode && res.statusCode < 500) { res.resume(); return resolve(true) }
        res.resume()
        if (Date.now() - start > timeoutMs) return reject(new Error('preview not ready'))
        setTimeout(tick, interval)
      })
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('preview not ready'))
        setTimeout(tick, interval)
      })
    }
    tick()
  })
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    const child = spawn(cmd, ['serve', PREVIEW_DIR, '-l', String(PORT)], { stdio: 'ignore' })
    child.on('error', reject)
    waitHttpOk(`${START}/`).then(() => resolve(() => child.kill())).catch(reject)
  })
}

function normalize(urlStr) {
  try {
    const u = new URL(urlStr)
    u.hash = ''
    if (u.origin !== new URL(START).origin) return null
    return u.toString()
  } catch { return null }
}

function urlToFile(u) {
  const { pathname } = new URL(u)
  const p = pathname.endsWith('/') ? pathname : pathname + '/'
  return path.join(OUT_DIR, '.' + p, 'index.html')
}

async function crawl() {
  await fs.remove(OUT_DIR)
  await fs.ensureDir(OUT_DIR)

  const stop = await startStaticServer()
  const browser = await puppeteer.launch({ headless: 'new' })
  const page    = await browser.newPage()

  const queue = [`${START}/`]
  const seen  = new Set(queue)
  let count = 0

  while (queue.length && count < MAX_PAGES) {
    const url = queue.shift()
    console.log('▶ visit', url)

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

    // 等待 React 根节点出现
    try {
      await page.waitForSelector(ROOT_SEL, { timeout: 5000 })
    } catch {}

    // 等待根节点有内容（避免空壳）
    try {
      await page.waitForFunction(
        sel => {
          const el = document.querySelector(sel)
          return !!(el && el.textContent && el.textContent.trim().length > 0)
        },
        { timeout: 5000 },
        ROOT_SEL
      )
    } catch {}

    // 兜底的固定等待（替代 waitForTimeout）
    await sleep(WAIT_MS)

    // 抓取渲染后的 HTML
    const html = await page.content()
    const file = urlToFile(url)
    await fs.ensureDir(path.dirname(file))
    await fs.writeFile(file, html, 'utf8')
    console.log('  ✓ saved =>', path.relative(process.cwd(), file))
    count++

    // 发现更多站内链接
    const hrefs = await page.$$eval('a[href]', as => as.map(a => a.href))
    for (const h of hrefs) {
      const n = normalize(h)
      if (!n) continue
      const pathname = new URL(n).pathname
      const last = pathname.split('/').pop() || ''
      if (last.includes('.')) continue // 跳过静态文件
      if (!seen.has(n)) { seen.add(n); queue.push(n) }
    }
  }

  await browser.close()
  await stop()
  console.log(`\nDone. Exported pages: ${count} → ${OUT_DIR}`)
}

crawl().catch(e => { console.error(e); process.exit(1) })