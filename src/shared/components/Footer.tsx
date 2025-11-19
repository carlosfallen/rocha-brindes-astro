// src/shared/components/Footer.tsx
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-title font-bold text-xl mb-4">Rocha Brindes</h3>
            <p className="text-sm text-gray-300">
              Soluções personalizadas em brindes corporativos
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/produtos" className="text-sm text-gray-300 hover:text-white transition-colors">Catálogo</a></li>
              <li><a href="/sobre" className="text-sm text-gray-300 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="/contato" className="text-sm text-gray-300 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>(89) 99433-3316</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span>contato@rochabrindes.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Sucupira do Riachão - MA</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Rocha Brindes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}