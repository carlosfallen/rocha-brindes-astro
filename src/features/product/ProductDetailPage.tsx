// src/features/product/ProductDetailPage.tsx
import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import { useCart } from '../../core/store/cart'
import { optimizeUrl } from '../../shared/utils/image'
import Layout from '../../components/Layout'
import Providers from '../../components/Providers'
import { ShoppingCart, Plus, Minus, Package, Tag, ArrowLeft, Share2 } from 'lucide-react'
import type { Product, ProductVariation } from '../../types/product'

interface Props {
  productId?: string
}

interface GalleryItem {
  label: string
  url: string
  variation?: ProductVariation
}

function ProductDetailContent({ productId: initialProductId }: Props) {
  const [productId, setProductId] = useState(initialProductId || '')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState(0)
  const { add } = useCart()

  useEffect(() => {
    if (!initialProductId && typeof window !== 'undefined') {
      const path = window.location.pathname
      const id = path.split('/').pop() || ''
      setProductId(decodeURIComponent(id))
    }
  }, [initialProductId])

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('ID não fornecido')
      
      const docSnap = await getDoc(doc(db, 'produtos', productId))
      if (!docSnap.exists()) {
        throw new Error('Produto não encontrado')
      }
      return { id: docSnap.id, ...docSnap.data() } as Product
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })

  const gallery = useMemo<GalleryItem[]>(() => {
    if (!product) return []
    const items: GalleryItem[] = []

    if (product.imagem_url) {
      items.push({ label: 'Principal', url: optimizeUrl(product.imagem_url, 'public') })
    }

    if (product.variacoes?.length) {
      product.variacoes.forEach(v => {
        if (v.imagem_url) {
          items.push({ 
            label: v.cor, 
            url: optimizeUrl(v.imagem_url, 'public'), 
            variation: v 
          })
        }
      })
    }

    return items
  }, [product])

  const active = gallery[activeIndex] || gallery[0]

  const handleAddToCart = () => {
    if (!product) return
    
    if (product.variacoes?.length && !selectedColor) {
      alert('Selecione uma cor antes de adicionar ao carrinho')
      return
    }

    const colorToUse = selectedColor || active?.variation?.cor

    for (let i = 0; i < quantity; i++) {
      add({ ...product, cor: colorToUse })
    }

    alert('Produto adicionado ao carrinho!')
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.nome,
          text: `Confira este produto: ${product?.nome}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Erro ao compartilhar:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
          <a 
            href="/produtos"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao catálogo
          </a>
        </div>
      </Layout>
    )
  }

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <a 
              href="/produtos"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Voltar ao catálogo
            </a>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              <div>
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4">
                  {active && (
                    <img
                      src={active.url}
                      alt={`${product.nome} - ${active.label}`}
                      className="w-full h-full object-contain p-8"
                      loading="eager"
                    />
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {gallery.map((item, idx) => (
                      <button
                        key={`${item.label}-${idx}`}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                          idx === activeIndex
                            ? 'ring-3 ring-primary scale-110 shadow-lg'
                            : 'ring-1 ring-gray-200 hover:ring-gray-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={optimizeUrl(item.url, 'thumbnail')} 
                          alt={item.label} 
                          className="w-full h-full object-cover" 
                          loading="lazy" 
                        />
                        {item.variation && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1">
                            <span className="text-[9px] text-white font-semibold block truncate text-center">
                              {item.variation.cor}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                      <Package className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <h1 className="font-title font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                        {product.nome}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Tag size={16} />
                        <span className="font-mono font-semibold">SKU: {product.id}</span>
                      </div>
                    </div>
                  </div>

                  {product.categorias?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.categorias.map(cat => (
                        <span 
                          key={cat} 
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-xs font-semibold text-primary"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {product.descricao && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-semibold text-sm text-gray-900 mb-2">Descrição</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {product.descricao}
                      </p>
                    </div>
                  )}

                  {product.variacoes?.length ? (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-bold text-gray-900">
                          Escolha a cor
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        {selectedColor && (
                          <span className="text-xs text-primary font-semibold">
                            ✓ {selectedColor}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {product.variacoes.map(v => {
                          const isActive = selectedColor === v.cor
                          return (
                            <button
                              key={v.cor}
                              type="button"
                              onClick={() => {
                                setSelectedColor(v.cor)
                                const targetIndex = gallery.findIndex(g => g.variation?.cor === v.cor)
                                if (targetIndex >= 0) setActiveIndex(targetIndex)
                              }}
                              className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:bg-primary/5'
                              }`}
                            >
                              {v.cor}
                            </button>
                          )
                        })}
                      </div>
                      {!selectedColor && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Selecione uma cor antes de adicionar
                        </p>
                      )}
                    </div>
                  ) : null}

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Quantidade
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                      >
                        <Plus size={18} />
                      </button>

                      <span className="text-sm text-gray-500 font-medium">
                        {quantity === 1 ? 'un.' : 'uns.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleAddToCart}
                    className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                  </button>
                  <a
                    href="/produtos"
                    className="block w-full text-center py-2.5 rounded-xl border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Continuar Comprando
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function ProductDetailPage({ productId }: Props) {
  return (
    <Providers>
      <ProductDetailContent productId={productId} />
    </Providers>
  )
}