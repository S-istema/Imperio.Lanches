"use strict";

const socket = io({ transports: ["websocket", "polling"] });

// ── Estado ───────────────────────────────────────────────────
const ADM = {
  orders:  [],
  filter:  { status: "all", search: "" },
  currentId: null,
};

const SINFO = {
  pending:    { label:"Aguardando",       icon:"⏳", color:"#ff9800", next:["confirmed","cancelled"] },
  confirmed:  { label:"Confirmado",       icon:"✅", color:"#2196f3", next:["preparing","cancelled"] },
  preparing:  { label:"Preparando",       icon:"👨‍🍳", color:"#9c27b0", next:["delivering","cancelled"] },
  delivering: { label:"Saiu p/ Entrega",  icon:"🛵", color:"#ff5722", next:["delivered","cancelled"] },
  delivered:  { label:"Entregue",         icon:"🎉", color:"#4caf50", next:[] },
  cancelled:  { label:"Cancelado",        icon:"❌", color:"#f44336", next:[] },
};
const BTNS = {
  confirmed:  { icon:"fa-check",       label:"Confirmar",       cls:"qa-confirm" },
  preparing:  { icon:"fa-fire",        label:"Iniciar Preparo", cls:"qa-prepare" },
  delivering: { icon:"fa-motorcycle",  label:"Saiu p/ Entrega", cls:"qa-deliver" },
  delivered:  { icon:"fa-check-circle",label:"Entregue",        cls:"qa-done" },
  cancelled:  { icon:"fa-times",       label:"Cancelar",        cls:"qa-cancel" },
};

const fmt = v => `R$ ${Number(v).toFixed(2).replace(".",",")}`;
const esc = s => String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const elapsed = iso => {
  const d = Math.floor((Date.now()-new Date(iso))/60000);
  return d<1?"agora":d<60?`${d}min`:`${Math.floor(d/60)}h${String(d%60).padStart(2,"0")}`;
};

// ════════════════════════════════════════════════════════════
// CONEXÃO
// ════════════════════════════════════════════════════════════
socket.on("connect", () => {
  setConn(true);
  const tok = sessionStorage.getItem("adm_tok");
  if (tok) auth(tok);
});
socket.on("disconnect", () => setConn(false));

function setConn(ok) {
  const el = document.getElementById("connStatus");
  const ws = document.getElementById("wsStatusText");
  if (el) { el.textContent = ok?"● Online":"● Offline"; el.style.color = ok?"#4caf50":"#f44336"; }
  if (ws)   ws.textContent = ok ? "Conectado ✅" : "Desconectado ❌";
}

// ════════════════════════════════════════════════════════════
// EVENTOS TEMPO REAL
// ════════════════════════════════════════════════════════════
socket.on("order:new", order => {
  ADM.orders.unshift(order);
  refreshUI();
  notify(order);
});
socket.on("order:updated", order => {
  const i = ADM.orders.findIndex(o => o.id === order.id);
  if (i >= 0) ADM.orders[i] = order; else ADM.orders.unshift(order);
  refreshUI();
  if (ADM.currentId === order.id) renderModal(order);
});
socket.on("orders:all", orders => { ADM.orders = orders; refreshUI(); });
socket.on("stats:update", stats => {
  setText("statTotal",     stats.total);
  setText("statPending",   stats.pending);
  setText("statPreparing", stats.preparing);
  setText("statDelivering",stats.delivering);
  setText("statDelivered", stats.delivered);
  setText("statRevenue",   fmt(stats.todayRevenue));
  const nb = document.getElementById("navBadge");
  if (nb) { nb.textContent = stats.pending||""; nb.style.display = stats.pending>0?"flex":"none"; }
  setText("pendingPill", stats.pending);
  setText("settTotal",   stats.total);
});
socket.on("settings:sync", s => applySettings(s));

function setText(id, v) { const e=document.getElementById(id); if(e) e.textContent=v; }

// ════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const tok  = btoa(`${user}:${pass}`);
  const btn  = document.getElementById("btnLogin");
  const err  = document.getElementById("loginError");

  btn.disabled   = true;
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
  err.textContent = "";

  auth(tok, res => {
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
    if (!res.ok) {
      err.textContent = res.error || "Credenciais inválidas";
      document.getElementById("loginPass").value = "";
    }
  });
});

