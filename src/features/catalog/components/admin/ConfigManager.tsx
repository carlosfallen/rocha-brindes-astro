// src/features/catalog/components/admin/ConfigManager.tsx
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { Phone, Save } from 'lucide-react'

interface ConfigData {
  whatsappNumber: string
  companyName: string
  companyEmail?: string
  companyAddress?: string
}

export default function ConfigManager() {
  const [config, setConfig] = useState<ConfigData>({
    whatsappNumber: '',
    companyName: '',
    companyEmail: '',
    companyAddress: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoadingData(true)
    try {
      const docSnap = await getDoc(doc(db, 'config', 'general'))
if (docSnap.exists()) {
  const data = docSnap.data() as ConfigData

  // remove o 55 se existir
  const num = data.whatsappNumber?.replace(/\D/g, '') || ''
  const withoutPrefix = num.startsWith('55') ? num.slice(2) : num

  // formata de volta para exibição
  const formatted = formatWhatsApp(withoutPrefix)

  setConfig({
    whatsappNumber: formatted,
    companyName: data.companyName || '',
    companyEmail: data.companyEmail || '',
    companyAddress: data.companyAddress || ''
  })
}

    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      setMessage('Erro ao carregar configurações')
    } finally {
      setLoadingData(false)
    }
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value)
    setConfig({ ...config, whatsappNumber: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
let numbersOnly = config.whatsappNumber.replace(/\D/g, '')

// (DDD + número) → mínimo 10 dígitos, máximo 11
if (numbersOnly.length < 10 || numbersOnly.length > 11) {
  setMessage('Número de WhatsApp inválido')
  setLoading(false)
  return
}

// sempre adiciona 55 ao salvar
const numberToSave = `55${numbersOnly}`

await setDoc(doc(db, 'config', 'general'), {
  whatsappNumber: numberToSave,

        companyName: config.companyName,
        companyEmail: config.companyEmail || '',
        companyAddress: config.companyAddress || '',
        updatedAt: new Date().toISOString()
      })

      setMessage('Configurações salvas com sucesso!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      setMessage('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Phone className="text-primary" size={24} />
        <h2 className="text-xl font-title font-bold">Configurações Gerais</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> O número de WhatsApp configurado aqui será usado para receber todos os pedidos do catálogo.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Número do WhatsApp *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={handleWhatsAppChange}
              placeholder="(00) 00000-0000"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Digite apenas números. Ex: 5589994333316
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Nome da Empresa *
          </label>
          <input
            type="text"
            value={config.companyName}
            onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
            placeholder="Rocha Brindes"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            E-mail da Empresa
          </label>
          <input
            type="email"
            value={config.companyEmail}
            onChange={(e) => setConfig({ ...config, companyEmail: e.target.value })}
            placeholder="contato@rochabrindes.com.br"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Endereço da Empresa
          </label>
          <textarea
            value={config.companyAddress}
            onChange={(e) => setConfig({ ...config, companyAddress: e.target.value })}
            placeholder="Rua Exemplo, 123 - Bairro - Cidade - Estado"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-center font-semibold ${
            message.includes('sucesso') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Configurações
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-sm mb-2">Prévia do número configurado:</h3>
        <p className="text-lg font-mono text-primary">
          {config.whatsappNumber || '(Nenhum número configurado)'}
        </p>
        {config.whatsappNumber && (
          <p className="text-xs text-gray-500 mt-1">
            Link: https://wa.me/{config.whatsappNumber.replace(/\D/g, '')}
          </p>
        )}
      </div>
    </div>
  )
}