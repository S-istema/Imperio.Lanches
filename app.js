"use strict";

/* ════════════════════════════════════════════
   DADOS DO CARDÁPIO
   ════════════════════════════════════════════ */
var CATEGORIES = [
  { id:"todos", name:"Todos", icon:"🏠" },
  { id:"massas", name:"Massas", icon:"🌾" },
  { id:"pasteis-salgados", name:"Pastéis Salgados", icon:"🥟" },
  { id:"pasteis-doces", name:"Pastéis Doces", icon:"🍫" },
  { id:"hamburgueres", name:"Hambúrgueres", icon:"🍔" },
  { id:"hamburgueres-artesanal", name:"Artesanal", icon:"🔥" },
  { id:"tapioca", name:"Tapioca", icon:"🫓" },
  { id:"cuscuz", name:"Cuscuz", icon:"🌽" },
  { id:"cachorro-quente", name:"Cachorro-Quente", icon:"🌭" },
  { id:"petiscos", name:"Petiscos", icon:"🍟" },
  { id:"pizzas", name:"Pizzas Salgadas", icon:"🍕" },
  { id:"pizzas-doces", name:"Pizzas Doces", icon:"🍰" },
  { id:"milkshake", name:"Milk Shake", icon:"🥤" },
  { id:"sorvete", name:"Sorvete", icon:"🍦" },
  { id:"acai", name:"Açaí", icon:"🫐" },
  { id:"bebidas", name:"Bebidas", icon:"🧃" },
  { id:"sucos", name:"Sucos", icon:"🍊" },
];

var PIZZA_SIZES = [
  { name:"Média", price:0 },
  { name:"Grande", price:10 },
  { name:"Gigante", price:20 },
];

function acaiModifiers(qtd) {
  return [
    { name:"Creme", required:true, multiple:false, options:[
      {name:"Açaí",price:0},{name:"Avelã",price:0},{name:"Cupuaçu",price:0},{name:"Ninho",price:0},
      {name:"Açaí com Banana",price:0},{name:"Ninho Trufado",price:0},{name:"Oreo",price:0},
      {name:"Ovomaltine",price:0},{name:"Tapioca",price:0}
    ]},
    { name:"Acompanhamentos", required:true, multiple:true, minSelect:qtd, maxSelect:qtd,
      description:"Escolha "+qtd+" acompanhamento"+(qtd>1?"s":""),
      options:[
        {name:"Amendoim",price:0},{name:"Chocobol",price:0},{name:"Chocopower",price:0},
        {name:"Confetes",price:0},{name:"Farinha Láctea",price:0},{name:"Gotas de Chocolate",price:0},
        {name:"Granola",price:0},{name:"Granulado",price:0},{name:"Jujuba",price:0},
        {name:"Leite em Pó",price:0},{name:"Ovomaltine",price:0},{name:"Paçoca",price:0}
      ]},
    { name:"Cobertura", required:true, multiple:false, options:[
      {name:"Leite Condensado",price:0},{name:"Chocolate",price:0},{name:"Morango",price:0}
    ]},
    { name:"Adicionais", required:false, multiple:true, minSelect:0, maxSelect:4, options:[
      {name:"Cobertura Fini de Dentadura",price:1},{name:"Cobertura Fini de Banana",price:1},
      {name:"Cobertura Fini de Beijos",price:1},{name:"Nutela",price:3}
    ]}
  ];
}

var pizzaModifier = { name:"Tamanho", required:true, multiple:false, options:PIZZA_SIZES };
var saborPastelSalgado = { name:"Sabor", required:true, multiple:false, options:[
  {name:"Três Queijos",price:0},{name:"Frango com Queijo",price:1},{name:"Pizza",price:1},
  {name:"Frango com Catupiry",price:2},{name:"Frango com Cheddar",price:2},{name:"Frango com Bacon",price:2},
  {name:"Carne com Catupiry",price:3},{name:"Carne com Cheddar",price:3},{name:"Calabresa",price:3},
  {name:"Carne com Queijo",price:3},{name:"Carne de Sol na Nata",price:5},{name:"Moda da Casa",price:6},{name:"Sertanejo",price:6}
]};
var saborPastelDoce = { name:"Sabor", required:true, multiple:false, options:[
  {name:"Chocolate ao Leite",price:0},{name:"Chocolate ao Leite + Queijo",price:0},
  {name:"Chocolate Meio Amargo",price:0},{name:"Chocolate Meio Amargo + Queijo",price:0},
  {name:"Romeu e Julieta",price:0},{name:"Churros",price:0}
]};
var recheioTapioca = { name:"Recheio", required:true, multiple:false, options:[
  {name:"Carne de Sol com Catupiry",price:0},{name:"Carne de Sol com Queijo",price:0},
  {name:"Frango com Catupiry",price:0},{name:"Frango com Queijo",price:0},
  {name:"Carne de Sol na Nata",price:1},{name:"Sertaneja",price:1}
]};
var recheioCuscuz = { name:"Recheio", required:true, multiple:false, options:[
  {name:"Carne de Sol com Queijo",price:0},{name:"Frango com Queijo",price:0},
  {name:"Calabresa",price:0},{name:"Carne de Sol na Nata",price:1}
]};
var adicionaisCuscuzTapioca = { name:"Adicionais", required:false, multiple:true, minSelect:0, maxSelect:7, options:[
  {name:"Vinagrete",price:2},{name:"Ovo",price:2},{name:"Catupiry (requeijão)",price:2},
  {name:"Cheddar (requeijão)",price:2},{name:"Queijo Coalho",price:3},
  {name:"Catupiry (original)",price:4},{name:"Cheddar (original)",price:4}
]};
var saborMassa = { name:"Sabor", required:true, multiple:false, options:[
  {name:"Cebola e Salsa",price:0},{name:"Bacon",price:0},{name:"Queijo",price:0}
]};

