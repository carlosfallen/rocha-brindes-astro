// src/components/checkout/ThankYouPage.tsx
import { Check, Home, ShoppingBag } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={48} className="text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-title font-bold text-dark mb-4">
          Obrigado pelo seu contato!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Seu orçamento foi enviado com sucesso para nosso WhatsApp. Nossa equipe entrará em contato em breve com os melhores preços e condições especiais para você.
        </p>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-dark mb-2">O que acontece agora?</h2>
          <ul className="text-sm text-gray-700 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Nossa equipe comercial analisará seu pedido</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Você receberá um orçamento personalizado via WhatsApp</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Poderemos discutir detalhes de personalização e prazos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Faremos o melhor negócio para sua empresa</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <Home size={20} />
            Voltar à página inicial
          </a>
          
          <a
            href="/produtos"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <ShoppingBag size={20} />
            Continuar comprando
          </a>
        </div>
      </div>
    </div>
  )
}