globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../../chunks/_@astro-renderers_Cevu3oIO.mjs';

const POST = async ({ request }) => {
  const cart = await request.json();
  const items = [];
  for (const item of cart) {
    const product = await undefined                           .get(`product:${item.id}`, "json");
    if (product) {
      items.push({
        ...product,
        qty: item.qty,
        cor: item.cor ?? null
      });
    }
  }
  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
