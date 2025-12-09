// src/core/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Category } from '../../types/product'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const snap = await getDocs(query(collection(db, 'categorias'), orderBy('nome')))
        const categories = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Category[]
        return categories
      } catch (error) {
        console.error('Error loading categories:', error)
        throw error
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
