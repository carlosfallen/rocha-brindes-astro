// src/features/home/ProductionVideo.tsx
import { Play } from 'lucide-react'

export default function ProductionVideo() {
  return (
    <section className="py-16">
      <h2 className="font-title font-bold text-3xl md:text-4xl text-dark text-center mb-8">
        Conheça Nossa Produção
      </h2>
      
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-card group cursor-pointer">
        <img 
          src="/video-thumb.jpg" 
          alt="Vídeo de produção" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform group-hover:scale-110 shadow-xl">
            <Play size={32} className="text-primary ml-1" fill="currentColor" />
          </button>
        </div>
      </div>
    </section>
  )
}