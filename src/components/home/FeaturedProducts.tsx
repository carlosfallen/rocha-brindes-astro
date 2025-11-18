// src/components/home/FeaturedProducts.tsx
import { useCatalog } from '../../core/hooks/useCatalog'
import ProductCard from '../products/ProductCard'

export default function FeaturedProducts() {
  console.log('⭐ FeaturedProducts rendering')
  
  const { data, isLoading } = useCatalog()
  
  const featured = data?.products.filter(p => p.destaque).slice(0, 4) || []

  if (isLoading || !featured.length) return null

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-title font-bold text-dark mb-4">
          Produtos em Destaque
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Conheça nossa seleção especial de produtos premium para sua empresa
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <a 
          href="/produtos"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Ver todos os produtos
        </a>
      </div>
    </section>
  )
}