var MENU = [
  {id:1,category:"massas",name:"Massa Gourmet",description:"Sabores: Cebola e Salsa, Bacon e Queijo",price:3,image:"imagem/massas.jpg",badge:null,modifiers:[saborMassa]},
  {id:4,category:"pasteis-salgados",name:"Pastel Salgado",description:"Vários sabores disponíveis",price:7,image:"imagem/pastel.jpg",badge:"MAIS PEDIDO",modifiers:[saborPastelSalgado]},
  {id:15,category:"pasteis-doces",name:"Pastel Doce",description:"Chocolate, Romeu e Julieta, Churros",price:10,image:"imagem/pastel.jpg",badge:"DOCE",modifiers:[saborPastelDoce]},
  {id:19,category:"hamburgueres",name:"X-Burg",description:"Pão, hambúrguer, queijo e presunto",price:7,image:"imagem/xburguer.jpg",badge:null,modifiers:[]},
  {id:20,category:"hamburgueres",name:"Bauru",description:"Pão, hambúrguer, alface, tomate, ovo, queijo e presunto",price:8,image:"imagem/bauru.jpg",badge:null,modifiers:[]},
  {id:21,category:"hamburgueres",name:"X-Bacon",description:"Pão, bacon, hambúrguer, ovo, queijo, presunto, alface e tomate",price:10,image:"imagem/xbacon.jpg",badge:"MAIS PEDIDO",modifiers:[]},
  {id:22,category:"hamburgueres",name:"X-Calabresa",description:"Pão, calabresa acebolada, hambúrguer, queijo, alface e tomate",price:10,image:"https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=400&q=80",badge:null,modifiers:[]},
  {id:23,category:"hamburgueres",name:"X-Tudo",description:"Pão, hambúrguer, ovo, bacon, salsicha, frango, presunto, queijo, alface e tomate",price:12,image:"imagem/xtudo.png",badge:"FAVORITO",modifiers:[]},
  {id:24,category:"hamburgueres",name:"X-Frango com Catupiry",description:"Pão, frango, catupiry, ovo, alface e tomate",price:12,image:"https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=400&q=80",badge:null,modifiers:[]},
  {id:25,category:"hamburgueres",name:"X-Carne de Sol",description:"Pão, carne de sol na nata, ovo, queijo, alface e tomate",price:13,image:"imagem/xcarnesol.jpg",badge:"ESPECIAL",modifiers:[]},
  {id:26,category:"hamburgueres",name:"Hamburguer Moda da Casa",description:"Pão, hambúrguer duplo, ovo, presunto duplo, queijo duplo, bacon, frango, salsicha, catupiry, alface e tomate",price:15,image:"https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&q=80",badge:"PREMIUM",modifiers:[]},
  {id:27,category:"hamburgueres-artesanal",name:"X-Cheddar",description:"Pão brioche, hambúrguer artesanal 100g, cheddar, bacon, cebola roxa e molho especial",price:18,image:"imagem/xchedar.webp",badge:"ARTESANAL",modifiers:[]},
  {id:28,category:"hamburgueres-artesanal",name:"Hamburguer Duplo Cheddar",description:"Pão brioche, dois hambúrgueres artesanais 100g, cheddar, bacon, cebola roxa e molho especial",price:22,image:"imagem/duplochedar.jpg",badge:"PREMIUM",modifiers:[]},
  {id:29,category:"tapioca",name:"Tapioca",description:"Escolha o recheio e adicionais",price:8,image:"imagem/tapioca.avif",badge:null,modifiers:[recheioTapioca,adicionaisCuscuzTapioca]},
  {id:35,category:"cuscuz",name:"Cuscuz",description:"Escolha o recheio e adicionais",price:8,image:"imagem/cuscuzcalabresa.jpg",badge:null,modifiers:[recheioCuscuz,adicionaisCuscuzTapioca]},
  {id:39,category:"cachorro-quente",name:"Cachorro-Quente Tradicional",description:"Pão, carne moída, salsicha, frango, batata palha, milho, ervilha e queijo ralado",price:7,image:"imagem/hotdog.webp",badge:null,modifiers:[]},
  {id:40,category:"cachorro-quente",name:"Cachorro-Quente Carne na Nata",description:"Pão, carne de sol na nata, salsicha, milho, ervilha, batata palha e queijo ralado",price:9,image:"imagem/Cachorro-quente-nata.jpg",badge:"ESPECIAL",modifiers:[]},
  {id:41,category:"petiscos",name:"Batata Frita P",description:"Porção pequena de batata frita",price:10,image:"imagem/batata.jpg",badge:null,modifiers:[]},
  {id:42,category:"petiscos",name:"Batata Frita G",description:"Porção grande de batata frita",price:14,image:"imagem/batata.jpg",badge:null,modifiers:[]},
  {id:43,category:"petiscos",name:"Batata Frita com Bacon e Cheddar",description:"Batata frita com bacon crocante e cheddar cremoso",price:20,image:"imagem/batata-bacon-chadar.jpg",badge:"MAIS PEDIDA",modifiers:[]},
  {id:44,category:"petiscos",name:"Batata Frita com Calabresa e Cheddar",description:"Batata frita com calabresa e cheddar",price:20,image:"imagem/batata-calabresa-chadar.jpg",badge:null,modifiers:[]},
  {id:45,category:"milkshake",name:"Milk Shake 300ml",description:"Milk shake cremoso com chantilly",price:13,image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",badge:"FAVORITO",modifiers:[{name:"Sabor",required:true,multiple:false,options:[{name:"Morango",price:0},{name:"Chocolate",price:0},{name:"Ovomaltine",price:0},{name:"Chocomenta",price:0}]}]},
  {id:46,category:"sorvete",name:"Sorvete 1 Bola",description:"Sorvete 1 bola",price:3,image:"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",badge:null,modifiers:[{name:"Sabor",required:true,multiple:false,options:[{name:"Morango",price:0},{name:"Chocolate",price:0},{name:"Chocomenta",price:0}]}]},
  {id:47,category:"pizzas",name:"Pizza Calabresa",description:"Calabresa, cebola, queijo mussarela, orégano, azeitona e molho",price:30,image:"imagem/pizzacalabresa.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:48,category:"pizzas",name:"Pizza Frango com Bacon",description:"Frango, bacon, queijo, orégano, azeitona e molho",price:30,image:"imagem/pizza-de-frango-com-bacon.png",badge:null,modifiers:[pizzaModifier]},
  {id:49,category:"pizzas",name:"Pizza Frango com Milho",description:"Frango, milho, queijo, orégano, azeitona e molho",price:30,image:"imagem/pizza-de-frangomilho.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:50,category:"pizzas",name:"Pizza Frango com Catupiry",description:"Frango, catupiry, queijo, orégano, azeitona e molho",price:30,image:"imagem/pizza-de-frango-com-catupiry.webp",badge:null,modifiers:[pizzaModifier]},
  {id:51,category:"pizzas",name:"Pizza Frango com Cheddar",description:"Frango, cheddar, queijo, orégano, azeitona e molho",price:30,image:"imagem/pizzafrangochedar.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:52,category:"pizzas",name:"Pizza Frango com Queijo",description:"Frango, queijo, orégano, azeitona e molho",price:30,image:"imagem/pizza-de-frango-queijo.webp",badge:null,modifiers:[pizzaModifier]},
  {id:53,category:"pizzas",name:"Pizza Moda da Casa",description:"Carne de sol, frango, calabresa, queijo, orégano, azeitona e molho",price:40,image:"imagem/pizzamodadacasa.jpg",badge:"ESPECIAL",modifiers:[pizzaModifier]},
  {id:54,category:"pizzas",name:"Pizza Carne com Catupiry",description:"Carne, catupiry, queijo, orégano, azeitona e molho",price:35,image:"imagem/pizzacarnedesolcatupiry.webp",badge:null,modifiers:[pizzaModifier]},
  {id:55,category:"pizzas",name:"Pizza Carne de Sol",description:"Carne de sol, queijo, orégano, azeitona e molho",price:35,image:"imagem/pizzacarnesol.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:56,category:"pizzas",name:"Pizza Carne com Cheddar",description:"Carne, cheddar, queijo, orégano, azeitona e molho",price:35,image:"imagem/pizza-carne-chedar.webp",badge:null,modifiers:[pizzaModifier]},
  {id:57,category:"pizzas",name:"Pizza Sertaneja",description:"Carne de sol, queijo coalho, queijo, orégano, azeitona e molho",price:35,image:"imagem/pizza-sertaneja.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:58,category:"pizzas-doces",name:"Pizza Chocolate com Confetes",description:"Chocolate ao leite e confetes",price:30,image:"imagem/pizzachocolatecf.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:59,category:"pizzas-doces",name:"Pizza Chocolate com Amendoim",description:"Chocolate ao leite com amendoim",price:30,image:"imagem/pizzachocolateam.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:60,category:"pizzas-doces",name:"Pizza Dois Amores",description:"Chocolate ao leite e chocolate branco",price:30,image:"imagem/pizzadoisamores.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:61,category:"pizzas-doces",name:"Pizza Churros",description:"Doce de leite, canela e açúcar",price:30,image:"imagem/pizzachurros.jpg",badge:null,modifiers:[pizzaModifier]},
  {id:62,category:"acai",name:"Açaí 250ml",description:"1 creme, 5 acompanhamentos, 1 cobertura",price:10,image:"imagem/açai.jpg",badge:null,modifiers:acaiModifiers(5)},
  {id:63,category:"acai",name:"Açaí 350ml",description:"1 creme, 6 acompanhamentos, 1 cobertura",price:12,image:"imagem/açai.jpg",badge:null,modifiers:acaiModifiers(6)},
  {id:64,category:"acai",name:"Açaí 500ml",description:"1 creme, 8 acompanhamentos, 1 cobertura",price:16,image:"imagem/açai.jpg",badge:null,modifiers:acaiModifiers(8)},
  {id:65,category:"acai",name:"Açaí 1 Litro",description:"1 creme, 10 acompanhamentos, 1 cobertura",price:28,image:"imagem/açai.jpg",badge:"FAMÍLIA",modifiers:acaiModifiers(10)},
  {id:66,category:"bebidas",name:"Água Mineral",description:"Água mineral sem gás 500ml",price:2,image:"imagem/aguamineral.webp",badge:null,modifiers:[]},
  {id:67,category:"bebidas",name:"Água com Gás",description:"Água mineral com gás 500ml",price:3,image:"imagem/aguacomgas.webp",badge:null,modifiers:[]},
  {id:68,category:"bebidas",name:"Refrigerante Mini",description:"Refrigerante mini",price:2.5,image:"imagem/minirefri.jpg",badge:null,modifiers:[]},
  {id:69,category:"bebidas",name:"Cerveja",description:"Cerveja long neck",price:5,image:"https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",badge:null,modifiers:[]},
  {id:70,category:"bebidas",name:"Guaraná Lata",description:"Guaraná em lata 350ml",price:5,image:"imagem/guaranalata.jpg",badge:null,modifiers:[]},
  {id:71,category:"bebidas",name:"Fanta Laranja Lata",description:"Fanta laranja em lata 350ml",price:5,image:"imagem/fantalaranjalata.webp",badge:null,modifiers:[]},
  {id:72,category:"bebidas",name:"Fanta Uva Lata",description:"Fanta uva em lata 350ml",price:5,image:"imagem/fantauva.webp",badge:null,modifiers:[]},
  {id:73,category:"bebidas",name:"Pepsi Lata",description:"Pepsi em lata 350ml",price:5,image:"imagem/pepsilata.webp",badge:null,modifiers:[]},
  {id:74,category:"bebidas",name:"Coca-Cola Lata",description:"Coca-Cola em lata 350ml",price:5,image:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",badge:null,modifiers:[{name:"Opção",required:true,multiple:false,options:[{name:"Original",price:0},{name:"Zero",price:0}]}]},
  {id:75,category:"bebidas",name:"Fanta Laranja 1L",description:"Fanta laranja 1 litro",price:8,image:"imagem/fantalaranja.webp",badge:null,modifiers:[]},
  {id:76,category:"bebidas",name:"Pepsi 1L",description:"Pepsi 1 litro",price:8,image:"imagem/pepsi.jpg",badge:null,modifiers:[]},
  {id:77,category:"bebidas",name:"Guaraná 1L",description:"Guaraná 1 litro",price:8,image:"imagem/guarana.webp",badge:null,modifiers:[]},
  {id:78,category:"bebidas",name:"Coca-Cola Original 1L",description:"Coca-Cola original 1 litro",price:10,image:"imagem/cocacola.webp",badge:null,modifiers:[]},
  {id:79,category:"bebidas",name:"Energético",description:"Energético",price:12,image:"https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80",badge:null,modifiers:[]},
  {id:80,category:"sucos",name:"Suco Natural",description:"Goiaba, Acerola, Cajá, Caju, Maracujá, Mangaba, Uva, Graviola, Morango, Abacaxi",price:4,image:"imagem/suco.jpg",badge:null,modifiers:[
    {name:"Base",required:true,multiple:false,options:[{name:"Água",price:0},{name:"Leite",price:1},{name:"Litro na água",price:11},{name:"Litro no leite",price:16}]},
    {name:"Sabor",required:true,multiple:false,options:["Goiaba","Acerola","Cajá","Caju","Maracujá","Mangaba","Uva","Graviola","Morango","Abacaxi com hortelã"].map(function(n){return{name:n,price:0};})}
  ]}
];

var PAYMENT_LABELS = { pix:"PIX ✅", cartao:"Cartão 💳", dinheiro:"Dinheiro 💵" };
var FALLBACK_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

var CONFIG = {
  whatsapp:"5584994994919", pix:"84994994919", pixName:"EMANUEL", pixCity:"NATAL",
  storeName:"Império Lanches", maxCartItemQty:99, toastDuration:3200,
  searchDebounce:220, cartKey:"imperio_cart_v3", delivery:0
};

/* ════════════════════════════════════════════
   ESTADO
   ════════════════════════════════════════════ */
var State = {
  cart:[], currentCategory:"todos",
  modal:{ product:null, qty:1, modifiers:{} },
  checkoutStep:1, lojaAberta:true, lastFocused:null,
  timers:{ search:null, toast:null },
  observers:{ reveal:null }, _index:null
};

var CLOUD = { delivery:0, aberto:true, aviso:"", desativados:[], desativadosOpts:[], tempo:"30-45 min" };

/* ════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════ */
function getIndex(){ if(!State._index) State._index=new Map(MENU.map(function(p){return[p.id,p];})); return State._index; }
function findProduct(id){ return getIndex().get(id)||null; }

var _cache=new Map();
function $(id){ if(_cache.has(id)) return _cache.get(id); var el=document.getElementById(id); if(el) _cache.set(id,el); return el; }
function setText(id,v){ var e=$(id); if(e) e.textContent=v; }
function setHTML(id,v){ var e=$(id); if(e) e.innerHTML=v; }

function fmt(v){ return "R$ "+Number(v).toFixed(2).replace(".",","); }
function clamp(v,a,b){ return Math.min(Math.max(v,a),b); }
function escape(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function normalize(s){ return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim(); }

function getSubtotal(){ return State.cart.reduce(function(s,i){return s+(i.price+i.modifiersTotal)*i.quantity;},0); }
function getTotal(){ return getSubtotal()+(CONFIG.delivery||0); }
function getDelivery(){ return CONFIG.delivery||0; }

function handleImgError(img){
  if(!img.dataset.retried){
    img.dataset.retried="1";
    img.onerror=null;
    img.src=FALLBACK_IMG;
    img.classList.add("loaded");
  }
}
function cartItemKey(pid,mods){ return pid+"||"+mods.join(","); }

/* ════════════════════════════════════════════
   PRELOADER
   ════════════════════════════════════════════ */
window.addEventListener("load",function(){
  var pre=$("preloader"); if(!pre) return;
  setTimeout(function(){ pre.classList.add("hide"); pre.addEventListener("transitionend",function(){pre.remove();},{once:true}); },1400);
});

/* ════════════════════════════════════════════
   SCROLL
   ════════════════════════════════════════════ */
function initReveal(){
  if(State.observers.reveal) State.observers.reveal.disconnect();
  State.observers.reveal=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var card=e.target; var grid=card.closest(".products-grid");
      var idx=grid?Array.from(grid.children).indexOf(card):0;
      setTimeout(function(){card.classList.add("revealed");},clamp(idx*40,0,300));
      State.observers.reveal.unobserve(card);
    });
  },{threshold:0.03,rootMargin:"0px 0px 40px 0px"});
  document.querySelectorAll(".product-card:not(.revealed)").forEach(function(c){State.observers.reveal.observe(c);});
}

function handleScroll(){
  var y=window.scrollY;
  var h=$("header"); if(h) h.classList.toggle("scrolled",y>50);
  var b=$("backToTop"); if(b) b.classList.toggle("visible",y>400);
}
function scrollToTop(){ window.scrollTo({top:0,behavior:"smooth"}); }

/* ════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded",function(){
  renderCategories();
  renderMenu();
  loadCart();

  window.addEventListener("scroll",handleScroll,{passive:true});

  var ph=$("customerPhone");
  if(ph) ph.addEventListener("input",function(){
    var v=this.value.replace(/\D/g,"").slice(0,11);
    if(v.length>10) v="("+v.slice(0,2)+") "+v.slice(2,7)+"-"+v.slice(7);
    else if(v.length>6) v="("+v.slice(0,2)+") "+v.slice(2,6)+"-"+v.slice(6);
    else if(v.length>2) v="("+v.slice(0,2)+") "+v.slice(2);
    else if(v.length>0) v="("+v;
    this.value=v;
  });

  document.querySelectorAll("#step1 input").forEach(function(inp){
    inp.addEventListener("input",function(){clearInputErr(inp);});
  });

  var mm=$("modalModifiers");
  if(mm) mm.addEventListener("change",onModifierChange);

  document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeAll(); });

  requestAnimationFrame(function(){requestAnimationFrame(initReveal);});
});

/* ════════════════════════════════════════════
   CATEGORIAS
   ════════════════════════════════════════════ */
function renderCategories(){
  var nav=$("categoryNav"); if(!nav) return;
  var frag=document.createDocumentFragment();
  CATEGORIES.forEach(function(cat){
    var btn=document.createElement("button");
    btn.className="cat-link"+(cat.id===State.currentCategory?" active":"");
    btn.dataset.cat=cat.id;
    btn.setAttribute("role","tab");
    btn.innerHTML=cat.icon+" "+escape(cat.name);
    btn.addEventListener("click",function(){filterCategory(cat.id,btn);});
    frag.appendChild(btn);
  });
  nav.innerHTML="";
  nav.appendChild(frag);
}

function filterCategory(id,el){
  State.currentCategory=id;
  document.querySelectorAll(".cat-link").forEach(function(b){b.classList.remove("active");});
  if(el){el.classList.add("active");el.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});}
  var inp=$("searchInput");
  if(inp&&inp.value){inp.value="";$("searchClear").classList.remove("visible");}
  renderMenu();
  if(id!=="todos"){
    requestAnimationFrame(function(){
      var t=document.getElementById("cat-"+id); if(!t) return;
      var hh=$("header")?$("header").offsetHeight:170;
      window.scrollTo({top:t.getBoundingClientRect().top+scrollY-hh-8,behavior:"smooth"});
    });
  }
}

/* ════════════════════════════════════════════
   MENU
   ════════════════════════════════════════════ */
var ORDERED_CATS=CATEGORIES.map(function(c){return c.id;}).filter(function(id){return id!=="todos";});

function groupBy(items){
  var g={};
  items.forEach(function(i){(g[i.category]=g[i.category]||[]).push(i);});
  return g;
}

function renderMenu(){
  var container=$("menuContainer"); if(!container) return;
  var items=State.currentCategory==="todos"?MENU:MENU.filter(function(i){return i.category===State.currentCategory;});
  if(!items.length){container.innerHTML='<div class="empty-search"><div style="font-size:3rem">🔍</div><h3>Nenhum resultado</h3></div>';return;}
  var grouped=groupBy(items);
  var frag=document.createDocumentFragment();
  ORDERED_CATS.filter(function(id){return grouped[id];}).forEach(function(catId){
    var cat=CATEGORIES.find(function(c){return c.id===catId;});
    var sec=document.createElement("section");
    sec.className="category-section"; sec.id="cat-"+catId;
    sec.innerHTML='<div class="section-header"><div class="section-icon">'+(cat?cat.icon:"🍽️")+'</div><h2 class="section-title">'+escape(cat?cat.name:catId)+'</h2></div><div class="products-grid">'+grouped[catId].map(renderCard).join("")+'</div>';
    frag.appendChild(sec);
  });
  container.innerHTML="";
  container.appendChild(frag);
  requestAnimationFrame(initReveal);
  // Reaplicar itens desativados
  if(CLOUD.desativados.length) applyDisabledItems(CLOUD.desativados);
}

function renderCard(p){
  var hasReq=p.modifiers&&p.modifiers.some(function(m){return m.required;});
  var ps=fmt(p.price);
  var action=hasReq?"openProductModal("+p.id+")":"quickAdd("+p.id+")";
  var icon=hasReq?"fa-sliders-h":"fa-plus";
  return '<article class="product-card" role="button" tabindex="0" onclick="openProductModal('+p.id+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openProductModal('+p.id+')}"><div class="product-image"><img src="'+escape(p.image)+'" alt="'+escape(p.name)+'" loading="lazy" decoding="async" onerror="handleImgError(this)">'+(p.badge?'<div class="product-badge">'+escape(p.badge)+'</div>':'')+'</div><div class="product-info"><h3 class="product-name">'+escape(p.name)+'</h3><p class="product-desc">'+escape(p.description)+'</p><div class="product-footer"><span class="product-price">'+ps+'</span><button class="btn-add-quick" onclick="event.stopPropagation();'+action+'"><i class="fas '+icon+'"></i></button></div></div></article>';
}

