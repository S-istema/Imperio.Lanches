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
  window.CLOUD_BIN_ID=BIN_ID;
  window.CLOUD_MASTER_KEY=MASTER_KEY;
  window.CLOUD_API_URL=API_URL;

  window.diagnostico=function(){
    console.log("=== DIAGNÓSTICO ADMIN ===");
    console.log("State existe?", typeof State!=="undefined");
    if(typeof State!=="undefined"){
      console.log("State.cart length:", State.cart ? State.cart.length : "N/A");
    }
    console.log("_cloudDisabled:", window._cloudDisabled);
    console.log("_cloudDisabledOpts:", window._cloudDisabledOpts);
    console.log("Todas chaves localStorage:", Object.keys(localStorage));
    console.log("==========================");
  };

  function cloudFetch(){
    fetch(API_URL+"/latest",{headers:{"X-Master-Key":MASTER_KEY}})
    .then(function(res){return res.json();})
    .then(function(json){_cloudData=json.record;if(_cloudData)applyState(_cloudData);})
    .catch(function(e){console.warn("[Admin] fetch err",e);});
  }

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
     POSTAR PEDIDO PARA A NUVEM
     ========================================= */
  window.postOrderToCloud=function(orderData){
    fetch(API_URL+"/latest",{headers:{"X-Master-Key":MASTER_KEY}})
    .then(function(res){return res.json();})
    .then(function(json){
      var data=json.record;
      if(!data.orders) data.orders=[];
      orderData._id=Date.now()+"_"+Math.random().toString(36).substr(2,6);
      data.orders.unshift(orderData);
      if(data.orders.length>200) data.orders=data.orders.slice(0,200);
      return fetch(API_URL,{
        method:"PUT",
        headers:{"Content-Type":"application/json","X-Master-Key":MASTER_KEY},
        body:JSON.stringify(data)
      });
    })
    .then(function(res){
      if(res&&res.ok) console.log("[Cloud] Pedido enviado ao painel admin");
      else console.warn("[Cloud] Erro ao enviar pedido");
    })
    .catch(function(e){
      console.warn("[Cloud] Erro postOrderToCloud:",e);
    });
  };

  function findCartItemId(item){
    if(!item) return null;
    if(item.productId!==undefined&&item.productId!==null) return item.productId;
    if(item.id!==undefined&&item.id!==null) return item.id;
    if(item.itemId!==undefined&&item.itemId!==null) return item.itemId;
    if(item.item&&typeof item.item==="object"){
      if(item.item.id!==undefined) return item.item.id;
      if(item.item.productId!==undefined) return item.item.productId;
    }
    if(item.product&&typeof item.product==="object"){
      if(item.product.id!==undefined) return item.product.id;
    }
    return null;
  }

  function findCartItemName(item){
    if(!item) return "Item";
    return item.name||item.title||item.itemName||(item.item&&item.item.name)||(item.product&&item.product.name)||"Item";
  }

  function findCartItemSelectedOpts(item){
    if(!item) return [];
    return item.selectedOptions||item.options||item.modifiers||item.extras||item.addons||[];
  }

  function saveCartSafe(){
    try{ if(typeof saveCart==="function"){saveCart();return;}}catch(e){}
    try{ if(typeof State!=="undefined"&&State.cart){localStorage.setItem("imperio_cart_v3",JSON.stringify(State.cart));}}catch(e){}
  }

  function closeCartDrawerIfOpen(){
    try{
      var els=document.querySelectorAll(".cart-sidebar");
      for(var i=0;i<els.length;i++){els[i].classList.remove("open","active");}
      var ov=document.getElementById("overlay");if(ov)ov.classList.remove("active");
      document.body.style.overflow="";
    }catch(e){}
  }

  function refreshAllCartUI(){
    try{if(typeof updateCartUI==="function")updateCartUI();}catch(e){}
    try{if(typeof renderCart==="function")renderCart();}catch(e){}
    closeCartDrawerIfOpen();
  }

  function removeSingleItemFromCart(id){
    if(typeof State==="undefined"||!State.cart||!State.cart.length) return false;
    var numId=Number(id);
    var removedName=null;
    State.cart=State.cart.filter(function(item){
      var cartId=findCartItemId(item);
      if(cartId!==null&&Number(cartId)===numId){removedName=findCartItemName(item);return false;}
      return true;
    });
    if(removedName!==null){saveCartSafe();refreshAllCartUI();if(typeof showToast==="function")showToast("Item desativado 🔒",removedName+" removido da sacola","warn");return true;}
    return false;
  }

  function removeItemsWithDisabledOpt(productId,optName){
    if(typeof State==="undefined"||!State.cart||!State.cart.length) return false;
    var strPid=String(productId),strOpt=String(optName),removedCount=0;
    State.cart=State.cart.filter(function(item){
      if(String(findCartItemId(item)||"")!==strPid) return true;
      var opts=findCartItemSelectedOpts(item);
      for(var i=0;i<opts.length;i++){
        var oName=typeof opts[i]==="object"?String(opts[i].name||opts[i].label||""):String(opts[i]);
        if(oName===strOpt){removedCount++;return false;}
      }
      return true;
    });
    if(removedCount>0){saveCartSafe();refreshAllCartUI();return true;}
    return false;
  }

  function removeFromCartIfDisabled(){
    try{
      if(typeof State==="undefined"||!State.cart||!State.cart.length) return;
      var disabledIds=window._cloudDisabled.slice();
      var disabledNums=disabledIds.map(Number);
      var disabledOptKeys=window._cloudDisabledOpts||[];
      if(!disabledIds.length&&!disabledOptKeys.length) return;
      var initialLength=State.cart.length,removedNames=[];
      State.cart=State.cart.filter(function(item){
        var cartId=findCartItemId(item);if(cartId===null) return true;
        var strId=String(cartId),numId=Number(cartId);
        var isMainDisabled=(disabledIds.indexOf(strId)!==-1)||(disabledNums.indexOf(numId)!==-1);
        var isOptDisabled=false;
        if(!isMainDisabled){
          var opts=findCartItemSelectedOpts(item);
          if(opts.length&&disabledOptKeys.length){
            for(var i=0;i<opts.length;i++){
              var oName=typeof opts[i]==="object"?String(opts[i].name||opts[i].label||""):String(opts[i]);
              if(oName&&disabledOptKeys.indexOf(strId+":"+oName)!==-1){isOptDisabled=true;break;}
            }
          }
        }
        if(isMainDisabled||isOptDisabled){removedNames.push(findCartItemName(item));return false;}
        return true;
      });
      if(State.cart.length<initialLength){saveCartSafe();refreshAllCartUI();}
    }catch(e){}
  }

  function applyState(data){
    if(!data) return;
    try{if(typeof State!=="undefined"&&data.aberto!==undefined) State.lojaAberta=data.aberto;}catch(e){}
    var badge=document.getElementById("status-loja");
    if(badge){badge.className="status-badge "+(data.aberto?"aberto":"fechado");var lbl=badge.querySelector("#status-label");if(lbl)lbl.textContent=data.aberto?"Aberto agora":"Fechado";}
    document.body.classList.toggle("loja-fechada",!data.aberto);
    try{if(typeof CONFIG!=="undefined"&&data.taxa!==undefined)CONFIG.delivery=parseFloat(data.taxa)||0;}catch(e){}
    try{if(typeof CLOUD!=="undefined"){CLOUD.delivery=data.taxa||0;CLOUD.aberto=data.aberto;CLOUD.aviso=data.aviso||"";CLOUD.desativados=data.desativados||[];CLOUD.desativadosOpts=data.desativadosOpts||[];CLOUD.tempo=data.tempo||"30-45 min";}}catch(e){}
    if(data.tempo){var t=document.querySelector(".delivery-time");if(t)t.innerHTML='<i class="far fa-clock"></i> '+data.tempo;}
    var notice=document.getElementById("storeNotice"),noticeT=document.getElementById("storeNoticeText");
    if(notice&&noticeT){if(data.aviso&&String(data.aviso).trim()){noticeT.textContent=data.aviso;notice.style.display="flex";}else{notice.style.display="none";}}
    if(!window._admEditing){window._cloudDisabled=(data.desativados||[]).map(String);window._cloudDisabledOpts=(data.desativadosOpts||[]).map(String);}
    try{if(typeof applyDisabledItems==="function")applyDisabledItems(window._cloudDisabled.map(Number));}catch(e){}
    removeFromCartIfDisabled();refreshAllCartUI();
    if(sessionStorage.getItem("adm_auth")==="1"&&!window._admEditing) syncPanel();
  }

  window.openAdmin=function(){
    var ov=document.getElementById("adminOverlay");if(!ov)return;ov.style.display="flex";document.body.style.overflow="hidden";window._admEditing=true;
    var ok=sessionStorage.getItem("adm_auth")==="1";
    var login=document.getElementById("adminLoginScreen"),dash=document.getElementById("adminDash");
    if(login)login.style.display=ok?"none":"block";if(dash)dash.style.display=ok?"flex":"none";
    if(ok)syncPanel();else setTimeout(function(){var p=document.getElementById("adminPass");if(p)p.focus();},100);
  };
  window.closeAdmin=function(){var ov=document.getElementById("adminOverlay");if(ov)ov.style.display="none";document.body.style.overflow="";window._admEditing=false;cloudFetch();};
  window.adminLogin=function(){
    var p=document.getElementById("adminPass"),e=document.getElementById("adminErr");if(!p)return;
    if(p.value===ADMIN_PASS){sessionStorage.setItem("adm_auth","1");p.value="";var login=document.getElementById("adminLoginScreen"),dash=document.getElementById("adminDash");if(login)login.style.display="none";if(dash)dash.style.display="flex";syncPanel();}
    else{if(e)e.textContent="Senha incorreta";p.value="";p.focus();setTimeout(function(){if(e)e.textContent="";},2000);}
  };
  window.admLogout=function(){sessionStorage.removeItem("adm_auth");var dash=document.getElementById("adminDash"),login=document.getElementById("adminLoginScreen");if(dash)dash.style.display="none";if(login)login.style.display="block";window.closeAdmin();};

  function syncPanel(){
    if(!_cloudData)return;var el;
    el=document.getElementById("admAberto");if(el)el.checked=!!_cloudData.aberto;
    el=document.getElementById("admAbertoLabel");if(el)el.textContent=_cloudData.aberto?"Aberta ✅":"Fechada 🔒";
    el=document.getElementById("admAviso");if(el)el.value=_cloudData.aberto||"";
    el=document.getElementById("admTaxa");if(el)el.value=_cloudData.taxa||0;
    el=document.getElementById("admTempo");if(el)el.value=_cloudData.tempo||"30-45 min";
    try{window.admRenderItems();}catch(e){}
  }

  window.admSaveAll=function(){
    var payload={aberto:!!(document.getElementById("admAberto")||{}).checked,aviso:(document.getElementById("admAviso")||{value:""}).value.trim(),taxa:parseFloat((document.getElementById("admTaxa")||{value:0}).value)||0,tempo:(document.getElementById("admTempo")||{value:"30-45 min"}).value.trim()||"30-45 min",desativados:window._cloudDisabled||[],desativadosOpts:window._cloudDisabledOpts||[]};
    cloudSave(payload).then(function(){syncPanel();});
  };

  window.admToggleItem=function(id){
    try{id=String(id);var list=window._cloudDisabled.slice(),idx=list.indexOf(id);
    if(idx===-1){list.push(id);removeSingleItemFromCart(id);}else{list.splice(idx,1);}
    window._cloudDisabled=list;window.admRenderItems();try{if(typeof applyDisabledItems==="function")applyDisabledItems(window._cloudDisabled.map(Number));}catch(e){}}catch(e){}
  };

  window.admToggleOpt=function(productId,optName){
    try{productId=String(productId);optName=String(optName);var key=productId+":"+optName,list=window._cloudDisabledOpts.slice(),idx=list.indexOf(key);
    if(idx===-1){list.push(key);removeItemsWithDisabledOpt(productId,optName);}else{list.splice(idx,1);}
    window._cloudDisabledOpts=list;window.admRenderItems();}catch(e){}
  };

  window.admToggleExpand=function(id){window._admExpanded[id]=!window._admExpanded[id];window.admRenderItems();};

  window.admRenderItems=function(){
    if(typeof MENU==="undefined")return;var box=document.getElementById("admItems"),q=(document.getElementById("admSearch")||{value:""}).value.toLowerCase();if(!box)return;
    var list=MENU.filter(function(i){return !q||i.name.toLowerCase().indexOf(q)!==-1;}),html="";
    list.forEach(function(item){
      var strId=String(item.id),off=window._cloudDisabled.indexOf(strId)!==-1;
      var cat=(typeof CATEGORIES!=="undefined")?CATEGORIES.find(function(c){return c.id===item.category;}):null;
      var price=typeof fmt==="function"?fmt(item.price):("R$"+(item.price||0).toFixed(2));
      var name=item.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      var totalOpts=0,totalOptsOff=0;
      if(item.modifiers&&item.modifiers.length){item.modifiers.forEach(function(mod){if(mod.options)mod.options.forEach(function(opt){totalOpts++;if(window._cloudDisabledOpts.indexOf(strId+":"+String(opt.name))!==-1)totalOptsOff++;});});}
      var hasOpts=totalOpts>0,expanded=!!window._admExpanded[item.id];
      html+='<div class="adm-item-row '+(off?"off":"")+'">';
      html+='<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">';
      if(hasOpts&&!off)html+='<button class="adm-expand-btn" onclick="admToggleExpand(\''+strId.replace(/'/g,"\\'")+'\')"><i class="fas fa-chevron-'+(expanded?"down":"right")+'"></i></button>';
      if(off)html+='<i class="fas fa-lock adm-lock-icon"></i>';
      html+='<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(cat?cat.icon:"🍽")+" "+name+' <small>'+price+'</small>';
      if(totalOptsOff>0&&!off)html+=' <span class="adm-opt-badge">'+totalOptsOff+' off</span>';
      html+='</span></div>';
      html+='<label class="adm-sw"><input type="checkbox" '+(off?"":"checked")+' onchange="admToggleItem(\''+strId.replace(/'/g,"\\'")+'\')"><span></span></label></div>';
      if(hasOpts&&expanded&&!off){item.modifiers.forEach(function(mod){if(!mod.options||!mod.options.length)return;html+='<div class="adm-opts-section"><div class="adm-opts-title">'+mod.name.toUpperCase()+'</div>';mod.options.forEach(function(opt){var optStrName=String(opt.name),key=strId+":"+optStrName,optOff=window._cloudDisabledOpts.indexOf(key)!==-1;var optNameHtml=opt.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");var optPrice=opt.price>0&&typeof fmt==="function"?' <small>+'+fmt(opt.price)+'</small>':"";html+='<div class="adm-opt-row '+(optOff?"off":"")+'"><span>'+optNameHtml+optPrice+'</span><label class="adm-sw adm-sw-sm"><input type="checkbox" '+(optOff?"":"checked")+' onchange="admToggleOpt(\''+strId.replace(/'/g,"\\'")+'\',\''+optStrName.replace(/'/g,"\\'")+'\')"><span></span></label></div>';});html+='</div>';});}
    });
    box.innerHTML=html;
  };

  document.addEventListener("click",function(e){var ov=document.getElementById("adminOverlay");if(e.target===ov)window.closeAdmin();});
  document.addEventListener("keydown",function(e){if(e.key==="Enter"){var p=document.getElementById("adminPass");if(p&&document.activeElement===p){e.preventDefault();window.adminLogin();}}});

  cloudFetch();
  setInterval(cloudFetch,8000);
})();