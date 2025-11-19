// src/core/services/catalog.ts
import { db } from '../lib/firebase'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc
} from 'firebase/firestore'
import type { Product, Category } from '../../types/product'

export interface LayoutConfig {
  logo?: string
  banners: Array<{ url: string; alt?: string }>
  promotions: string[]
  popups: string[]
}

export interface CatalogData {
  products: Product[]
  categories: Category[]
  layout: LayoutConfig
}

export async function getCatalog(productLimit = 6): Promise<CatalogData> {
  try {
    const [productsSnap, categoriesSnap, layoutDoc] = await Promise.all([
      getDocs(
        query(
          collection(db, 'produtos'),
          orderBy('createdAt', 'desc'),
          limit(productLimit)
        )
      ),
      getDocs(query(collection(db, 'categorias'), orderBy('nome'))),
      getDoc(doc(db, 'config', 'layout'))
    ])

    const products = productsSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as Product[]

    const categories = categoriesSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as Category[]

    const layoutData = layoutDoc.exists() ? layoutDoc.data() : {}

    const banners = Array.isArray(layoutData.banners)
      ? layoutData.banners.map((b: any) =>
          typeof b === 'string'
            ? { url: b, alt: 'Banner' }
            : { url: b.url || b, alt: b.alt || 'Banner' }
        )
      : []

    const layout: LayoutConfig = {
      logo: layoutData.logo || '',
      banners,
      promotions: layoutData.promotions || [],
      popups: layoutData.popups || []
    }

    return { products, categories, layout }
  } catch (error) {
    console.error('Error loading catalog:', error)
    throw error
  }
}
