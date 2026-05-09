/* ============================================================
   IMPÉRIO LANCHES — app.js (Versão JSONBin - Sem Servidor)
   ============================================================ */
"use strict";

// ── CONFIGURAÇÃO JSONBIN (Mesmo do Admin) ─────────────────────
const BIN_CONFIG = {
  id: "69ff6740adc21f119a778293", 
  key: "$2a$10$zfLo4xQ0.IvfaaQaJbTDle3OU9eW24NU.iN7JbK9Ph9OpF0MiuRRu",
  url: "https://api.jsonbin.io/v3/b/69ff6740adc21f119a778293/latest"
};

// ── DADOS DO CARDÁPIO ────────────────────────────────────────
const CATEGORIES = [
  { id: "todos",                  name: "Todos",            icon: "🏠" },
  { id: "massas",                 name: "Massas",           icon: "🌾" },
  { id: "pasteis-salgados",       name: "Pastéis Salgados", icon: "🥟" },
  { id: "pasteis-doces",          name: "Pastéis Doces",    icon: "🍫" },
  { id: "hamburgueres",           name: "Hambúrgueres",     icon: "🍔" },
  { id: "hamburgueres-artesanal", name: "Artesanal",        icon: "🔥" },
  { id: "tapioca",                name: "Tapioca",          icon: "🫓" },
  { id: "cuscuz",                 name: "Cuscuz",           icon: "🌽" },
  { id: "cachorro-quente",        name: "Cachorro-Quente",  icon: "🌭" },
  { id: "petiscos",               name: "Petiscos",         icon: "🍟" },
  { id: "pizzas",                 name: "Pizzas Salgadas",  icon: "🍕" },
  { id: "pizzas-doces",           name: "Pizzas Doces",     icon: "🍰" },
  { id: "milkshake",              name: "Milk Shake",       icon: "🥤" },
  { id: "sorvete",                name: "Sorvete",          icon: "🍦" },
  { id: "acai",                   name: "Açaí",             icon: "🫐" },
  { id: "bebidas",                name: "Bebidas",          icon: "🧃" },
  { id: "sucos",                  name: "Sucos",            icon: "🍊" },
  { id: "adicionais",             name: "Adicionais",       icon: "➕" },
];

const PIZZA_SIZES = [
  { name: "Média",   price: 0  },
  { name: "Grande",  price: 10 },
  { name: "Gigante", price: 20 },
];

function acaiModifiers(qtd) {
  return [
    {
      name: "Creme", required: true, multiple: false,
      options: [
        { name: "Açaí",            price: 0 },
        { name: "Avelã",           price: 0 },
        { name: "Cupuaçu",         price: 0 },
        { name: "Ninho",           price: 0 },
        { name: "Açaí com Banana", price: 0 },
        { name: "Ninho Trufado",   price: 0 },
        { name: "Oreo",            price: 0 },
        { name: "Ovomaltine",      price: 0 },
        { name: "Tapioca",         price: 0 },
      ],
    },
    {
      name: "Acompanhamentos", required: true, multiple: true,
      minSelect: qtd, maxSelect: qtd,
      description: `Escolha ${qtd} acompanhamento${qtd > 1 ? "s" : ""}`,
      options: [
        { name: "Amendoim",           price: 0 },
        { name: "Chocobol",           price: 0 },
        { name: "Chocopower",         price: 0 },
        { name: "Confetes",           price: 0 },
        { name: "Farinha Láctea",     price: 0 },
        { name: "Gotas de Chocolate", price: 0 },
        { name: "Granola",            price: 0 },
        { name: "Granulado",          price: 0 },
        { name: "Jujuba",             price: 0 },
        { name: "Leite em Pó",        price: 0 },
        { name: "Ovomaltine",         price: 0 },
        { name: "Paçoca",             price: 0 },
      ],
    },
    {
      name: "Cobertura", required: true, multiple: false,
      options: [
        { name: "Leite Condensado", price: 0 },
        { name: "Chocolate",        price: 0 },
        { name: "Morango",          price: 0 },
      ],
    },
    {
      name: "Adicionais", required: false, multiple: true, minSelect: 0, maxSelect: 4,
      options: [
        { name: "Cobertura Fini de Dentadura", price: 1 },
        { name: "Cobertura Fini de Banana",    price: 1 },
        { name: "Cobertura Fini de Beijos",    price: 1 },
        { name: "Nutela",                      price: 3 },
      ],
    },
  ];
}

const pizzaModifier        = { name: "Tamanho", required: true, multiple: false, options: PIZZA_SIZES };
const saborPastelSalgado   = {
  name: "Sabor", required: true, multiple: false,
  options: [
    { name: "Três Queijos",         price: 0 },
    { name: "Frango com Queijo",    price: 1 },
    { name: "Pizza",                price: 1 },
    { name: "Frango com Catupiry",  price: 2 },
    { name: "Frango com Cheddar",   price: 2 },
    { name: "Frango com Bacon",     price: 2 },
    { name: "Carne com Catupiry",   price: 3 },
    { name: "Carne com Cheddar",    price: 3 },
    { name: "Calabresa",            price: 3 },
    { name: "Carne com Queijo",     price: 3 },
    { name: "Carne de Sol na Nata", price: 5 },
    { name: "Moda da Casa",         price: 6 },
    { name: "Sertanejo",            price: 6 },
  ],
};
const saborPastelDoce = {
  name: "Sabor", required: true, multiple: false,
  options: [
    { name: "Chocolate ao Leite",             price: 0 },
    { name: "Chocolate ao Leite + Queijo",    price: 0 },
    { name: "Chocolate Meio Amargo",          price: 0 },
    { name: "Chocolate Meio Amargo + Queijo", price: 0 },
    { name: "Romeu e Julieta",                price: 0 },
    { name: "Churros",                        price: 0 },
  ],
};
const recheioTapioca = {
  name: "Recheio", required: true, multiple: false,
  options: [
    { name: "Carne de Sol com Catupiry", price: 0 },
    { name: "Carne de Sol com Queijo",   price: 0 },
    { name: "Frango com Catupiry",       price: 0 },
    { name: "Frango com Queijo",         price: 0 },
    { name: "Carne de Sol na Nata",      price: 1 },
    { name: "Sertaneja",                 price: 1 },
  ],
};
const recheioCuscuz = {
  name: "Recheio", required: true, multiple: false,
  options: [
    { name: "Carne de Sol com Queijo", price: 0 },
    { name: "Frango com Queijo",       price: 0 },
    { name: "Calabresa",               price: 0 },
    { name: "Carne de Sol na Nata",    price: 1 },
  ],
};
const adicionaisCuscuzTapioca = {
  name: "Adicionais", required: false, multiple: true, minSelect: 0, maxSelect: 7,
  options: [
    { name: "Vinagrete",            price: 2 },
    { name: "Ovo",                  price: 2 },
    { name: "Catupiry (requeijão)", price: 2 },
    { name: "Cheddar (requeijão)",  price: 2 },
    { name: "Queijo Coalho",        price: 3 },
    { name: "Catupiry (original)",  price: 4 },
    { name: "Cheddar (original)",   price: 4 },
  ],
};
const saborMassa = {
  name: "Sabor", required: true, multiple: false,
  options: [
    { name: "Cebola e Salsa", price: 0 },
    { name: "Bacon",          price: 0 },
    { name: "Queijo",         price: 0 },
  ],
};

