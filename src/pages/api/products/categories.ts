import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
  const cats = await import.meta.env.KV_CATEGORIES.get("categories", "json")

  return new Response(JSON.stringify({
    categories: cats || []
  }), {
    headers: { "Content-Type": "application/json" }
  })
}
