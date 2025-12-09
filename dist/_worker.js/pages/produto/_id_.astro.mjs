globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as createAstro, a as renderTemplate, g as defineScriptVars, b as addAttribute, m as maybeRenderHead, r as renderComponent } from '../../chunks/astro/server_DMHZTcBm.mjs';
import { $ as $$Layout } from '../../chunks/Layout_BiHM0FIQ.mjs';
import { o as optimizeUrl } from '../../chunks/image_BuXG3seY.mjs';
import { a as doc, d as db, b as getDoc } from '../../chunks/firebase_CF_0dyeA.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Cevu3oIO.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$ProductDetail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProductDetail;
  const { product } = Astro2.props;
  const gallery = [];
  if (product.imagem_url) {
    gallery.push({
      label: "Principal",
      url: optimizeUrl(product.imagem_url, "public"),
      cor: null
    });
  }
  if (product.variacoes?.length) {
    for (const v of product.variacoes) {
      if (v.imagem_url) {
        gallery.push({
          label: v.cor,
          url: optimizeUrl(v.imagem_url, "public"),
          cor: v.cor
        });
      }
    }
  }
  return renderTemplate(_a || (_a = __template(["", '<section class="container mx-auto px-4 py-8"> <!-- Breadcrumb --> <nav class="mb-8 text-sm text-gray-600"> <a href="/" class="hover:text-primary">In\xEDcio</a> <span class="mx-2">/</span> <a href="/produtos" class="hover:text-primary">Produtos</a> <span class="mx-2">/</span> <span class="text-dark font-semibold">', '</span> </nav> <div class="grid md:grid-cols-2 gap-12 mb-16"> <!-- Galeria --> <div> <div id="gallery-main" class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center"> <img id="main-image"', "", ' class="w-full h-full object-contain p-8"> </div> ', ' </div> <!-- Informa\xE7\xF5es --> <div> <h1 class="text-3xl font-title font-bold text-dark mb-4">', '</h1> <p class="text-sm text-gray-500 font-mono mb-6">\nSKU: ', " </p> ", " ", " <!-- Varia\xE7\xF5es --> ", ' <!-- Quantidade --> <div class="mb-6"> <label class="block text-sm font-bold text-dark mb-3">Quantidade</label> <div class="flex items-center gap-3"> <button id="qty-minus" class="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl">-</button> <input id="qty" type="number" min="1" value="1" class="w-20 text-center px-3 py-2.5 bg-gray-50 text-gray-900 text-lg font-bold rounded-xl border-2"> <button id="qty-plus" class="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl">+</button> </div> </div> <!-- Bot\xE3o de adicionar --> <button id="add-to-cart" class="w-full bg-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"', ">\nAdicionar ao Or\xE7amento\n</button> </div> </div> </section> <script>(function(){", '\n  const mainImg = document.getElementById("main-image")\n  const thumbs = document.querySelectorAll(".thumb-btn")\n  const colorBtns = document.querySelectorAll(".color-btn")\n  const qtyInput = document.getElementById("qty")\n\n  let selectedColor = null\n\n  /* Miniaturas */\n  thumbs.forEach(btn => {\n    btn.addEventListener("click", () => {\n      const index = Number(btn.dataset.index)\n      mainImg.src = gallery[index].url\n      selectedColor = gallery[index].cor\n    })\n  })\n\n  /* Varia\xE7\xF5es */\n  colorBtns.forEach(btn => {\n    btn.addEventListener("click", () => {\n      selectedColor = btn.dataset.color\n      mainImg.src = gallery.find(g => g.cor === selectedColor)?.url || mainImg.src\n    })\n  })\n\n  /* Quantidade */\n  document.getElementById("qty-plus").onclick = () => qtyInput.value = Number(qtyInput.value) + 1\n  document.getElementById("qty-minus").onclick = () => qtyInput.value = Math.max(1, Number(qtyInput.value) - 1)\n\n  /* Add ao carrinho */\n  document.getElementById("add-to-cart").onclick = () => {\n    const id = document.getElementById("add-to-cart").dataset.id\n    const qty = Number(qtyInput.value)\n\n    if (gallery.some(g => g.cor) && !selectedColor) {\n      alert("Selecione uma cor antes de adicionar ao or\xE7amento.")\n      return\n    }\n\n    // LocalStorage (KV ser\xE1 integrado depois)\n    const cart = JSON.parse(localStorage.getItem("cart") || "[]")\n    cart.push({ id, qty, cor: selectedColor })\n    localStorage.setItem("cart", JSON.stringify(cart))\n\n    window.location.href = "/carrinho"\n  }\n})();<\/script>'])), maybeRenderHead(), product.nome, addAttribute(gallery[0]?.url, "src"), addAttribute(product.nome, "alt"), gallery.length > 1 && renderTemplate`<div class="flex gap-2 overflow-x-auto pb-2"> ${gallery.map((item, idx) => renderTemplate`<button class="thumb-btn flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden"${addAttribute(idx, "data-index")}> <img${addAttribute(optimizeUrl(item.url, "thumbnail"), "src")}${addAttribute(item.label, "alt")} class="w-full h-full object-cover"> </button>`)} </div>`, product.nome, product.id, product.categorias?.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-6"> ${product.categorias.map((cat) => renderTemplate`<span class="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary"> ${cat} </span>`)} </div>`, product.descricao && renderTemplate`<div class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200"> <p class="text-sm text-gray-700 whitespace-pre-line">${product.descricao}</p> </div>`, product.variacoes?.length > 0 && renderTemplate`<div class="mb-6"> <label class="block text-sm font-bold text-dark mb-3">
Escolha a cor <span class="text-red-500">*</span> </label> <div class="grid grid-cols-2 gap-2"> ${product.variacoes.map((v) => renderTemplate`<button class="color-btn px-3 py-2.5 rounded-xl bg-white text-gray-700 border-2 border-gray-200 hover:border-primary transition-all"${addAttribute(v.cor, "data-color")}> ${v.cor} </button>`)} </div> </div>`, addAttribute(product.id, "data-id"), defineScriptVars({ gallery }));
}, "/home/user/rocha-brindes-astro/src/components/products/ProductDetail.astro", void 0);

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const id = Astro2.params.id;
  let product = null;
  let errorMessage = null;
  try {
    const docRef = doc(db, "produtos", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return Astro2.redirect("/produtos?erro=produto-nao-encontrado");
    }
    product = { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error loading product:", error);
    errorMessage = "Erro ao carregar o produto. Por favor, tente novamente mais tarde.";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": product?.nome ?? "Produto" }, { "default": async ($$result2) => renderTemplate`${errorMessage ? renderTemplate`${maybeRenderHead()}<div class="container mx-auto px-4 py-12"> <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto"> <h2 class="text-xl font-bold text-red-800 mb-2">Erro ao Carregar Produto</h2> <p class="text-red-600">${errorMessage}</p> <a href="/produtos" class="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
Voltar para Produtos
</a> </div> </div>` : product ? renderTemplate`${renderComponent($$result2, "ProductDetail", $$ProductDetail, { "product": product })}` : renderTemplate`<div class="container mx-auto px-4 py-12"> <p class="text-gray-500">Carregando...</p> </div>`}` })}`;
}, "/home/user/rocha-brindes-astro/src/pages/produto/[id].astro", void 0);

const $$file = "/home/user/rocha-brindes-astro/src/pages/produto/[id].astro";
const $$url = "/produto/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