const MENU = [
  // MASSAS
  { id:1,  category:"massas",                 name:"Massa Gourmet",                    description:"Sabores: Cebola e Salsa, Bacon e Queijo", price:3,  image:"imagem/massas.jpg",                    badge:null,         modifiers:[saborMassa] },
  // PASTÉIS SALGADOS
  { id:4,  category:"pasteis-salgados",       name:"Pastel Salgado",                   description:"Vários sabores disponíveis",              price:7,  image:"imagem/pastel.jpg",                    badge:"MAIS PEDIDO", modifiers:[saborPastelSalgado] },
  // PASTÉIS DOCES
  { id:15, category:"pasteis-doces",          name:"Pastel Doce",                      description:"Sabores: Chocolate, Romeu e Julieta, Churros", price:10, image:"imagem/pastel.jpg",              badge:"DOCE",        modifiers:[saborPastelDoce] },
  // HAMBÚRGUERES
  { id:19, category:"hamburgueres",           name:"X-Burg",                           description:"Pão, hambúrguer, queijo e presunto",     price:7,  image:"imagem/xburguer.jpg",                  badge:null,         modifiers:[] },
  { id:20, category:"hamburgueres",           name:"Bauru",                            description:"Pão, hambúrguer, alface, tomate, ovo, queijo e presunto", price:8, image:"imagem/bauru.jpg",    badge:null,         modifiers:[] },
  { id:21, category:"hamburgueres",           name:"X-Bacon",                          description:"Pão, bacon, hambúrguer, ovo, queijo, presunto, alface e tomate", price:10, image:"imagem/xbacon.jpg", badge:"MAIS PEDIDO", modifiers:[] },
  { id:22, category:"hamburgueres",           name:"X-Calabresa",                      description:"Pão, calabresa acebolada, hambúrguer, queijo, alface e tomate", price:10, image:"https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=400&q=80", badge:null, modifiers:[] },
  { id:23, category:"hamburgueres",           name:"X-Tudo",                           description:"Pão, hambúrguer, ovo, bacon, salsicha, frango, presunto, queijo, alface e tomate", price:12, image:"imagem/xtudo.png", badge:"FAVORITO", modifiers:[] },
  { id:24, category:"hamburgueres",           name:"X-Frango com Catupiry",            description:"Pão, frango, catupiry, ovo, alface e tomate", price:12, image:"https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=400&q=80", badge:null, modifiers:[] },
  { id:25, category:"hamburgueres",           name:"X-Carne de Sol",                   description:"Pão, carne de sol na nata, ovo, queijo, alface e tomate", price:13, image:"imagem/xcarnesol.jpg", badge:"ESPECIAL", modifiers:[] },
  { id:26, category:"hamburgueres",           name:"Hamburguer Moda da Casa",           description:"Pão, hambúrguer duplo, ovo, presunto duplo, queijo duplo, bacon, frango, salsicha, catupiry, alface e tomate", price:15, image:"https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&q=80", badge:"PREMIUM", modifiers:[] },
  // ARTESANAL
  { id:27, category:"hamburgueres-artesanal", name:"X-Cheddar",                        description:"Pão brioche, hambúrguer artesanal 100g, cheddar, bacon, cebola roxa e molho especial", price:18, image:"imagem/xchedar.webp", badge:"ARTESANAL", modifiers:[] },
  { id:28, category:"hamburgueres-artesanal", name:"Hamburguer Duplo Cheddar",          description:"Pão brioche, dois hambúrgueres artesanais 100g, cheddar, bacon, cebola roxa e molho especial", price:22, image:"imagem/duplochedar.jpg", badge:"PREMIUM", modifiers:[] },
  // TAPIOCA
  { id:29, category:"tapioca",                name:"Tapioca",                           description:"Escolha o recheio e adicionais",          price:8,  image:"imagem/tapioca.avif",                  badge:null,         modifiers:[recheioTapioca, adicionaisCuscuzTapioca] },
  // CUSCUZ
  { id:35, category:"cuscuz",                 name:"Cuscuz",                            description:"Escolha o recheio e adicionais",          price:8,  image:"imagem/cuscuzcalabresa.jpg",           badge:null,         modifiers:[recheioCuscuz, adicionaisCuscuzTapioca] },
  // CACHORRO-QUENTE
  { id:39, category:"cachorro-quente",        name:"Cachorro-Quente Tradicional",       description:"Pão, carne moída, salsicha, frango, batata palha, milho, ervilha e queijo ralado", price:7, image:"imagem/hotdog.webp", badge:null, modifiers:[] },
  { id:40, category:"cachorro-quente",        name:"Cachorro-Quente Carne na Nata",     description:"Pão, carne de sol na nata, salsicha, milho, ervilha, batata palha e queijo ralado", price:9, image:"imagem/Cachorro-quente-nata.jpg", badge:"ESPECIAL", modifiers:[] },
  // PETISCOS
  { id:41, category:"petiscos",               name:"Batata Frita P",                    description:"Porção pequena de batata frita",          price:10, image:"imagem/batata.jpg",                    badge:null,         modifiers:[] },
  { id:42, category:"petiscos",               name:"Batata Frita G",                    description:"Porção grande de batata frita",           price:14, image:"imagem/batata.jpg",                    badge:null,         modifiers:[] },
  { id:43, category:"petiscos",               name:"Batata Frita com Bacon e Cheddar",  description:"Batata frita com bacon crocante e cheddar cremoso", price:20, image:"imagem/batata-bacon-chadar.jpg", badge:"MAIS PEDIDA", modifiers:[] },
  { id:44, category:"petiscos",               name:"Batata Frita com Calabresa e Cheddar", description:"Batata frita com calabresa e cheddar", price:20, image:"imagem/batata-calabresa-chadar.jpg",   badge:null,         modifiers:[] },
  // MILK SHAKE
  { id:45, category:"milkshake",              name:"Milk Shake 300ml",                  description:"Milk shake cremoso com chantilly",        price:13, image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80", badge:"FAVORITO", modifiers:[{ name:"Sabor", required:true, multiple:false, options:[{name:"Morango",price:0},{name:"Chocolate",price:0},{name:"Ovomaltine",price:0},{name:"Chocomenta",price:0}] }] },
  // SORVETE
  { id:46, category:"sorvete",                name:"Sorvete 1 Bola",                    description:"Sorvete 1 bola",                          price:3,  image:"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80", badge:null, modifiers:[{ name:"Sabor", required:true, multiple:false, options:[{name:"Morango",price:0},{name:"Chocolate",price:0},{name:"Chocomenta",price:0}] }] },
  // PIZZAS SALGADAS
  { id:47, category:"pizzas", name:"Pizza Calabresa",           description:"Calabresa, cebola, queijo mussarela, orégano, azeitona e molho de tomate", price:30, image:"imagem/pizzacalabresa.jpg",              badge:null,      modifiers:[pizzaModifier] },
  { id:48, category:"pizzas", name:"Pizza Frango com Bacon",    description:"Frango, cebola, bacon, queijo, orégano, azeitona e molho",                 price:30, image:"imagem/pizza-de-frango-com-bacon.png",    badge:null,      modifiers:[pizzaModifier] },
  { id:49, category:"pizzas", name:"Pizza Frango com Milho",    description:"Frango, cebola, milho, queijo, orégano, azeitona e molho",                 price:30, image:"imagem/pizza-de-frangomilho.jpg",         badge:null,      modifiers:[pizzaModifier] },
  { id:50, category:"pizzas", name:"Pizza Frango com Catupiry", description:"Frango, catupiry, cebola, queijo, orégano, azeitona e molho",              price:30, image:"imagem/pizza-de-frango-com-catupiry.webp", badge:null,     modifiers:[pizzaModifier] },
  { id:51, category:"pizzas", name:"Pizza Frango com Cheddar",  description:"Frango, cheddar, cebola, queijo, orégano, azeitona e molho",               price:30, image:"imagem/pizzafrangochedar.jpg",            badge:null,      modifiers:[pizzaModifier] },
  { id:52, category:"pizzas", name:"Pizza Frango com Queijo",   description:"Frango, cebola, queijo, orégano, azeitona e molho",                        price:30, image:"imagem/pizza-de-frango-queijo.webp",      badge:null,      modifiers:[pizzaModifier] },
  { id:53, category:"pizzas", name:"Pizza Moda da Casa",        description:"Carne de sol, frango, calabresa, queijo, orégano, azeitona e molho",       price:40, image:"imagem/pizzamodadacasa.jpg",              badge:"ESPECIAL", modifiers:[pizzaModifier] },
  { id:54, category:"pizzas", name:"Pizza Carne com Catupiry",  description:"Carne, catupiry, cebola, queijo, orégano, azeitona e molho",               price:35, image:"imagem/pizzacarnedesolcatupiry.webp",     badge:null,      modifiers:[pizzaModifier] },
  { id:55, category:"pizzas", name:"Pizza Carne de Sol",        description:"Carne de sol, cebola, queijo, orégano, azeitona e molho",                  price:35, image:"imagem/pizzacarnesol.jpg",                badge:null,      modifiers:[pizzaModifier] },
  { id:56, category:"pizzas", name:"Pizza Carne com Cheddar",   description:"Carne, cheddar, cebola, queijo, orégano, azeitona e molho",                price:35, image:"imagem/pizza-carne-chedar.webp",          badge:null,      modifiers:[pizzaModifier] },
  { id:57, category:"pizzas", name:"Pizza Sertaneja",           description:"Carne de sol, cebola, queijo coalho, queijo, orégano, azeitona e molho",   price:35, image:"imagem/pizza-sertaneja.jpg",              badge:null,      modifiers:[pizzaModifier] },
  // PIZZAS DOCES
  { id:58, category:"pizzas-doces", name:"Pizza Chocolate com Confetes",  description:"Chocolate ao leite e confetes",                         price:30, image:"imagem/pizzachocolatecf.jpg",  badge:null, modifiers:[pizzaModifier] },
  { id:59, category:"pizzas-doces", name:"Pizza Chocolate com Amendoim",  description:"Chocolate ao leite com amendoim triturado",             price:30, image:"imagem/pizzachocolateam.jpg",  badge:null, modifiers:[pizzaModifier] },
  { id:60, category:"pizzas-doces", name:"Pizza Dois Amores",             description:"Chocolate ao leite e chocolate branco",                 price:30, image:"imagem/pizzadoisamores.jpg",   badge:null, modifiers:[pizzaModifier] },
  { id:61, category:"pizzas-doces", name:"Pizza Churros",                 description:"Doce de leite, canela e açúcar",                        price:30, image:"imagem/pizzachurros.jpg",      badge:null, modifiers:[pizzaModifier] },
  // AÇAÍ
  { id:62, category:"acai", name:"Açaí 250ml",  description:"1 creme, 5 acompanhamentos, 1 cobertura",  price:10, image:"imagem/açai.jpg", badge:null,     modifiers:acaiModifiers(5) },
  { id:63, category:"acai", name:"Açaí 350ml",  description:"1 creme, 6 acompanhamentos, 1 cobertura",  price:12, image:"imagem/açai.jpg", badge:null,     modifiers:acaiModifiers(6) },
  { id:64, category:"acai", name:"Açaí 500ml",  description:"1 creme, 8 acompanhamentos, 1 cobertura",  price:16, image:"imagem/açai.jpg", badge:null,     modifiers:acaiModifiers(8) },
  { id:65, category:"acai", name:"Açaí 1 Litro",description:"1 creme, 10 acompanhamentos, 1 cobertura", price:28, image:"imagem/açai.jpg", badge:"FAMÍLIA", modifiers:acaiModifiers(10) },
  // BEBIDAS
  { id:66, category:"bebidas", name:"Água Mineral",        description:"Água mineral sem gás 500ml",   price:2,   image:"imagem/aguamineral.webp",     badge:null, modifiers:[] },
  { id:67, category:"bebidas", name:"Água com Gás",        description:"Água mineral com gás 500ml",   price:3,   image:"imagem/aguacomgas.webp",      badge:null, modifiers:[] },
  { id:68, category:"bebidas", name:"Refrigerante Mini",   description:"Refrigerante mini",             price:2.5, image:"imagem/minirefri.jpg",        badge:null, modifiers:[] },
  { id:69, category:"bebidas", name:"Cerveja",             description:"Cerveja long neck",             price:5,   image:"https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80", badge:null, modifiers:[] },
  { id:70, category:"bebidas", name:"Guaraná Lata",        description:"Guaraná em lata 350ml",        price:5,   image:"imagem/guaranalata.jpg",      badge:null, modifiers:[] },
  { id:71, category:"bebidas", name:"Fanta Laranja Lata",  description:"Fanta laranja em lata 350ml",  price:5,   image:"imagem/fantalaranjalata.webp", badge:null, modifiers:[] },
  { id:72, category:"bebidas", name:"Fanta Uva Lata",      description:"Fanta uva em lata 350ml",      price:5,   image:"imagem/fantauva.webp",        badge:null, modifiers:[] },
  { id:73, category:"bebidas", name:"Pepsi Lata",          description:"Pepsi em lata 350ml",          price:5,   image:"imagem/pepsilata.webp",       badge:null, modifiers:[] },
  { id:74, category:"bebidas", name:"Coca-Cola Lata",      description:"Coca-Cola em lata 350ml",      price:5,   image:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80", badge:null, modifiers:[{ name:"Opção", required:true, multiple:false, options:[{name:"Original",price:0},{name:"Zero",price:0}] }] },
  { id:75, category:"bebidas", name:"Fanta Laranja 1L",    description:"Fanta laranja 1 litro",        price:8,   image:"imagem/fantalaranja.webp",    badge:null, modifiers:[] },
  { id:76, category:"bebidas", name:"Pepsi 1L",            description:"Pepsi 1 litro",                price:8,   image:"imagem/pepsi.jpg",            badge:null, modifiers:[] },
  { id:77, category:"bebidas", name:"Guaraná 1L",          description:"Guaraná 1 litro",              price:8,   image:"imagem/guarana.webp",         badge:null, modifiers:[] },
  { id:78, category:"bebidas", name:"Coca-Cola Original 1L", description:"Coca-Cola original 1 litro", price:10,  image:"imagem/cocacola.webp",        badge:null, modifiers:[] },
  { id:79, category:"bebidas", name:"Energético",          description:"Energético",                   price:12,  image:"https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80", badge:null, modifiers:[] },
  // SUCOS
  { id:80, category:"sucos", name:"Suco Natural", description:"Goiaba, Acerola, Cajá, Caju, Maracujá, Mangaba, Uva, Graviola, Morango, Abacaxi", price:4, image:"imagem/suco.jpg", badge:null,
    modifiers:[
      { name:"Base", required:true, multiple:false, options:[{name:"Água",price:0},{name:"Leite",price:1},{name:"Litro na água",price:11},{name:"Litro no leite",price:16}] },
      { name:"Sabor", required:true, multiple:false, options:["Goiaba","Acerola","Cajá","Caju","Maracujá","Mangaba","Uva","Graviola","Morango","Abacaxi com hortelã"].map(n=>({name:n,price:0})) },
    ]
  },
];

const PAYMENT_LABELS = { pix:"PIX ✅", cartao:"Cartão 💳", dinheiro:"Dinheiro 💵" };
const FALLBACK_IMG   = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

const CONFIG = Object.freeze({
  whatsapp:        "5584994994919",
  pix:             "84994994919",
  pixName:         "EMANUEL",
  pixCity:         "NATAL",
  storeName:       "Império Lanches",
  maxCartItemQty:  99,
  toastDuration:   3200,
  searchDebounce:  220,
  cartKey:         "imperio_cart_v3",
});

// ════════════════════════════════════════════════════════════
// VARIAVEIS DE ESTADO GLOBAL (Incluindo dados do JSONBin)
// ════════════════════════════════════════════════════════════
const State = {
  cart:            [],
  currentCategory: "todos",
  modal:           { product: null, qty: 1, modifiers: {} },
  checkoutStep:    1,
  lojaAberta:      true,
  lastFocused:     null,
  timers:          { search: null, toast: null, polling: null },
  observers:       { reveal: null },
  _index:          null,
};

// Dados vindos da nuvem (Cloud)
const CLOUD = {
  delivery: 0,
  aberto: true,
  aviso: "",
  desativados: [],
  tempo: "30-45 min"
};

// ════════════════════════════════════════════════════════════
// FUNÇÕES DE BUSCA JSONBIN
// ════════════════════════════════════════════════════════════
async function fetchCloudSettings() {
  try {
    const res = await fetch(BIN_CONFIG.url, { headers: { "X-Master-Key": BIN_CONFIG.key } });
    if (!res.ok) return; // Silencioso se falhar, usa valores padrão
    const json = await res.json();
    const data = json.record;

    if(data) {
      CLOUD.aberto = data.aberto !== undefined ? data.aberto : true;
      CLOUD.delivery = data.taxa !== undefined ? data.taxa : 0;
      CLOUD.aviso = data.aviso || "";
      CLOUD.desativados = data.desativados || [];
      CLOUD.tempo = data.tempo || "30-45 min";

      applyCloudSettings();
    }
  } catch(e) {
    console.warn("Erro ao buscar nuvem", e);
  }
}

function applyCloudSettings() {
  // Atualiza Status
  State.lojaAberta = CLOUD.aberto;
  const badge = document.getElementById("status-loja");
  if(badge) {
    badge.className = `status-badge ${CLOUD.aberto ? "aberto" : "fechado"}`;
    const lbl = badge.querySelector("#status-label");
    if(lbl) lbl.textContent = CLOUD.aberto ? "Aberto agora" : "Fechado";
  }
  document.body.classList.toggle("loja-fechada", !CLOUD.aberto);

  // Atualiza Aviso
  const notice = document.getElementById("storeNotice");
  const noticeT = document.getElementById("storeNoticeText");
  if(notice && noticeT) {
    if(CLOUD.aviso && String(CLOUD.aviso).trim()) {
      noticeT.textContent = CLOUD.aviso;
      notice.style.display = "flex";
    } else {
      notice.style.display = "none";
    }
  }

  // Atualiza Taxa de entrega no CONFIG
  CONFIG.delivery = CLOUD.delivery;

  // Atualiza Tempo
  const tempoEl = document.querySelector(".delivery-time");
  if(tempoEl) tempoEl.innerHTML = `<i class="far fa-clock" aria-hidden="true"></i> ${CLOUD.tempo}`;
  
  // Atualiza carrinho se aberto
  updateCartUI();

  // Aplica itens desativados visualmente
  applyDisabledItems(CLOUD.desativados);
}

function applyDisabledItems(ids) {
  document.querySelectorAll(".product-card").forEach(card => {
    const m = (card.getAttribute("onclick") || "").match(/openProductModal\((\d+)\)/);
    if (!m) return;
    const id = parseInt(m[1], 10);
    const off = ids.includes(id);
    card.classList.toggle("item-disabled", off);
    let ov = card.querySelector(".disabled-overlay");
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

// ════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ════════════════════════════════════════════════════════════
function getIndex() {
  if (!State._index) State._index = new Map(MENU.map(p => [p.id, p]));
  return State._index;
}
function findProduct(id) { return getIndex().get(id) ?? null; }

const _cache = new Map();
function $(id) {
  if (_cache.has(id)) return _cache.get(id);
  const el = document.getElementById(id);
  if (el) _cache.set(id, el);
  return el;
}
const setText = (id, v) => { const e = $(id); if (e) e.textContent = v; };
const setHTML = (id, v) => { const e = $(id); if (e) e.innerHTML = v; };

const fmt      = v  => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
const clamp    = (v, a, b) => Math.min(Math.max(v, a), b);
const escape   = s  => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const normalize = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const plural   = (n, s, p) => `${n} ${n === 1 ? s : p}`;

function getSubtotal() { return State.cart.reduce((s,i) => s + (i.price + i.modifiersTotal) * i.quantity, 0); }
function getTotal()    { return getSubtotal() + (CONFIG.delivery || 0); }
function getDelivery() { return CONFIG.delivery || 0; }

function handleImgError(img) {
  if (!img.dataset.retried) { img.dataset.retried="1"; img.src = FALLBACK_IMG; }
}
function cartItemKey(pid, mods) { return `${pid}||${mods.join(",")}`; }

// ════════════════════════════════════════════════════════════
// PRELOADER FIX
// ════════════════════════════════════════════════════════════
window.addEventListener("load", () => {
  const pre = $("preloader");
  if (!pre) return;
  setTimeout(() => {
    pre.classList.add("hide");
    pre.addEventListener("transitionend", () => pre.remove(), { once: true });
  }, 1400);
});

// ════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════════════════════════
function initReveal() {
  if (State.observers.reveal) State.observers.reveal.disconnect();
  if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
    document.querySelectorAll(".product-card:not(.revealed)").forEach(c => c.classList.add("revealed"));
    return;
  }
  State.observers.reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card = e.target;
      const grid = card.closest(".products-grid");
      const idx  = grid ? [...grid.children].indexOf(card) : 0;
      const delay = clamp(idx * 40, 0, 300);
      setTimeout(() => card.classList.add("revealed"), delay);
      State.observers.reveal.unobserve(card);
    });
  }, { threshold: 0.03, rootMargin: "0px 0px 40px 0px" });
  document.querySelectorAll(".product-card:not(.revealed)").forEach(c => State.observers.reveal.observe(c));
}

