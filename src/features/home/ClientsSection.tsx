// src/features/home/ClientsSection.tsx
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../core/lib/firebase'
import { optimizeUrl } from '../../shared/utils/image'

interface ClientData {
  clients: string[]
}

export default function ClientsSection() {
  const [clients, setClients] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'clients'))
      if (docSnap.exists()) {
        const data = docSnap.data() as ClientData
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16">
        <h2 className="font-title font-bold text-3xl md:text-4xl text-dark text-center mb-4">
          Nossos Clientes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!clients.length) return null

  return (
    <section className="py-16">
      <h2 className="font-title font-bold text-3xl md:text-4xl text-dark text-center mb-4">
        Nossos Clientes
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Empresas que confiam em nossos produtos e serviços
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {clients.map((clientImageId, i) => (
          <div key={i} className="flex items-center justify-center p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all">
            <img 
              src={optimizeUrl(clientImageId, 'thumbnail')} 
              alt={`Cliente ${i + 1}`}
              className="w-full h-16 object-contain grayscale hover:grayscale-0 transition-all"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}