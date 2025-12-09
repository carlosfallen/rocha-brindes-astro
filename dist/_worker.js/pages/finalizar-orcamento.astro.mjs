globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_DMHZTcBm.mjs';
import { $ as $$Layout } from '../chunks/Layout_BiHM0FIQ.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Cevu3oIO.mjs';

const $$FinalizarOrcamento = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "88 Brindes - Finalizar Or\xE7amento" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CheckoutPageWrapper", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/user/rocha-brindes-astro/src/components/checkout/CheckoutPageWrapper", "client:component-export": "default" })} ` })}`;
}, "/home/user/rocha-brindes-astro/src/pages/finalizar-orcamento.astro", void 0);

const $$file = "/home/user/rocha-brindes-astro/src/pages/finalizar-orcamento.astro";
const $$url = "/finalizar-orcamento";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FinalizarOrcamento,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