// ════════════════════════════════════════════════════════════
// SCROLL
// ════════════════════════════════════════════════════════════
function handleScroll() {
  const y = window.scrollY;
  $("header")?.classList.toggle("scrolled", y > 50);
  $("backToTop")?.classList.toggle("visible", y > 400);
}
function scrollToTop() { window.scrollTo({ top:0, behavior:"smooth" }); }

// ════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderMenu();
  loadCart();
  fetchCloudSettings(); // Busca dados do JSONBin
  setInterval(fetchCloudSettings, 8000); // Polling de 8s

  window.addEventListener("scroll", handleScroll, { passive: true });

  const ph = $("customerPhone");
  if (ph) ph.addEventListener("input", maskPhone);

  document.querySelectorAll("#step1 input").forEach(inp => {
    inp.addEventListener("input", () => clearInputErr(inp));
  });

  const modalMods = $("modalModifiers");
  if (modalMods) modalMods.addEventListener("change", onModifierChange);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
  });

  requestAnimationFrame(() => requestAnimationFrame(initReveal));
});

// ════════════════════════════════════════════════════════════
// MÁSCARA TELEFONE
// ════════════════════════════════════════════════════════════
function maskPhone() {
  let v = this.value.replace(/\D/g,"").slice(0,11);
  if      (v.length > 10) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 6)  v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  else if (v.length > 2)  v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length > 0)  v = `(${v}`;
  this.value = v;
}