/* ════════════════════════════════════════════
   BUSCA
   ════════════════════════════════════════════ */
function searchMenu(){
  clearTimeout(State.timers.search);
  State.timers.search=setTimeout(doSearch,CONFIG.searchDebounce);
}

function doSearch(){
  var raw=$("searchInput")?$("searchInput").value:"";
  var q=normalize(raw);
  var clear=$("searchClear");
  if(clear) clear.classList.toggle("visible",q.length>0);
  var container=$("menuContainer"); if(!container) return;
  if(!q){renderMenu();return;}
  var filtered=MENU.filter(function(item){
    return normalize(item.name).indexOf(q)!==-1||normalize(item.description).indexOf(q)!==-1||
      (item.modifiers&&item.modifiers.some(function(m){return m.options&&m.options.some(function(o){return normalize(o.name).indexOf(q)!==-1;});}));
  });
  if(!filtered.length){container.innerHTML='<div class="empty-search"><div style="font-size:3rem">🔍</div><h3>Nenhum resultado para "'+escape(raw)+'"</h3></div>';return;}
  var grouped=groupBy(filtered);
  var frag=document.createDocumentFragment();
  ORDERED_CATS.filter(function(id){return grouped[id];}).forEach(function(catId){
    var cat=CATEGORIES.find(function(c){return c.id===catId;});
    var sec=document.createElement("section");
    sec.className="category-section";
    sec.innerHTML='<div class="section-header"><div class="section-icon">'+(cat?cat.icon:"🍽️")+'</div><h2 class="section-title">'+escape(cat?cat.name:catId)+'</h2></div><div class="products-grid">'+grouped[catId].map(renderCard).join("")+'</div>';
    frag.appendChild(sec);
  });
  container.innerHTML="";container.appendChild(frag);
  requestAnimationFrame(initReveal);
}

