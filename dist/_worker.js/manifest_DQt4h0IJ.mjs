globalThis.process ??= {}; globalThis.process.env ??= {};
import { h as decodeKey } from './chunks/astro/server_DMHZTcBm.mjs';
import './chunks/astro-designed-error-pages_BueT6ffK.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_B9YO7_aK.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/user/rocha-brindes-astro/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/products/all","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/all\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"all","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/products/all.ts","pathname":"/api/products/all","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/products/cart/info","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/cart\\/info\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"cart","dynamic":false,"spread":false}],[{"content":"info","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/products/cart/info.ts","pathname":"/api/products/cart/info","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/products/categories","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/categories\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/products/categories.ts","pathname":"/api/products/categories","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/products/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/products/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/carrinho","isIndex":false,"type":"page","pattern":"^\\/carrinho\\/?$","segments":[[{"content":"carrinho","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/carrinho.astro","pathname":"/carrinho","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/checkout","isIndex":false,"type":"page","pattern":"^\\/checkout\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout.astro","pathname":"/checkout","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/contato","isIndex":false,"type":"page","pattern":"^\\/contato\\/?$","segments":[[{"content":"contato","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contato.astro","pathname":"/contato","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/finalizar-orcamento","isIndex":false,"type":"page","pattern":"^\\/finalizar-orcamento\\/?$","segments":[[{"content":"finalizar-orcamento","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/finalizar-orcamento.astro","pathname":"/finalizar-orcamento","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/obrigado","isIndex":false,"type":"page","pattern":"^\\/obrigado\\/?$","segments":[[{"content":"obrigado","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/obrigado.astro","pathname":"/obrigado","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/produto/[id]","isIndex":false,"type":"page","pattern":"^\\/produto\\/([^/]+?)\\/?$","segments":[[{"content":"produto","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/produto/[id].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/produtos","isIndex":false,"type":"page","pattern":"^\\/produtos\\/?$","segments":[[{"content":"produtos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/produtos.astro","pathname":"/produtos","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/sobre","isIndex":false,"type":"page","pattern":"^\\/sobre\\/?$","segments":[[{"content":"sobre","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sobre.astro","pathname":"/sobre","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BULYC2YF.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/user/rocha-brindes-astro/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/carrinho.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/checkout.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/contato.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/finalizar-orcamento.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/obrigado.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/produto/[id].astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/produtos.astro",{"propagation":"none","containsHead":true}],["/home/user/rocha-brindes-astro/src/pages/sobre.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/products/all@_@ts":"pages/api/products/all.astro.mjs","\u0000@astro-page:src/pages/api/products/cart/info@_@ts":"pages/api/products/cart/info.astro.mjs","\u0000@astro-page:src/pages/api/products/categories@_@ts":"pages/api/products/categories.astro.mjs","\u0000@astro-page:src/pages/api/products/[id]@_@ts":"pages/api/products/_id_.astro.mjs","\u0000@astro-page:src/pages/carrinho@_@astro":"pages/carrinho.astro.mjs","\u0000@astro-page:src/pages/checkout@_@astro":"pages/checkout.astro.mjs","\u0000@astro-page:src/pages/finalizar-orcamento@_@astro":"pages/finalizar-orcamento.astro.mjs","\u0000@astro-page:src/pages/obrigado@_@astro":"pages/obrigado.astro.mjs","\u0000@astro-page:src/pages/sobre@_@astro":"pages/sobre.astro.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:src/pages/produto/[id]@_@astro":"pages/produto/_id_.astro.mjs","\u0000@astro-page:src/pages/produtos@_@astro":"pages/produtos.astro.mjs","\u0000@astro-page:src/pages/contato@_@astro":"pages/contato.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_DQt4h0IJ.mjs","/home/user/rocha-brindes-astro/src/components/Admin":"_astro/Admin.DPRe9sQ8.js","/home/user/rocha-brindes-astro/src/components/checkout/CheckoutPageWrapper":"_astro/CheckoutPageWrapper.DM1IGqqS.js","/home/user/rocha-brindes-astro/src/components/checkout/ThankYouPageWrapper":"_astro/ThankYouPageWrapper.CARIEx5A.js","@astrojs/react/client.js":"_astro/client.Bkmpnrl_.js","/home/user/rocha-brindes-astro/src/features/catalog/components/admin/AdminDashboard.tsx":"_astro/AdminDashboard.987XIFCK.js","/home/user/rocha-brindes-astro/src/features/catalog/components/admin/LoginForm.tsx":"_astro/LoginForm.B-vfOZFL.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/admin.BULYC2YF.css","/favicon-dark.png","/favicon-light.png","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/renderers.mjs","/_astro/Admin.DPRe9sQ8.js","/_astro/AdminDashboard.987XIFCK.js","/_astro/CheckoutPageWrapper.DM1IGqqS.js","/_astro/LoginForm.B-vfOZFL.js","/_astro/Providers.DwJZh4qX.js","/_astro/ThankYouPageWrapper.CARIEx5A.js","/_astro/client.Bkmpnrl_.js","/_astro/createLucideIcon.DozWMnKj.js","/_astro/firebase.BuVAD2yK.js","/_astro/image.BnuFfM80.js","/_astro/index.Ba-IbuDT.js","/_worker.js/_astro/admin.BULYC2YF.css","/_worker.js/chunks/Layout_BiHM0FIQ.mjs","/_worker.js/chunks/_@astro-renderers_Cevu3oIO.mjs","/_worker.js/chunks/astro-designed-error-pages_BueT6ffK.mjs","/_worker.js/chunks/astro_DElbm3p1.mjs","/_worker.js/chunks/firebase_CF_0dyeA.mjs","/_worker.js/chunks/image_BuXG3seY.mjs","/_worker.js/chunks/index_DIQaqsfJ.mjs","/_worker.js/chunks/noop-middleware_B9YO7_aK.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/admin.astro.mjs","/_worker.js/pages/carrinho.astro.mjs","/_worker.js/pages/checkout.astro.mjs","/_worker.js/pages/contato.astro.mjs","/_worker.js/pages/finalizar-orcamento.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/obrigado.astro.mjs","/_worker.js/pages/produtos.astro.mjs","/_worker.js/pages/sobre.astro.mjs","/_worker.js/chunks/astro/env-setup_DUaZ-hTo.mjs","/_worker.js/chunks/astro/server_DMHZTcBm.mjs","/_worker.js/pages/produto/_id_.astro.mjs","/_worker.js/pages/api/products/_id_.astro.mjs","/_worker.js/pages/api/products/all.astro.mjs","/_worker.js/pages/api/products/categories.astro.mjs","/_worker.js/pages/api/products/cart/info.astro.mjs"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"+lfmGg/GAp/rj9pI0bDbqtbDFwhBhjVioFg6OiiFeZ8=","experimentalEnvGetSecretEnabled":false});

export { manifest };
