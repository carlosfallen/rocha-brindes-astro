// src/components/product/ProductDetail.tsx
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import { useCart } from '../../core/store/cart'
import { optimizeUrl } from '../../shared/utils/image'
import { ShoppingCart, Plus, Minus, Package, Tag, Star } from 'lucide-react'
import type { Product, ProductVariation } from '../../types/product'

interface GalleryItem {
  label: string
  url: string
  variation?: ProductVariation
}

export default function ProductDetail() {
  const params = useParams()
  const productId = params.id || window.location.pathname.split('/').pop()
  const { add } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    if (!productId) return
    
    try {
      const docSnap = await getDoc(doc(db, 'produtos', productId))
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product)
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
    } finally {
      setLoading(false)
    }
  }

  const gallery = useMemo<GalleryItem[]>(() => {
    if (!product) return []
    
    const items: GalleryItem[] = []

    if (product.imagem_url) {
      items.push({ label: 'Principal', url: optimizeUrl(product.imagem_url, 'public') })
    }

    if (product.variacoes?.length) {
      product.variacoes.forEach(v => {
        if (v.imagem_url) {
          items.push({ label: v.cor, url: optimizeUrl(v.imagem_url, 'public'), variation: v })
        }
      })
    }

    return items
  }, [product])

  const active = gallery[activeIndex] || gallery[0]

  const handleAdd = () => {
    if (!product) return
    
    if (product.variacoes?.length && !selectedColor) {
      alert('Selecione uma cor antes de adicionar ao orçamento')
      return
    }

    const colorToUse = selectedColor || active?.variation?.cor

    for (let i = 0; i < quantity; i++) {
      add({ ...product, cor: colorToUse })
    }
    
    window.location.href = '/carrinho'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
        <a href="/produtos" className="text-primary hover:underline">Voltar para produtos</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <a href="/" className="hover:text-primary">Início</a>
        <span className="mx-2">/</span>
        <a href="/produtos" className="hover:text-primary">Produtos</a>
        <span className="mx-2">/</span>
        <span className="text-dark font-semibold">{product.nome}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Galeria de Imagens */}
        <div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
            {active && (
              <img
                src={active.url}
                alt={`${product.nome} - ${active.label}`}
                className="w-full h-full object-contain p-8"
              />
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                    idx === activeIndex ? 'ring-3 ring-primary scale-110' : 'ring-1 ring-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={optimizeUrl(item.url, 'thumbnail')} alt={item.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Package className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-title font-bold text-dark mb-2">{product.nome}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Tag size={16} />
                <span className="font-mono font-semibold">SKU: {product.id}</span>
              </div>
            </div>
          </div>

          {product.categorias?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.categorias.map(cat => (
                <span key={cat} className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {product.descricao && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">{product.descricao}</p>
            </div>
          )}

          {product.variacoes?.length ? (
            <div className="mb-6">
              <label className="block text-sm font-bold text-dark mb-3">
                Escolha a cor <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variacoes.map(v => (
                  <button
                    key={v.cor}
                    onClick={() => {
                      setSelectedColor(v.cor)
                      const targetIndex = gallery.findIndex(g => g.variation?.cor === v.cor)
                      if (targetIndex >= 0) setActiveIndex(targetIndex)
                    }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedColor === v.cor
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {v.cor}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mb-6">
            <label className="block text-sm font-bold text-dark mb-3">Quantidade</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <Minus size={18} />
              </button>
              
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center px-3 py-2.5 bg-gray-50 text-gray-900 text-lg font-bold rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none"
              />
              
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <ShoppingCart size={20} />
            Adicionar ao Orçamento
          </button>
        </div>
      </div>

      {/* Seção de Avaliações (placeholder) */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-title font-bold text-dark mb-8">Avaliações</h2>
        
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Star size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Seja o primeiro a avaliar este produto</p>
        </div>
      </div>

      {/* Produtos Relacionados (placeholder) */}
      <div className="mt-16">
        <h2 className="text-2xl font-title font-bold text-dark mb-8">Produtos Relacionados</h2>
        <p className="text-gray-600">Em breve...</p>
      </div>
    </div>
  )
}