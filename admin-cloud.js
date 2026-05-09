(function(){

  var BIN_ID="69ff6740adc21f119a778293";
  var MASTER_KEY="$2a$10$zfLo4xQ0.IvfaaQaJbTDle3OU9eW24NU.iN7JbK9Ph9OpF0MiuRRu";
  var API_URL="https://api.jsonbin.io/v3/b/"+BIN_ID;
  var ADMIN_PASS="imperio123";
  var _cloudData=null;
  window._cloudDisabled=[];
  window._cloudDisabledOpts=[];
  window._admExpanded={};
  window._admEditing=false;

  function cloudFetch(){
    fetch(API_URL+"/latest",{headers:{"X-Master-Key":MASTER_KEY}})
    .then(function(res){return res.json();})
    .then(function(json){_cloudData=json.record;if(_cloudData)applyState(_cloudData);})
    .catch(function(e){console.warn("[Admin]",e);});
  }

  function cloudSave(payload){
    return fetch(API_URL,{method:"PUT",headers:{"Content-Type":"application/json","X-Master-Key":MASTER_KEY},body:JSON.stringify(payload)})
    .then(function(res){if(!res.ok)throw new Error("HTTP "+res.status);_cloudData=payload;applyState(payload);
      if(typeof showToast==="function")showToast("Salvo na nuvem! ☁️","Clientes verão em instantes.","success");
      return true;})
    .catch(function(e){if(typeof showToast==="function")showToast("Erro ao salvar ❌","Verifique a conexão.","warn");return false;});
  }

  function applyState(data){
    if(!data) return;
    if(typeof State!=="undefined"&&data.aberto!==undefined) State.lojaAberta=data.aberto;
    var badge=document.getElementById("status-loja");
    if(badge){badge.className="status-badge "+(data.aberto?"aberto":"fechado");var lbl=badge.querySelector("#status-label");if(lbl)lbl.textContent=data.aberto?"Aberto agora":"Fechado";}
    document.body.classList.toggle("loja-fechada",!data.aberto);
    if(typeof CONFIG!=="undefined"&&data.taxa!==undefined) CONFIG.delivery=parseFloat(data.taxa)||0;
    if(typeof CLOUD!=="undefined"){CLOUD.delivery=data.taxa||0;CLOUD.aberto=data.aberto;CLOUD.aviso=data.aviso||"";CLOUD.desativados=data.desativados||[];CLOUD.desativadosOpts=data.desativadosOpts||[];CLOUD.tempo=data.tempo||"30-45 min";}
    if(data.tempo){var t=document.querySelector(".delivery-time");if(t)t.innerHTML='<i class="far fa-clock"></i> '+data.tempo;}
    var notice=document.getElementById("storeNotice");var noticeT=document.getElementById("storeNoticeText");
    if(notice&&noticeT){if(data.aviso&&String(data.aviso).trim()){noticeT.textContent=data.aviso;notice.style.display="flex";}else{notice.style.display="none";}}
    
    if(!window._admEditing){
      window._cloudDisabled=(data.desativados||[]).map(String);
      window._cloudDisabledOpts=(data.desativadosOpts||[]).map(String);
    }
    
    // CORREÇÃO: Converte para Número na hora de bloquear, pois o app.js usa Números
    if(typeof applyDisabledItems==="function") applyDisabledItems(window._cloudDisabled.map(Number));
    if(typeof updateCartUI==="function") updateCartUI();
    
    // Limpa o carrinho se tiver algum item que foi desativado na nuvem
    removeFromCartIfDisabled();
    
    if(sessionStorage.getItem("adm_auth")==="1" && !window._admEditing) syncPanel();
  }

  // NOVA FUNÇÃO: Remove do carrinho itens que foram desativados
  function removeFromCartIfDisabled(){
    if(typeof State==="undefined"||!Array.isArray(State.cart)) return;
    var disabledNums = window._cloudDisabled.map(Number);
    var qtdAntes = State.cart.length;
    
    State.cart = State.cart.filter(function(item){
      return disabledNums.indexOf(item.productId) === -1;
    });
    
    // Se removeu algum item, salva e atualiza a tela do carrinho
    if(State.cart.length !== qtdAntes){
      if(typeof saveCart==="function") saveCart();
      if(typeof updateCartUI==="function") updateCartUI();
      if(typeof showToast==="function") showToast("Sacola atualizada 🗑️","Item indisponível foi removido automaticamente","warn");
    }
  }

  window.openAdmin=function(){
    var ov=document.getElementById("adminOverlay");if(!ov)return;
    ov.style.display="flex";document.body.style.overflow="hidden";
    window._admEditing=true;
    var ok=sessionStorage.getItem("adm_auth")==="1";
    var login=document.getElementById("adminLoginScreen");var dash=document.getElementById("adminDash");
    if(login)login.style.display=ok?"none":"block";
    if(dash)dash.style.display=ok?"flex":"none";
    if(ok)syncPanel();else setTimeout(function(){var p=document.getElementById("adminPass");if(p)p.focus();},100);
  };

  window.closeAdmin=function(){
    var ov=document.getElementById("adminOverlay");if(ov)ov.style.display="none";document.body.style.overflow="";
    window._admEditing=false;
    cloudFetch();
  };

  window.adminLogin=function(){
    var p=document.getElementById("adminPass");var e=document.getElementById("adminErr");if(!p)return;
    if(p.value===ADMIN_PASS){sessionStorage.setItem("adm_auth","1");p.value="";
      var login=document.getElementById("adminLoginScreen");var dash=document.getElementById("adminDash");
      if(login)login.style.display="none";if(dash)dash.style.display="flex";syncPanel();
    }else{if(e)e.textContent="Senha incorreta";p.value="";p.focus();setTimeout(function(){if(e)e.textContent="";},2000);}
  };

  window.admLogout=function(){
    sessionStorage.removeItem("adm_auth");
    var dash=document.getElementById("adminDash");var login=document.getElementById("adminLoginScreen");
    if(dash)dash.style.display="none";if(login)login.style.display="block";
    window.closeAdmin();
  };

  function syncPanel(){
    if(!_cloudData)return;
    var el;
    el=document.getElementById("admAberto");if(el)el.checked=!!_cloudData.aberto;
    el=document.getElementById("admAbertoLabel");if(el)el.textContent=_cloudData.aberto?"Aberta ✅":"Fechada 🔒";
    el=document.getElementById("admAviso");if(el)el.value=_cloudData.aviso||"";
    el=document.getElementById("admTaxa");if(el)el.value=_cloudData.taxa||0;
    el=document.getElementById("admTempo");if(el)el.value=_cloudData.tempo||"30-45 min";
    window.admRenderItems();
  }

  window.admSaveAll=function(){
    var payload={
      aberto:!!(document.getElementById("admAberto")||{}).checked,
      aviso:(document.getElementById("admAviso")||{value:""}).value.trim(),
      taxa:parseFloat((document.getElementById("admTaxa")||{value:0}).value)||0,
      tempo:(document.getElementById("admTempo")||{value:"30-45 min"}).value.trim()||"30-45 min",
      desativados:window._cloudDisabled||[],
      desativadosOpts:window._cloudDisabledOpts||[]
    };
    cloudSave(payload).then(function(){syncPanel();});
  };

  window.admToggleItem=function(id){
    id = String(id);
    var list=window._cloudDisabled.slice();var idx=list.indexOf(id);
    if(idx===-1)list.push(id);else list.splice(idx,1);
    window._cloudDisabled=list;
    window.admRenderItems();
    
    // Bloqueia/Desbloqueia instantaneamente no cardápio
    if(typeof applyDisabledItems==="function") applyDisabledItems(window._cloudDisabled.map(Number));
    
    // Remove do carrinho se tiver sido desativado agora
    removeFromCartIfDisabled();
  };

  window.admToggleOpt=function(productId,optName){
    productId = String(productId);
    optName = String(optName);
    var key=productId+":"+optName;
    var list=window._cloudDisabledOpts.slice();var idx=list.indexOf(key);
    if(idx===-1)list.push(key);else list.splice(idx,1);
    window._cloudDisabledOpts=list;
    window.admRenderItems();
  };

  window.admToggleExpand=function(id){window._admExpanded[id]=!window._admExpanded[id];window.admRenderItems();};

  window.admRenderItems=function(){
    if(typeof MENU==="undefined")return;
    var box=document.getElementById("admItems");
    var q=(document.getElementById("admSearch")||{value:""}).value.toLowerCase();
    if(!box)return;
    var list=MENU.filter(function(i){return!q||i.name.toLowerCase().indexOf(q)!==-1;});
    var html="";
    list.forEach(function(item){
      var strId = String(item.id);
      var off=window._cloudDisabled.indexOf(strId)!==-1;
      var cat=CATEGORIES.find(function(c){return c.id===item.category;});
      var price=fmt(item.price);
      var name=item.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      var totalOpts=0,totalOptsOff=0;
      if(item.modifiers&&item.modifiers.length){item.modifiers.forEach(function(mod){if(mod.options){mod.options.forEach(function(opt){totalOpts++;if(window._cloudDisabledOpts.indexOf(strId+":"+String(opt.name))!==-1)totalOptsOff++;});}});}
      var hasOpts=totalOpts>0;var expanded=!!window._admExpanded[item.id];

      html+='<div class="adm-item-row '+(off?"off":"")+'">';
      html+='<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">';
      if(hasOpts&&!off){html+='<button class="adm-expand-btn" onclick="admToggleExpand(\''+strId.replace(/'/g,"\\'")+'\')"><i class="fas fa-chevron-'+(expanded?"down":"right")+'"></i></button>';}
      
      if(off){html+='<i class="fas fa-lock adm-lock-icon"></i>';}
      
      html+='<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">';
      html+=(cat?cat.icon:"🍽")+" "+name+' <small>'+price+'</small>';
      if(totalOptsOff>0&&!off){html+=' <span class="adm-opt-badge">'+totalOptsOff+' off</span>';}
      html+='</span></div>';
      html+='<label class="adm-sw"><input type="checkbox" '+(off?"":"checked")+' onchange="admToggleItem(\''+strId.replace(/'/g,"\\'")+'\')"><span></span></label>';
      html+='</div>';

      if(hasOpts&&expanded&&!off){
        item.modifiers.forEach(function(mod){
          if(!mod.options||!mod.options.length)return;
          html+='<div class="adm-opts-section">';
          html+='<div class="adm-opts-title">'+mod.name.toUpperCase()+'</div>';
          mod.options.forEach(function(opt){
            var optStrName = String(opt.name);
            var key=strId+":"+optStrName;
            var optOff=window._cloudDisabledOpts.indexOf(key)!==-1;
            var optNameHtml=opt.name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
            var optPrice=opt.price>0?' <small>+'+fmt(opt.price)+'</small>':"";
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

  document.addEventListener("click",function(e){var ov=document.getElementById("adminOverlay");if(e.target===ov)window.closeAdmin();});

  cloudFetch();
  setInterval(cloudFetch,8000);

})();