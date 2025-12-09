globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DMHZTcBm.mjs';
import { $ as $$Layout } from '../chunks/Layout_BiHM0FIQ.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Cevu3oIO.mjs';

const $$Sobre = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "88 Brindes - Sobre N\xF3s" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <div class="max-w-4xl mx-auto"> <h1 class="text-4xl font-title font-bold text-dark mb-8 text-center">Sobre a 88 Brindes</h1> <div class="prose prose-lg max-w-none"> <div class="bg-white rounded-xl shadow-card p-8 mb-8"> <p class="text-gray-700 leading-relaxed mb-6">
A 88 Brindes é uma empresa especializada em produtos promocionais com sede localizada em Goiânia - GO. 
            A maioria dos produtos ofertados são de importação própria, possibilitando assim, preços competitivos aos nossos clientes.
</p> <p class="text-gray-700 leading-relaxed mb-6">
Nossas personalizações são feitas internamente, agilizando as entregas dos nossos pedidos e garantindo 
            a melhor qualidade para nossos clientes.
</p> <p class="text-gray-700 leading-relaxed">
Com anos de experiência no mercado, oferecemos uma ampla variedade de brindes personalizados para 
            empresas de todos os tamanhos, sempre com o melhor custo-benefício.
</p> </div> <div class="grid md:grid-cols-3 gap-6 mb-8"> <div class="bg-primary/10 rounded-xl p-6 text-center"> <div class="text-4xl font-bold text-primary mb-2">10+</div> <p class="text-gray-700 font-semibold">Anos de Experiência</p> </div> <div class="bg-primary/10 rounded-xl p-6 text-center"> <div class="text-4xl font-bold text-primary mb-2">1000+</div> <p class="text-gray-700 font-semibold">Clientes Satisfeitos</p> </div> <div class="bg-primary/10 rounded-xl p-6 text-center"> <div class="text-4xl font-bold text-primary mb-2">500+</div> <p class="text-gray-700 font-semibold">Produtos Disponíveis</p> </div> </div> <div class="bg-white rounded-xl shadow-card p-8"> <h2 class="text-2xl font-title font-bold text-dark mb-4">Nossa Missão</h2> <p class="text-gray-700 leading-relaxed mb-6">
Fornecer produtos promocionais de alta qualidade com preços competitivos, 
            ajudando empresas a fortalecerem sua marca e conquistarem seus objetivos de marketing.
</p> <h2 class="text-2xl font-title font-bold text-dark mb-4">Nossos Valores</h2> <ul class="space-y-3"> <li class="flex items-start gap-3"> <span class="text-primary mt-1">✓</span> <span class="text-gray-700">Qualidade em todos os produtos e serviços</span> </li> <li class="flex items-start gap-3"> <span class="text-primary mt-1">✓</span> <span class="text-gray-700">Agilidade na entrega e atendimento</span> </li> <li class="flex items-start gap-3"> <span class="text-primary mt-1">✓</span> <span class="text-gray-700">Transparência e honestidade com clientes</span> </li> <li class="flex items-start gap-3"> <span class="text-primary mt-1">✓</span> <span class="text-gray-700">Inovação constante em produtos e processos</span> </li> </ul> </div> </div> </div> </div> ` })}`;
}, "/home/user/rocha-brindes-astro/src/pages/sobre.astro", void 0);

const $$file = "/home/user/rocha-brindes-astro/src/pages/sobre.astro";
const $$url = "/sobre";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sobre,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
