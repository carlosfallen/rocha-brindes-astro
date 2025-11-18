// src/components/home/InstagramFeed.tsx
import { Instagram } from 'lucide-react'

export default function InstagramFeed() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-title font-bold text-dark mb-4">
          Últimas do nosso Instagram
        </h2>
        <a
          href="https://www.instagram.com/88brindes/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
        >
          <Instagram size={20} />
          Siga @88brindes
        </a>
      </div>

      {/* Grid de Instagram - você pode integrar com API do Instagram aqui */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Instagram size={48} />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.instagram.com/88brindes/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          <Instagram size={20} />
          Ver mais no Instagram
        </a>
      </div>
    </section>
  )
}