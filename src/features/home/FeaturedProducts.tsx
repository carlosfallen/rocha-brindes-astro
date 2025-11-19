// src/features/home/FeaturedProducts.tsx
import { useCatalog } from '../../core/hooks/useCatalog'
import ProductCard from '../catalog/components/ProductCard'
import { ArrowRight } from 'lucide-react'

export default function FeaturedProducts() {
  const { data, isLoading } = useCatalog(1000)
  const featured = data?.products.filter(p => p.destaque).slice(0, 6) || []

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!featured.length) return null

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-title font-bold text-3xl md:text-4xl text-dark">
          Produtos em Destaque
        </h2>
        <a 
          href="/produtos"
          className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
        >
          Ver todos
          <ArrowRight size={20} />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            linkToPage
          />
        ))}
      </div>
    </section>
  )
}