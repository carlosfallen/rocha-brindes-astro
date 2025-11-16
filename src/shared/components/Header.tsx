// src/shared/components/Header.tsx
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../core/store/cart'
import { useCatalog } from '../../core/hooks/useCatalog'
import { optimizeUrl } from '../../shared/utils/image'

export default function Header() {
  const { count, toggle } = useCart()
  const { data, isLoading } = useCatalog()
  
  const logoId = data?.layout.logo
  const logoUrl = logoId ? optimizeUrl(logoId, 'public') : ''

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {isLoading || !logoUrl ? (
            <div className="h-14 md:h-16 w-64 bg-gray-200 animate-pulse rounded" />
          ) : (
            <img 
              src={logoUrl} 
              alt="Rocha Brindes" 
              className="h-14 md:h-16 w-auto object-contain" 
              loading="eager"
            />
          )}
          
          <button 
            onClick={toggle} 
            className="relative p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" 
            aria-label="Abrir carrinho"
          >
            <ShoppingCart size={24} strokeWidth={2.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-dark font-bold text-xs min-w-[24px] h-[24px] flex items-center justify-center rounded-full border-3 border-white shadow-md">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}