// ════════════════════════════════════════════════════════════
// CATEGORIAS
// ════════════════════════════════════════════════════════════
function renderCategories() {
  const nav = $("categoryNav");
  if (!nav) return;
  const frag = document.createDocumentFragment();
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className  = `cat-link${cat.id === State.currentCategory ? " active" : ""}`;
    btn.dataset.cat = cat.id;
    btn.setAttribute("role", "tab");
    btn.innerHTML  = `${cat.icon} ${escape(cat.name)}`;
    btn.addEventListener("click", () => filterCategory(cat.id, btn));
    frag.appendChild(btn);
  });
  nav.innerHTML = "";
  nav.appendChild(frag);
}

function filterCategory(id, el) {
  State.currentCategory = id;
  document.querySelectorAll(".cat-link").forEach(b => b.classList.remove("active"));
  el?.classList.add("active");
  el?.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
  const inp = $("searchInput");
  if (inp?.value) { inp.value=""; $("searchClear")?.classList.remove("visible"); }
  renderMenu();
  if (id !== "todos") {
    requestAnimationFrame(() => {
      const t = document.getElementById(`cat-${id}`);
      if (!t) return;
      const hh = $("header")?.offsetHeight ?? 170;
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - hh - 8, behavior:"smooth" });
    });
  }
}

// ════════════════════════════════════════════════════════════
// CARDÁPIO
// ════════════════════════════════════════════════════════════
const ORDERED_CATS = CATEGORIES.map(c => c.id).filter(id => id !== "todos");

function groupBy(items) {
  const g = {};
  for (const i of items) (g[i.category] ??= []).push(i);
  return g;
}

