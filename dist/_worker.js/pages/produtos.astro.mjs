globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as createAstro, m as maybeRenderHead, b as addAttribute, a as renderTemplate, r as renderComponent, F as Fragment } from '../chunks/astro/server_DMHZTcBm.mjs';
import { $ as $$Layout } from '../chunks/Layout_BiHM0FIQ.mjs';
import { o as optimizeUrl } from '../chunks/image_BuXG3seY.mjs';
import { g as getDocs, q as query, c as collection, d as db, o as orderBy } from '../chunks/firebase_CF_0dyeA.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Cevu3oIO.mjs';

const $$Astro$1 = createAstro();
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const { product } = Astro2.props;
  const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url || product.variacoes?.[0]?.imagem_url || "/assets/images/placeholder.webp";
  const imgUrl = optimizeUrl(imgId, "thumbnail");
  return renderTemplate`${maybeRenderHead()}<article class="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"> <a${addAttribute(`/produto/${product.id}`, "href")} class="block"> <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"> <img${addAttribute(imgUrl, "src")}${addAttribute(product.nome, "alt")} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy"> ${product.variacoes && product.variacoes.length > 0 && renderTemplate`<div class="absolute top-3 left-3"> <span class="bg-accent text-dark px-3 py-1.5 rounded-full text-xs font-bold shadow-md"> ${product.variacoes.length} ${product.variacoes.length === 1 ? "cor" : "cores"} </span> </div>`} ${product.destaque && renderTemplate`<div class="absolute top-3 right-3"> <span class="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
Destaque
</span> </div>`} </div> <div class="p-5"> <h3 class="font-title font-bold text-lg mb-2 line-clamp-2 min-h-[56px] text-dark group-hover:text-primary transition-colors"> ${product.nome} </h3> <p class="text-sm text-gray-500 font-medium mb-4">
Código: ${product.id} </p> </div> </a> <!-- Botão de “Adicionar ao Orçamento” —
       Versão Astro Puro usando URL GET,
       posso converter depois para LocalStorage com client:load --> <div class="px-5 pb-5"> <form method="GET" action="/carrinho"> <input type="hidden" name="add"${addAttribute(product.id, "value")}> <button type="submit" class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-4a1 1 0 110 2 1 1 0 010-2z"></path> </svg>
Adicionar ao Orçamento
</button> </form> </div> </article>`;
}, "/home/user/rocha-brindes-astro/src/components/products/ProductCard.astro", void 0);

