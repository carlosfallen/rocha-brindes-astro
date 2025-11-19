// src/features/catalog/components/ProductGrid.tsx
import { memo } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '../../../types/product'

interface Props {
  products: Product[]
  linkToPage?: boolean
}

export default memo(function ProductGrid({ products, linkToPage = false }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          linkToPage={linkToPage}
        />
      ))}
    </div>
  )
})