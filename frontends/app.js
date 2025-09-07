
/** GuildHub Demo App (pure HTML/JS, localStorage backed) **/

const Store = {
  get(k, fallback){ try{ return JSON.parse(localStorage.getItem(k)) ?? fallback }catch(e){ return fallback }},
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)) },
  now(){ return new Date().toISOString() },
};

function seed() {
  if(!Store.get('gd_seeded', false)) {
    const users = [
      {id:"u1", name:"You (Freelancer)", avatar:"🧑‍💻", homepage:"#"},
      {id:"u2", name:"Ava Employer", avatar:"👩‍💼", homepage:"#"},
      {id:"u3", name:"Ken Maker", avatar:"🛠️", homepage:"#"}
    ];
    const ads = [
      {id:"ad1", text:"🔥 佣金减免周—本周完成的前100个委托返1%平台费", href:"#"},
      {id:"ad2", text:"🛡️ 安全提示：平台严禁线下转账，谨防诈骗", href:"#"},
      {id:"ad3", text:"🎯 新功能：链接卡片预览，发帖更清晰 >", href:"tutorial.html"}
    ];
    const reqs = [
      {id:"r1", title:"制作一个城市游玩攻略海报",
       description:"需要会做简单设计，包含这两个参考链接：https://zh.wikipedia.org/wiki/Toronto https://www.toronto.ca/",
       budget:300, createdBy:"u2", createdAt:Store.now(),
       expiresAt:addDays(7), anonymous:false, status:"open", assignedTo:null},
      {id:"r2", title:"小程序支付对接（微信/Stripe）",
       description:"后端Node，前端Vue。需求文档：https://example.com/spec/payments_v1",
       budget:1200, createdBy:"u3", createdAt:Store.now(),
       expiresAt:addDays(6), anonymous:true, status:"open", assignedTo:null}
    ];
    const qna = [
      {id:"q1", question:"如何把请求里的链接渲染成卡片？", createdBy:"u3", createdAt:Store.now(), answers:[
        {id:"a1", text:"使用正则提取URL，包一层卡片DOM就行。看教程页~", createdBy:"u2", createdAt:Store.now()},
      ]},
    ];
    const messages = [
      {id:"m1", threadType:"request", threadId:"r1", participants:["u1","u2"], messages:[
        {senderId:"u2", text:"你好，可以接这个活吗？", ts:Date.now()-1000*60*60},
        {senderId:"u1", text:"可以，我先看看需求~", ts:Date.now()-1000*60*30},
      ]},
    ];
    const ratings = [];
    Store.set('gd_users', users);
    Store.set('gd_ads', ads);
    Store.set('gd_requests', reqs);
    Store.set('gd_qna', qna);
    Store.set('gd_messages', messages);
    Store.set('gd_ratings', ratings);
    Store.set('gd_currentUserId', 'u1');
    Store.set('gd_seeded', true);
  }
}
function addDays(n){ const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString() }

function users(){ return Store.get('gd_users', []) }
function ads(){ return Store.get('gd_ads', []) }
function requests(){ return Store.get('gd_requests', []) }
function qnas(){ return Store.get('gd_qna', []) }
function msgs(){ return Store.get('gd_messages', []) }
function ratings(){ return Store.get('gd_ratings', []) }
function currentUser(){ return users().find(u=>u.id===Store.get('gd_currentUserId','u1')) || users()[0] }

function saveRequests(list){ Store.set('gd_requests', list) }
function saveQnas(list){ Store.set('gd_qna', list) }
function saveMsgs(list){ Store.set('gd_messages', list) }
function saveRatings(list){ Store.set('gd_ratings', list) }

function userById(id){ return users().find(u=>u.id===id) }

