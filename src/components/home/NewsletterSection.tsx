// src/components/home/NewsletterSection.tsx
import { useState } from 'react'
import { Send } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica de envio do email
    setMessage('Obrigado por se inscrever! Em breve você receberá novidades.')
    setEmail('')
    
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-title font-bold mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-white/90 mb-8">
            Assine nossa newsletter e receba descontos exclusivos, novos produtos e ofertas especiais
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="flex-1 px-6 py-4 rounded-xl text-dark focus:outline-none focus:ring-4 focus:ring-white/30"
              required
            />
            <button
              type="submit"
              className="bg-accent hover:opacity-90 text-dark font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Assinar
            </button>
          </form>

          {message && (
            <p className="mt-4 text-accent font-semibold">{message}</p>
          )}
        </div>
      </div>
    </section>
  )
}