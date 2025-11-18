// src/components/cart/CartPage.tsx
import { useState } from 'react'
import { useCart } from '../../core/store/cart'
import { optimizeUrl } from '../../shared/utils/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, remove, updateQuantity, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-title font-bold text-dark mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-8">Adicione produtos para solicitar um orçamento</p>
          <a
            href="/produtos"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            Ver Produtos
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-title font-bold text-dark mb-2">Meu Carrinho</h1>
        <p className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            let imgId = item.thumb_url || item.imagem_url
            
            if (item.cor && item.variacoes?.length) {
              const colorVariation = item.variacoes.find(v => v.cor === item.cor)
              if (colorVariation) {
                imgId = colorVariation.thumb_url || colorVariation.imagem_url || imgId
              }
            }
            
            const imgUrl = imgId ? optimizeUrl(imgId, 'thumbnail') : ''

            return (
              <div key={`${item.id}-${item.cor || 'default'}`} className="bg-white rounded-xl shadow-card p-6">
                <div className="flex gap-6">
                  <a href={`/produto/${item.id}`} className="flex-shrink-0">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.nome}
                        className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400">Sem img</span>
                      </div>
                    )}
                  </a>

                  <div className="flex-1">
                    <a href={`/produto/${item.id}`}>
                      <h3 className="font-semibold text-lg text-dark hover:text-primary transition-colors mb-2">
                        {item.nome}
                      </h3>
                    </a>
                    <p className="text-sm text-gray-500 mb-3">Código: {item.id}</p>
                    
                    {item.cor && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-600">Cor:</span>
                        <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                          {item.cor}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center px-3 py-2 bg-gray-50 text-gray-900 font-bold rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                      />
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(item.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )
          })}

          <button
            onClick={clear}
            className="w-full py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all border-2 border-red-200"
          >
            Limpar carrinho
          </button>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
            <h2 className="text-xl font-title font-bold text-dark mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Total de itens:</span>
                <span className="font-bold text-dark">{totalItems}</span>
              </div>
            </div>

            <a
              href="/finalizar-orcamento"
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Solicitar Orçamento
              <ArrowRight size={20} />
            </a>

            <a
              href="/produtos"
              className="block w-full text-center py-3 mt-3 text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Continuar comprando
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}