function header(active){
  const u = currentUser();
  const el = document.querySelector('#app-header');
  if(!el) return;
  const nav = (href, text)=>`<a href="${href}" class="${active===href?'active':''}">${text}</a>`;
  el.innerHTML = `
    <div class="header">
      <div class="navbar container">
        <div class="brand">⚔️ GuildHub</div>
        <div class="navlinks">
          ${nav('index.html','首页')}
          ${nav('qna.html','公开问答')}
          ${nav('messages.html','私信')}
          ${nav('profile.html','我的主页')}
          ${nav('tutorial.html','链接卡片教程')}
        </div>
        <div class="spacer"></div>
        <div class="user-switch">
          <div class="avatar">${u.avatar}</div>
          <select id="userSelect"></select>
        </div>
      </div>
    </div>`;
  const sel = el.querySelector('#userSelect');
  users().forEach(x=>{
    const opt = document.createElement('option');
    opt.value = x.id; opt.textContent = x.name;
    if(x.id === u.id) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', (e)=>{
    Store.set('gd_currentUserId', e.target.value);
    location.reload();
  });
}

function renderAdbar(){
  const list = ads();
  const track = document.querySelector('.ad-track');
  if(!track) return;
  track.innerHTML = list.map(a => `
    <div class="ad">
      <span class="mark">AD</span>
      <a href="${a.href || '#'}"><strong>${escapeHtml(a.text)}</strong></a>
    </div>
  `).join('');
  let idx = 0;
  setInterval(()=>{
    idx = (idx+1)%list.length;
    track.style.transform = `translateX(-${idx*100}%)`;
  }, 3500);
}

function escapeHtml(s){ return (s || '').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) }

function linkCardsFromText(text){
  const urlRegex = /(https?:\/\/[^\s)]+)(?=\s|$|\)|\]|,)/g;
  const urls = (text.match(urlRegex) || []);
  const cards = urls.map(u=>{
    const domain = (new URL(u)).hostname.replace(/^www\./,'');
    return `
      <a class="link-card" href="${u}">
        <div class="favicon">${domain.split('.').slice(0,1)[0][0]?.toUpperCase()||'🌐'}</div>
        <div>
          <div class="title">${escapeHtml(u)}</div>
          <div class="domain">${escapeHtml(domain)}</div>
        </div>
      </a>
    `;
  });
  return cards.join('');
}

function statusBadge(req){
  const now = new Date();
  const exp = new Date(req.expiresAt);
  if(req.status === 'completed') return `<span class="badge good">已完成</span>`;
  if(exp < now) return `<span class="badge bad">已过期</span>`;
  if(req.assignedTo) return `<span class="badge warn">进行中</span>`;
  return `<span class="badge">招募中</span>`;
}

function renderRequestCard(req){
  const creator = userById(req.createdBy);
  return `
    <div class="card request">
      <div class="avatar">${req.anonymous?'🫥':creator.avatar}</div>
      <div class="request-main">
        <div class="section-title"><a href="request.html?id=${req.id}">${escapeHtml(req.title)}</a></div>
        <div class="meta">
          ${req.anonymous? '匿名委托' : `<a href="profile.html?id=${creator.id}">${escapeHtml(creator.name)}</a>`}
          · 预算 ¥${req.budget} · 截止 ${new Date(req.expiresAt).toLocaleDateString()}
        </div>
        <div class="status-row">
          ${statusBadge(req)}
          <div class="chips"><span class="badge">#${req.id}</span></div>
        </div>
        <div class="help" style="margin-top:6px">${escapeHtml(req.description)}</div>
        <div class="link-cards">${linkCardsFromText(req.description)}</div>
      </div>
    </div>
  `;
}

function activeRequestsCount(uid){
  const now = new Date();
  return requests().filter(r=>r.createdBy===uid && r.status!=='completed' && new Date(r.expiresAt) > now).length;
}

