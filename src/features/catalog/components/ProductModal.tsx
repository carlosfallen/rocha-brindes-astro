// src/features/catalog/components/ProductModal.tsx
import { useState, useMemo, memo } from 'react'
import { X, ShoppingCart, Plus, Minus, Package, Tag } from 'lucide-react'
import { optimizeUrl } from '../../../shared/utils/image'
import { useCart } from '../../../core/store/cart'
import type { Product, ProductVariation } from '../../../types/product'

interface Props {
  product: Product
  onClose: () => void
}

interface GalleryItem {
  label: string
  url: string
  variation?: ProductVariation 
}

export default memo(function ProductModal({ product, onClose }: Props) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')

  const gallery = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = []

    if (product.imagem_url) {
      items.push({ label: 'Principal', url: optimizeUrl(product.imagem_url, 'public') })
    }

    if (product.variacoes?.length) {
      product.variacoes.forEach(v => {
        if (v.imagem_url) {
          items.push({ label: v.cor, url: optimizeUrl(v.imagem_url, 'thumbnail'), variation: v })
        }
      })
    }

    if (!items.length && product.imagens_urls?.length) {
      product.imagens_urls.forEach((url, i) => {
        items.push({ label: i === 0 ? 'Imagem' : `Imagem ${i + 1}`, url: optimizeUrl(url, 'thumbnail') })
      })
    }

    return items
  }, [product])

  const [activeIndex, setActiveIndex] = useState(0)
  const active = gallery[activeIndex] || gallery[0]

  const handleAdd = () => {
    if (product.variacoes?.length && !selectedColor) {
      alert('Selecione uma cor antes de adicionar ao orçamento')
      return
    }

    const colorToUse = selectedColor || active?.variation?.cor

    for (let i = 0; i < quantity; i++) {
      add({ ...product, cor: colorToUse })
    }
    onClose()
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setQuantity(Math.max(1, value))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-2.5 z-10 hover:bg-white shadow-lg transition-all"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
          {/* Galeria de Imagens */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col max-h-[95vh]">
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {active && (
                <img
                  src={active.url}
                  alt={`${product.nome} - ${active.label}`}
                  className="w-full h-full object-cover drop-shadow-xl"
                  loading="eager"
                />
              )}
            </div>

            {/* Miniaturas */}
            {gallery.length > 1 && (
              <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 flex gap-2 overflow-x-auto flex-shrink-0">
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
                    title={item.label}
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

          {/* Informações do Produto */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                    <Package className="text-primary" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-title font-bold text-xl md:text-2xl text-gray-900 mb-2 break-words leading-tight">
                      {product.nome}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Tag size={16} className="flex-shrink-0" />
                      <span className="font-mono font-semibold break-all">SKU: {product.id}</span>
                    </div>
                  </div>
                </div>

                {/* Categorias */}
                {product.categorias?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.categorias.map(cat => (
                      <span key={cat} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-xs font-semibold text-primary">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Descrição */}
              {product.descricao && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-line break-words leading-relaxed">
                    {product.descricao}
                  </p>
                </div>
              )}

              {/* Seleção de Cores */}
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

                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {product.variacoes?.map(v => {
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
                          className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all break-words text-left ${
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
                  {product.variacoes.length > 0 && !selectedColor && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Selecione uma cor antes de adicionar
                    </p>
                  )}
                </div>
              ) : null}

              {/* Quantidade */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Quantidade
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex-shrink-0"
                  >
                    <Minus size={18} className="text-gray-700" />
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center px-3 py-2.5 bg-gray-50 text-gray-900 text-lg font-bold rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex-shrink-0"
                  >
                    <Plus size={18} className="text-gray-700" />
                  </button>

                  <span className="text-sm text-gray-500 font-medium">
                    {quantity === 1 ? 'un.' : 'uns.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer com Botões */}
            <div className="border-t border-gray-200 bg-white p-4 md:p-6 space-y-2.5 flex-shrink-0">
              <button
                onClick={handleAdd}
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                <ShoppingCart size={20} />
                <span className="text-sm md:text-base">Adicionar ao Orçamento</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})