// src/components/checkout/CheckoutPage.tsx
import { useState, useEffect } from 'react'
import { useCart } from '../../core/store/cart'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import Providers from '../Providers'
import { optimizeUrl } from '../../shared/utils/image'
import { Send, ArrowLeft } from 'lucide-react'

function CheckoutContent() {
  const { items, clear } = useCart()
  const [whatsappNumber, setWhatsappNumber] = useState('5562992485958')
  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    address: '',
    cep: '',
    obs: ''
  })

  useEffect(() => {
    loadWhatsAppNumber()
  }, [])

  const loadWhatsAppNumber = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'general'))
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar contato:', error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h2>
        <a href="/produtos" className="text-primary hover:underline">Voltar para produtos</a>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let message = `*Orçamento - 88 Brindes*\n\n`
    message += `*Cliente:* ${formData.name}\n`
    message += `*Contato:* ${formData.doc}\n`
    message += `*Endereço:* ${formData.address}\n`
    message += `*CEP:* ${formData.cep}\n\n`
    message += `*Produtos:*\n`
    
    items.forEach(item => {
      message += `• ${item.nome} (Cód: ${item.id})`
      if (item.cor) message += ` - Cor: ${item.cor}`
      message += ` - Qtd: ${item.quantity}\n`
    })
    
    if (formData.obs) {
      message += `\n*Observações:* ${formData.obs}`
    }

    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message.trim())}`

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = whatsappUrl
    } else {
      window.open(whatsappUrl, '_blank')
    }
    
    clear()
    window.location.href = '/obrigado'
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <a href="/carrinho" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={18} />
        Voltar ao carrinho
      </a>

      <h1 className="text-3xl md:text-4xl font-title font-bold text-dark mb-8">Finalizar Orçamento</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nome completo *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">CPF/CNPJ *</label>
              <input
                type="text"
                value={formData.doc}
                onChange={(e) => setFormData({ ...formData, doc: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Endereço completo *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">CEP *</label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Observações (opcional)</label>
              <textarea
                value={formData.obs}
                onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Enviar para WhatsApp
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
            <h2 className="text-xl font-title font-bold text-dark mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
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
                  <div key={`${item.id}-${item.cor || 'default'}`} className="flex gap-3 pb-4 border-b border-gray-200">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.nome}
                        className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400">Sem img</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.nome}</h3>
                      {item.cor && (
                        <p className="text-xs text-gray-500 mb-1">Cor: {item.cor}</p>
                      )}
                      <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Total de itens:</span>
                <span className="font-bold text-dark">{totalItems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Providers>
      <CheckoutContent />
    </Providers>
  )
}