function createRequest(payload){
  // Enforce <= 3 active requests
  const uid = currentUser().id;
  if(activeRequestsCount(uid) >= 3){
    alert("每位用户最多拥有 3 个未完成/未过期的委托。请先完成或等待过期。");
    return false;
  }
  // Enforce expiry <= 7 days from now
  const now = new Date();
  const in7 = new Date(); in7.setDate(in7.getDate()+7);
  const exp = new Date(payload.expiresAt);
  if(exp > in7){
    alert("委托最长期限为 7 天，请重新选择截止日期。");
    return false;
  }
  const list = requests();
  const id = 'r' + (Math.max(0, ...list.map(x=>parseInt(x.id.slice(1)) || 0)) + 1);
  const req = {
    id, title:payload.title, description:payload.description, budget:payload.budget,
    createdBy:uid, createdAt:Store.now(), expiresAt:payload.expiresAt,
    anonymous: !!payload.anonymous, status:'open', assignedTo:null
  };
  list.unshift(req);
  saveRequests(list);
  location.href = `request.html?id=${id}`;
  return true;
}

function markAssigned(reqId, workerId){
  const list = requests();
  const r = list.find(x=>x.id===reqId);
  if(!r) return;
  r.assignedTo = workerId;
  saveRequests(list);
  // create private message thread
  const threads = msgs();
  const exists = threads.find(t=>t.threadType==='private' && t.participants.includes(r.createdBy) && t.participants.includes(workerId) && t.threadId===reqId);
  if(!exists){
    threads.push({id:'m'+(threads.length+1), threadType:'private', threadId:reqId, participants:[r.createdBy, workerId], messages:[]});
    saveMsgs(threads);
  }
  alert('已达成合作，可前往“私信”页面沟通细节');
  location.reload();
}

function markCompleted(reqId){
  const list = requests();
  const r = list.find(x=>x.id===reqId);
  if(!r) return;
  r.status = 'completed';
  saveRequests(list);
  alert('已标记为完成，可在双方主页撰写评价。');
  location.reload();
}

function ensureDateLimit(inputId){
  const input = document.getElementById(inputId);
  if(!input) return;
  const today = new Date();
  const max = new Date(); max.setDate(max.getDate()+7);
  input.min = today.toISOString().split('T')[0];
  input.max = max.toISOString().split('T')[0];
}

function mountIndex(){
  header('index.html');
  renderAdbar();
  ensureDateLimit('expiresAt');
  const list = requests().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  document.getElementById('reqList').innerHTML = list.map(renderRequestCard).join('') || `<div class="empty">暂无委托</div>`;
  document.getElementById('newReqForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.budget = parseFloat(data.budget || 0);
    data.anonymous = !!data.anonymous;
    createRequest(data);
  });
  document.getElementById('activeCount').textContent = activeRequestsCount(currentUser().id);
}

