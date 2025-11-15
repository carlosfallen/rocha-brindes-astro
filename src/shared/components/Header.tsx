// src/shared/components/Header.tsx
import { useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../core/store/cart'
import { useCatalog } from '../../core/hooks/useCatalog'
import { optimizeUrl, preloadImage } from '../../shared/utils/image'

export default function Header() {
  const { count, toggle } = useCart()
  const { data } = useCatalog()
  
  const logoId = data?.layout.logo
  const logoUrl = logoId ? optimizeUrl(logoId, 'public') : '/assets/images/logo-rocha-brindes.png'

  useEffect(() => {
    if (logoId) preloadImage(logoId, 'high')
  }, [logoId])

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <img 
            src={logoUrl} 
            alt="Rocha Brindes - Catálogo de produtos personalizados" 
            width={257} 
            height={64} 
            className="h-14 md:h-16 w-auto object-contain" 
            fetchPriority="high" 
            decoding="async" 
          />
          
          <button 
            onClick={toggle} 
            className="relative p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" 
            aria-label="Abrir carrinho de orçamento"
          >
            <ShoppingCart size={24} strokeWidth={2.5} />
            {count > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-accent text-dark font-bold text-xs min-w-[24px] h-[24px] flex items-center justify-center rounded-full border-3 border-white shadow-md animate-pulse"
                aria-label={`${count} ${count === 1 ? 'item' : 'itens'} no carrinho`}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}