function renderMenu() {
  const container = $("menuContainer");
  if (!container) return;
  const items = State.currentCategory === "todos"
    ? MENU
    : MENU.filter(i => i.category === State.currentCategory);

  if (!items.length) { container.innerHTML = emptyHTML(); return; }

  const grouped = groupBy(items);
  const frag    = document.createDocumentFragment();

  ORDERED_CATS.filter(id => grouped[id]).forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    const sec = document.createElement("section");
    sec.className = "category-section";
    sec.id        = `cat-${catId}`;
    sec.innerHTML = `
      <div class="section-header">
        <div class="section-icon">${cat?.icon ?? "🍽️"}</div>
        <h2 class="section-title">${escape(cat?.name ?? catId)}</h2>
      </div>
      <div class="products-grid">
        ${grouped[catId].map(renderCard).join("")}
      </div>`;
    frag.appendChild(sec);
  });

  container.innerHTML = "";
  container.appendChild(frag);
  requestAnimationFrame(initReveal);
}

function renderCard(p) {
  const hasReq = p.modifiers?.some(m => m.required);
  const ps     = fmt(p.price);
  const action = hasReq ? `openProductModal(${p.id})` : `quickAdd(${p.id})`;
  const icon   = hasReq ? "fa-sliders-h" : "fa-plus";

  return `
    <article class="product-card" role="button" tabindex="0"
             onclick="openProductModal(${p.id})"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProductModal(${p.id})}">
      <div class="product-image">
        <img src="${escape(p.image)}" alt="${escape(p.name)}" loading="lazy" decoding="async" onerror="handleImgError(this)">
        ${p.badge ? `<div class="product-badge">${escape(p.badge)}</div>` : ""}
      </div>
      <div class="product-info">
        <h3 class="product-name">${escape(p.name)}</h3>
        <p class="product-desc">${escape(p.description)}</p>
        <div class="product-footer">
          <span class="product-price">${ps}</span>
          <button class="btn-add-quick" onclick="event.stopPropagation();${action}">
            <i class="fas ${icon}"></i>
          </button>
        </div>
      </div>
    </article>`;
}

function emptyHTML(msg = "Nenhum resultado") {
  return `<div class="empty-search" role="status"><div style="font-size:3rem">🔍</div><h3>${escape(msg)}</h3></div>`;
}

// ════════════════════════════════════════════════════════════
// BUSCA
// ════════════════════════════════════════════════════════════
function searchMenu() {
  clearTimeout(State.timers.search);
  State.timers.search = setTimeout(doSearch, CONFIG.searchDebounce);
}

function doSearch() {
  const raw   = $("searchInput")?.value ?? "";
  const q     = normalize(raw);
  const clear = $("searchClear");
  if (clear) clear.classList.toggle("visible", q.length > 0);

  const container = $("menuContainer");
  if (!container) return;
  if (!q) { renderMenu(); return; }

  const filtered = MENU.filter(item =>
    normalize(item.name).includes(q) ||
    normalize(item.description).includes(q) ||
    item.modifiers?.some(m => m.options?.some(o => normalize(o.name).includes(q)))
  );

  if (!filtered.length) { container.innerHTML = emptyHTML(`Nenhum resultado para "${escape(raw)}"`); return; }

  const grouped = groupBy(filtered);
  const frag    = document.createDocumentFragment();

  ORDERED_CATS.filter(id => grouped[id]).forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    const sec = document.createElement("section");
    sec.className = "category-section";
    sec.innerHTML = `
      <div class="section-header">
        <div class="section-icon">${cat?.icon ?? "🍽️"}</div>
        <h2 class="section-title">${escape(cat?.name ?? catId)}</h2>
      </div>
      <div class="products-grid">${grouped[catId].map(renderCard).join("")}</div>`;
    frag.appendChild(sec);
  });

  container.innerHTML = "";
  container.appendChild(frag);
  requestAnimationFrame(initReveal);
}

function clearSearch() {
  const inp = $("searchInput");
  if (inp) inp.value = "";
  $("searchClear")?.classList.remove("visible");
  renderMenu();
  inp?.focus();
}

// ════════════════════════════════════════════════════════════
// LOJA FECHADA
// ════════════════════════════════════════════════════════════
function isClosed() {
  if (!State.lojaAberta) {
    showToast("Fechado 🔒", "Estamos fechados no momento. Volte em breve!", "warn");
    return true;
  }
  return false;
}

// ════════════════════════════════════════════════════════════
// MODAL PRODUTO
// ════════════════════════════════════════════════════════════
function openProductModal(pid) {
  // Check if disabled via cloud
  if (CLOUD.desativados.includes(pid)) {
    showToast("Indisponível 😔", "Item temporariamente fora do cardápio.", "warn");
    return;
  }
  
  if (isClosed()) return;
  const p = findProduct(pid);
  if (!p) return;

  State.lastFocused     = document.activeElement;
  State.modal.product   = p;
  State.modal.qty       = 1;
  State.modal.modifiers = {};

  const modal = $("productModal");
  if (!modal) return;

  const img       = $("modalImg");
  img.alt         = p.name;
  img.src         = "";
  img.onerror     = () => handleImgError(img);
  img.src         = p.image;

  const badge = $("modalBadge");
  if (badge) { badge.textContent = p.badge ?? ""; badge.style.display = p.badge ? "block" : "none"; }

  const cat = CATEGORIES.find(c => c.id === p.category);
  setText("modalCategory",    cat?.name ?? "");
  setText("modalTitle",       p.name);
  setText("modalDescription", p.description);
  setText("modalQty",         "1");

  renderModifiers(p);
  updateModalPrice();

  modal.classList.add("active");
  modal.setAttribute("aria-hidden","false");
  $("overlay")?.classList.add("active");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => modal.querySelector(".modal-close")?.focus());
}

function closeProductModal() {
  const modal = $("productModal");
  if (!modal?.classList.contains("active")) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden","true");
  tryCloseOverlay();
  document.body.style.overflow = "";
  State.lastFocused?.focus();
  State.lastFocused = null;
}

// ════════════════════════════════════════════════════════════
// MODIFICADORES
// ════════════════════════════════════════════════════════════
function renderModifiers(p) {
  const container = $("modalModifiers");
  if (!container) return;
  if (!p.modifiers?.length) { container.innerHTML = ""; return; }

  const frag = document.createDocumentFragment();

  p.modifiers.forEach((mod, mi) => {
    const isMulti = !!mod.multiple;
    const title   = mod.description || mod.name;
    const group   = document.createElement("div");
    group.className = "modifier-group";
    group.id        = `modGroup-${mi}`;

    const reqLabel  = mod.required ? `<span class="mod-req">(obrigatório)</span>` : "";
    const limLabel  = isMulti && mod.maxSelect
      ? `<span class="mod-limit"> — até ${mod.maxSelect}</span>` : "";

    const titleEl = document.createElement("div");
    titleEl.className = "modifier-title";
    titleEl.id        = `modTitle-${mi}`;
    titleEl.innerHTML = `${escape(title)}${reqLabel}${limLabel}`;

    let counter = null;
    if (isMulti && mod.maxSelect) {
      counter = document.createElement("div");
      counter.className = "mod-counter";
      counter.id        = `modCounter-${mi}`;
      counter.textContent = `0 / ${mod.maxSelect}`;
    }

    const opts = document.createElement("div");
    opts.className = "modifier-options";
    opts.setAttribute("role", isMulti ? "group" : "radiogroup");
    opts.setAttribute("aria-labelledby", `modTitle-${mi}`);

    mod.options.forEach((opt, oi) => {
      const label = document.createElement("label");
      label.className = "modifier-option";

      const input = document.createElement("input");
      input.name  = `mod-${mi}`;
      input.value = String(oi);
      input.dataset.modifierIndex = String(mi);
      input.dataset.optionIndex   = String(oi);

      if (isMulti) {
        input.type = "checkbox";
        input.dataset.maxSelect = String(mod.maxSelect ?? 0);
      } else {
        input.type = "radio";
        input.addEventListener("change", () => selectModifier(mi, oi, opt.name, opt.price ?? 0));
      }

      const content = document.createElement("div");
      content.className = "option-content";
      content.innerHTML = `
        <span class="option-name">${escape(opt.name)}</span>
        ${opt.price > 0 ? `<span class="option-price">+${fmt(opt.price)}</span>` : ""}`;

      label.appendChild(input);
      label.appendChild(content);
      opts.appendChild(label);
    });

    group.appendChild(titleEl);
    if (counter) group.appendChild(counter);
    group.appendChild(opts);
    frag.appendChild(group);
  });

  container.innerHTML = "";
  container.appendChild(frag);
}

