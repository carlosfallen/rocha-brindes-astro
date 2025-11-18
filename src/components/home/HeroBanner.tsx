// src/components/home/HeroBanner.tsx
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCatalog } from '../../core/hooks/useCatalog'
import { optimizeUrl } from '../../shared/utils/image'

export default function HeroBanner() {
  console.log('🎯 HeroBanner rendering')
  
  const { data } = useCatalog()
  const [current, setCurrent] = useState(0)
  
  const banners = data?.layout.banners || []

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gray-200 shadow-card group">
        {banners.map((banner, i) => (
          <div 
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={optimizeUrl(banner.url, 'public')}
              alt={banner.alt || `Banner ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrent(i => (i === 0 ? banners.length - 1 : i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={() => setCurrent(i => (i + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'bg-white w-8' : 'bg-white/60 w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}