function clearSearch(){
  var inp=$("searchInput"); if(inp) inp.value="";
  var cl=$("searchClear"); if(cl) cl.classList.remove("visible");
  renderMenu(); if(inp) inp.focus();
}

/* ════════════════════════════════════════════
   LOJA FECHADA
   ════════════════════════════════════════════ */
function isClosed(){
  if(!State.lojaAberta){showToast("Fechado 🔒","Estamos fechados. Volte em breve!","warn");return true;}
  return false;
}

/* ════════════════════════════════════════════
   ITENS DESATIVADOS (para o app.js)
   ════════════════════════════════════════════ */
function applyDisabledItems(ids){
  document.querySelectorAll(".product-card").forEach(function(card){
    var m=(card.getAttribute("onclick")||"").match(/openProductModal\((\d+)\)/);
    if(!m) return;
    var id=parseInt(m[1],10);
    var off=ids.indexOf(id)!==-1;
    card.classList.toggle("item-disabled",off);
    var ov=card.querySelector(".disabled-overlay");
    if(off&&!ov){ov=document.createElement("div");ov.className="disabled-overlay";ov.innerHTML="<span>Indisponível</span>";card.appendChild(ov);}
    else if(!off&&ov){ov.remove();}
  });
}

/* ════════════════════════════════════════════
   MODAL PRODUTO
   ════════════════════════════════════════════ */
