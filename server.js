"use strict";

require("dotenv").config();
const express        = require("express");
const http           = require("http");
const { Server }     = require("socket.io");
const path           = require("path");
const { v4: uuidv4 } = require("uuid");
const cors           = require("cors");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ["websocket", "polling"],
});

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve a pasta admin
app.use("/admin-assets", express.static(path.join(__dirname, "admin")));
app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

// ── Estado global ────────────────────────────────────────────
const ORDERS   = new Map();
let   orderSeq = 0;

const SETTINGS = {
  lojaAberta:      true,
  delivery:        0,
  tempoPreparo:    45,
  mensagemFechado: "Estamos fechados no momento. Volte em breve!",
  storeName:       "Império Lanches",
  whatsapp:        process.env.WHATSAPP || "5584994994919",
};

// ── Token admin ──────────────────────────────────────────────
const ADMIN_TOKEN = Buffer.from(
  `${process.env.ADMIN_USER || "admin"}:${process.env.ADMIN_PASSWORD || "imperio2024"}`
).toString("base64");

function isAdmin(socket) {
  return socket.data.isAdmin === true;
}

// ── Status possíveis ─────────────────────────────────────────
const STATUS = {
  pending:    "pending",
  confirmed:  "confirmed",
  preparing:  "preparing",
  delivering: "delivering",
  delivered:  "delivered",
  cancelled:  "cancelled",
};

