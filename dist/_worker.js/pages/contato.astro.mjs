globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_DMHZTcBm.mjs';
import { $ as $$Layout } from '../chunks/Layout_BiHM0FIQ.mjs';
import { a as reactExports } from '../chunks/_@astro-renderers_Cevu3oIO.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Cevu3oIO.mjs';

/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim();
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, ...rest }, ref) => reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: ["lucide", `lucide-${toKebabCase(iconName)}`, className].join(" "),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );
  Component.displayName = `${iconName}`;
  return Component;
};

/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Clock = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);

/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Mail = createLucideIcon("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);

/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const MapPin = createLucideIcon("MapPin", [
  ["path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", key: "2oe9fu" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);

/**
 * @license lucide-react v0.300.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Phone = createLucideIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ]
]);

const $$Contato = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "88 Brindes - Contato" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <div class="max-w-5xl mx-auto"> <h1 class="text-4xl font-title font-bold text-dark mb-8 text-center">Fale Conosco</h1> <div class="grid md:grid-cols-2 gap-8">  <div class="space-y-6"> <div class="bg-white rounded-xl shadow-card p-6"> <h2 class="text-2xl font-title font-bold text-dark mb-6">Informações de Contato</h2> <div class="space-y-4"> <div class="flex items-start gap-4"> <div class="p-3 bg-primary/10 rounded-lg"> ${renderComponent($$result2, "MapPin", MapPin, { "class": "text-primary", "size": 24 })} </div> <div> <h3 class="font-semibold text-dark mb-1">Endereço</h3> <p class="text-gray-600 text-sm">
Av. Rio Verde, 8250 - Quadra 75, Lote 09<br>
Jd. Presidente - Goiânia - GO<br>
CEP: 74353-520
</p> </div> </div> <div class="flex items-start gap-4"> <div class="p-3 bg-primary/10 rounded-lg"> ${renderComponent($$result2, "Phone", Phone, { "class": "text-primary", "size": 24 })} </div> <div> <h3 class="font-semibold text-dark mb-1">Telefone</h3> <a href="tel:6240168888" class="text-gray-600 text-sm hover:text-primary transition-colors">
(62) 4016-8888
</a> </div> </div> <div class="flex items-start gap-4"> <div class="p-3 bg-primary/10 rounded-lg"> ${renderComponent($$result2, "Mail", Mail, { "class": "text-primary", "size": 24 })} </div> <div> <h3 class="font-semibold text-dark mb-1">E-mail</h3> <a href="mailto:contato@88brindes.com.br" class="text-gray-600 text-sm hover:text-primary transition-colors">
contato@88brindes.com.br
</a> </div> </div> <div class="flex items-start gap-4"> <div class="p-3 bg-primary/10 rounded-lg"> ${renderComponent($$result2, "Clock", Clock, { "class": "text-primary", "size": 24 })} </div> <div> <h3 class="font-semibold text-dark mb-1">Horário de Atendimento</h3> <p class="text-gray-600 text-sm">
Segunda a Sexta: 8h às 18h<br>
Sábado: 8h às 12h
</p> </div> </div> </div> </div> <div class="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-card p-6"> <h3 class="text-xl font-title font-bold mb-4">Atendimento via WhatsApp</h3> <p class="text-white/90 mb-4">
Fale diretamente com nossa equipe e tire suas dúvidas em tempo real!
</p>
href="https://wa.me/5562992485958"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all"
            >
<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg>
Chamar no WhatsApp
</div> </div>  <div class="bg-white rounded-xl shadow-card p-6"> <h2 class="text-2xl font-title font-bold text-dark mb-6">Envie sua Mensagem</h2> <form class="space-y-4"> <div> <label class="block text-sm font-semibold mb-2">Nome *</label> <input type="text" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"> </div> <div> <label class="block text-sm font-semibold mb-2">E-mail *</label> <input type="email" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"> </div> <div> <label class="block text-sm font-semibold mb-2">Telefone</label> <input type="tel" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"> </div> <div> <label class="block text-sm font-semibold mb-2">Assunto *</label> <input type="text" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"> </div> <div> <label class="block text-sm font-semibold mb-2">Mensagem *</label> <textarea required${addAttribute(5, "rows")} class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"></textarea> </div> <button type="submit" class="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
Enviar Mensagem
</button> </form> </div> </div> </div> </div> ` })}`;
}, "/home/user/rocha-brindes-astro/src/pages/contato.astro", void 0);

const $$file = "/home/user/rocha-brindes-astro/src/pages/contato.astro";
const $$url = "/contato";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contato,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
