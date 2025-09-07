async function safeFetch(url, options = {}) {
  // 封装好的 fetch 函数
  // 可以在这里添加各种拦截器、超时、重试等逻辑
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 5000);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 根据 Content-Type 解析响应
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    // 处理其他类型的响应，如 text 或 blob
    return await response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Fetch request timed out.');
    } else {
      console.error('Fetch error:', error);
    }
    throw error; // 重新抛出错误，让调用者可以处理
  }
}

class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.messageQueue = [];
    this.connect();
  }

  connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;
    
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected.");
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.flushQueue();
    };

    this.socket.onmessage = (event) => {
      // 在这里处理接收到的消息
      console.log("Message received:", event.data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected. Attempting to reconnect...");
      this.isConnecting = false;
      this.scheduleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.socket.close();
    };
  }

  scheduleReconnect() {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      // 如果连接未打开，将消息推入队列
      this.messageQueue.push(data);
    }
  }

  flushQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
// antiColor.js

/**
 * 颜色反转函数的核心逻辑
 * @param {string} color - 任何 CSS 颜色值，例如 #ffffff, rgb(255, 255, 255)
 * @returns {string} - 反转后的颜色值
 */
function invertColor(color) {
  // 这里是颜色转换和反转的复杂逻辑
  // 比如将 RGB 转换为数值，然后进行计算
  // const rgb = parseColor(color);
  // const invertedRgb = [255 - rgb[0], 255 - rgb[1], 255 - rgb[2]];
  // return formatColor(invertedRgb);
}

/**
 * 遍历 DOM 树并应用颜色反转
 * @param {HTMLElement} element - 从哪个元素开始遍历，通常是 document.body
 */
function applyInvert(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  // 1. 过滤图片元素，例如 <img> 标签
  if (element.tagName === 'IMG') {
    return;
  }

  // 2. 检查背景图片，跳过包含 url() 的元素
  const style = window.getComputedStyle(element);
  if (style.backgroundImage.includes('url(')) {
    return;
  }

  // 3. 遍历并修改颜色属性
  // 3.1 处理文本颜色
  const textColor = style.color;
  if (textColor && textColor !== 'transparent' && textColor !== 'initial') {
    element.style.color = invertColor(textColor);
  }

  // 3.2 处理背景颜色
  const bgColor = style.backgroundColor;
  if (bgColor && bgColor !== 'transparent' && bgColor !== 'initial') {
    element.style.backgroundColor = invertColor(bgColor);
  }

  // 4. 递归处理子元素
  for (let i = 0; i < element.children.length; i++) {
    applyInvert(element.children[i]);
  }
}

/**
 * 封装后的主函数
 * 启动颜色反转流程
 */
export function toggleInvertMode() {
  // 你可以在这里添加一些状态管理，比如一个全局的 class
  // document.body.classList.toggle('invert-mode');

  // 然后调用 applyInvert 函数
  applyInvert(document.body);
}

// 颜色转换的辅助函数，可能会非常冗长
// function parseColor(colorStr) { ... }
// function formatColor(rgb) { ... }