const $$Astro = createAstro();
const $$ProductsPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProductsPage;
  let products = [];
  let categories = [];
  let errorMessage = null;
  try {
    const productsSnap = await getDocs(query(collection(db, "produtos"), orderBy("createdAt", "desc")));
    products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const categoriesSnap = await getDocs(query(collection(db, "categorias"), orderBy("nome")));
    categories = categoriesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error loading products and categories:", error);
    errorMessage = "Erro ao carregar produtos. Por favor, tente novamente mais tarde.";
  }
  const categoryNames = categories.length > 0 ? categories.map((c) => c.nome) : Array.from(new Set(products.flatMap((p) => p.categorias || [])));
  const url = Astro2.url;
  const categoryParam = url.searchParams.get("cat") || "Todos";
  const searchParam = (url.searchParams.get("q") || "").toLowerCase();
  const pageParam = Number(url.searchParams.get("page") || "1");
  const pageSize = 12;
  const filtered = products.filter((p) => {
    const matchCat = categoryParam === "Todos" || p.categorias && p.categorias.includes(categoryParam);
    const nomeLower = p.nome.toLowerCase();
    const idLower = p.id.toLowerCase();
    const matchSearch = !searchParam || nomeLower.includes(searchParam) || idLower.includes(searchParam);
    return matchCat && matchSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(pageParam, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  function buildUrl(params) {
    const u = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value === void 0 || value === "") {
        u.searchParams.delete(key);
      } else {
        u.searchParams.set(key, String(value));
      }
    });
    return `${u.pathname}${u.search}`;
  }
  return renderTemplate`${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <!-- Título --> <div class="mb-8"> <h1 class="text-3xl md:text-4xl font-title font-bold text-dark mb-2">
Nossos Produtos
</h1> <p class="text-gray-600">
Encontre os melhores brindes personalizados para sua empresa
</p> </div> ${errorMessage && renderTemplate`<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"> <h2 class="text-xl font-bold text-red-800 mb-2">Erro ao Carregar Produtos</h2> <p class="text-red-600">${errorMessage}</p> </div>`} <div class="grid lg:grid-cols-[280px_1fr] gap-8"> <!-- Sidebar de Categorias + Busca --> <aside class="bg-white rounded-2xl shadow-card p-5 h-fit"> <form method="GET" class="space-y-5"> <!-- Busca --> <div> <label class="block text-sm font-semibold text-gray-700 mb-2">
Buscar produto
</label> <input type="text" name="q"${addAttribute(searchParam, "value")} placeholder="Nome ou código" class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"> </div> <!-- Categorias --> <div> <label class="block text-sm font-semibold text-gray-700 mb-2">
Categoria
</label> <select name="cat" class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"> <option value="Todos"${addAttribute(categoryParam === "Todos", "selected")}>
Todas
</option> ${categoryNames.map((cat) => renderTemplate`<option${addAttribute(cat, "value")}${addAttribute(categoryParam === cat, "selected")}> ${cat} </option>`)} </select> </div> <!-- Página (sempre volta para 1 ao aplicar filtro) --> <input type="hidden" name="page" value="1"> <button type="submit" class="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
Aplicar filtros
</button> ${searchParam && renderTemplate`<a${addAttribute(buildUrl({ q: "", page: 1 }), "href")} class="block text-center text-xs text-gray-500 hover:text-primary mt-1">
Limpar busca
</a>`} </form> </aside> <!-- Lista de Produtos --> <section> ${filtered.length === 0 ? renderTemplate`<div class="text-center py-20"> <p class="text-xl text-gray-500 mb-4">Nenhum produto encontrado</p> ${(searchParam || categoryParam !== "Todos") && renderTemplate`<a${addAttribute(buildUrl({ q: "", cat: "Todos", page: 1 }), "href")} class="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all text-sm font-semibold">
Limpar filtros
</a>`} </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <div class="mb-4 flex items-center justify-between"> <p class="text-sm text-gray-600">
Mostrando${" "} <span class="font-semibold"> ${start + 1} </span>${" "}
-${" "} <span class="font-semibold"> ${Math.min(start + pageSize, filtered.length)} </span>${" "}
de${" "} <span class="font-semibold"> ${filtered.length} </span>${" "}
produtos
</p> </div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${paginated.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "product": product })}`)} </div> ${totalPages > 1 && renderTemplate`<div class="mt-12 flex items-center justify-center gap-4"> <!-- Anterior --> <a${addAttribute(currentPage > 1 ? buildUrl({ page: currentPage - 1 }) : "#", "href")}${addAttribute(currentPage <= 1, "aria-disabled")}${addAttribute(`flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm ${currentPage <= 1 ? "opacity-40 pointer-events-none" : "hover:bg-gray-50 hover:border-primary transition-all"}`, "class")}>
‹ Anterior
</a> <span class="text-sm text-gray-600 font-medium">
Página ${currentPage} de ${totalPages} </span> <!-- Próxima --> <a${addAttribute(currentPage < totalPages ? buildUrl({ page: currentPage + 1 }) : "#", "href")}${addAttribute(currentPage >= totalPages, "aria-disabled")}${addAttribute(`flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm ${currentPage >= totalPages ? "opacity-40 pointer-events-none" : "hover:bg-gray-50 hover:border-primary transition-all"}`, "class")}>
Próxima ›
</a> </div>`}` })}`} </section> </div> </div>`;
}, "/home/user/rocha-brindes-astro/src/components/products/ProductsPage.astro", void 0);

const $$Produtos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "88 Brindes - Produtos" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductsPage", $$ProductsPage, {})} ` })}`;
}, "/home/user/rocha-brindes-astro/src/pages/produtos.astro", void 0);

const $$file = "/home/user/rocha-brindes-astro/src/pages/produtos.astro";
const $$url = "/produtos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Produtos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