function openProductModal(pid){
  if(CLOUD.desativados.indexOf(pid)!==-1){showToast("Indisponível 😔","Item fora do cardápio.","warn");return;}
  if(isClosed()) return;
  var p=findProduct(pid); if(!p) return;
  State.lastFocused=document.activeElement;
  State.modal.product=p; State.modal.qty=1; State.modal.modifiers={};
  var modal=$("productModal"); if(!modal) return;

  var img=$("modalImg");
  img.alt=p.name;
  img.classList.remove("loaded");
  img.onerror=null;
  img.onload=null;
  img.dataset.retried="";
  img.onerror=function(){ handleImgError(this); };
  img.onload=function(){ this.classList.add("loaded"); };
  img.src=p.image;

  var badge=$("modalBadge"); if(badge){badge.textContent=p.badge||"";badge.style.display=p.badge?"block":"none";}
  var cat=CATEGORIES.find(function(c){return c.id===p.category;});
  setText("modalCategory",cat?cat.name:"");
  setText("modalTitle",p.name);
  setText("modalDescription",p.description);
  setText("modalQty","1");
  renderModifiers(p);
  updateModalPrice();
  modal.classList.add("active"); modal.setAttribute("aria-hidden","false");
  $("overlay").classList.add("active");
  document.body.style.overflow="hidden";
  setTimeout(function(){hideDisabledOptions(pid);},50);
  requestAnimationFrame(function(){modal.querySelector(".modal-close").focus();});
}

function closeProductModal(){
  var modal=$("productModal");
  if(!modal||!modal.classList.contains("active")) return;
  modal.classList.remove("active"); modal.setAttribute("aria-hidden","true");
  tryCloseOverlay(); document.body.style.overflow="";
  if(State.lastFocused) State.lastFocused.focus(); State.lastFocused=null;
}

function hideDisabledOptions(productId){
  var disabledOpts=CLOUD.desativadosOpts||[];
  var container=$("modalModifiers"); if(!container) return;
  container.querySelectorAll(".modifier-option").forEach(function(optEl){
    var nameEl=optEl.querySelector(".option-name"); if(!nameEl) return;
    var key=productId+":"+nameEl.textContent.trim();
    if(disabledOpts.indexOf(key)!==-1){
      optEl.style.display="none";
      var input=optEl.querySelector("input");
      if(input&&input.checked){input.checked=false;input.dispatchEvent(new Event("change",{bubbles:true}));}
    } else { optEl.style.display=""; }
  });
}

/* ════════════════════════════════════════════
   MODIFICADORES
   ════════════════════════════════════════════ */
function renderModifiers(p){
  var container=$("modalModifiers"); if(!container) return;
  if(!p.modifiers||!p.modifiers.length){container.innerHTML="";return;}
  var frag=document.createDocumentFragment();
  p.modifiers.forEach(function(mod,mi){
    var isMulti=!!mod.multiple;
    var title=mod.description||mod.name;
    var group=document.createElement("div");
    group.className="modifier-group"; group.id="modGroup-"+mi;
    var reqLabel=mod.required?'<span class="mod-req">(obrigatório)</span>':"";
    var limLabel=isMulti&&mod.maxSelect?' <span class="mod-limit">— até '+mod.maxSelect+'</span>':"";
    var titleEl=document.createElement("div");
    titleEl.className="modifier-title"; titleEl.id="modTitle-"+mi;
    titleEl.innerHTML=escape(title)+reqLabel+limLabel;
    var counter=null;
    if(isMulti&&mod.maxSelect){
      counter=document.createElement("div"); counter.className="mod-counter"; counter.id="modCounter-"+mi;
      counter.textContent="0 / "+mod.maxSelect;
    }
    var opts=document.createElement("div");
    opts.className="modifier-options";
    opts.setAttribute("role",isMulti?"group":"radiogroup");
    opts.setAttribute("aria-labelledby","modTitle-"+mi);
    mod.options.forEach(function(opt,oi){
      var label=document.createElement("label"); label.className="modifier-option";
      var input=document.createElement("input");
      input.name="mod-"+mi; input.value=String(oi);
      input.dataset.modifierIndex=String(mi); input.dataset.optionIndex=String(oi);
      if(isMulti){input.type="checkbox";input.dataset.maxSelect=String(mod.maxSelect||0);}
      else{input.type="radio";input.addEventListener("change",function(){selectModifier(mi,oi,opt.name,opt.price||0);});}
      var content=document.createElement("div"); content.className="option-content";
      content.innerHTML='<span class="option-name">'+escape(opt.name)+'</span>'+(opt.price>0?'<span class="option-price">+'+fmt(opt.price)+'</span>':"");
      label.appendChild(input); label.appendChild(content); opts.appendChild(label);
    });
    group.appendChild(titleEl);
    if(counter) group.appendChild(counter);
    group.appendChild(opts); frag.appendChild(group);
  });
  container.innerHTML=""; container.appendChild(frag);
}

function onModifierChange(e){
  var input=e.target;
  if(input.type!=="checkbox"||!input.dataset.modifierIndex) return;
  var mi=parseInt(input.dataset.modifierIndex,10);
  var max=parseInt(input.dataset.maxSelect||"0",10);
  if(max>0&&input.checked){
    var checked=document.querySelectorAll('#modalModifiers input[type="checkbox"][data-modifier-index="'+mi+'"]:checked');
    if(checked.length>max){input.checked=false;showToast("Limite atingido ⚠️","Máximo de "+max+" opção(ões)","warn");return;}
  }
  syncCheckbox(mi); updateModalPrice();
}

