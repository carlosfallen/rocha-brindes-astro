// src/shared/components/Footer.tsx
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-dark to-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-title font-bold text-xl mb-4">Sobre Nós</h3>
            <p className="text-gray-300 leading-relaxed">
              Oferecemos os melhores produtos com qualidade e atendimento excepcional.
            </p>
          </div>

          <div>
            <h3 className="font-title font-bold text-xl mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="flex-shrink-0" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="flex-shrink-0" />
                <span>contato@empresa.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="flex-shrink-0" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-title font-bold text-xl mb-4">Horário</h3>
            <div className="space-y-2 text-gray-300">
              <p>Segunda a Sexta: 8h às 18h</p>
              <p>Sábado: 8h às 12h</p>
              <p>Domingo: Fechado</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}