function onModifierChange(e) {
  const input = e.target;
  if (input.type !== "checkbox" || !input.dataset.modifierIndex) return;

  const mi  = parseInt(input.dataset.modifierIndex, 10);
  const max = parseInt(input.dataset.maxSelect || "0", 10);

  if (max > 0 && input.checked) {
    const checked = document.querySelectorAll(
      `#modalModifiers input[type="checkbox"][data-modifier-index="${mi}"]:checked`
    );
    if (checked.length > max) {
      input.checked = false;
      showToast("Limite atingido ⚠️", `Máximo de ${max} opção(ões)`, "warn");
      return;
    }
  }
  syncCheckbox(mi);
  updateModalPrice();
}

function selectModifier(mi, oi, name, price) {
  State.modal.modifiers[mi] = [{ oi, name, price }];
  document.querySelectorAll(`input[name="mod-${mi}"]`).forEach((inp, idx) => {
    inp.closest(".modifier-option")?.classList.toggle("selected", idx === oi);
  });
  updateGroupProgress(mi);
  updateModalPrice();
}

function syncCheckbox(mi) {
  const mod = State.modal.product?.modifiers[mi];
  if (!mod) return;

  const checked = document.querySelectorAll(
    `#modalModifiers input[type="checkbox"][data-modifier-index="${mi}"]:checked`
  );
  State.modal.modifiers[mi] = [...checked].map(inp => {
    const oi  = parseInt(inp.dataset.optionIndex, 10);
    const opt = mod.options[oi];
    return { oi, name: opt.name, price: opt.price ?? 0 };
  });

  document.querySelectorAll(`#modalModifiers input[data-modifier-index="${mi}"]`)
    .forEach(inp => inp.closest(".modifier-option")?.classList.toggle("selected", inp.checked));

  const counter = $(`modCounter-${mi}`);
  if (counter) {
    const cnt = State.modal.modifiers[mi]?.length ?? 0;
    counter.textContent = `${cnt} / ${mod.maxSelect}`;
  }
  updateGroupProgress(mi);
}

function updateGroupProgress(mi) {
  const group = $(`modGroup-${mi}`);
  const mod   = State.modal.product?.modifiers[mi];
  if (!group || !mod) return;
  const cnt = (State.modal.modifiers[mi] ?? []).length;
  const min = mod.multiple ? (mod.minSelect ?? 1) : 1;
  group.classList.toggle("filled", cnt >= min);
  group.classList.remove("error");
}

function updateModalQty(delta) {
  State.modal.qty = clamp(State.modal.qty + delta, 1, CONFIG.maxCartItemQty);
  setText("modalQty", State.modal.qty);
  updateModalPrice();
}

function calcModsTotal() {
  return Object.values(State.modal.modifiers).flat().reduce((s,m) => s + (m.price ?? 0), 0);
}

function updateModalPrice() {
  if (!State.modal.product) return;
  const modTotal = calcModsTotal();
  const unit     = State.modal.product.price + modTotal;
  setText("modalPrice", fmt(unit));
  setText("modalTotal", fmt(unit * State.modal.qty));
}

// ════════════════════════════════════════════════════════════
// ADICIONAR AO CARRINHO
// ════════════════════════════════════════════════════════════
function addToCartFromModal() {
  const p = State.modal.product;
  if (!p) return;

  for (let mi = 0; mi < p.modifiers.length; mi++) {
    const mod      = p.modifiers[mi];
    const selected = State.modal.modifiers[mi] ?? [];
    if (!mod.required) continue;
    if (mod.multiple) {
      const need = mod.minSelect ?? 1;
      if (selected.length < need) {
        highlightErr(mi);
        showToast("Atenção ⚠️", `Escolha ${need} opção(ões) em: ${mod.name}`, "warn");
        return;
      }
    } else {
      if (!selected.length) {
        highlightErr(mi);
        showToast("Atenção ⚠️", `Selecione uma opção em: ${mod.name}`, "warn");
        return;
      }
    }
  }

  const modsList  = Object.values(State.modal.modifiers).flat().map(m => m.name);
  const modsTotal = calcModsTotal();
  const key       = cartItemKey(p.id, modsList);
  const existing  = State.cart.find(i => cartItemKey(i.productId, i.modifiers) === key);

  if (existing) {
    existing.quantity = clamp(existing.quantity + State.modal.qty, 1, CONFIG.maxCartItemQty);
  } else {
    State.cart.push({ productId:p.id, name:p.name, price:p.price, image:p.image,
      quantity:State.modal.qty, modifiers:modsList, modifiersTotal:modsTotal });
  }

  saveCart(); updateCartUI(); closeProductModal();
  showToast("Adicionado! 🎉", `${p.name} adicionado à sacola`);
}

function highlightErr(mi) {
  const group = $(`modGroup-${mi}`);
  if (!group) return;
  group.classList.add("error");
  group.scrollIntoView({ behavior:"smooth", block:"nearest" });
  group.addEventListener("change", () => group.classList.remove("error"), { once: true });
}

function quickAdd(pid) {
  if (isClosed()) return;
  
  // Check disabled
  if (CLOUD.desativados.includes(pid)) {
    showToast("Indisponível 😔", "Item temporariamente fora do cardápio.", "warn");
    return;
  }

  const p = findProduct(pid);
  if (!p) return;
  if (p.modifiers?.some(m => m.required)) { openProductModal(pid); return; }

  const key = cartItemKey(p.id, []);
  const ex  = State.cart.find(i => cartItemKey(i.productId, i.modifiers) === key);

  if (ex) { ex.quantity = clamp(ex.quantity + 1, 1, CONFIG.maxCartItemQty); }
  else State.cart.push({ productId:p.id, name:p.name, price:p.price, image:p.image,
    quantity:1, modifiers:[], modifiersTotal:0 });

  saveCart(); updateCartUI();
  showToast("Adicionado! 🎉", `${p.name} adicionado à sacola`);
}

// ════════════════════════════════════════════════════════════
// CARRINHO UI
// ════════════════════════════════════════════════════════════
function updateCartUI() {
  const qty  = State.cart.reduce((s,i) => s + i.quantity, 0);
  const sub  = getSubtotal();
  const tot  = getTotal();
  const del  = getDelivery();

  const badge = $("cartBadge");
  if (badge) {
    badge.textContent = qty;
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }
  setText("cartBarQty",   qty);
  setText("cartBarTotal", fmt(tot));
  const bar = $("cartBar");
  if (bar) bar.style.display = qty > 0 ? "flex" : "none";

  const empty  = $("cartEmpty");
  const items  = $("cartItems");
  const footer = $("cartFooter");

  if (!State.cart.length) {
    if (empty)  empty.style.display  = "block";
    if (items)  items.innerHTML      = "";
    if (footer) footer.style.display = "none";
  } else {
    if (empty)  empty.style.display  = "none";
    if (items)  items.innerHTML      = State.cart.map(renderCartItem).join("");
    if (footer) footer.style.display = "block";
  }

  setText("cartSubtotal", fmt(sub));
  setText("cartDelivery", del > 0 ? fmt(del) : "Grátis");
  setText("cartTotal",    fmt(tot));
}

function renderCartItem(item, idx) {
  const unit  = item.price + item.modifiersTotal;
  const total = unit * item.quantity;
  const mods  = item.modifiers.length
    ? `<div class="cart-item-modifiers">${escape(item.modifiers.join(", "))}</div>` : "";
  return `
    <div class="cart-item">
      <img src="${escape(item.image)}" alt="${escape(item.name)}" class="cart-item-image" loading="lazy" onerror="handleImgError(this)">
      <div class="cart-item-info">
        <div class="cart-item-name">${escape(item.name)}</div>
        ${mods}
        <div class="cart-item-price">${fmt(total)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${idx},-1)"><i class="fas fa-minus"></i></button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)"><i class="fas fa-plus"></i></button>
          <button class="cart-item-remove" onclick="removeItem(${idx})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`;
}

