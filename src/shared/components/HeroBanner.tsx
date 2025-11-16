// src/shared/components/HeroBanner.tsx
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  const goToPrevious = () => setCurrent(i => (i === 0 ? banners.length - 1 : i - 1))
  const goToNext = () => setCurrent(i => (i + 1) % banners.length)

  return (
    <section className="mb-12 relative h-48 md:h-72 lg:h-96 rounded-3xl overflow-hidden bg-gray-200 shadow-card group">
      {banners.map((banner, i) => {
        const imageUrl = optimizeUrl(banner.url, 'public')
        return (
          <div 
            key={banner.url} 
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={imageUrl}
              alt={banner.alt || `Banner ${i + 1}`} 
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        )
      })}
      
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
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
    </section>
  )
}