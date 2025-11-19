import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params }) => {
  const id = params.id
  const product = await import.meta.env.KV_PRODUCTS.get(`product:${id}`, "json")

  if (!product) {
    return new Response(JSON.stringify({ error: "Produto não encontrado" }), { status: 404 })
  }

  return new Response(JSON.stringify(product), {
    headers: { "Content-Type": "application/json" }
  })
}
