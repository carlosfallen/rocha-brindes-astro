// src/shared/components/Footer.tsx (atualizado - sem hooks)
import { Phone, MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Endereço */}
          <div>
            <h3 className="font-title font-bold text-lg mb-4">Endereço</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>Av. Rio Verde, 8250 - Quadra 75, Lote 09 - Jd. Presidente - Goiânia - GO - 74353-520</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:6240168888" className="hover:text-accent transition-colors">(62) 4016-8888</a>
              </li>
            </ul>
          </div>

          {/* Ajuda e Informações */}
          <div>
            <h3 className="font-title font-bold text-lg mb-4">Ajuda & Informações</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/institucional/termos" className="hover:text-accent transition-colors">Termos e condições</a></li>
              <li><a href="/produtos" className="hover:text-accent transition-colors">Produtos</a></li>
            </ul>
          </div>

          {/* Sobre nós */}
          <div>
            <h3 className="font-title font-bold text-lg mb-4">Sobre nós</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/institucional/faq" className="hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="/contato" className="hover:text-accent transition-colors">Fale conosco</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-title font-bold text-lg mb-4">Fique por dentro</h3>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="flex-1 px-3 py-2 rounded-lg text-dark text-sm"
              />
              <button 
                type="submit"
                className="bg-accent text-dark px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                →
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm">
          <p>© 2025 88 Brindes. Todos os direitos reservados.</p>
          <p className="mt-2">
            <a href="https://ajungsolutions.com/" target="_blank" className="hover:text-accent transition-colors">
              Desenvolvido por A. Jung
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}