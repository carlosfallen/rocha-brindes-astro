import type { APIRoute } from "astro"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../core/lib/firebase'

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id
    if (!id) {
      return new Response(JSON.stringify({ error: "ID não fornecido" }), { status: 400 })
    }

    const docRef = doc(db, 'produtos', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Produto não encontrado" }), { status: 404 })
    }

    return new Response(JSON.stringify({ id: docSnap.id, ...docSnap.data() }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao buscar produto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