function changeQty(idx, delta) {
  const item = State.cart[idx];
  if (!item) return;
  item.quantity = clamp(item.quantity + delta, 0, CONFIG.maxCartItemQty);
  if (item.quantity === 0) State.cart.splice(idx, 1);
  saveCart(); updateCartUI();
}

function removeItem(idx) {
  const name = State.cart[idx]?.name ?? "";
  State.cart.splice(idx, 1);
  saveCart(); updateCartUI();
  showToast("Removido 🗑️", `${name} removido da sacola`);
}

function clearCart() {
  if (!State.cart.length) return;
  if (!confirm("Limpar todos os itens?")) return;
  State.cart = [];
  saveCart(); updateCartUI();
  showToast("Sacola limpa 🗑️", "Todos os itens removidos");
}

function saveCart() {
  try { localStorage.setItem(CONFIG.cartKey, JSON.stringify(State.cart)); } catch {}
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CONFIG.cartKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    State.cart = parsed.filter(i => i && typeof i.productId === "number"
      && i.quantity > 0 && findProduct(i.productId));
  } catch { State.cart = []; } finally { updateCartUI(); }
}

// ════════════════════════════════════════════════════════════
// TOGGLE CARRINHO
// ════════════════════════════════════════════════════════════
function toggleCart() {
  const sidebar = $("cartSidebar");
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains("active");
  if (isOpen) {
    sidebar.classList.remove("active");
    sidebar.setAttribute("aria-hidden","true");
    tryCloseOverlay();
    document.body.style.overflow = "";
  } else {
    State.lastFocused = document.activeElement;
    sidebar.classList.add("active");
    sidebar.setAttribute("aria-hidden","false");
    $("overlay")?.classList.add("active");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => sidebar.querySelector(".btn-close")?.focus());
  }
}

// ════════════════════════════════════════════════════════════
// CHECKOUT
// ════════════════════════════════════════════════════════════
function openCheckout() {
  if (!State.cart.length) { showToast("Sacola vazia 🛒","Adicione itens antes","warn"); return; }
  if (isClosed()) return;
  $("cartSidebar")?.classList.remove("active");
  $("cartSidebar")?.setAttribute("aria-hidden","true");
  State.checkoutStep = 1;
  syncSteps();
  const modal = $("checkoutModal");
  modal?.classList.add("active");
  modal?.setAttribute("aria-hidden","false");
  $("overlay")?.classList.add("active");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("customerName")?.focus(), 200);
}

function closeCheckout() {
  const modal = $("checkoutModal");
  if (!modal?.classList.contains("active")) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden","true");
  tryCloseOverlay();
  document.body.style.overflow = "";
}

function goToStep(step) {
  if (step > State.checkoutStep && State.checkoutStep === 1 && !validateStep1()) return;
  State.checkoutStep = step;
  syncSteps();
  if (step === 2) { updatePaymentValues(); togglePaymentView(); generatePix(); }
  if (step === 3) buildReview();
  document.querySelector(".checkout-body")?.scrollTo(0, 0);
}

function syncSteps() {
  document.querySelectorAll(".checkout-steps .step").forEach((el, i) => {
    const n = i + 1;
    el.classList.toggle("active",    n === State.checkoutStep);
    el.classList.toggle("completed", n <  State.checkoutStep);
  });
  document.querySelectorAll(".step-line").forEach((el, i) => {
    el.classList.toggle("completed", i + 1 < State.checkoutStep);
  });
  document.querySelectorAll(".checkout-step").forEach((el, i) => {
    el.classList.toggle("active", i + 1 === State.checkoutStep);
  });
}

// ════════════════════════════════════════════════════════════
// VALIDAÇÃO STEP 1
// ════════════════════════════════════════════════════════════
function getVal(id) { return $(id)?.value?.trim() ?? ""; }

function markErr(id, msg) {
  const inp = $(id);
  if (!inp) return;
  inp.classList.add("input-error");
  let errEl = document.getElementById(`${id}-error`);
  if (!errEl) {
    errEl = document.createElement("span");
    errEl.id        = `${id}-error`;
    errEl.className = "input-error-msg";
    errEl.setAttribute("role","alert");
    inp.parentNode?.appendChild(errEl);
  }
  errEl.textContent = msg;
  inp.focus();
}

function clearInputErr(inp) {
  if (!inp) return;
  inp.classList.remove("input-error");
  const e = document.getElementById(`${inp.id}-error`);
  if (e) e.textContent = "";
}

function validateStep1() {
  document.querySelectorAll("#step1 .input-error").forEach(e => clearInputErr(e));
  const name  = getVal("customerName");
  const phone = getVal("customerPhone").replace(/\D/g,"");
  const str   = getVal("customerStreet");
  const num   = getVal("customerNumber");
  const neigh = getVal("customerNeighborhood");

  if (!name)                               { markErr("customerName",         "Informe seu nome completo"); showToast("Campo obrigatório ⚠️","Nome completo","warn"); return false; }
  if (name.trim().split(/\s+/).length < 2) { markErr("customerName",         "Nome e sobrenome");          showToast("Nome inválido ⚠️","Informe nome e sobrenome","warn"); return false; }
  if (phone.length < 10)                   { markErr("customerPhone",        "WhatsApp com DDD");          showToast("Telefone inválido ⚠️","Informe WhatsApp com DDD","warn"); return false; }
  if (!str)                                { markErr("customerStreet",       "Informe a rua");             showToast("Endereço ⚠️","Informe a rua","warn"); return false; }
  if (!num)                                { markErr("customerNumber",       "Informe o número");          showToast("Endereço ⚠️","Informe o número","warn"); return false; }
  if (!neigh)                              { markErr("customerNeighborhood", "Informe o bairro");          showToast("Endereço ⚠️","Informe o bairro","warn"); return false; }
  return true;
}

// ════════════════════════════════════════════════════════════
// PAGAMENTO
// ════════════════════════════════════════════════════════════
function getSelectedPayment() {
  return document.querySelector('input[name="payment"]:checked')?.value ?? "pix";
}
function togglePaymentView() {
  const type = getSelectedPayment();
  const pix  = $("pixSection");
  const cash = $("cashSection");
  if (pix)  pix.style.display  = type === "pix"      ? "block" : "none";
  if (cash) cash.style.display = type === "dinheiro" ? "block" : "none";
}
function toggleChangeField() {
  const val   = document.querySelector('input[name="change"]:checked')?.value;
  const field = $("changeField");
  if (field) field.style.display = val === "yes" ? "block" : "none";
}
function updatePaymentValues() {
  const v = fmt(getTotal());
  ["paymentTotalDisplay","pixCardValue","cartaoCardValue","dinheiroCardValue"].forEach(id => setText(id, v));
}

