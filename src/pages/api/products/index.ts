import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
  const list = await import.meta.env.KV_PRODUCTS_ALL.get("products_all", "json")

  return new Response(JSON.stringify({
    products: list || []
  }), {
    headers: { "Content-Type": "application/json" }
  })
}
