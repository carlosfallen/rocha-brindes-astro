// src/features/catalog/components/ProductCard.tsx
import { memo } from 'react'
import { ShoppingCart, Eye } from 'lucide-react'
import { optimizeUrl } from '../../../shared/utils/image'
import { useCart } from '../../../core/store/cart'
import type { Product } from '../../../types/product'

interface Props {
  product: Product
  linkToPage?: boolean
}

export default memo(function ProductCard({ product, linkToPage = false }: Props) {
  const { add } = useCart()
  const imgId = product.thumb_url || product.imagem_url || product.variacoes?.[0]?.thumb_url
  const imgUrl = imgId ? optimizeUrl(imgId, 'thumbnail') : ''

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    add(product)
  }

  const CardContent = () => (
    <>
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
            <span className="bg-accent text-dark backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              {product.variacoes.length} {product.variacoes.length === 1 ? 'cor' : 'cores'}
            </span>
          </div>
        )}

        {product.destaque && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
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

        <div className="flex gap-2">
          {linkToPage ? (
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <ShoppingCart size={16} />
              Adicionar
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <ShoppingCart size={16} />
              Adicionar
            </button>
          )}
        </div>
      </div>
    </>
  )

  if (linkToPage) {
    return (
      <a 
        href={`/produto/${product.id}`}
        className="block group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
      >
        <CardContent />
      </a>
    )
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
      <CardContent />
    </article>
  )
})