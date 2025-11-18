// src/shared/components/Header.tsx
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../core/store/cart'
import { useCatalog } from '../../core/hooks/useCatalog'
import { optimizeUrl } from '../../shared/utils/image'

export default function Header() {
  console.log('📌 Header rendering') // LOG
  
  const { count } = useCart()
  const { data, isLoading } = useCatalog()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  console.log('📌 Header - catalog data:', !!data, 'loading:', isLoading) // LOG
  
  const logoId = data?.layout.logo
  const logoUrl = logoId ? optimizeUrl(logoId, 'thumbnail') : ''

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            {isLoading || !logoUrl ? (
              <div className="h-10 sm:h-14 md:h-16 w-32 sm:w-48 md:w-64 bg-gray-200 animate-pulse rounded" />
            ) : (
              <img 
                src={logoUrl} 
                alt="88 Brindes" 
                className="h-8 sm:h-10 md:h-12 w-auto object-contain" 
                loading="eager"
              />
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary font-semibold transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/carrinho"
              className="relative p-2.5 sm:p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-accent text-dark font-bold text-[10px] sm:text-xs min-w-[20px] sm:min-w-[24px] h-[20px] sm:h-[24px] flex items-center justify-center rounded-full border-2 sm:border-3 border-white shadow-md">
                  {count}
                </span>
              )}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary font-semibold rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}