function mountRequest(){
  header('request.html');
  renderAdbar();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const r = requests().find(x=>x.id===id);
  if(!r){ document.getElementById('detail').innerHTML = `<div class="empty">未找到该委托</div>`; return; }
  const creator = userById(r.createdBy);
  const worker = r.assignedTo ? userById(r.assignedTo) : null;
  document.getElementById('detail').innerHTML = `
    <div class="card">
      <div style="display:flex;gap:12px;align-items:center">
        <div class="avatar">${r.anonymous?'🫥':creator.avatar}</div>
        <div>
          <div class="section-title">${escapeHtml(r.title)}</div>
          <div class="meta">${r.anonymous ? '匿名委托' : `<a href="profile.html?id=${creator.id}">${escapeHtml(creator.name)}</a>`} · 预算 ¥${r.budget} · 截止 ${new Date(r.expiresAt).toLocaleDateString()}</div>
          <div class="status-row">${statusBadge(r)}</div>
        </div>
        <div class="spacer"></div>
        <div class="chips">
          ${!r.assignedTo && r.status!=='completed' ? `<button class="btn small primary" id="btnTake">接单</button>`:''}
          ${!r.assignedTo && r.status!=='completed' && currentUser().id===r.createdBy ? `<button class="btn small" id="btnAssignMe">指派给当前用户</button>`:''}
          ${r.assignedTo && r.status!=='completed' && currentUser().id===r.createdBy ? `<button class="btn small good" id="btnDone">标记完成</button>`:''}
          ${r.assignedTo ? `<a class="btn small" href="messages.html?req=${r.id}">私信沟通</a>`:''}
        </div>
      </div>
      <hr class="sep"/>
      <div class="help">${escapeHtml(r.description)}</div>
      <div class="link-cards">${linkCardsFromText(r.description)}</div>
    </div>
    <div style="height:12px"></div>
    <div class="grid two-col">
      <div class="card">
        <div class="section-title">委托聊天（仅雇主与接单者可见）</div>
        <div class="chat">
          <div class="log" id="chatLog"></div>
          <div class="composer">
            <input id="msgInput" class="input" placeholder="输入消息…" />
            <button id="sendBtn" class="btn primary">发送</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-title">提示</div>
        <div class="help small-note">达成合作后将自动创建私信线程用于细节沟通。完成后双方可在对方主页撰写评价并打分。</div>
      </div>
    </div>
  `;
  const thread = ensureRequestThread(r);
  wireChat(thread);

  const me = currentUser().id;
  const btnTake = document.getElementById('btnTake');
  if(btnTake) btnTake.onclick = ()=> markAssigned(r.id, me);
  const btnAssignMe = document.getElementById('btnAssignMe');
  if(btnAssignMe) btnAssignMe.onclick = ()=> markAssigned(r.id, me);
  const btnDone = document.getElementById('btnDone');
  if(btnDone) btnDone.onclick = ()=> markCompleted(r.id);
}

function ensureRequestThread(r){
  const list = msgs();
  let t = list.find(x=>x.threadType==='request' && x.threadId===r.id);
  if(!t){
    t = {id:'m'+(list.length+1), threadType:'request', threadId:r.id, participants:[r.createdBy, currentUser().id], messages:[]};
    list.push(t); saveMsgs(list);
  }
  return t;
}

function wireChat(thread){
  const log = document.getElementById('chatLog');
  function render(){
    const u = currentUser();
    log.innerHTML = (thread.messages||[]).map(m=>{
      const mine = m.senderId===u.id;
      return `<div class="msg ${mine?'me':'other'}">${escapeHtml(m.text)}<div class="small-note">${new Date(m.ts).toLocaleTimeString()}</div></div>`;
    }).join('') || `<div class="empty">还没有消息</div>`;
    log.scrollTop = log.scrollHeight;
  }
  render();
  document.getElementById('sendBtn').onclick = ()=>{
    const input = document.getElementById('msgInput');
    const txt = input.value.trim(); if(!txt) return;
    const all = msgs(); const t = all.find(x=>x.id===thread.id);
    t.messages.push({senderId:currentUser().id, text:txt, ts:Date.now()});
    saveMsgs(all); input.value=''; render();
  };
}

function mountQna(){
  header('qna.html');
  const el = document.getElementById('qnaList');
  renderQna(el);
  const form = document.getElementById('qForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if(data.anonymous) { alert("公开问答不允许匿名"); return; }
    const list = qnas();
    const id = 'q'+(list.length+1);
    list.unshift({id, question:data.question, createdBy:currentUser().id, createdAt:Store.now(), answers:[]});
    saveQnas(list);
    form.reset();
    renderQna(el);
  });
}