function selectModifier(mi,oi,name,price){
  State.modal.modifiers[mi]=[{oi:oi,name:name,price:price}];
  document.querySelectorAll('input[name="mod-'+mi+'"]').forEach(function(inp,idx){
    var opt=inp.closest(".modifier-option"); if(opt) opt.classList.toggle("selected",idx===oi);
  });
  updateModalPrice();
}

function syncCheckbox(mi){
  var mod=State.modal.product?State.modal.product.modifiers[mi]:null; if(!mod) return;
  var checked=document.querySelectorAll('#modalModifiers input[type="checkbox"][data-modifier-index="'+mi+'"]:checked');
  State.modal.modifiers[mi]=Array.from(checked).map(function(inp){
    var oi=parseInt(inp.dataset.optionIndex,10); var opt=mod.options[oi];
    return{oi:oi,name:opt.name,price:opt.price||0};
  });
  document.querySelectorAll('#modalModifiers input[data-modifier-index="'+mi+'"]').forEach(function(inp){
    var opt=inp.closest(".modifier-option"); if(opt) opt.classList.toggle("selected",inp.checked);
  });
  var counter=$("modCounter-"+mi);
  if(counter){var cnt=State.modal.modifiers[mi]?State.modal.modifiers[mi].length:0;counter.textContent=cnt+" / "+mod.maxSelect;}
}

function updateModalQty(delta){
  State.modal.qty=clamp(State.modal.qty+delta,1,CONFIG.maxCartItemQty);
  setText("modalQty",State.modal.qty); updateModalPrice();
}

function calcModsTotal(){
  var total=0;
  Object.keys(State.modal.modifiers).forEach(function(k){
    State.modal.modifiers[k].forEach(function(m){total+=(m.price||0);});
  });
  return total;
}

function updateModalPrice(){
  if(!State.modal.product) return;
  var modTotal=calcModsTotal();
  var unit=State.modal.product.price+modTotal;
  setText("modalPrice",fmt(unit));
  setText("modalTotal",fmt(unit*State.modal.qty));
}

/* ════════════════════════════════════════════
   CARRINHO
   ════════════════════════════════════════════ */
function addToCartFromModal(){
  var p=State.modal.product; if(!p) return;
  for(var mi=0;mi<p.modifiers.length;mi++){
    var mod=p.modifiers[mi]; var selected=State.modal.modifiers[mi]||[];
    if(!mod.required) continue;
    if(mod.multiple){var need=mod.minSelect||1;if(selected.length<need){highlightErr(mi);showToast("Atenção ⚠️","Escolha "+need+" opção(ões) em: "+mod.name,"warn");return;}}
    else{if(!selected.length){highlightErr(mi);showToast("Atenção ⚠️","Selecione uma opção em: "+mod.name,"warn");return;}}
  }
  var modsList=[];
  Object.keys(State.modal.modifiers).forEach(function(k){
    State.modal.modifiers[k].forEach(function(m){modsList.push(m.name);});
  });
  var modsTotal=calcModsTotal();
  var key=cartItemKey(p.id,modsList);
  var existing=null;
  for(var i=0;i<State.cart.length;i++){if(cartItemKey(State.cart[i].productId,State.cart[i].modifiers)===key){existing=State.cart[i];break;}}
  if(existing){existing.quantity=clamp(existing.quantity+State.modal.qty,1,CONFIG.maxCartItemQty);}
  else{State.cart.push({productId:p.id,name:p.name,price:p.price,image:p.image,quantity:State.modal.qty,modifiers:modsList,modifiersTotal:modsTotal});}
  saveCart();updateCartUI();closeProductModal();
  showToast("Adicionado! 🎉",p.name+" adicionado à sacola");
}

function highlightErr(mi){
  var group=$("modGroup-"+mi); if(!group) return;
  group.classList.add("error");
  group.scrollIntoView({behavior:"smooth",block:"nearest"});
  group.addEventListener("change",function(){group.classList.remove("error");},{once:true});
}

function quickAdd(pid){
  if(CLOUD.desativados.indexOf(pid)!==-1){showToast("Indisponível 😔","Item fora do cardápio.","warn");return;}
  if(isClosed()) return;
  var p=findProduct(pid); if(!p) return;
  if(p.modifiers&&p.modifiers.some(function(m){return m.required;})){openProductModal(pid);return;}
  var key=cartItemKey(p.id,[]);
  var ex=null;
  for(var i=0;i<State.cart.length;i++){if(cartItemKey(State.cart[i].productId,State.cart[i].modifiers)===key){ex=State.cart[i];break;}}
  if(ex){ex.quantity=clamp(ex.quantity+1,1,CONFIG.maxCartItemQty);}
  else{State.cart.push({productId:p.id,name:p.name,price:p.price,image:p.image,quantity:1,modifiers:[],modifiersTotal:0});}
  saveCart();updateCartUI();showToast("Adicionado! 🎉",p.name+" adicionado à sacola");
}

function updateCartUI(){
  var qty=State.cart.reduce(function(s,i){return s+i.quantity;},0);
  var sub=getSubtotal(); var tot=getTotal(); var del=getDelivery();
  var badge=$("cartBadge");
  if(badge){badge.textContent=qty;badge.classList.remove("pop");void badge.offsetWidth;badge.classList.add("pop");}
  setText("cartBarQty",qty); setText("cartBarTotal",fmt(tot));
  var bar=$("cartBar"); if(bar) bar.style.display=qty>0?"flex":"none";
  var empty=$("cartEmpty"); var items=$("cartItems"); var footer=$("cartFooter");
  if(!State.cart.length){if(empty)empty.style.display="block";if(items)items.innerHTML="";if(footer)footer.style.display="none";}
  else{if(empty)empty.style.display="none";if(items)items.innerHTML=State.cart.map(renderCartItem).join("");if(footer)footer.style.display="block";}
  setText("cartSubtotal",fmt(sub));
  setText("cartDelivery",del>0?fmt(del):"Grátis");
  setText("cartTotal",fmt(tot));
}

function renderCartItem(item,idx){
  var unit=item.price+item.modifiersTotal; var total=unit*item.quantity;
  var mods=item.modifiers.length?'<div class="cart-item-modifiers">'+escape(item.modifiers.join(", "))+'</div>':"";
  return '<div class="cart-item"><img src="'+escape(item.image)+'" alt="'+escape(item.name)+'" class="cart-item-image" loading="lazy" onerror="handleImgError(this)"><div class="cart-item-info"><div class="cart-item-name">'+escape(item.name)+'</div>'+mods+'<div class="cart-item-price">'+fmt(total)+'</div><div class="cart-item-controls"><button class="qty-btn" onclick="changeQty('+idx+',-1)"><i class="fas fa-minus"></i></button><span class="cart-item-qty">'+item.quantity+'</span><button class="qty-btn" onclick="changeQty('+idx+',1)"><i class="fas fa-plus"></i></button><button class="cart-item-remove" onclick="removeItem('+idx+')"><i class="fas fa-trash"></i></button></div></div></div>';
}

function changeQty(idx,delta){
  var item=State.cart[idx]; if(!item) return;
  item.quantity=clamp(item.quantity+delta,0,CONFIG.maxCartItemQty);
  if(item.quantity===0) State.cart.splice(idx,1);
  saveCart();updateCartUI();
}

