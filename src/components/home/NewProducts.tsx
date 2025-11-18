// src/components/home/NewProducts.tsx
import { useCatalog } from '../../core/hooks/useCatalog'
import ProductCard from '../products/ProductCard'

export default function NewProducts() {
  const { data, isLoading } = useCatalog()
  
  const newProducts = data?.products.slice(0, 8) || []

  if (isLoading || !newProducts.length) return null

  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-title font-bold text-dark mb-4">
          Lançamentos
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Confira os produtos mais recentes do nosso catálogo
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}