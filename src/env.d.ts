/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly KV_PRODUCTS: KVNamespace
  readonly KV_PRODUCTS_ALL: KVNamespace
  readonly KV_CATEGORIES: KVNamespace
  readonly KV_CARTS: KVNamespace
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