function auth(tok, cb) {
  socket.emit("admin:auth", { token: tok }, res => {
    if (res.ok) {
      sessionStorage.setItem("adm_tok", tok);
      document.getElementById("loginScreen").style.display  = "none";
      document.getElementById("adminPanel").style.display   = "flex";
    }
    cb?.(res);
  });
}

function togglePassVis() {
  const inp  = document.getElementById("loginPass");
  const icon = document.getElementById("eyeIcon");
  inp.type   = inp.type === "password" ? "text" : "password";
  icon.className = inp.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
}

function logout() {
  sessionStorage.removeItem("adm_tok");
  location.reload();
}

// ════════════════════════════════════════════════════════════
// NAVEGAÇÃO
// ════════════════════════════════════════════════════════════
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    navigateTo(link.dataset.page);
    closeSidebar();
  });
});

function navigateTo(pg) {
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  document.querySelector(`[data-page="${pg}"]`)?.classList.add("active");
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${pg}`)?.classList.add("active");
  const titles = { dashboard:"Dashboard", orders:"Pedidos", settings:"Configurações" };
  setText("pageTitle", titles[pg] ?? pg);
  if (pg === "orders") renderTable();
}

function toggleSidebar() {
  document.getElementById("adminSidebar").classList.toggle("open");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}
function closeSidebar() {
  document.getElementById("adminSidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

// ════════════════════════════════════════════════════════════
// REFRESH
// ════════════════════════════════════════════════════════════
function refreshOrders() {
  socket.emit("orders:get", {}, res => {
    if (res.ok) { ADM.orders = res.orders; refreshUI(); toast("✅ Atualizado"); }
  });
}

function refreshUI() {
  renderPending();
  renderActive();
  if (document.getElementById("page-orders").classList.contains("active")) renderTable();
}

// ════════════════════════════════════════════════════════════
// RENDER LISTAS DASHBOARD
// ════════════════════════════════════════════════════════════
function renderPending() {
  const list = document.getElementById("pendingList");
  const data = ADM.orders.filter(o => o.status === "pending");
  list.innerHTML = data.length
    ? data.map(cardHTML).join("")
    : `<div class="list-empty"><i class="fas fa-check-circle"></i><p>Nenhum pendente</p></div>`;
}

function renderActive() {
  const list = document.getElementById("activeList");
  const data = ADM.orders.filter(o => ["confirmed","preparing","delivering"].includes(o.status));
  list.innerHTML = data.length
    ? data.map(cardHTML).join("")
    : `<div class="list-empty"><p>Nenhum em andamento</p></div>`;
}

function cardHTML(o) {
  const si   = SINFO[o.status] || SINFO.pending;
  const time = elapsed(o.createdAt);
  const acts = (si.next || []).map(next => {
    const b = BTNS[next];
    return `<button class="qa-btn ${b.cls}" onclick="event.stopPropagation();updStatus('${o.id}','${next}')">
      <i class="fas ${b.icon}"></i> ${b.label}</button>`;
  }).join("");

  return `
    <div class="order-card" onclick="openModal('${o.id}')">
      <div class="oc-top">
        <span class="oc-code">${esc(o.code)}</span>
        <span class="oc-status" style="background:${si.color}">${si.icon} ${si.label}</span>
      </div>
      <div class="oc-name"><i class="fas fa-user"></i><strong>${esc(o.customer?.name)}</strong></div>
      <div class="oc-addr"><i class="fas fa-map-marker-alt"></i><span>${esc(o.address?.neighborhood)}</span></div>
      <div class="oc-items">${o.items?.slice(0,2).map(i=>`${i.quantity}× ${i.name}`).join(", ")||""}${(o.items?.length||0)>2?` +${o.items.length-2}`:""}</div>
      <div class="oc-foot">
        <span class="oc-total">${fmt(o.total)}</span>
        <span class="oc-time">⏱ ${time}</span>
      </div>
      ${acts ? `<div class="oc-actions" onclick="event.stopPropagation()">${acts}</div>` : ""}
    </div>`;
}

// ════════════════════════════════════════════════════════════
// TABELA DE PEDIDOS
// ════════════════════════════════════════════════════════════
function renderTable() {
  const body  = document.getElementById("tableBody");
  const empty = document.getElementById("tableEmpty");
  const sq    = ADM.filter.search.toLowerCase();
  const sf    = ADM.filter.status;

  let data = ADM.orders;
  if (sf !== "all") data = data.filter(o => o.status === sf);
  if (sq) data = data.filter(o =>
    o.code.toLowerCase().includes(sq) ||
    (o.customer?.name||"").toLowerCase().includes(sq) ||
    (o.customer?.phone||"").includes(sq)
  );

  if (!data.length) { body.innerHTML=""; empty.style.display="block"; return; }
  empty.style.display = "none";

  body.innerHTML = data.map(o => {
    const si   = SINFO[o.status] || SINFO.pending;
    const time = new Date(o.createdAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
    const acts = (si.next||[]).map(next => {
      const b = BTNS[next];
      return `<button class="t-btn ${b.cls}" title="${b.label}" onclick="event.stopPropagation();updStatus('${o.id}','${next}')"><i class="fas ${b.icon}"></i></button>`;
    }).join("") + `<button class="t-btn t-view" title="Ver" onclick="event.stopPropagation();openModal('${o.id}')"><i class="fas fa-eye"></i></button>`;

    return `
      <tr onclick="openModal('${o.id}')">
        <td><strong>${esc(o.code)}</strong></td>
        <td><strong>${esc(o.customer?.name)}</strong><br><small>${esc(o.customer?.phone)}</small></td>
        <td><small>${esc(o.address?.street)}, ${esc(o.address?.number)}</small><br><small>${esc(o.address?.neighborhood)}</small></td>
        <td><small>${o.items?.slice(0,2).map(i=>`${i.quantity}×${i.name}`).join(", ")||""}${(o.items?.length||0)>2?"...":""}</small></td>
        <td><strong>${fmt(o.total)}</strong></td>
        <td><small>${esc(o.payment?.label)}</small></td>
        <td><span class="status-pill" style="background:${si.color}">${si.icon} ${si.label}</span></td>
        <td><small>${time}</small></td>
        <td onclick="event.stopPropagation()"><div class="t-actions">${acts}</div></td>
      </tr>`;
  }).join("");
}

function filterOrders() {
  ADM.filter.status = document.getElementById("statusFilter").value;
  ADM.filter.search = document.getElementById("orderSearch").value.trim();
  renderTable();
}

// ════════════════════════════════════════════════════════════
// MODAL DE PEDIDO
// ════════════════════════════════════════════════════════════
function openModal(id) {
  const order = ADM.orders.find(o => o.id === id);
  if (!order) return;
  ADM.currentId = id;
  document.getElementById("orderModal").style.display = "flex";
  renderModal(order);
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
  ADM.currentId = null;
}

function renderModal(order) {
  const si = SINFO[order.status] || SINFO.pending;
  setText("modalCode", `Pedido ${order.code}`);

  const itemsHTML = (order.items||[]).map(i => `
    <div class="m-item">
      <span class="m-qty">${i.quantity}×</span>
      <div class="m-iname">
        <strong>${esc(i.name)}</strong>
        ${i.modifiers?.length ? `<small>${esc(i.modifiers.join(", "))}</small>` : ""}
      </div>
      <span class="m-iprice">${fmt(i.lineTotal)}</span>
    </div>`).join("");

  const tlHTML = [...(order.timeline||[])].reverse().map(t => {
    const ti = SINFO[t.status] || { icon:"📌", label: t.status };
    return `
      <div class="m-tl-item">
        <span>${ti.icon}</span>
        <div>
          <strong>${esc(ti.label)}</strong>
          <p>${esc(t.note)}</p>
          <time>${new Date(t.time).toLocaleString("pt-BR")}</time>
        </div>
      </div>`;
  }).join("");

  document.getElementById("modalBody").innerHTML = `
    <div class="m-banner" style="background:${si.color}20;border-left:4px solid ${si.color}">
      <span class="big-icon">${si.icon}</span>
      <div>
        <strong style="color:${si.color}">${si.label}</strong>
        <small>Atualizado: ${new Date(order.updatedAt).toLocaleString("pt-BR")}</small>
      </div>
    </div>

    <div class="m-section">
      <h4><i class="fas fa-user"></i> Cliente</h4>
      <p><strong>${esc(order.customer?.name)}</strong></p>
      <p>${esc(order.customer?.phone)}</p>
    </div>

    <div class="m-section">
      <h4><i class="fas fa-map-marker-alt"></i> Endereço</h4>
      <p>${esc(order.address?.street)}, ${esc(order.address?.number)}</p>
      <p>${esc(order.address?.neighborhood)}</p>
      ${order.address?.complement ? `<p><em>${esc(order.address.complement)}</em></p>` : ""}
    </div>

    <div class="m-section">
      <h4><i class="fas fa-shopping-bag"></i> Itens</h4>
      ${itemsHTML}
      <div class="m-totals">
        <div class="m-total-row"><span>Subtotal</span><span>${fmt(order.subtotal)}</span></div>
        <div class="m-total-row"><span>Entrega</span><span>${order.delivery>0?fmt(order.delivery):"Grátis"}</span></div>
        <div class="m-total-row grand"><span>Total</span><span>${fmt(order.total)}</span></div>
      </div>
    </div>

    <div class="m-section">
      <h4><i class="fas fa-credit-card"></i> Pagamento</h4>
      <p>${esc(order.payment?.label)}</p>
      ${order.payment?.needChange ? `<p>Troco para: ${esc(order.payment.changeFor)}</p>` : ""}
    </div>

    <div class="m-section">
      <h4><i class="fas fa-history"></i> Histórico</h4>
      <div class="m-timeline">${tlHTML}</div>
    </div>`;

  const acts = (si.next||[]).map(next => {
    const b = BTNS[next];
    return `<button class="act-btn ${b.cls}" onclick="updStatus('${order.id}','${next}')">
      <i class="fas ${b.icon}"></i> ${b.label}</button>`;
  }).join("") || `<p style="color:var(--muted);font-size:13px">Nenhuma ação disponível</p>`;
  document.getElementById("modalActions").innerHTML = acts;
}

// ════════════════════════════════════════════════════════════
// AÇÕES
// ════════════════════════════════════════════════════════════
function updStatus(id, status) {
  let note = "";
  if (status === "cancelled") {
    note = prompt("Motivo do cancelamento (opcional):") ?? "";
    if (note === null) return;
  }
  socket.emit("order:status", { orderId:id, status, note }, res => {
    toast(res.ok ? `✅ ${SINFO[status]?.label||status}` : `❌ ${res.error}`, !res.ok);
  });
}

function printTicket() {
  const order = ADM.orders.find(o => o.id === ADM.currentId);
  if (!order) return;
  const w   = window.open("","_blank","width=320,height=640");
  const now = new Date().toLocaleString("pt-BR");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${order.code}</title>
  <style>body{font-family:monospace;font-size:12px;padding:10px;max-width:280px;margin:0 auto}
  h1{font-size:14px;text-align:center}hr{border-top:1px dashed #000}
  .row{display:flex;justify-content:space-between}.bold{font-weight:bold}</style></head><body>
  <h1>👑 IMPÉRIO LANCHES</h1>
  <p style="text-align:center">${order.code} — ${now}</p><hr>
  <p><b>Cliente:</b> ${order.customer?.name}<br><b>Tel:</b> ${order.customer?.phone}</p>
  <p><b>Endereço:</b><br>${order.address?.street}, ${order.address?.number}<br>${order.address?.neighborhood}
  ${order.address?.complement?"<br>"+order.address.complement:""}</p><hr>
  <b>ITENS:</b><br>
  ${(order.items||[]).map(i=>`<div class="row"><span>${i.quantity}× ${i.name}</span><span>${fmt(i.lineTotal)}</span></div>
  ${i.modifiers?.length?`<small style="color:#666"> — ${i.modifiers.join(", ")}</small>`:""}`).join("")}
  <hr>
  <div class="row"><span>Subtotal</span><span>${fmt(order.subtotal)}</span></div>
  <div class="row"><span>Entrega</span><span>${order.delivery>0?fmt(order.delivery):"Grátis"}</span></div>
  <div class="row bold"><span>TOTAL</span><span>${fmt(order.total)}</span></div><hr>
  <p><b>Pagamento:</b> ${order.payment?.label}</p>
  ${order.payment?.needChange?`<p>Troco para: ${order.payment.changeFor}</p>`:""}
  <p style="text-align:center;font-size:10px;margin-top:8px">Obrigado pela preferência!</p>
  <script>window.onload=()=>{window.print();window.close()}<\/script>
  </body></html>`);
  w.document.close();
}