function removeItem(idx){
  var name=State.cart[idx]?State.cart[idx].name:"";
  State.cart.splice(idx,1); saveCart();updateCartUI();
  showToast("Removido 🗑️",name+" removido da sacola");
}

function clearCart(){
  if(!State.cart.length) return;
  if(!confirm("Limpar todos os itens?")) return;
  State.cart=[];saveCart();updateCartUI();showToast("Sacola limpa 🗑️","Todos os itens removidos");
}

function saveCart(){try{localStorage.setItem(CONFIG.cartKey,JSON.stringify(State.cart));}catch(e){}}

function loadCart(){
  try{
    var raw=localStorage.getItem(CONFIG.cartKey); if(!raw) return;
    var parsed=JSON.parse(raw); if(!Array.isArray(parsed)) return;
    State.cart=parsed.filter(function(i){return i&&typeof i.productId==="number"&&i.quantity>0&&findProduct(i.productId);});
  }catch(e){State.cart=[];}
  updateCartUI();
}

function toggleCart(){
  var sidebar=$("cartSidebar"); if(!sidebar) return;
  var isOpen=sidebar.classList.contains("active");
  if(isOpen){sidebar.classList.remove("active");sidebar.setAttribute("aria-hidden","true");tryCloseOverlay();document.body.style.overflow="";}
  else{State.lastFocused=document.activeElement;sidebar.classList.add("active");sidebar.setAttribute("aria-hidden","false");$("overlay").classList.add("active");document.body.style.overflow="hidden";}
}

/* ════════════════════════════════════════════
   CHECKOUT
   ════════════════════════════════════════════ */
function openCheckout(){
  if(!State.cart.length){showToast("Sacola vazia 🛒","Adicione itens antes","warn");return;}
  if(isClosed()) return;
  var sb=$("cartSidebar"); if(sb){sb.classList.remove("active");sb.setAttribute("aria-hidden","true");}
  State.checkoutStep=1;syncSteps();
  var modal=$("checkoutModal"); if(modal){modal.classList.add("active");modal.setAttribute("aria-hidden","false");}
  $("overlay").classList.add("active");document.body.style.overflow="hidden";
  setTimeout(function(){var n=$("customerName");if(n)n.focus();},200);
}

function closeCheckout(){
  var modal=$("checkoutModal");
  if(!modal||!modal.classList.contains("active")) return;
  modal.classList.remove("active");modal.setAttribute("aria-hidden","true");
  tryCloseOverlay();document.body.style.overflow="";
}

function goToStep(step){
  if(step>State.checkoutStep&&State.checkoutStep===1&&!validateStep1()) return;
  State.checkoutStep=step;syncSteps();
  if(step===2){updatePaymentValues();togglePaymentView();generatePix();}
  if(step===3) buildReview();
  var body=document.querySelector(".checkout-body"); if(body) body.scrollTop=0;
}

function syncSteps(){
  document.querySelectorAll(".checkout-steps .step").forEach(function(el,i){
    var n=i+1;el.classList.toggle("active",n===State.checkoutStep);el.classList.toggle("completed",n<State.checkoutStep);
  });
  document.querySelectorAll(".step-line").forEach(function(el,i){el.classList.toggle("completed",i+1<State.checkoutStep);});
  document.querySelectorAll(".checkout-step").forEach(function(el,i){el.classList.toggle("active",i+1===State.checkoutStep);});
}

function getVal(id){return $(id)?$(id).value.trim():"";}

function markErr(id,msg){
  var inp=$(id); if(!inp) return; inp.classList.add("input-error");
  var errEl=document.getElementById(id+"-error");
  if(!errEl){errEl=document.createElement("span");errEl.id=id+"-error";errEl.className="input-error-msg";errEl.setAttribute("role","alert");inp.parentNode.appendChild(errEl);}
  errEl.textContent=msg; inp.focus();
}

function clearInputErr(inp){
  if(!inp) return; inp.classList.remove("input-error");
  var e=document.getElementById(inp.id+"-error"); if(e) e.textContent="";
}

function validateStep1(){
  document.querySelectorAll("#step1 .input-error").forEach(function(e){clearInputErr(e);});
  var name=getVal("customerName"); var phone=getVal("customerPhone").replace(/\D/g,"");
  var str=getVal("customerStreet"); var num=getVal("customerNumber"); var neigh=getVal("customerNeighborhood");
  if(!name){markErr("customerName","Informe seu nome completo");showToast("Campo obrigatório ⚠️","Nome completo","warn");return false;}
  if(name.trim().split(/\s+/).length<2){markErr("customerName","Nome e sobrenome");showToast("Nome inválido ⚠️","Informe nome e sobrenome","warn");return false;}
  if(phone.length<10){markErr("customerPhone","WhatsApp com DDD");showToast("Telefone inválido ⚠️","Informe WhatsApp com DDD","warn");return false;}
  if(!str){markErr("customerStreet","Informe a rua");showToast("Endereço ⚠️","Informe a rua","warn");return false;}
  if(!num){markErr("customerNumber","Informe o número");showToast("Endereço ⚠️","Informe o número","warn");return false;}
  if(!neigh){markErr("customerNeighborhood","Informe o bairro");showToast("Endereço ⚠️","Informe o bairro","warn");return false;}
  return true;
}

function getSelectedPayment(){return(document.querySelector('input[name="payment"]:checked')||{value:"pix"}).value;}
function togglePaymentView(){
  var type=getSelectedPayment();
  var pix=$("pixSection"); var cash=$("cashSection");
  if(pix) pix.style.display=type==="pix"?"block":"none";
  if(cash) cash.style.display=type==="dinheiro"?"block":"none";
}
function toggleChangeField(){
  var val=(document.querySelector('input[name="change"]:checked')||{value:"no"}).value;
  var field=$("changeField"); if(field) field.style.display=val==="yes"?"block":"none";
}
function updatePaymentValues(){
  var v=fmt(getTotal());
  ["paymentTotalDisplay","pixCardValue","cartaoCardValue","dinheiroCardValue"].forEach(function(id){setText(id,v);});
}

/* ════════════════════════════════════════════
   PIX
   ════════════════════════════════════════════ */
function generatePix(){
  var total=getTotal();
  setText("pixAmount",fmt(total)); setText("pixKeyValue",fmt(total));
  var payload=buildPixPayload(CONFIG.pix,CONFIG.pixName,CONFIG.pixCity,total);
  var codeEl=$("pixCode"); if(codeEl) codeEl.value=payload;
  var qrImg=$("pixQR"); var loading=$("pixLoading");
  if(!qrImg||!loading) return;
  loading.style.display="flex"; qrImg.style.display="none";
  var enc=encodeURIComponent(payload); var tried=0;
  qrImg.onload=function(){loading.style.display="none";qrImg.style.display="block";};
  qrImg.onerror=function(){if(tried===0){tried++;qrImg.src="https://quickchart.io/qr?size=200&text="+enc;}else{loading.innerHTML="<small>Use o código Copia e Cola</small>";}};
  qrImg.src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&ecc=M&margin=8&data="+enc;
}

