globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDocs, q as query, c as collection, d as db, o as orderBy } from '../../../chunks/firebase_-vWPoMRi.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Cevu3oIO.mjs';

const GET = async () => {
  try {
    const snap = await getDocs(query(collection(db, "categorias"), orderBy("nome")));
    const categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return new Response(JSON.stringify({
      categories
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      categories: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
