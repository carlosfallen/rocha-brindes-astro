import type { APIRoute } from "astro"
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../../core/lib/firebase'

export const GET: APIRoute = async () => {
  try {
    const snap = await getDocs(query(collection(db, 'produtos'), orderBy('createdAt', 'desc')))
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }))

    return new Response(JSON.stringify({
      products
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      products: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