function buildPixPayload(chave,nome,cidade,valor){
  var key=chave.replace(/\D/g,""); if(key.indexOf("55")!==0) key="55"+key; key="+"+key;
  function clean(s){return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9 ]/g,"").toUpperCase().trim().slice(0,25);}
  function tlv(id,val){return String(id).padStart(2,"0")+String(val.length).padStart(2,"0")+val;}
  var mai=tlv("00","br.gov.bcb.pix")+tlv("01",key);
  var body=tlv("00","01")+tlv("01","12")+tlv("26",mai)+tlv("52","0000")+tlv("53","986")+tlv("54",valor.toFixed(2))+tlv("58","BR")+tlv("59",clean(nome))+tlv("60",clean(cidade))+tlv("62",tlv("05","***"))+"6304";
  return body+crc16(body);
}

function crc16(str){
  var crc=0xFFFF;
  for(var i=0;i<str.length;i++){crc^=str.charCodeAt(i)<<8;for(var j=0;j<8;j++){crc=(crc&0x8000)?((crc<<1)^0x1021):(crc<<1);crc&=0xFFFF;}}
  return crc.toString(16).toUpperCase().padStart(4,"0");
}

function copyToClipboard(text){
  try{navigator.clipboard.writeText(text);return Promise.resolve(true);}catch(e){}
  var ta=document.createElement("textarea");ta.value=text;ta.style.cssText="position:fixed;opacity:0;left:-9999px";
  document.body.appendChild(ta);ta.select();
  try{var r=document.execCommand("copy");ta.remove();return Promise.resolve(r);}catch(e){ta.remove();return Promise.resolve(false);}
}
function copyPixCode(){copyToClipboard(($("pixCode")||{value:""}).value).then(function(ok){showToast(ok?"Copiado! ✅":"Erro ❌",ok?"Código PIX copiado":"Copie manualmente",ok?"success":"warn");});}
function copyPixKey(){copyToClipboard(($("pixKey")||{value:""}).value).then(function(ok){showToast(ok?"Copiado! ✅":"Erro ❌",ok?"Chave PIX copiada":"Copie manualmente",ok?"success":"warn");});}

/* ════════════════════════════════════════════
   REVISÃO + WHATSAPP
   ════════════════════════════════════════════ */
function buildReview(){
  var sub=getSubtotal(); var del=getDelivery(); var tot=getTotal();
  setHTML("reviewItems",State.cart.map(function(i){
    var lt=(i.price+i.modifiersTotal)*i.quantity;
    var ms=i.modifiers.length?' <em>('+escape(i.modifiers.join(", "))+')</em>':"";
    return '<div class="review-item"><span>'+i.quantity+'× '+escape(i.name)+ms+'</span><span>'+fmt(lt)+'</span></div>';
  }).join(""));
  setHTML("reviewCustomer",escape(getVal("customerName"))+'<br><small>'+escape(getVal("customerPhone"))+'</small>');
  var addr=escape(getVal("customerStreet"))+", "+escape(getVal("customerNumber"))+" — "+escape(getVal("customerNeighborhood"));
  var comp=getVal("customerComplement");
  setHTML("reviewAddress",addr+(comp?'<br><small>'+escape(comp)+'</small>':""));
  setText("reviewPayment",PAYMENT_LABELS[getSelectedPayment()]||getSelectedPayment());
  setText("reviewSubtotal",fmt(sub));
  setText("reviewDelivery",del>0?fmt(del):"Grátis");
  setText("reviewTotal",fmt(tot));
}

function sendToWhatsApp(){
  if(!validateStep1()){goToStep(1);return;}
  var pay=getSelectedPayment();
  var changeOpt=(document.querySelector('input[name="change"]:checked')||{value:"no"}).value;
  var changeAmt=getVal("changeAmount");
  var total=getTotal();
  var now=new Date().toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"});
  var msg="👑 *IMPÉRIO LANCHES*\n━━━━━━━━━━━━━━━━━━━━━━━\n🛒 *PEDIDO*\n\n*📦 ITENS:*\n";
  State.cart.forEach(function(i){
    var lt=(i.price+i.modifiersTotal)*i.quantity;
    msg+="  • "+i.quantity+"× "+i.name;
    if(i.modifiers.length) msg+=" _("+i.modifiers.join(", ")+")_";
    msg+=" — "+fmt(lt)+"\n";
  });
  msg+="\n━━━━━━━━━━━━━━━━━━━━━━━\n";
  msg+="💰 Subtotal: "+fmt(getSubtotal())+"\n";
  msg+="🛵 Entrega: "+(getDelivery()>0?fmt(getDelivery()):"Grátis")+"\n";
  msg+="*💵 TOTAL: "+fmt(total)+"*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n";
  msg+="*👤 CLIENTE:*\n  "+getVal("customerName")+"\n  "+getVal("customerPhone")+"\n\n";
  msg+="*📍 ENDEREÇO:*\n  "+getVal("customerStreet")+", "+getVal("customerNumber")+" — "+getVal("customerNeighborhood")+"\n";
  var comp=getVal("customerComplement"); if(comp) msg+="  "+comp+"\n";
  msg+="\n*💳 PAGAMENTO:* "+(PAYMENT_LABELS[pay]||pay)+"\n";
  if(pay==="dinheiro"&&changeOpt==="yes"&&changeAmt) msg+="  Troco para: "+changeAmt+"\n";
  msg+="\n━━━━━━━━━━━━━━━━━━━━━━━\n_Pedido em: "+now+"_";
  window.open("https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer");
  State.cart.length=0;localStorage.removeItem(CONFIG.cartKey);
  closeCheckout();$("overlay").classList.remove("active");document.body.style.overflow="";
  updateCartUI();showToast("Pedido enviado! 🎉","Aguarde confirmação pelo WhatsApp","success");
}

/* ════════════════════════════════════════════
   TOAST
   ════════════════════════════════════════════ */
var TOAST_ICONS={success:"fa-check-circle",warn:"fa-exclamation-circle",error:"fa-times-circle"};

function showToast(title,message,type){
  type=type||"success";
  var toast=$("toast"); if(!toast) return;
  var icon=toast.querySelector(".toast-icon");
  if(icon){icon.className="toast-icon "+type;icon.innerHTML='<i class="fas '+(TOAST_ICONS[type]||TOAST_ICONS.success)+'"></i>';}
  setText("toastTitle",title); setText("toastMessage",message);
  toast.setAttribute("aria-hidden","false");
  toast.classList.remove("show"); void toast.offsetWidth; toast.classList.add("show");
  clearTimeout(State.timers.toast);
  State.timers.toast=setTimeout(function(){toast.classList.remove("show");toast.setAttribute("aria-hidden","true");},CONFIG.toastDuration);
}

/* ════════════════════════════════════════════
   OVERLAY
   ════════════════════════════════════════════ */
function tryCloseOverlay(){
  var any=($("productModal")&&$("productModal").classList.contains("active"))||
    ($("checkoutModal")&&$("checkoutModal").classList.contains("active"))||
    ($("cartSidebar")&&$("cartSidebar").classList.contains("active"));
  if(!any){var ov=$("overlay");if(ov)ov.classList.remove("active");}
}

function closeAll(){
  if($("productModal")&&$("productModal").classList.contains("active")){closeProductModal();return;}
  if($("checkoutModal")&&$("checkoutModal").classList.contains("active")){closeCheckout();return;}
  if($("cartSidebar")&&$("cartSidebar").classList.contains("active")){toggleCart();return;}
  var ov=$("overlay");if(ov)ov.classList.remove("active");
}