globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_DMHZTcBm.mjs';
import { $ as $$Layout } from '../chunks/Layout_DP87oAng.mjs';
import { o as optimizeUrl } from '../chunks/image_BuXG3seY.mjs';
import { g as getDocs, b as getDoc, q as query, c as collection, d as db, o as orderBy, l as limit, a as doc } from '../chunks/firebase_-vWPoMRi.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Cevu3oIO.mjs';

const $$HeroBanner = createComponent(($$result, $$props, $$slots) => {
  const bannerUrl = optimizeUrl(
    "/assets/images/banner-home.webp",
    "public"
  );
  return renderTemplate`${maybeRenderHead()}<section class="relative w-full h-[480px] md:h-[560px] flex items-center justify-center overflow-hidden rounded-2xl shadow-xl"> <img${addAttribute(bannerUrl, "src")} alt="Banner principal" class="absolute inset-0 w-full h-full object-cover opacity-90" loading="eager"> <div class="relative z-10 text-center text-white px-4 max-w-3xl"> <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">
Brindes Personalizados com a Sua Identidade
</h1> <p class="mt-4 text-lg md:text-xl opacity-90">
Qualidade premium, entrega rápida e o melhor atendimento do mercado.
</p> <a href="/produtos" class="inline-block mt-6 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-lg">
Conhecer Produtos
</a> </div> <div class="absolute inset-0 bg-black/40"></div> </section>`;
}, "/home/user/rocha-brindes-astro/src/components/home/HeroBanner.astro", void 0);

async function getCatalog(productLimit = 6) {
  try {
    const [productsSnap, categoriesSnap, layoutDoc] = await Promise.all([
      getDocs(
        query(
          collection(db, "produtos"),
          orderBy("createdAt", "desc"),
          limit(productLimit)
        )
      ),
      getDocs(query(collection(db, "categorias"), orderBy("nome"))),
      getDoc(doc(db, "config", "layout"))
    ]);
    const products = productsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
    const categories = categoriesSnap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
    const layoutData = layoutDoc.exists() ? layoutDoc.data() : {};
    const banners = Array.isArray(layoutData.banners) ? layoutData.banners.map(
      (b) => typeof b === "string" ? { url: b, alt: "Banner" } : { url: b.url || b, alt: b.alt || "Banner" }
    ) : [];
    const layout = {
      logo: layoutData.logo || "",
      banners,
      promotions: layoutData.promotions || [],
      popups: layoutData.popups || []
    };
    return { products, categories, layout };
  } catch (error) {
    console.error("Error loading catalog:", error);
    throw error;
  }
}

const $$FeaturedProducts = createComponent(async ($$result, $$props, $$slots) => {
  const data = await getCatalog(6);
  const products = data.products;
  return renderTemplate`${maybeRenderHead()}<section class="container mx-auto px-4 py-12"> <h2 class="text-2xl font-bold mb-6 text-gray-900">
Produtos em Destaque
</h2> ${products.length === 0 && renderTemplate`<p class="text-gray-500">Nenhum produto encontrado.</p>`} <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${products.map((product) => renderTemplate`<a${addAttribute(`/produto/${product.id}`, "href")} class="group block"> <div class="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm"> <img${addAttribute(optimizeUrl(product.imagem_url, "public"), "src")}${addAttribute(product.nome, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy"> </div> <h3 class="mt-2 font-semibold text-gray-800 group-hover:text-orange-500"> ${product.nome} </h3> </a>`)} </div> </section>`;
}, "/home/user/rocha-brindes-astro/src/components/home/FeaturedProducts.astro", void 0);

const $$NewProducts = createComponent(async ($$result, $$props, $$slots) => {
  const data = await getCatalog(8);
  const products = data.products;
  return renderTemplate`${maybeRenderHead()}<section class="container mx-auto px-4 py-12"> <h2 class="text-2xl font-bold mb-6 text-gray-900">
Novidades
</h2> ${products.length === 0 && renderTemplate`<p class="text-gray-500">Nenhum produto novo foi encontrado.</p>`} <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${products.map((product) => renderTemplate`<a${addAttribute(`/produto/${product.id}`, "href")} class="group block"> <div class="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden shadow"> <img${addAttribute(optimizeUrl(product.imagem_url, "public"), "src")}${addAttribute(product.nome, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy"> </div> <h3 class="mt-2 font-semibold text-gray-800 group-hover:text-orange-500"> ${product.nome} </h3> </a>`)} </div> </section>`;
}, "/home/user/rocha-brindes-astro/src/components/home/NewProducts.astro", void 0);

const $$ClientsSection = createComponent(($$result, $$props, $$slots) => {
  const logos = [
    "/assets/logos/cliente1.webp",
    "/assets/logos/cliente2.webp",
    "/assets/logos/cliente3.webp",
    "/assets/logos/cliente4.webp",
    "/assets/logos/cliente5.webp"
  ];
  return renderTemplate`${maybeRenderHead()}<section class="px-4 py-16 bg-gray-50 border-t border-gray-200"> <div class="container mx-auto"> <h2 class="text-2xl font-semibold text-gray-900 text-center mb-8">
Empresas que Confiam em Nós
</h2> <div class="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center"> ${logos.map((src) => renderTemplate`<div class="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"> <img${addAttribute(src, "src")} class="w-28 md:w-32 object-contain" loading="lazy"> </div>`)} </div> </div> </section>`;
}, "/home/user/rocha-brindes-astro/src/components/home/ClientsSection.astro", void 0);

const $$NewsletterSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="px-4 py-16 bg-white"> <div class="container mx-auto max-w-2xl text-center"> <h2 class="text-3xl font-bold text-gray-900">
Receba Novidades e Promoções
</h2> <p class="mt-3 text-gray-600">
Inscreva-se e receba nossos lançamentos, promoções e produtos em destaque.
</p> <form action="https://formsubmit.co/seu-email-aqui" method="POST" class="mt-6 flex gap-3 justify-center"> <input type="email" name="email" required placeholder="Seu melhor e-mail" class="w-full max-w-sm px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"> <button type="submit" class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow-md transition-colors">
Enviar
</button> </form> </div> </section>`;
}, "/home/user/rocha-brindes-astro/src/components/home/NewsletterSection.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "88 Brindes - Cat\xE1logo de Brindes Personalizados" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex flex-col gap-16"> ${renderComponent($$result2, "HeroBanner", $$HeroBanner, {})} ${renderComponent($$result2, "FeaturedProducts", $$FeaturedProducts, {})} ${renderComponent($$result2, "NewProducts", $$NewProducts, {})} ${renderComponent($$result2, "ClientsSection", $$ClientsSection, {})} ${renderComponent($$result2, "NewsletterSection", $$NewsletterSection, {})} </main> ` })}`;
}, "/home/user/rocha-brindes-astro/src/pages/index.astro", void 0);

const $$file = "/home/user/rocha-brindes-astro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