// ════════════════════════════════════════════════════════════
// PIX
// ════════════════════════════════════════════════════════════
function generatePix() {
  const total = getTotal();
  setText("pixAmount",   fmt(total));
  setText("pixKeyValue", fmt(total));

  const payload = buildPixPayload(CONFIG.pix, CONFIG.pixName, CONFIG.pixCity, total);
  const codeEl  = $("pixCode");
  if (codeEl) codeEl.value = payload;

  const qrImg  = $("pixQR");
  const loading = $("pixLoading");
  if (!qrImg || !loading) return;

  loading.style.display = "flex";
  qrImg.style.display   = "none";

  const enc  = encodeURIComponent(payload);
  let tried  = 0;
  qrImg.onload  = () => { loading.style.display = "none"; qrImg.style.display = "block"; };
  qrImg.onerror = () => {
    if (tried === 0) { tried++; qrImg.src = `https://quickchart.io/qr?size=200&text=${enc}`; }
    else { loading.innerHTML = `<small>Use o código Copia e Cola</small>`; }
  };
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&ecc=M&margin=8&data=${enc}`;
}

function buildPixPayload(chave, nome, cidade, valor) {
  let key = chave.replace(/\D/g,"");
  if (!key.startsWith("55")) key = "55" + key;
  key = "+" + key;
  const clean = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9 ]/g,"").toUpperCase().trim().slice(0,25);
  const tlv   = (id, val) => String(id).padStart(2,"0") + String(val.length).padStart(2,"0") + val;
  const mai   = tlv("00","br.gov.bcb.pix") + tlv("01", key);
  const body  = tlv("00","01") + tlv("01","12") + tlv("26",mai) + tlv("52","0000") + tlv("53","986") + tlv("54",valor.toFixed(2)) + tlv("58","BR") + tlv("59",clean(nome)) + tlv("60",clean(cidade)) + tlv("62",tlv("05","***")) + "6304";
  return body + crc16(body);
}

function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) { crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1); crc &= 0xFFFF; }
  }
  return crc.toString(16).toUpperCase().padStart(4,"0");
}

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.cssText = "position:fixed;opacity:0;left:-9999px";
  document.body.appendChild(ta); ta.select();
  try { return document.execCommand("copy"); } catch { return false; } finally { ta.remove(); }
}
async function copyPixCode() {
  const ok = await copyToClipboard($("pixCode")?.value ?? "");
  showToast(ok?"Copiado! ✅":"Erro ❌", ok?"Código PIX copiado":"Copie manualmente", ok?"success":"warn");
}
async function copyPixKey() {
  const ok = await copyToClipboard($("pixKey")?.value ?? "");
  showToast(ok?"Copiado! ✅":"Erro ❌", ok?"Chave PIX copiada":"Copie manualmente", ok?"success":"warn");
}

// ════════════════════════════════════════════════════════════
// REVISÃO (WHATSAPP)
// ════════════════════════════════════════════════════════════
function buildReview() {
  const sub = getSubtotal();
  const del = getDelivery();
  const tot = getTotal();

  setHTML("reviewItems", State.cart.map(i => {
    const lt = (i.price + i.modifiersTotal) * i.quantity;
    const ms = i.modifiers.length ? ` <em>(${escape(i.modifiers.join(", "))})</em>` : "";
    return `<div class="review-item"><span>${i.quantity}× ${escape(i.name)}${ms}</span><span>${fmt(lt)}</span></div>`;
  }).join(""));

  setHTML("reviewCustomer", `${escape(getVal("customerName"))}<br><small>${escape(getVal("customerPhone"))}</small>`);
  const addr = `${escape(getVal("customerStreet"))}, ${escape(getVal("customerNumber"))} — ${escape(getVal("customerNeighborhood"))}`;
  const comp = getVal("customerComplement");
  setHTML("reviewAddress", addr + (comp ? `<br><small>${escape(comp)}</small>` : ""));

  const pay = getSelectedPayment();
  setText("reviewPayment", PAYMENT_LABELS[pay] ?? pay);
  setText("reviewSubtotal", fmt(sub));
  setText("reviewDelivery", del > 0 ? fmt(del) : "Grátis");
  setText("reviewTotal",    fmt(tot));
}

// ════════════════════════════════════════════════════════════
// ENVIAR PEDIDO (WHATSAPP)
// ════════════════════════════════════════════════════════════
function sendToWhatsApp() {
  if (!validateStep1()) { goToStep(1); return; }

  const pay       = getSelectedPayment();
  const changeOpt = document.querySelector('input[name="change"]:checked')?.value ?? "no";
  const changeAmt = getVal("changeAmount");

  const payload = {
    customer: { name: getVal("customerName"), phone: getVal("customerPhone") },
    address:  {
      street:       getVal("customerStreet"),
      number:       getVal("customerNumber"),
      neighborhood: getVal("customerNeighborhood"),
      complement:   getVal("customerComplement"),
    },
    items: State.cart.map(i => ({
      name:           i.name,
      quantity:       i.quantity,
      price:          i.price,
      modifiers:      i.modifiers,
      modifiersTotal: i.modifiersTotal,
      lineTotal:      (i.price + i.modifiersTotal) * i.quantity,
    })),
    subtotal: getSubtotal(),
    payment: {
      method:     pay,
      label:      PAYMENT_LABELS[pay] ?? pay,
      needChange: pay === "dinheiro" && changeOpt === "yes",
      changeFor:  changeAmt,
    },
  };

  const { customer, address, items, payment } = payload;
  const total = getSubtotal() + (CLOUD.delivery || 0);
  const now   = new Date().toLocaleString("pt-BR", { dateStyle:"short", timeStyle:"short" });

  let msg = `👑 *IMPÉRIO LANCHES*\n━━━━━━━━━━━━━━━━━━━━━━━\n🛒 *PEDIDO*\n\n*📦 ITENS:*\n`;
  items.forEach(i => {
    msg += `  • ${i.quantity}× ${i.name}`;
    if (i.modifiers?.length) msg += ` _(${i.modifiers.join(", ")})_`;
    msg += ` — ${fmt(i.lineTotal)}\n`;
  });
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 Subtotal: ${fmt(payload.subtotal)}\n`;
  msg += `🛵 Entrega:  ${CLOUD.delivery > 0 ? fmt(CLOUD.delivery) : "Grátis"}\n`;
  msg += `*💵 TOTAL:   ${fmt(total)}*\n━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `*👤 CLIENTE:*\n  ${customer.name}\n  ${customer.phone}\n\n`;
  msg += `*📍 ENDEREÇO:*\n  ${address.street}, ${address.number} — ${address.neighborhood}\n`;
  if (address.complement) msg += `  ${address.complement}\n`;
  msg += `\n*💳 PAGAMENTO:* ${payment.label}\n`;
  if (payment.needChange) msg += `  Troco para: ${payment.changeFor}\n`;
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━\n_Pedido em: ${now}_`;

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");

  // Limpa carrinho
  State.cart.length = 0;
  localStorage.removeItem(CONFIG.cartKey);

  closeCheckout();
  $("overlay")?.classList.remove("active");
  document.body.style.overflow = "";
  updateCartUI();

  showToast("Pedido enviado! 🎉", "Aguarde confirmação pelo WhatsApp", "success");
}

// ── Sobrescreve o botão do checkout para chamar o WhatsApp direto ──
window.sendToWhatsApp = sendToWhatsApp;


// ════════════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════════════
const TOAST_ICONS = { success:"fa-check-circle", warn:"fa-exclamation-circle", error:"fa-times-circle", info:"fa-info-circle" };

function showToast(title, message, type = "success") {
  const toast = $("toast");
  if (!toast) return;
  const icon = toast.querySelector(".toast-icon");
  if (icon) { icon.className = `toast-icon ${type}`; icon.innerHTML = `<i class="fas ${TOAST_ICONS[type]??TOAST_ICONS.success}"></i>`; }
  setText("toastTitle",   title);
  setText("toastMessage", message);
  toast.setAttribute("aria-hidden","false");
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
  clearTimeout(State.timers.toast);
  State.timers.toast = setTimeout(() => { toast.classList.remove("show"); toast.setAttribute("aria-hidden","true"); }, CONFIG.toastDuration);
}

function closeToast() {
  clearTimeout(State.timers.toast);
  $("toast")?.classList.remove("show");
}

// ════════════════════════════════════════════════════════════
// OVERLAY
// ════════════════════════════════════════════════════════════
function tryCloseOverlay() {
  const any =
    $("productModal")?.classList.contains("active")  ||
    $("checkoutModal")?.classList.contains("active") ||
    $("cartSidebar")?.classList.contains("active");
  if (!any) $("overlay")?.classList.remove("active");
}

function closeAll() {
  if ($("productModal")?.classList.contains("active"))  { closeProductModal(); return; }
  if ($("checkoutModal")?.classList.contains("active")) { closeCheckout();     return; }
  if ($("cartSidebar")?.classList.contains("active"))   { toggleCart();        return; }
  $("overlay")?.classList.remove("active");
}