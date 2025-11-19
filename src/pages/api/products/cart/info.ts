import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
  const cart = await request.json()

  const items = []

  for (const item of cart) {
    const product = await import.meta.env.KV_PRODUCTS.get(`product:${item.id}`, "json")

    if (product) {
      items.push({
        ...product,
        qty: item.qty,
        cor: item.cor ?? null
      })
    }
  }

  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" }
  })
}