// ════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ════════════════════════════════════════════════════════════
function toggleLoja(checked) {
  socket.emit("settings:update", { lojaAberta: checked }, res => {
    toast(res.ok ? (checked?"Loja aberta ✅":"Loja fechada 🔒") : "Erro ao atualizar", !res.ok);
  });
}

function saveSettings() {
  socket.emit("settings:update", {
    lojaAberta:      document.getElementById("settLojaAberta")?.checked ?? true,
    delivery:        parseFloat(document.getElementById("settDelivery")?.value || 0),
    tempoPreparo:    parseInt(document.getElementById("settTempo")?.value || 45, 10),
    mensagemFechado: document.getElementById("settFechado")?.value || "",
  }, res => {
    const ok = document.getElementById("saveOk");
    if (res.ok) { if(ok){ok.style.display="block";setTimeout(()=>ok.style.display="none",2000);} toast("✅ Configurações salvas"); }
    else toast("❌ Erro ao salvar", true);
  });
}

function applySettings(s) {
  const lt = document.getElementById("lojaToggle");
  const sl = document.getElementById("settLojaAberta");
  const tx = document.getElementById("lojaText");
  const st = document.getElementById("settLojaText");
  if (lt) lt.checked = s.lojaAberta;
  if (sl) sl.checked = s.lojaAberta;
  if (tx) { tx.textContent = s.lojaAberta?"Aberta":"Fechada"; tx.className = s.lojaAberta?"loja-aberta":"loja-fechada-txt"; }
  if (st) st.textContent = s.lojaAberta?"Aberta":"Fechada";
  const de = document.getElementById("settDelivery");
  const te = document.getElementById("settTempo");
  const fe = document.getElementById("settFechado");
  if (de) de.value = s.delivery ?? 0;
  if (te) te.value = s.tempoPreparo ?? 45;
  if (fe) fe.value = s.mensagemFechado ?? "";
}