// ── Helpers ──────────────────────────────────────────────────
function allOrders() {
  return [...ORDERS.values()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function calcStats() {
  const orders = [...ORDERS.values()];
  const today  = new Date().toDateString();
  return {
    total:      orders.length,
    pending:    orders.filter(o => o.status === STATUS.pending).length,
    confirmed:  orders.filter(o => o.status === STATUS.confirmed).length,
    preparing:  orders.filter(o => o.status === STATUS.preparing).length,
    delivering: orders.filter(o => o.status === STATUS.delivering).length,
    delivered:  orders.filter(o => o.status === STATUS.delivered).length,
    cancelled:  orders.filter(o => o.status === STATUS.cancelled).length,
    todayOrders: orders.filter(
      o => new Date(o.createdAt).toDateString() === today
    ).length,
    todayRevenue: orders
      .filter(o =>
        new Date(o.createdAt).toDateString() === today &&
        o.status !== STATUS.cancelled
      )
      .reduce((s, o) => s + (o.total || 0), 0),
  };
}

function toAdmins(event, data) {
  io.to("admins").emit(event, data);
}

function pushStats() {
  toAdmins("stats:update", calcStats());
}

// ── Socket.io ────────────────────────────────────────────────
io.on("connection", socket => {
  console.log(`[WS] Conectado: ${socket.id}`);

  // ── Admin: autenticar ──────────────────────────────────────
  socket.on("admin:auth", ({ token }, cb) => {
    if (token !== ADMIN_TOKEN) {
      return cb({ ok: false, error: "Usuário ou senha inválidos" });
    }
    socket.data.isAdmin = true;
    socket.join("admins");
    cb({ ok: true });
    socket.emit("orders:all",    allOrders());
    socket.emit("settings:sync", SETTINGS);
    pushStats();
    console.log(`[ADMIN] Autenticado: ${socket.id}`);
  });

  // ── Cliente: criar pedido ──────────────────────────────────
  socket.on("order:create", (payload, cb) => {
    if (!SETTINGS.lojaAberta) {
      return cb({ ok: false, error: SETTINGS.mensagemFechado });
    }

    orderSeq++;
    const id    = uuidv4();
    const code  = `#${String(orderSeq).padStart(4, "0")}`;
    const now   = new Date().toISOString();

    const order = {
      id,
      code,
      status:    STATUS.pending,
      customer:  payload.customer  || {},
      address:   payload.address   || {},
      items:     payload.items     || [],
      subtotal:  Number(payload.subtotal) || 0,
      delivery:  SETTINGS.delivery,
      total:     (Number(payload.subtotal) || 0) + SETTINGS.delivery,
      payment:   payload.payment   || {},
      notes:     payload.notes     || "",
      createdAt: now,
      updatedAt: now,
      timeline: [
        { status: STATUS.pending, time: now, note: "Pedido recebido" },
      ],
    };

    ORDERS.set(id, order);
    socket.data.orderId = id;
    socket.join(`order:${id}`);

    cb({ ok: true, orderId: id, code });
    toAdmins("order:new", order);
    pushStats();
    console.log(`[PEDIDO] ${code} — ${order.customer.name} — R$ ${order.total}`);
  });

  // ── Cliente: rastrear pedido ───────────────────────────────
  socket.on("order:track", ({ orderId }, cb) => {
    const order = ORDERS.get(orderId);
    if (!order) return cb({ ok: false, error: "Pedido não encontrado" });
    socket.join(`order:${orderId}`);
    cb({ ok: true, order });
  });

  // ── Admin: listar pedidos ──────────────────────────────────
  socket.on("orders:get", (_d, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });
    cb({ ok: true, orders: allOrders() });
  });

  // ── Admin: atualizar status ────────────────────────────────
  socket.on("order:status", ({ orderId, status, note }, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });

    const order = ORDERS.get(orderId);
    if (!order) return cb({ ok: false, error: "Pedido não encontrado" });

    const VALID = Object.values(STATUS);
    if (!VALID.includes(status)) return cb({ ok: false, error: "Status inválido" });

    const prev     = order.status;
    order.status   = status;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      status,
      time: order.updatedAt,
      note: note || status,
    });

    io.to(`order:${orderId}`).emit("order:updated", order);
    toAdmins("order:updated", order);
    pushStats();
    cb({ ok: true, order });
    console.log(`[STATUS] ${order.code}: ${prev} → ${status}`);
  });

  // ── Admin: cancelar pedido ─────────────────────────────────
  socket.on("order:cancel", ({ orderId, reason }, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });

    const order = ORDERS.get(orderId);
    if (!order) return cb({ ok: false, error: "Pedido não encontrado" });

    order.status    = STATUS.cancelled;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      status: STATUS.cancelled,
      time: order.updatedAt,
      note: reason || "Cancelado pelo estabelecimento",
    });

    io.to(`order:${orderId}`).emit("order:updated", order);
    toAdmins("order:updated", order);
    pushStats();
    cb({ ok: true });
  });

  // ── Admin: configurações GET ───────────────────────────────
  socket.on("settings:get", (_d, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });
    cb({ ok: true, settings: SETTINGS });
  });

  // ── Admin: configurações UPDATE ────────────────────────────
  socket.on("settings:update", (payload, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });

    const allowed = ["lojaAberta", "delivery", "tempoPreparo", "mensagemFechado"];
    allowed.forEach(k => {
      if (payload[k] !== undefined) SETTINGS[k] = payload[k];
    });

    io.emit("settings:sync", SETTINGS);
    cb({ ok: true, settings: SETTINGS });
    console.log(`[CONFIG] lojaAberta=${SETTINGS.lojaAberta} | delivery=${SETTINGS.delivery}`);
  });

  // ── Admin: exportar CSV ────────────────────────────────────
  socket.on("orders:export", (_d, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });
    cb({ ok: true, orders: allOrders() });
  });

  // ── Admin: imprimir ticket ─────────────────────────────────
  socket.on("order:print", ({ orderId }, cb) => {
    if (!isAdmin(socket)) return cb({ ok: false, error: "Não autorizado" });
    const order = ORDERS.get(orderId);
    cb(order ? { ok: true, order } : { ok: false });
  });

  // ── Disconnect ─────────────────────────────────────────────
  socket.on("disconnect", () => {
    console.log(`[WS] Desconectado: ${socket.id}`);
  });
});

// ── Inicia servidor ──────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n👑 Império Lanches rodando em http://localhost:${PORT}`);
  console.log(`🔧 Admin em: http://localhost:${PORT}/admin\n`);
});