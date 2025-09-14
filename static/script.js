// ====== 基础配置 ======
const BASE_URL = ""; // 同域部署：留空即可。若后端是别的端口，填 "http://127.0.0.1:5000"
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function setEnvInfo() {
  $("#base-url").textContent = window.location.origin + (BASE_URL || "");
  $("#cookie-view").textContent = document.cookie || "(空)";
}

// 简单 fetch 包装
async function api(method, path, body) {
  const url = (BASE_URL || "") + path;
  const init = { method, headers: {} };
  if (body && method !== "GET") {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const resp = await fetch(url, init);
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text, status: resp.status };
  }
}

// 渲染 JSON
function showJSON(el, data) {
  el.textContent = JSON.stringify(data, null, 2);
}

// 卡片渲染：posts
function renderPostCards(list, container) {
  container.innerHTML = "";
  (list || []).forEach((p) => {
    const div = document.createElement("div");
    div.className = "card-mini";
    const pics = Array.isArray(p.pic_url) ? p.pic_url : (p.pic_url ? [p.pic_url] : []);
    div.innerHTML = `
      <h4>${escapeHtml(p.Title || p.title || "Untitled")}</h4>
      <div class="meta">${escapeHtml(p.post_time || "")}</div>
      <div>${escapeHtml(p.Description || p.description || "")}</div>
      ${p.Location || p.Locations ? `<div class="meta">Location: ${escapeHtml(p.Location || p.Locations)}</div>` : ""}
      ${p.Price ? `<div class="meta">Price: ${escapeHtml(typeof p.Price === "string" ? p.Price : (p.Price.amount + " " + (p.Price.currency||"") + " " + (p.Price.unit||"")))}</div>` : ""}
      <div class="meta">❤ ${p.Likes ?? p.likes ?? 0} · 💬 ${p.Comments ?? p.comments ?? 0}</div>
      ${pics.length ? `<div class="meta">pics: ${pics.map(x=>`<a href="${x}" target="_blank">img</a>`).join(" ")}</div>` : ""}
      ${p.post_url ? `<div><a href="${p.post_url}" target="_blank">${p.post_url}</a></div>` : ""}
    `;
    container.appendChild(div);
  });
}

// 卡片渲染：chats & recommend
function renderChatCards(list, container) {
  container.innerHTML = "";
  (list || []).forEach((c) => {
    const div = document.createElement("div");
    div.className = "card-mini";
    div.innerHTML = `
      <h4>${escapeHtml(c.Chat_Name || "Chat")}</h4>
      <div class="meta">${escapeHtml(c.Newest_msg_time || "")}</div>
      <div>${escapeHtml(c.Newest_msg || "")}</div>
      ${c.chat_url || c.Chat_url ? `<div><a href="${c.chat_url || c.Chat_url}" target="_blank">open</a></div>` : ""}
    `;
    container.appendChild(div);
  });
}

function renderRecoCards(list, container) {
  container.innerHTML = "";
  (list || []).forEach((r) => {
    const div = document.createElement("div");
    div.className = "card-mini";
    div.innerHTML = `
      <h4>[${escapeHtml(r.type || "")}] ${escapeHtml(r.title || "")}</h4>
      <div>${escapeHtml(r.description || "")}</div>
      ${r.url ? `<div><a href="${r.url}" target="_blank">${r.url}</a></div>` : ""}
    `;
    container.appendChild(div);
  });
}

// 安全文本
function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

// ====== 事件绑定 ======
function bindEvents() {
  // Activities
  $("#btn-activities").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const data = await api("GET", `/user/${uid}/activities`);
    showJSON($("#out-user"), data);
  });

  // Edit profile info
  $("#btn-profile-info").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const data = await api("GET", `/user/${uid}/edit_profile/info`);
    showJSON($("#out-user"), data);
  });

  // Logout
  $("#btn-logout").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const data = await api("GET", `/user/${uid}/logout`);
    showJSON($("#out-user"), data);
  });

  // 他人主页
  $("#btn-other-profile").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const wid = +$("#watcher-id").value || 2;
    const data = await api("GET", `/user/${uid}/profile/${wid}`);
    showJSON($("#out-other"), data);
  });

  // 六类帖子按钮
  $$(".btn-cat").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = +$("#user-id").value || 1;
      const cat = btn.dataset.cat;
      const data = await api("GET", `/user/${uid}/posts/${cat}`);
      renderPostCards(data.items, $("#post-cards"));
      showJSON($("#out-posts"), data);
    });
  });

  // sendpost
  $("#sendpost-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const uid = +$("#user-id").value || 1;
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const data = await api("POST", `/user/${uid}/sendpost`, payload);
    showJSON($("#out-sendpost"), data);
  });

  // chats
  $("#btn-chats").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const data = await api("GET", `/user/${uid}/chats`);
    renderChatCards(data.items, $("#chat-cards"));
    showJSON($("#out-chats"), data);
  });

  // search
  $("#btn-search").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const cat = $("#search-cat").value.trim() || "general";
    const q = $("#search-q").value.trim();
    const tags = ($("#search-tags").value.trim() || "")
      .split(",").map(s=>s.trim()).filter(Boolean);
    const data = await api("POST", `/search/${encodeURIComponent(cat)}/${uid}`, { q, tags });
    showJSON($("#out-search"), data);
  });

  // recommend
  $("#btn-reco").addEventListener("click", async () => {
    const uid = +$("#user-id").value || 1;
    const data = await api("GET", `/recommend/${uid}`);
    renderRecoCards(data.items, $("#reco-cards"));
    showJSON($("#out-reco"), data);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setEnvInfo();
  bindEvents();
});