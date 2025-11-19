// src/features/home/ProductionVideo.tsx
import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import { optimizeUrl } from '../../shared/utils/image'

interface VideoData {
  thumbnailId: string
  videoUrl?: string
}

export default function ProductionVideo() {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    void loadVideo()
  }, [])

  const loadVideo = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'video'))
      if (docSnap.exists()) {
        setVideoData(docSnap.data() as VideoData)
      }
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16">
        <h2 className="font-title font-bold text-3xl md:text-4xl text-dark text-center mb-8">
          Conheça Nossa Produção
        </h2>
        <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
      </section>
    )
  }

  if (!videoData?.thumbnailId) return null

  return (
    <section className="py-16">
      <h2 className="font-title font-bold text-3xl md:text-4xl text-dark text-center mb-8">
        Conheça Nossa Produção
      </h2>
      
      {showVideo && videoData.videoUrl ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-card">
          <iframe
            src={videoData.videoUrl}
            title="Vídeo de produção"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            Fechar
          </button>
        </div>
      ) : (
        <div 
          className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-card group cursor-pointer"
          onClick={() => videoData.videoUrl && setShowVideo(true)}
        >
          <img 
            src={optimizeUrl(videoData.thumbnailId, 'public')} 
            alt="Vídeo de produção" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform group-hover:scale-110 shadow-xl">
              <Play size={32} className="text-primary ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}