function renderQna(container){
  const list = qnas();
  container.innerHTML = list.map(q=>{
    const u = userById(q.createdBy);
    const answers = (q.answers||[]).map(a=>{
      const au = userById(a.createdBy);
      return `<div class="card" style="background:#fafafa">
        <div class="meta"><a href="profile.html?id=${au.id}">${escapeHtml(au.name)}</a> · ${new Date(a.createdAt).toLocaleString()}</div>
        <div style="margin-top:6px">${escapeHtml(a.text)}</div>
      </div>`;
    }).join('');
    return `<div class="card">
      <div class="section-title">${escapeHtml(q.question)}</div>
      <div class="meta">提问者：<a href="profile.html?id=${u.id}">${escapeHtml(u.name)}</a> · ${new Date(q.createdAt).toLocaleString()}</div>
      <div style="height:8px"></div>
      <div>${answers || '<div class="empty">还没有回答</div>'}</div>
      <div style="height:8px"></div>
      <form data-q="${q.id}" class="answerForm">
        <input class="input" name="answer" placeholder="写下你的回答…" />
        <div style="height:8px"></div>
        <button class="btn primary small">提交回答</button>
      </form>
    </div>`;
  }).join('') || `<div class="empty">暂无提问</div>`;
  container.querySelectorAll('.answerForm').forEach(f=>{
    f.addEventListener('submit', (e)=>{
      e.preventDefault();
      const qid = f.getAttribute('data-q');
      const txt = f.answer.value.trim(); if(!txt) return;
      const list = qnas(); const item = list.find(x=>x.id===qid);
      item.answers = item.answers || [];
      item.answers.push({id:'a'+(item.answers.length+1), text:txt, createdBy:currentUser().id, createdAt:Store.now()});
      saveQnas(list); renderQna(container);
    });
  });
}

function mountProfile(){
  header('profile.html');
  const params = new URLSearchParams(location.search);
  const uid = params.get('id') || currentUser().id;
  const u = userById(uid);
  if(!u){ document.getElementById('profile').innerHTML = `<div class="empty">未找到用户</div>`; return; }

  const myCompleted = requests().filter(r=>r.status==='completed' && (r.createdBy===uid || r.assignedTo===uid));
  const myRatings = ratings().filter(x=>x.toUser===uid);

  document.getElementById('profile').innerHTML = `
    <div class="card" style="display:flex;gap:12px;align-items:center">
      <div class="avatar" style="width:60px;height:60px;font-size:1.4rem">${u.avatar}</div>
      <div>
        <div class="section-title">${escapeHtml(u.name)}</div>
        <div class="meta"><a href="${u.homepage}">个人主页</a></div>
        <div class="meta">历史完成：${myCompleted.length} · 平均评分：${avgScoreText(myRatings)}</div>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="grid two-col">
      <div class="card">
        <div class="section-title">完成的任务</div>
        ${myCompleted.map(r=>`
          <div class="card" style="margin-top:10px">
            <div><a href="request.html?id=${r.id}">${escapeHtml(r.title)}</a></div>
            <div class="meta">预算 ¥${r.budget} · 完成于 ${new Date(r.expiresAt).toLocaleDateString()}</div>
            ${rateBox(uid, r)}
          </div>
        `).join('') || '<div class="empty">暂无</div>'}
      </div>
      <div class="card">
        <div class="section-title">收到的评价</div>
        ${myRatings.map(rt=>renderRating(rt)).join('') || '<div class="empty">暂无评价</div>'}
      </div>
    </div>
  `;
  wireRatingForms(uid);
}

