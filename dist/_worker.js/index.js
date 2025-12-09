globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_Cevu3oIO.mjs';
import { createExports } from './_@astrojs-ssr-adapter.mjs';
import { manifest } from './manifest_DQt4h0IJ.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/products/all.astro.mjs');
const _page3 = () => import('./pages/api/products/cart/info.astro.mjs');
const _page4 = () => import('./pages/api/products/categories.astro.mjs');
const _page5 = () => import('./pages/api/products/_id_.astro.mjs');
const _page6 = () => import('./pages/carrinho.astro.mjs');
const _page7 = () => import('./pages/checkout.astro.mjs');
const _page8 = () => import('./pages/contato.astro.mjs');
const _page9 = () => import('./pages/finalizar-orcamento.astro.mjs');
const _page10 = () => import('./pages/obrigado.astro.mjs');
const _page11 = () => import('./pages/produto/_id_.astro.mjs');
const _page12 = () => import('./pages/produtos.astro.mjs');
const _page13 = () => import('./pages/sobre.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/products/all.ts", _page2],
    ["src/pages/api/products/cart/info.ts", _page3],
    ["src/pages/api/products/categories.ts", _page4],
    ["src/pages/api/products/[id].ts", _page5],
    ["src/pages/carrinho.astro", _page6],
    ["src/pages/checkout.astro", _page7],
    ["src/pages/contato.astro", _page8],
    ["src/pages/finalizar-orcamento.astro", _page9],
    ["src/pages/obrigado.astro", _page10],
    ["src/pages/produto/[id].astro", _page11],
    ["src/pages/produtos.astro", _page12],
    ["src/pages/sobre.astro", _page13],
    ["src/pages/index.astro", _page14]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
