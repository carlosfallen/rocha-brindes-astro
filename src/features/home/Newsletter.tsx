// src/features/home/Newsletter.tsx
import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setMessage('Obrigado por se inscrever!')
    setEmail('')
    setLoading(false)
    
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <section className="py-16">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-white text-center shadow-card">
        <Mail size={48} className="mx-auto mb-4" />
        <h2 className="font-title font-bold text-3xl md:text-4xl mb-4">
          Receba Novidades
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Cadastre-se e receba ofertas exclusivas e novidades em primeira mão
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="flex-1 px-4 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-gray-100 text-primary font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={20} />
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
          {message && (
            <p className="mt-4 text-sm font-semibold">{message}</p>
          )}
        </form>
      </div>
    </section>
  )
}