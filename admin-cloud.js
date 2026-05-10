(function(){

  var BIN_ID="69ff6740adc21f119a778293";
  var MASTER_KEY="$2a$10$zfLo4xQ0.IvfaaQaJbTDle3OU9eW24NU.iN7JbK9Ph9OpF0MiuRRu";
  var API_URL="https://api.jsonbin.io/v3/b/"+BIN_ID;
  var ADMIN_PASS="1204";
  var _cloudData=null;
  window._cloudDisabled=[];
  window._cloudDisabledOpts=[];
  window._admExpanded={};
  window._admEditing=false;

  /* =========================================
     DIAGNÓSTICO — rode no console: diagnostico()
     ========================================= */
  window.diagnostico=function(){
    console.log("=== DIAGNÓSTICO ADMIN ===");
    console.log("State existe?", typeof State!=="undefined");
    if(typeof State!=="undefined"){
      console.log("State.cart existe?", !!State.cart);
      console.log("State.cart tipo:", typeof State.cart);
      console.log("State.cart length:", State.cart ? State.cart.length : "N/A");
      if(State.cart && State.cart.length){
        console.log("Primeiro item do carrinho:", JSON.stringify(State.cart[0], null, 2));
      }
    }
    console.log("MENU existe?", typeof MENU!=="undefined");
    console.log("CATEGORIES existe?", typeof CATEGORIES!=="undefined");
    console.log("saveCart existe?", typeof saveCart==="function");
    console.log("updateCartUI existe?", typeof updateCartUI==="function");
    console.log("renderCart existe?", typeof renderCart==="function");
    console.log("_cloudDisabled:", window._cloudDisabled);
    console.log("_cloudDisabledOpts:", window._cloudDisabledOpts);

    /* tenta achar o carrinho no localStorage */
    var keys=["cart","sacola","carrinho","bag","pedido","delivery_cart","ifood_cart"];
    keys.forEach(function(k){
      var v=localStorage.getItem(k);
      if(v){
        try{
          var parsed=JSON.parse(v);
          console.log("localStorage['"+k+"']:", Array.isArray(parsed)?parsed.length+" itens":typeof parsed);
          if(Array.isArray(parsed)&&parsed.length) console.log("  Primeiro item:", JSON.stringify(parsed[0],null,2));
        }catch(e){}
      }
    });

    /* lista todas as chaves do localStorage */
    console.log("Todas chaves localStorage:", Object.keys(localStorage));
    console.log("==========================");
  };

  /* =========================================
     CLOUD FETCH
     ========================================= */
  function cloudFetch(){
    fetch(API_URL+"/latest",{headers:{"X-Master-Key":MASTER_KEY}})
    .then(function(res){return res.json();})
    .then(function(json){_cloudData=json.record;if(_cloudData)applyState(_cloudData);})
    .catch(function(e){console.warn("[Admin] fetch err",e);});
  }

  /* =========================================
     CLOUD SAVE
     ========================================= */
  function cloudSave(payload){
    return fetch(API_URL,{
      method:"PUT",
      headers:{"Content-Type":"application/json","X-Master-Key":MASTER_KEY},
      body:JSON.stringify(payload)
    })
    .then(function(res){
      if(!res.ok) throw new Error("HTTP "+res.status);
      _cloudData=payload;
      applyState(payload);
      if(typeof showToast==="function") showToast("Salvo na nuvem ☁️","Clientes verão em instantes.","success");
      return true;
    })
    .catch(function(e){
      if(typeof showToast==="function") showToast("Erro ao salvar ❌","Verifique a conexão.","warn");
      return false;
    });
  }

  /* =========================================
     ENCONTRAR ID DO ITEM NO CARRINHO
     — tenta todos os formatos possíveis
     ========================================= */
  function findCartItemId(item){
    if(!item) return null;
    /* direto */
    if(item.productId!==undefined && item.productId!==null) return item.productId;
    if(item.id!==undefined && item.id!==null) return item.id;
    if(item.itemId!==undefined && item.itemId!==null) return item.itemId;
    if(item.menuId!==undefined && item.menu!==null) return item.menuId;
    /* dentro de objeto */
    if(item.item && typeof item.item==="object"){
      if(item.item.id!==undefined) return item.item.id;
      if(item.item.productId!==undefined) return item.item.productId;
    }
    if(item.product && typeof item.product==="object"){
      if(item.product.id!==undefined) return item.product.id;
      if(item.product.productId!==undefined) return item.product.productId;
    }
    if(item.menuItem && typeof item.menuItem==="object"){
      if(item.menuItem.id!==undefined) return item.menuItem.id;
    }
    /* dentro de variação/variante */
    if(item.variant && typeof item.variant==="object"){
      if(item.variant.id!==undefined) return item.variant.id;
    }
    if(item.variation && typeof item.variation==="object"){
      if(item.variation.id!==undefined) return item.variation.id;
    }
    /* último recurso: procurar qualquer campo numérico que pareça ID */
    var numericKeys=[];
    for(var key in item){
      if(item.hasOwnProperty(key) && typeof item[key]==="number" && item[key]>0){
        if(key!=="quantity" && key!=="price" && key!=="total" && key!=="subtotal" && key!=="itemTotal"){
          numericKeys.push({key:key,val:item[key]});
        }
      }
    }
    if(numericKeys.length===1) return numericKeys[0].val;
    return null;
  }

  /* =========================================
     ENCONTRAR NOME DO ITEM NO CARRINHO
     ========================================= */
  function findCartItemName(item){
    if(!item) return "Item";
    return item.name || item.title || item.itemName || (item.item && item.item.name) || (item.product && item.product.name) || "Item";
  }

  /* =========================================
     ENCONTRAR OPÇÕES SELECIONADAS
     ========================================= */
  function findCartItemSelectedOpts(item){
    if(!item) return [];
    var opts=item.selectedOptions || item.options || item.modifiers || item.extras || item.addons || [];
    if(opts && !Array.isArray(opts)) opts=[];
    return opts;
  }

  /* =========================================
     SALVAR CARRINHO (múltiplos métodos)
     ========================================= */
  function saveCartSafe(){
    try{
      if(typeof saveCart==="function"){ saveCart(); return; }
    }catch(e){}
    try{
      if(typeof State!=="undefined" && typeof State.save==="function"){ State.save(); return; }
    }catch(e){}
    try{
      if(typeof State!=="undefined" && State.cart){
        /* tenta achar a chave certa no localStorage */
        var keys=Object.keys(localStorage);
        for(var i=0;i<keys.length;i++){
          try{
            var v=JSON.parse(localStorage.getItem(keys[i]));
            if(Array.isArray(v) && v.length===State.cart.length){
              localStorage.setItem(keys[i], JSON.stringify(State.cart));
              return;
            }
          }catch(e){}
        }
        /* fallback: salva em "cart" */
        localStorage.setItem("cart", JSON.stringify(State.cart));
      }
    }catch(e){}
  }

  /* =========================================
     FECHAR DRAWER DO CARRINHO
     ========================================= */
  function closeCartDrawerIfOpen(){
    try{
      var els=document.querySelectorAll(".cart-drawer,.bag-drawer,.cart-sidebar,.cart-panel,[data-cart],[data-drawer],#cartDrawer,#bagDrawer,#cartSidebar");
      for(var i=0;i<els.length;i++){
        if(els[i].classList.contains("open")||els[i].classList.contains("active")||els[i].style.display==="flex"){
          els[i].classList.remove("open","active");
          els[i].style.display="";
        }
      }
      /* overlay */
      var overlays=document.querySelectorAll(".cart-overlay,.bag-overlay,.overlay");
      for(var j=0;j<overlays.length;j++){
        overlays[j].style.display="none";
      }
      document.body.style.overflow="";
    }catch(e){}
  }

  /* =========================================
     ATUALIZAR TODAS AS UIs DO CARRINHO
     ========================================= */
  function refreshAllCartUI(){
    try{ if(typeof updateCartUI==="function") updateCartUI(); }catch(e){}
    try{ if(typeof renderCart==="function") renderCart(); }catch(e){}
    try{ if(typeof updateCartCount==="function") updateCartCount(); }catch(e){}
    try{ if(typeof updateBagBadge==="function") updateBagBadge(); }catch(e){}
    try{ if(typeof renderBag==="function") renderBag(); }catch(e){}
    try{ if(typeof updateBadge==="function") updateBadge(); }catch(e){}
    closeCartDrawerIfOpen();
  }

  /* =========================================
     REMOVER ITEM DO CARRINHO POR ID
     ========================================= */
  function removeSingleItemFromCart(id){
    console.log("[Admin] Tentando remover item ID:", id, "do carrinho");

    /* checa se carrinho acessível */
    if(typeof State==="undefined"){
      console.warn("[Admin] State não existe — não consigo acessar o carrinho");
      return false;
    }
    if(!State.cart){
      console.warn("[Admin] State.cart não existe");
      return false;
    }
    if(!State.cart.length){
      console.log("[Admin] Carrinho vazio, nada a remover");
      return false;
    }

    /* mostra estrutura antes */
    console.log("[Admin] Carrinho antes:", State.cart.length, "itens");
    console.log("[Admin] Estrutura do primeiro item:", JSON.stringify(State.cart[0]));

    var numId=Number(id);
    var removedName=null;

    State.cart=State.cart.filter(function(item){
      var cartId=findCartItemId(item);
      console.log("[Admin] Comparando: cartId=", cartId, "(tipo:"+typeof cartId+") vs numId=", numId);

      if(cartId!==null && Number(cartId)===numId){
        removedName=findCartItemName(item);
        console.log("[Admin] REMOVEU:", removedName);
        return false;
      }
      return true;
    });

    if(removedName!==null){
      console.log("[Admin] Salvando carrinho após remoção...");
      saveCartSafe();
      refreshAllCartUI();
      if(typeof showToast==="function") showToast("Item desativado 🔒",removedName+" removido da sacola","warn");
      return true;
    }

    console.warn("[Admin] Item ID",id,"não encontrado no carrinho. IDs presentes:");
    State.cart.forEach(function(item,i){
      console.log("  ["+i+"]", findCartItemId(item), "→", findCartItemName(item));
    });
    return false;
  }

  /* =========================================
     REMOVER ITENS COM OPÇÃO DESATIVADA
     ========================================= */
  function removeItemsWithDisabledOpt(productId,optName){
    if(typeof State==="undefined"||!State.cart||!State.cart.length) return false;

    var strPid=String(productId);
    var strOpt=String(optName);
    var removedCount=0;

    State.cart=State.cart.filter(function(item){
      var cartPid=String(findCartItemId(item)||"");
      if(cartPid!==strPid) return true;

      var opts=findCartItemSelectedOpts(item);
      for(var i=0;i<opts.length;i++){
        var oName="";
        if(typeof opts[i]==="object"&&opts[i]!==null){
          oName=String(opts[i].name||opts[i].label||opts[i].title||"");
        }else{
          oName=String(opts[i]);
        }
        if(oName===strOpt){
          removedCount++;
          return false;
        }
      }
      return true;
    });

    if(removedCount>0){
      saveCartSafe();
      refreshAllCartUI();
      if(typeof showToast==="function") showToast("Opção desativada 🔒",removedCount+" item(ns) removido(s)","warn");
      return true;
    }
    return false;
  }

  /* =========================================
     REMOVE FROM CART IF DISABLED
     — chamado quando a nuvem atualiza
     ========================================= */
  function removeFromCartIfDisabled(){
    try{
      if(typeof State==="undefined"||!State.cart||!State.cart.length) return;

      var disabledIds=window._cloudDisabled.slice();
      var disabledNums=disabledIds.map(Number);
      var disabledOptKeys=window._cloudDisabledOpts||[];

      if(!disabledIds.length&&!disabledOptKeys.length) return;

      var initialLength=State.cart.length;
      var removedNames=[];

      State.cart=State.cart.filter(function(item){
        var cartId=findCartItemId(item);
        if(cartId===null) return true;
        var strId=String(cartId);
        var numId=Number(cartId);

        var isMainDisabled=(disabledIds.indexOf(strId)!==-1)||(disabledNums.indexOf(numId)!==-1);

        var isOptDisabled=false;
        if(!isMainDisabled){
          var opts=findCartItemSelectedOpts(item);
          if(opts.length&&disabledOptKeys.length){
            for(var i=0;i<opts.length;i++){
              var oName="";
              if(typeof opts[i]==="object"&&opts[i]!==null){
                oName=String(opts[i].name||opts[i].label||opts[i].title||"");
              }else{
                oName=String(opts[i]);
              }
              if(oName){
                var optKey=strId+":"+oName;
                if(disabledOptKeys.indexOf(optKey)!==-1){
                  isOptDisabled=true;
                  break;
                }
              }
            }
          }
        }

        if(isMainDisabled||isOptDisabled){
          removedNames.push(findCartItemName(item));
          return false;
        }
        return true;
      });

      if(State.cart.length<initialLength){
        saveCartSafe();
        refreshAllCartUI();
        if(typeof showToast==="function"){
          var msg=removedNames.length===1?removedNames[0]+" removido":removedNames.length+" itens removidos";
          showToast("Sacola atualizada 🗑️",msg,"warn");
        }
      }
    }catch(e){
      console.error("[Admin] removeFromCartIfDisabled erro:",e);
    }
  }

  /* =========================================
     APPLY STATE
     ========================================= */
  function applyState(data){
    if(!data) return;

    try{
      if(typeof State!=="undefined"&&data.aberto!==undefined) State.lojaAberta=data.aberto;
    }catch(e){}

    var badge=document.getElementById("status-loja");
    if(badge){
      badge.className="status-badge "+(data.aberto?"aberto":"fechado");
      var lbl=badge.querySelector("#status-label");
      if(lbl) lbl.textContent=data.aberto?"Aberto agora":"Fechado";
    }
    document.body.classList.toggle("loja-fechada",!data.aberto);

    try{
      if(typeof CONFIG!=="undefined"&&data.taxa!==undefined) CONFIG.delivery=parseFloat(data.taxa)||0;
    }catch(e){}
    try{
      if(typeof CLOUD!=="undefined"){
        CLOUD.delivery=data.taxa||0;
        CLOUD.aberto=data.aberto;
        CLOUD.aviso=data.aviso||"";
        CLOUD.desativados=data.desativados||[];
        CLOUD.desativadosOpts=data.desativadosOpts||[];
        CLOUD.tempo=data.tempo||"30-45 min";
      }
    }catch(e){}

    if(data.tempo){
      var t=document.querySelector(".delivery-time");
      if(t) t.innerHTML='<i class="far fa-clock"></i> '+data.tempo;
    }

    var notice=document.getElementById("storeNotice");
    var noticeT=document.getElementById("storeNoticeText");
    if(notice&&noticeT){
      if(data.aviso&&String(data.aviso).trim()){
        noticeT.textContent=data.aviso;
        notice.style.display="flex";
      }else{
        notice.style.display="none";
      }
    }

    if(!window._admEditing){
      window._cloudDisabled=(data.desativados||[]).map(String);
      window._cloudDisabledOpts=(data.desativadosOpts||[]).map(String);
    }

    try{ if(typeof applyDisabledItems==="function") applyDisabledItems(window._cloudDisabled.map(Number)); }catch(e){}

    removeFromCartIfDisabled();
    refreshAllCartUI();

    if(sessionStorage.getItem("adm_auth")==="1"&&!window._admEditing) syncPanel();
  }

  /* =========================================
     OPEN ADMIN
     ========================================= */
  window.openAdmin=function(){
    var ov=document.getElementById("adminOverlay");
    if(!ov) return;
    ov.style.display="flex";
    document.body.style.overflow="hidden";
    window._admEditing=true;
    var ok=sessionStorage.getItem("adm_auth")==="1";
    var login=document.getElementById("adminLoginScreen");
    var dash=document.getElementById("adminDash");
    if(login) login.style.display=ok?"none":"block";
    if(dash) dash.style.display=ok?"flex":"none";
    if(ok) syncPanel();
    else setTimeout(function(){var p=document.getElementById("adminPass");if(p)p.focus();},100);
  };

  /* =========================================
     CLOSE ADMIN
     ========================================= */
  window.closeAdmin=function(){
    var ov=document.getElementById("adminOverlay");
    if(ov) ov.style.display="none";
    document.body.style.overflow="";
    window._admEditing=false;
    cloudFetch();
  };

  /* =========================================
     ADMIN LOGIN
     ========================================= */
  window.adminLogin=function(){
    var p=document.getElementById("adminPass");
    var e=document.getElementById("adminErr");
    if(!p) return;
    if(p.value===ADMIN_PASS){
      sessionStorage.setItem("adm_auth","1");
      p.value="";
      var login=document.getElementById("adminLoginScreen");
      var dash=document.getElementById("adminDash");
      if(login) login.style.display="none";
      if(dash) dash.style.display="flex";
      syncPanel();
    }else{
      if(e) e.textContent="Senha incorreta";
      p.value="";
      p.focus();
      setTimeout(function(){if(e)e.textContent="";},2000);
    }
  };

  /* =========================================
     ADMIN LOGOUT
     ========================================= */
  window.admLogout=function(){
    sessionStorage.removeItem("adm_auth");
    var dash=document.getElementById("adminDash");
    var login=document.getElementById("adminLoginScreen");
    if(dash) dash.style.display="none";
    if(login) login.style.display="block";
    window.closeAdmin();
  };

  /* =========================================
     SYNC PANEL
     ========================================= */
  function syncPanel(){
    if(!_cloudData) return;
    var el;
    el=document.getElementById("admAberto");if(el) el.checked=!!_cloudData.aberto;
    el=document.getElementById("admAbertoLabel");if(el) el.textContent=_cloudData.aberto?"Aberta ✅":"Fechada 🔒";
    el=document.getElementById("admAviso");if(el) el.value=_cloudData.aviso||"";
    el=document.getElementById("admTaxa");if(el) el.value=_cloudData.taxa||0;
    el=document.getElementById("admTempo");if(el) el.value=_cloudData.tempo||"30-45 min";
    try{ window.admRenderItems(); }catch(e){ console.error("[Admin] admRenderItems erro:",e); }
  }

  /* =========================================
     ADM SAVE ALL
     ========================================= */
  window.admSaveAll=function(){
    var payload={
      aberto:!!(document.getElementById("admAberto")||{}).checked,
      aviso:(document.getElementById("admAviso")||{value:""}).value.trim(),
      taxa:parseFloat((document.getElementById("admTaxa")||{value:0}).value)||0,
      tempo:(document.getElementById("admTempo")||{value:"30-45 min"}).value.trim()||"30-45 min",
      desativados:window._cloudDisabled||[],
      desativadosOpts:window._cloudDisabledOpts||[]
    };
    cloudSave(payload).then(function(){ syncPanel(); });
  };

  /* =========================================
     ADM TOGGLE ITEM — desativa + remove do carrinho
     ========================================= */
  window.admToggleItem=function(id){
    try{
      id=String(id);
      var list=window._cloudDisabled.slice();
      var idx=list.indexOf(id);

      if(idx===-1){
        list.push(id);
        removeSingleItemFromCart(id);
      }else{
        list.splice(idx,1);
      }

      window._cloudDisabled=list;
      window.admRenderItems();

      try{ if(typeof applyDisabledItems==="function") applyDisabledItems(window._cloudDisabled.map(Number)); }catch(e){}
    }catch(e){
      console.error("[Admin] admToggleItem erro:",e);
    }
  };

  /* =========================================
     ADM TOGGLE OPT — desativa opção + remove do carrinho
     ========================================= */
  window.admToggleOpt=function(productId,optName){
    try{
      productId=String(productId);
      optName=String(optName);
      var key=productId+":"+optName;
      var list=window._cloudDisabledOpts.slice();
      var idx=list.indexOf(key);

      if(idx===-1){
        list.push(key);
        removeItemsWithDisabledOpt(productId,optName);
      }else{
        list.splice(idx,1);
      }

      window._cloudDisabledOpts=list;
      window.admRenderItems();
    }catch(e){
      console.error("[Admin] admToggleOpt erro:",e);
    }
  };

  /* =========================================
     ADM TOGGLE EXPAND
     ========================================= */
  window.admToggleExpand=function(id){
    window._admExpanded[id]=!window._admExpanded[id];
    window.admRenderItems();
  };

  /* =========================================
     ADM RENDER ITEMS
     ========================================= */
  window.admRenderItems=function(){
    if(typeof MENU==="undefined") return;
    var box=document.getElementById("admItems");
    var q=(document.getElementById("admSearch")||{value:""}).value.toLowerCase();
    if(!box) return;

    var list=MENU.filter(function(i){ return !q||i.name.toLowerCase().indexOf(q)!==-1; });
    var html="";

    list.forEach(function(item){
      var strId=String(item.id);
      var off=window._cloudDisabled.indexOf(strId)!==-1;
      var cat=(typeof CATEGORIES!=="undefined")?CATEGORIES.find(function(c){return c.id===item.category;}):null;
      var price=typeof fmt==="function"?fmt(item.price):("R$"+(item.price||0).toFixed(2));
      var name=item.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

      var totalOpts=0,totalOptsOff=0;
      if(item.modifiers&&item.modifiers.length){
        item.modifiers.forEach(function(mod){
          if(mod.options){
            mod.options.forEach(function(opt){
              totalOpts++;
              if(window._cloudDisabledOpts.indexOf(strId+":"+String(opt.name))!==-1) totalOptsOff++;
            });
          }
        });
      }
      var hasOpts=totalOpts>0;
      var expanded=!!window._admExpanded[item.id];

      html+='<div class="adm-item-row '+(off?"off":"")+'">';
      html+='<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">';
      if(hasOpts&&!off){
        html+='<button class="adm-expand-btn" onclick="admToggleExpand(\''+strId.replace(/'/g,"\\'")+'\')"><i class="fas fa-chevron-'+(expanded?"down":"right")+'"></i></button>';
      }
      if(off) html+='<i class="fas fa-lock adm-lock-icon"></i>';
      html+='<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">';
      html+=(cat?cat.icon:"🍽")+" "+name+' <small>'+price+'</small>';
      if(totalOptsOff>0&&!off) html+=' <span class="adm-opt-badge">'+totalOptsOff+' off</span>';
      html+='</span></div>';
      html+='<label class="adm-sw"><input type="checkbox" '+(off?"":"checked")+' onchange="admToggleItem(\''+strId.replace(/'/g,"\\'")+'\')"><span></span></label>';
      html+='</div>';

      if(hasOpts&&expanded&&!off){
        item.modifiers.forEach(function(mod){
          if(!mod.options||!mod.options.length) return;
          html+='<div class="adm-opts-section">';
          html+='<div class="adm-opts-title">'+mod.name.toUpperCase()+'</div>';
          mod.options.forEach(function(opt){
            var optStrName=String(opt.name);
            var key=strId+":"+optStrName;
            var optOff=window._cloudDisabledOpts.indexOf(key)!==-1;
            var optNameHtml=opt.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
            var optPrice=opt.price>0?' <small>+'+price+'</small>':"";
            if(typeof fmt==="function") optPrice=opt.price>0?' <small>+'+fmt(opt.price)+'</small>':"";
            html+='<div class="adm-opt-row '+(optOff?"off":"")+'">';
            html+='<span>'+optNameHtml+optPrice+'</span>';
            html+='<label class="adm-sw adm-sw-sm"><input type="checkbox" '+(optOff?"":"checked")+' onchange="admToggleOpt(\''+strId.replace(/'/g,"\\'")+'\',\''+optStrName.replace(/'/g,"\\'")+'\')"><span></span></label>';
            html+='</div>';
          });
          html+='</div>';
        });
      }
    });

    box.innerHTML=html;
  };

  /* =========================================
     FECHAR AO CLICAR FORA
     ========================================= */
  document.addEventListener("click",function(e){
    var ov=document.getElementById("adminOverlay");
    if(e.target===ov) window.closeAdmin();
  });

  /* =========================================
     ENTER NA SENHA
     ========================================= */
  document.addEventListener("keydown",function(e){
    if(e.key==="Enter"){
      var p=document.getElementById("adminPass");
      if(p&&document.activeElement===p){ e.preventDefault(); window.adminLogin(); }
    }
  });

  /* =========================================
     INIT
     ========================================= */
  cloudFetch();
  setInterval(cloudFetch,8000);

})();