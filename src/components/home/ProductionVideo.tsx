// src/components/home/ProductionVideo.tsx
export default function ProductionVideo() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-card">
        <div className="relative aspect-video">
          <img 
            src="https://img.youtube.com/vi/CiYTfn2ZJxc/maxresdefault.jpg"
            alt="Vídeo 88 Brindes"
            className="w-full h-full object-cover"
          />
          <a 
            href="https://www.youtube.com/watch?v=CiYTfn2ZJxc"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all group"
          >
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}