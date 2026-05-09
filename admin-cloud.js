/* ============================================================
   ADMIN + JSONBIN.IO — Com desativação de sabores individuais
   ============================================================ */

(function() {

  var BIN_ID     = "69ff6740adc21f119a778293"; 
  var MASTER_KEY = "$2a$10$zfLo4xQ0.IvfaaQaJbTDle3OU9eW24NU.iN7JbK9Ph9OpF0MiuRRu";
  var API_URL    = "https://api.jsonbin.io/v3/b/" + BIN_ID;
  var ADMIN_PASS = "imperio123";

  var _cloudData = null;
  window._cloudDisabled = [];      // IDs de produtos desativados
  window._cloudDisabledOpts = [];  // Sabores/opções desativados: ["4:Frango com Bacon", "4:Pizza"]

  /* ── LER NUVEM ── */
  function cloudFetch() {
    fetch(API_URL + "/latest", {
      headers: { "X-Master-Key": MASTER_KEY }
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
      _cloudData = json.record;
      if (_cloudData) applyState(_cloudData);
    })
    .catch(function(e) { console.warn("[Admin]", e); });
  }

  /* ── SALVAR NUVEM ── */
  function cloudSave(payload) {
    return fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
      },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      _cloudData = payload;
      applyState(payload);
      if (typeof showToast === "function") {
        showToast("Salvo na nuvem! ☁️", "Clientes verão em instantes.", "success");
      }
      return true;
    })
    .catch(function(e) {
      if (typeof showToast === "function") {
        showToast("Erro ao salvar ❌", "Verifique a conexão.", "warn");
      }
      return false;
    });
  }

  /* ── APLICAR ESTADO ── */
  function applyState(data) {
    if (!data) return;

    // Loja aberta/fechada
    if (typeof State !== "undefined" && data.aberto !== undefined) {
      State.lojaAberta = data.aberto;
    }
    var badge = document.getElementById("status-loja");
    if (badge) {
      badge.className = "status-badge " + (data.aberto ? "aberto" : "fechado");
      var lbl = badge.querySelector("#status-label");
      if (lbl) lbl.textContent = data.aberto ? "Aberto agora" : "Fechado";
    }
    document.body.classList.toggle("loja-fechada", !data.aberto);

    // Taxa
    if (typeof CONFIG !== "undefined" && data.taxa !== undefined) {
      CONFIG.delivery = parseFloat(data.taxa) || 0;
    }
    if (typeof CLOUD !== "undefined") {
      CLOUD.delivery = data.taxa || 0;
      CLOUD.aberto = data.aberto;
      CLOUD.aviso = data.aviso || "";
      CLOUD.desativados = data.desativados || [];
      CLOUD.tempo = data.tempo || "30-45 min";
    }

    // Tempo
    if (data.tempo) {
      var tempoEl = document.querySelector(".delivery-time");
      if (tempoEl) tempoEl.innerHTML = '<i class="far fa-clock"></i> ' + data.tempo;
    }

    // Aviso
    var notice = document.getElementById("storeNotice");
    var noticeT = document.getElementById("storeNoticeText");
    if (notice && noticeT) {
      if (data.aviso && String(data.aviso).trim()) {
        noticeT.textContent = data.aviso;
        notice.style.display = "flex";
      } else {
        notice.style.display = "none";
      }
    }

    // Desativados (produtos inteiros)
    window._cloudDisabled = data.desativados || [];
    applyDisabledProducts(window._cloudDisabled);

    // Desativados (sabores/opções individuais)
    window._cloudDisabledOpts = data.desativadosOpts || [];

    // Atualiza carrinho
    if (typeof updateCartUI === "function") updateCartUI();

    // Sync painel admin se aberto
    if (sessionStorage.getItem("adm_auth") === "1") syncPanel();
  }

  function applyDisabledProducts(ids) {
    document.querySelectorAll(".product-card").forEach(function(card) {
      var m = (card.getAttribute("onclick") || "").match(/openProductModal\((\d+)\)/);
      if (!m) return;
      var id = parseInt(m[1], 10);
      var off = ids.indexOf(id) !== -1;
      card.classList.toggle("item-disabled", off);
      var ov = card.querySelector(".disabled-overlay");
      if (off && !ov) {
        ov = document.createElement("div");
        ov.className = "disabled-overlay";
        ov.innerHTML = "<span>Indisponível</span>";
        card.appendChild(ov);
      } else if (!off && ov) {
        ov.remove();
      }
    });
  }

  /* ══════════════════════════════════════════════
     INTERCEPTAR MODAL — Esconder opções desativadas
     ══════════════════════════════════════════════ */
  var _origRenderModifiers = window.renderModifiers;
  if (typeof _origRenderModifiers === "function") {
    window.renderModifiers = function(p) {
      _origRenderModifiers(p);
      // Após renderizar, esconde as opções desativadas
      hideDisabledOptions(p.id);
    };
  }

  // Observa quando o modal abre para esconder opções
  var _origOpenModal = window.openProductModal;
  window.openProductModal = function(pid) {
    // Bloqueia produto inteiro se desativado
    if (window._cloudDisabled && window._cloudDisabled.indexOf(pid) !== -1) {
      if (typeof showToast === "function") {
        showToast("Indisponível 😔", "Item temporariamente fora do cardápio.", "warn");
      }
      return;
    }
    _origOpenModal(pid);
    // Espera o modal renderizar e esconde opções
    setTimeout(function() { hideDisabledOptions(pid); }, 50);
  };

  function hideDisabledOptions(productId) {
    var disabledOpts = window._cloudDisabledOpts || [];
    var container = document.getElementById("modalModifiers");
    if (!container) return;

    var allOptions = container.querySelectorAll(".modifier-option");
    allOptions.forEach(function(optEl) {
      var nameEl = optEl.querySelector(".option-name");
      if (!nameEl) return;
      var optName = nameEl.textContent.trim();
      var key = productId + ":" + optName;

      if (disabledOpts.indexOf(key) !== -1) {
        optEl.style.display = "none";
        // Desmarca se estava selecionado
        var input = optEl.querySelector("input");
        if (input && input.checked) {
          input.checked = false;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else {
        optEl.style.display = "";
      }
    });
  }

  /* ══════════════════════════════════════════════
     PAINEL ADMIN
     ══════════════════════════════════════════════ */

  window.openAdmin = function() {
    var ov = document.getElementById("adminOverlay");
    if (!ov) return;
    ov.style.display = "flex";
    document.body.style.overflow = "hidden";

    var ok = sessionStorage.getItem("adm_auth") === "1";
    var login = document.getElementById("adminLoginScreen");
    var dash  = document.getElementById("adminDash");
    if (login) login.style.display = ok ? "none" : "block";
    if (dash)  dash.style.display  = ok ? "flex" : "none";
    if (ok) syncPanel();
    else setTimeout(function() {
      var p = document.getElementById("adminPass");
      if (p) p.focus();
    }, 100);
  };

  window.closeAdmin = function() {
    var ov = document.getElementById("adminOverlay");
    if (ov) ov.style.display = "none";
    document.body.style.overflow = "";
  };

  /* ── LOGIN ── */
  window.adminLogin = function() {
    var p = document.getElementById("adminPass");
    var e = document.getElementById("adminErr");
    if (!p) return;
    if (p.value === ADMIN_PASS) {
      sessionStorage.setItem("adm_auth", "1");
      p.value = "";
      var login = document.getElementById("adminLoginScreen");
      var dash  = document.getElementById("adminDash");
      if (login) login.style.display = "none";
      if (dash)  dash.style.display  = "flex";
      syncPanel();
    } else {
      if (e) e.textContent = "Senha incorreta";
      p.value = "";
      p.focus();
      setTimeout(function() { if (e) e.textContent = ""; }, 2000);
    }
  };

  window.admLogout = function() {
    sessionStorage.removeItem("adm_auth");
    var dash  = document.getElementById("adminDash");
    var login = document.getElementById("adminLoginScreen");
    if (dash)  dash.style.display  = "none";
    if (login) login.style.display = "block";
    window.closeAdmin();
  };

  /* ── SYNC PAINEL ── */
  function syncPanel() {
    if (!_cloudData) return;
    var el;
    el = document.getElementById("admAberto");
    if (el) el.checked = !!_cloudData.aberto;
    el = document.getElementById("admAbertoLabel");
    if (el) el.textContent = _cloudData.aberto ? "Aberta ✅" : "Fechada 🔒";
    el = document.getElementById("admAviso");
    if (el) el.value = _cloudData.aviso || "";
    el = document.getElementById("admTaxa");
    if (el) el.value = _cloudData.taxa || 0;
    el = document.getElementById("admTempo");
    if (el) el.value = _cloudData.tempo || "30-45 min";
    window.admRenderItems();
  }

  /* ── SALVAR ── */
  window.admSaveAll = function() {
    var payload = {
      aberto: !!(document.getElementById("admAberto") || {}).checked,
      aviso:  (document.getElementById("admAviso")  || {value:""}).value.trim(),
      taxa:   parseFloat((document.getElementById("admTaxa") || {value:0}).value) || 0,
      tempo:  (document.getElementById("admTempo")  || {value:"30-45 min"}).value.trim() || "30-45 min",
      desativados: window._cloudDisabled || [],
      desativadosOpts: window._cloudDisabledOpts || []
    };
    cloudSave(payload).then(function() { syncPanel(); });
  };

  /* ── TOGGLE PRODUTO INTEIRO ── */
  window.admToggleItem = function(id) {
    var list = window._cloudDisabled ? window._cloudDisabled.slice() : [];
    var idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    window._cloudDisabled = list;
    window.admRenderItems();
  };

  /* ── TOGGLE OPÇÃO/SABOR INDIVIDUAL ── */
  window.admToggleOpt = function(productId, optName) {
    var key = productId + ":" + optName;
    var list = window._cloudDisabledOpts ? window._cloudDisabledOpts.slice() : [];
    var idx = list.indexOf(key);
    if (idx === -1) list.push(key);
    else list.splice(idx, 1);
    window._cloudDisabledOpts = list;
    window.admRenderItems();
  };

  /* ── EXPANDIR/COLAPSAR ── */
  window._admExpanded = {};
  window.admToggleExpand = function(id) {
    window._admExpanded[id] = !window._admExpanded[id];
    window.admRenderItems();
  };

  /* ── RENDER ITEMS ── */
  window.admRenderItems = function() {
    if (typeof MENU === "undefined") return;
    var box = document.getElementById("admItems");
    var q   = (document.getElementById("admSearch") || {value:""}).value.toLowerCase();
    if (!box) return;

    var list = MENU.filter(function(i) {
      return !q || i.name.toLowerCase().indexOf(q) !== -1;
    });

    var html = "";

    list.forEach(function(item) {
      var off = (window._cloudDisabled || []).indexOf(item.id) !== -1;
      var cat = CATEGORIES.find(function(c) { return c.id === item.category; });
      var price = "R$ " + Number(item.price).toFixed(2).replace(".", ",");
      var name = item.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

      // Conta quantas opções tem
      var totalOpts = 0;
      var totalOptsOff = 0;
      if (item.modifiers && item.modifiers.length > 0) {
        item.modifiers.forEach(function(mod) {
          if (mod.options) {
            mod.options.forEach(function(opt) {
              totalOpts++;
              var key = item.id + ":" + opt.name;
              if ((window._cloudDisabledOpts || []).indexOf(key) !== -1) {
                totalOptsOff++;
              }
            });
          }
        });
      }

      var hasOpts = totalOpts > 0;
      var expanded = !!window._admExpanded[item.id];

      // Linha do produto
      html += '<div class="adm-item-row ' + (off ? "off" : "") + '">';
      html += '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">';

      // Botão expandir (se tem opções)
      if (hasOpts && !off) {
        html += '<button onclick="admToggleExpand(' + item.id + ')" ' +
                'style="background:none;border:none;color:rgba(255,255,255,.4);' +
                'cursor:pointer;font-size:12px;padding:2px 4px;flex-shrink:0">' +
                '<i class="fas fa-chevron-' + (expanded ? 'down' : 'right') + '"></i></button>';
      }

      html += '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">';
      html += (cat ? cat.icon : "🍽") + ' ' + name;
      html += ' <small>' + price + '</small>';

      // Badge de opções desativadas
      if (totalOptsOff > 0 && !off) {
        html += ' <span style="background:rgba(255,152,0,.2);color:#ff9800;' +
                'padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600">' +
                totalOptsOff + ' sabor(es) off</span>';
      }

      html += '</span></div>';

      // Toggle do produto inteiro
      html += '<label class="adm-sw">';
      html += '<input type="checkbox" ' + (off ? '' : 'checked') +
              ' onchange="admToggleItem(' + item.id + ')">';
      html += '<span></span></label>';
      html += '</div>';

      // Opções expandidas (sabores individuais)
      if (hasOpts && expanded && !off) {
        item.modifiers.forEach(function(mod) {
          if (!mod.options || mod.options.length === 0) return;

          html += '<div style="margin-left:20px;padding:6px 0 6px 12px;' +
                  'border-left:2px solid rgba(255,255,255,.06)">';
          html += '<div style="font-size:11px;color:rgba(255,255,255,.35);' +
                  'margin-bottom:4px;font-weight:600">' +
                  mod.name.toUpperCase() + '</div>';

          mod.options.forEach(function(opt) {
            var key = item.id + ":" + opt.name;
            var optOff = (window._cloudDisabledOpts || []).indexOf(key) !== -1;
            var optName = opt.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
            var optPrice = opt.price > 0
              ? ' <small style="color:#ff9800">+R$ ' + Number(opt.price).toFixed(2).replace(".",",") + '</small>'
              : '';

            html += '<div class="adm-item-row ' + (optOff ? "off" : "") + '" ' +
                    'style="margin:2px 0;padding:6px 10px;background:rgba(255,255,255,.02)">';
            html += '<span style="font-size:12px">' + optName + optPrice + '</span>';
            html += '<label class="adm-sw" style="width:38px;height:22px">';
            html += '<input type="checkbox" ' + (optOff ? '' : 'checked') +
                    ' onchange="admToggleOpt(' + item.id + ',\'' + opt.name.replace(/'/g,"\\'") + '\')">';
            html += '<span style="border-radius:22px"></span>';
            html += '</label></div>';
          });

          html += '</div>';
        });
      }
    });

    box.innerHTML = html;
  };

  /* ── FECHAR CLICANDO FORA ── */
  document.addEventListener("click", function(e) {
    var ov = document.getElementById("adminOverlay");
    if (e.target === ov) window.closeAdmin();
  });

  /* ── INICIAR POLLING ── */
  cloudFetch();
  setInterval(cloudFetch, 8000);

})();