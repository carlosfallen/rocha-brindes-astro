// src/components/products/ProductCard.tsx
import { ShoppingCart, Eye } from 'lucide-react'
import { optimizeUrl } from '../../shared/utils/image'
import { useCart } from '../../core/store/cart'
import type { Product } from '../../types/product'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { add } = useCart()
  
  const imgId = product.thumb_url || product.imagem_url
  const imgUrl = imgId ? optimizeUrl(imgId, 'thumbnail') : ''

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <a href={`/produto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={product.nome}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm font-medium">Sem imagem</span>
            </div>
          )}
          
          {product.variacoes && product.variacoes.length > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-accent text-dark px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                {product.variacoes.length} {product.variacoes.length === 1 ? 'cor' : 'cores'}
              </span>
            </div>
          )}

          {product.destaque && (
            <div className="absolute top-3 right-3">
              <span className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                Destaque
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-title font-bold text-lg mb-2 line-clamp-2 min-h-[56px] text-dark group-hover:text-primary transition-colors">
            {product.nome}
          </h3>
          <p className="text-sm text-gray-500 font-medium mb-4">Código: {product.id}</p>
        </div>
      </a>
      
      <div className="px-5 pb-5">
        <button 
          onClick={() => add(product)}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all"
        >
          <ShoppingCart size={18} />
          Adicionar ao Orçamento
        </button>
      </div>
    </article>
  )
}