// ════════════════════════════════════════════════════════════
// EXPORT CSV
// ════════════════════════════════════════════════════════════
function exportCSV() {
  socket.emit("orders:export", {}, res => {
    if (!res.ok) { toast("❌ Erro ao exportar", true); return; }
    const rows = [
      ["Código","Cliente","Telefone","Rua","Número","Bairro","Itens","Total","Pagamento","Status","Data"],
      ...res.orders.map(o => [
        o.code,
        o.customer?.name||"",
        o.customer?.phone||"",
        o.address?.street||"",
        o.address?.number||"",
        o.address?.neighborhood||"",
        (o.items||[]).map(i=>`${i.quantity}x${i.name}`).join("; "),
        o.total?.toFixed(2)||"0.00",
        o.payment?.label||"",
        SINFO[o.status]?.label||o.status,
        new Date(o.createdAt).toLocaleString("pt-BR"),
      ]),
    ];
    const csv  = rows.map(r => r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv], { type:"text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href:url, download:`pedidos-${Date.now()}.csv` });
    a.click(); URL.revokeObjectURL(url);
    toast("✅ CSV exportado");
  });
}

// ════════════════════════════════════════════════════════════
// NOTIFICAÇÃO
// ════════════════════════════════════════════════════════════
function notify(order) {
  beep();
  toast(`🔔 Novo pedido ${order.code} — ${order.customer?.name}`);
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Novo Pedido! 🛒", { body:`${order.code} — ${fmt(order.total)}` });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function beep() {
  if (!document.getElementById("soundOn")?.checked) return;
  try {
    const ctx  = new (window.AudioContext||window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime+0.15);
    osc.frequency.setValueAtTime(880, ctx.currentTime+0.3);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.5);
    osc.start(); osc.stop(ctx.currentTime+0.5);
  } catch {}
}

function toast(msg, isErr = false) {
  const el = document.getElementById("admToast");
  if (!el) return;
  el.textContent = msg;
  el.className   = `adm-toast${isErr?" err":""}`;
  el.style.display = "block";
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = "none"; }, 3500);
}