function avgScoreText(list){
  if(!list.length) return '—';
  const avg = (list.reduce((a,b)=>a+b.score,0)/list.length).toFixed(1);
  return `${avg} / 5 (${list.length} 条)`;
}
function renderRating(rt){
  const from = userById(rt.fromUser);
  return `<div class="card" style="background:#fafafa;margin-top:10px">
    <div class="meta"><a href="profile.html?id=${from.id}">${escapeHtml(from.name)}</a> → ${rt.role==='employee'?'雇员':'雇主'} 评分：${'★'.repeat(rt.score)}${'☆'.repeat(5-rt.score)}</div>
    <div style="margin-top:6px">${escapeHtml(rt.comment)}</div>
  </div>`;
}
function rateBox(profileUid, r){
  const me = currentUser().id;
  // If viewing someone else's profile, allow rating them for completed requests you participated in.
  const canRateEmployer = r.createdBy===profileUid && (me===r.assignedTo);
  const canRateWorker = r.assignedTo===profileUid && (me===r.createdBy);
  if(!(canRateEmployer || canRateWorker)) return '';
  const role = canRateWorker ? 'employee' : 'employer';
  const target = profileUid;
  const already = ratings().find(x=>x.fromUser===me && x.toUser===target && x.forRequestId===r.id);
  if(already) return `<div class="small-note">你已对该任务打分：${'★'.repeat(already.score)}${'☆'.repeat(5-already.score)} - ${escapeHtml(already.comment)}</div>`;
  return `
    <form class="rateForm" data-target="${target}" data-req="${r.id}" data-role="${role}" style="margin-top:8px">
      <div class="rating">
        ${[1,2,3,4,5].map(i=>`<span class="star" data-v="${i}">★</span>`).join('')}
      </div>
      <input class="input" name="comment" placeholder="写下你的评价（可选）"/>
      <div style="height:8px"></div>
      <button class="btn small primary">提交评分</button>
    </form>
  `;
}
function wireRatingForms(profileUid){
  document.querySelectorAll('.rateForm').forEach(f=>{
    let chosen = 5;
    f.querySelectorAll('.star').forEach(st=>{
      st.addEventListener('mouseenter', ()=>highlight(st.dataset.v));
      st.addEventListener('click', ()=>{ chosen=parseInt(st.dataset.v); highlight(chosen); });
    });
    function highlight(n){
      f.querySelectorAll('.star').forEach((s,i)=> s.style.color = (i < n) ? '#f59e0b' : '#9ca3af');
    }
    highlight(chosen);
    f.addEventListener('submit', (e)=>{
      e.preventDefault();
      const list = ratings();
      list.push({
        id:'rt'+(list.length+1),
        fromUser: currentUser().id,
        toUser: f.getAttribute('data-target'),
        forRequestId: f.getAttribute('data-req'),
        role: f.getAttribute('data-role'),
        score: chosen,
        comment: f.comment.value.trim(),
        ts: Date.now()
      });
      saveRatings(list);
      alert('已提交评分');
      location.reload();
    })
  });
}

function mountMessages(){
  header('messages.html');
  const threads = msgs().filter(t=>t.threadType==='private' && t.participants.includes(currentUser().id));
  const listEl = document.getElementById('threadList');
  listEl.innerHTML = threads.map(t=>{
    const other = t.participants.find(p=>p!==currentUser().id);
    const u = userById(other);
    const last = t.messages[t.messages.length-1];
    return `<div class="card">
      <div class="section-title">${escapeHtml(u.name)}</div>
      <div class="meta">关联委托：<a href="request.html?id=${t.threadId}">${t.threadId}</a></div>
      <div class="small-note">${last? escapeHtml(last.text) : '暂无消息'}</div>
      <div style="height:6px"></div>
      <a class="btn small" href="messages.html?open=${t.id}">打开</a>
    </div>`;
  }).join('') || `<div class="empty">暂无私信</div>`;
  const params = new URLSearchParams(location.search);
  const open = params.get('open');
  const reqParam = params.get('req');
  let thread = null;
  if(open){
    thread = msgs().find(t=>t.id===open);
  }else if(reqParam){
    // Open the private thread for a request if exists
    thread = msgs().find(t=>t.threadType==='private' && t.threadId===reqParam && t.participants.includes(currentUser().id));
  }
  if(thread){
    mountChatRight(thread);
  }
}

function mountChatRight(thread){
  const right = document.getElementById('chatRight');
  const other = thread.participants.find(p=>p!==currentUser().id);
  const u = userById(other);
  right.innerHTML = `
    <div class="card">
      <div class="section-title">与 ${escapeHtml(u.name)} 的私信</div>
      <div class="chat">
        <div class="log" id="chatLog"></div>
        <div class="composer">
          <input id="msgInput" class="input" placeholder="输入消息…" />
          <button id="sendBtn" class="btn primary">发送</button>
        </div>
      </div>
    </div>`;
  wireChat(thread);
}

function mountTutorial(){
  header('tutorial.html');
}

document.addEventListener('DOMContentLoaded', ()=>{
  seed();
});
