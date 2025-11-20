// src/shared/components/PopularCategories.tsx
import { memo } from 'react'
import { optimizeUrl } from '../utils/image'
import type { Category } from '../../types/product'

interface Props {
  categories: Category[]
  onSelect: (name: string) => void
}

export default memo(function PopularCategories({ categories, onSelect }: Props) {
  if (!categories.length) return null

  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-title font-bold text-dark mb-8 text-center">
        Categorias Populares
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map(cat => {
          const imageUrl = cat.imagePath ? optimizeUrl(cat.imagePath, 'thumbnail') : ''
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.nome)}
              className="relative h-36 md:h-44 rounded-2xl overflow-hidden group bg-gray-200 shadow-card hover:shadow-card-hover transition-all transform hover:-translate-y-1"
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={cat.nome} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent group-hover:from-primary/80 transition-all" />

              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white font-title font-bold text-base md:text-lg drop-shadow-lg">
                  {cat.nome}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
})