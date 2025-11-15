// src/shared/components/HeroBanner.tsx
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from './Image'
import { optimizeUrl } from '../utils/image'

interface Banner {
  url: string
  alt?: string
}

interface Props {
  banners: Banner[]
}

export default function HeroBanner({ banners }: Props) {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  const goToPrevious = () => {
    setCurrent(i => (i === 0 ? banners.length - 1 : i - 1))
  }

  const goToNext = () => {
    setCurrent(i => (i + 1) % banners.length)
  }

  return (
    <section className="mb-12 relative h-48 md:h-72 lg:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-card group" aria-label="Banners promocionais">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {banners.map((banner, i) => {
        const imageUrl = optimizeUrl(banner.url, 'public')
        return (
          <div 
            key={banner.url} 
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'} ${!loaded ? 'invisible' : ''}`}
            aria-hidden={i !== current}
          >
            <img 
              src={imageUrl}
              alt={banner.alt || `Promoção ${i + 1}`} 
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              onLoad={() => i === 0 && setLoaded(true)}
            />
          </div>
        )
      })}
      
      {loaded && banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Banner anterior"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Próximo banner"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full" role="tablist" aria-label="Navegação de banners">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-white w-8' : 'bg-white/60 w-2 hover:bg-white/80'
                }`}
                aria-label={`Ir para banner ${i + 1}`}
                aria-selected={i === current}
                role="tab"
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}