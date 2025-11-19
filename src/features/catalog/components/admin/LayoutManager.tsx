// src/features/catalog/components/admin/LayoutManager.tsx
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { uploadToCloudflare, optimizeUrl, deleteCloudflareImage } from '../../../../core/lib/cloudflare'
import { db } from '../../../../core/lib/firebase'
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, Bell, LayoutDashboard, Users, Video } from 'lucide-react'

interface LayoutAssets {
  logo?: string
  banners: string[]
  promotions: string[]
  popups: string[]
}

interface ClientsData {
  clients: string[]
}

interface VideoData {
  thumbnailId: string
  videoUrl?: string
}

type AssetType = 'banners' | 'promotions' | 'popups' | 'clients'

export default function LayoutManager() {
  const [assets, setAssets] = useState<LayoutAssets>({
    banners: [],
    promotions: [],
    popups: [],
  })
  const [clients, setClients] = useState<string[]>([])
  const [video, setVideo] = useState<VideoData>({ thumbnailId: '', videoUrl: '' })
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'logo' | AssetType | 'video' | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void loadAssets()
    void loadClients()
    void loadVideo()
  }, [])

  const loadAssets = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'layout'))
      if (docSnap.exists()) {
        setAssets(docSnap.data() as LayoutAssets)
      }
    } catch (error) {
      console.error('Erro ao carregar assets:', error)
    }
  }

  const loadClients = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'clients'))
      if (docSnap.exists()) {
        const data = docSnap.data() as ClientsData
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    }
  }

  const loadVideo = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'video'))
      if (docSnap.exists()) {
        setVideo(docSnap.data() as VideoData)
      }
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error)
    }
  }

  const saveAssets = async (data: LayoutAssets) => {
    await setDoc(doc(db, 'config', 'layout'), data)
  }

  const saveClients = async (data: string[]) => {
    await setDoc(doc(db, 'config', 'clients'), { clients: data })
  }

  const saveVideo = async (data: VideoData) => {
    await setDoc(doc(db, 'config', 'video'), data)
  }

  const showMessage = (msg: string, timeout = 3000) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), timeout)
  }

  const handleLogoUpload = async (file: File) => {
    setLoading(true)
    setLoadingType('logo')
    try {
      const imageId = await uploadToCloudflare(file, {
        folder: 'layout',
        type: 'logo'
      })

      if (assets.logo) {
        await deleteCloudflareImage(assets.logo)
      }

      const newAssets: LayoutAssets = { ...assets, logo: imageId }
      await saveAssets(newAssets)
      setAssets(newAssets)
      showMessage('Logo atualizado com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao fazer upload do logo')
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const handleMultipleUploads = async (
    files: FileList,
    type: AssetType,
    folder: string,
    uploadType: 'banner' | 'promotion' | 'popup' | 'logo'
  ) => {
    setLoading(true)
    setLoadingType(type)
    try {
      const imageIds: string[] = []
      for (let i = 0; i < files.length; i++) {
        const imageId = await uploadToCloudflare(files[i], {
          folder,
          type: uploadType
        })
        imageIds.push(imageId)
      }
      
      if (type === 'clients') {
        const newClients = [...clients, ...imageIds]
        await saveClients(newClients)
        setClients(newClients)
        showMessage('Logos de clientes adicionados com sucesso!')
      } else {
        const newAssets: LayoutAssets = {
          ...assets,
          [type]: [...assets[type], ...imageIds]
        }
        await saveAssets(newAssets)
        setAssets(newAssets)
        
        const typeNames = {
          banners: 'Banners',
          promotions: 'Promoções',
          popups: 'Popups',
          clients: 'Clientes'
        }
        showMessage(`${typeNames[type]} adicionados com sucesso!`)
      }
    } catch (error) {
      console.error(error)
      showMessage(`Erro ao fazer upload`)
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const handleVideoUpload = async (file: File, videoUrl: string) => {
    setLoading(true)
    setLoadingType('video')
    try {
      const imageId = await uploadToCloudflare(file, {
        folder: 'layout/video',
        type: 'banner'
      })

      if (video.thumbnailId) {
        await deleteCloudflareImage(video.thumbnailId)
      }

      const newVideo: VideoData = { thumbnailId: imageId, videoUrl }
      await saveVideo(newVideo)
      setVideo(newVideo)
      showMessage('Vídeo atualizado com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao fazer upload do vídeo')
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const removeAsset = async (type: AssetType, index: number) => {
    try {
      if (type === 'clients') {
        const imageId = clients[index]
        await deleteCloudflareImage(imageId)
        
        const newClients = clients.filter((_, i) => i !== index)
        await saveClients(newClients)
        setClients(newClients)
      } else {
        const imageId = assets[type][index]
        await deleteCloudflareImage(imageId)
        
        const newAssets: LayoutAssets = {
          ...assets,
          [type]: assets[type].filter((_, i) => i !== index)
        }
        await saveAssets(newAssets)
        setAssets(newAssets)
      }
      showMessage('Item removido com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao remover item')
    }
  }

  const removeLogo = async () => {
    if (!assets.logo) return
    
    try {
      await deleteCloudflareImage(assets.logo)
      const newAssets: LayoutAssets = { ...assets, logo: undefined }
      await saveAssets(newAssets)
      setAssets(newAssets)
      showMessage('Logo removido com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao remover logo')
    }
  }

  const removeVideo = async () => {
    if (!video.thumbnailId) return
    
    try {
      await deleteCloudflareImage(video.thumbnailId)
      const newVideo: VideoData = { thumbnailId: '', videoUrl: '' }
      await saveVideo(newVideo)
      setVideo(newVideo)
      showMessage('Vídeo removido com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao remover vídeo')
    }
  }

  const renderUploadButton = (
    label: string,
    onChange: (files: FileList) => void,
    multiple = false,
    isLoading = false,
    icon?: React.ReactNode
  ) => (
    <label className={`group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary hover:from-primary/20 hover:to-primary/10 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
        {isLoading ? (
          <Loader2 size={20} className="animate-spin text-primary" />
        ) : (
          icon || <Upload size={20} className="text-primary" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{label}</span>
        <span className="text-xs text-gray-500">Clique para selecionar {multiple ? 'arquivos' : 'arquivo'}</span>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) onChange(e.target.files)
        }}
        className="hidden"
        disabled={loading}
      />
    </label>
  )

  const renderImageGrid = (
    images: string[],
    type: AssetType,
    aspectClass: string
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((imageId, i) => (
        <div key={`${imageId}-${i}`} className={`relative ${aspectClass} border-2 border-gray-200 rounded-xl overflow-hidden group hover:border-primary transition-colors bg-gray-50`}>
          <img 
            src={optimizeUrl(imageId, 'thumbnail')} 
            alt={`${type} ${i + 1}`} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              onClick={() => void removeAsset(type, i)}
              className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-all shadow-lg transform scale-75 group-hover:scale-100"
              title="Remover"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderEmptyState = (icon: React.ReactNode, text: string) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  )

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl text-center font-semibold shadow-md animate-fade-in ${message.includes('sucesso') ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-red-50 text-red-700 border-2 border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ImageIcon size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-title font-bold text-gray-800">Logo Principal</h2>
            <p className="text-sm text-gray-500">Logotipo exibido no cabeçalho do site</p>
          </div>
        </div>
        
        {assets.logo ? (
          <div className="relative inline-block">
            <div className="w-64 h-32 border-2 border-gray-200 rounded-xl p-4 group hover:border-primary transition-colors bg-gray-50">
              <img 
                src={optimizeUrl(assets.logo, 'thumbnail')} 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <button
              onClick={() => void removeLogo()}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
              title="Remover logo"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          renderUploadButton(
            'Adicionar Logo',
            (files) => void handleLogoUpload(files[0]),
            false,
            loadingType === 'logo',
            <ImageIcon size={20} className="text-primary" />
          )
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-title font-bold text-gray-800">Banners Hero</h2>
            <p className="text-sm text-gray-500">Slides principais da página inicial</p>
          </div>
        </div>
        
        <div className="mb-6">
          {renderUploadButton(
            'Adicionar Banners',
            (files) => void handleMultipleUploads(files, 'banners', 'layout/banners', 'banner'),
            true,
            loadingType === 'banners',
            <LayoutDashboard size={20} className="text-primary" />
          )}
        </div>
        
        {assets.banners.length > 0 ? (
          renderImageGrid(assets.banners, 'banners', 'aspect-video')
        ) : (
          renderEmptyState(
            <LayoutDashboard size={28} className="text-gray-400" />,
            'Nenhum banner adicionado'
          )
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Sparkles size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-title font-bold text-gray-800">Promoções em Destaque</h2>
            <p className="text-sm text-gray-500">Cards de ofertas e promoções especiais</p>
          </div>
        </div>
        
        <div className="mb-6">
          {renderUploadButton(
            'Adicionar Promoções',
            (files) => void handleMultipleUploads(files, 'promotions', 'layout/promocoes', 'promotion'),
            true,
            loadingType === 'promotions',
            <Sparkles size={20} className="text-primary" />
          )}
        </div>
        
        {assets.promotions.length > 0 ? (
          renderImageGrid(assets.promotions, 'promotions', 'aspect-square')
        ) : (
          renderEmptyState(
            <Sparkles size={28} className="text-gray-400" />,
            'Nenhuma promoção adicionada'
          )
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Bell size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-title font-bold text-gray-800">Popups</h2>
            <p className="text-sm text-gray-500">Modais promocionais exibidos aos visitantes</p>
          </div>
        </div>
        
        <div className="mb-6">
          {renderUploadButton(
            'Adicionar Popups',
            (files) => void handleMultipleUploads(files, 'popups', 'layout/popups', 'popup'),
            true,
            loadingType === 'popups',
            <Bell size={20} className="text-primary" />
          )}
        </div>
        
        {assets.popups.length > 0 ? (
          renderImageGrid(assets.popups, 'popups', 'aspect-square')
        ) : (
          renderEmptyState(
            <Bell size={28} className="text-gray-400" />,
            'Nenhum popup adicionado'
          )
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-title font-bold text-gray-800">Logos de Clientes</h2>
            <p className="text-sm text-gray-500">Logos de empresas parceiras</p>
          </div>
        </div>
        
        <div className="mb-6">
          {renderUploadButton(
            'Adicionar Logos de Clientes',
            (files) => void handleMultipleUploads(files, 'clients', 'layout/clientes', 'logo'),
            true,
            loadingType === 'clients',
            <Users size={20} className="text-primary" />
          )}
        </div>
        
        {clients.length > 0 ? (
          renderImageGrid(clients, 'clients', 'aspect-square')
        ) : (
          renderEmptyState(
            <Users size={28} className="text-gray-400" />,
            'Nenhum logo de cliente adicionado'
          )
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Video size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-title font-bold text-gray-800">Vídeo de Produção</h2>
            <p className="text-sm text-gray-500">Thumbnail e link do vídeo institucional</p>
          </div>
        </div>
        
        {video.thumbnailId ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <div className="w-full max-w-md aspect-video border-2 border-gray-200 rounded-xl overflow-hidden group hover:border-primary transition-colors">
                <img 
                  src={optimizeUrl(video.thumbnailId, 'public')} 
                  alt="Thumbnail do vídeo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button
                onClick={() => void removeVideo()}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
                title="Remover vídeo"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">URL do Vídeo (YouTube, Vimeo, etc.)</label>
              <input
                type="url"
                value={video.videoUrl || ''}
                onChange={(e) => {
                  const newVideo = { ...video, videoUrl: e.target.value }
                  setVideo(newVideo)
                }}
                onBlur={() => void saveVideo(video)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold mb-2 block">Thumbnail do Vídeo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = prompt('Digite a URL do vídeo (YouTube embed, Vimeo, etc.):')
                    if (url) void handleVideoUpload(file, url)
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}