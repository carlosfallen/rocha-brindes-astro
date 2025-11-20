// src/features/catalog/components/admin/LayoutManager.tsx
import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { uploadToCloudflare, optimizeUrl, deleteCloudflareImage } from '../../../../core/lib/cloudflare'
import { db } from '../../../../core/lib/firebase'
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, Bell, LayoutDashboard, Info, Phone, Settings } from 'lucide-react'

interface LayoutAssets {
  logo?: string
  banners: string[]
  promotions: string[]
  popups: string[]
  companyInfo?: {
    title?: string
    description: string
  }
  whatsapp?: string
}

type AssetType = 'banners' | 'promotions' | 'popups'

export default function LayoutManager() {
  const [assets, setAssets] = useState<LayoutAssets>({
    banners: [],
    promotions: [],
    popups: [],
  })
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'logo' | AssetType | null>(null)
  const [message, setMessage] = useState('')
  const [companyTitle, setCompanyTitle] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    void loadAssets()
    void loadWhatsAppFromGeneral()
  }, [])

  const loadAssets = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'layout'))
      if (docSnap.exists()) {
        const data = docSnap.data() as LayoutAssets
        setAssets(data)
        setCompanyTitle(data.companyInfo?.title || '')
        setCompanyDescription(data.companyInfo?.description || '')
        if (data.whatsapp) setWhatsapp(data.whatsapp)
      }
    } catch (error) {
      console.error('Erro ao carregar assets:', error)
      setMessage('Erro ao carregar configurações')
    }
  }

  const loadWhatsAppFromGeneral = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'config', 'general'))
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.whatsappNumber && !whatsapp) {
          setWhatsapp(data.whatsappNumber)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar WhatsApp:', error)
    }
  }

  const saveAssets = async (data: LayoutAssets) => {
    await setDoc(doc(db, 'config', 'layout'), data, { merge: true })
  }

  const saveWhatsAppToGeneral = async (number: string) => {
    await setDoc(doc(db, 'config', 'general'), { whatsappNumber: number }, { merge: true })
  }

  const showMessage = (msg: string, timeout = 3000) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), timeout)
  }

  const saveCompanyInfo = async () => {
    try {
      const newAssets: LayoutAssets = {
        ...assets,
        companyInfo: companyDescription ? {
          title: companyTitle,
          description: companyDescription
        } : undefined,
        whatsapp: whatsapp || undefined
      }
      
      await saveAssets(newAssets)
      
      if (whatsapp) {
        await saveWhatsAppToGeneral(whatsapp)
      }
      
      setAssets(newAssets)
      showMessage('Informações salvas com sucesso!')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao salvar informações')
    }
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
    uploadType: 'banner' | 'promotion' | 'popup'
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
      
      const newAssets: LayoutAssets = {
        ...assets,
        [type]: [...assets[type], ...imageIds]
      }
      await saveAssets(newAssets)
      setAssets(newAssets)
      
      const typeNames = {
        banners: 'Banners',
        promotions: 'Promoções',
        popups: 'Popups'
      }
      showMessage(`${typeNames[type]} adicionados com sucesso!`)
    } catch (error) {
      console.error(error)
      showMessage(`Erro ao fazer upload`)
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const removeAsset = async (type: AssetType, index: number) => {
    try {
      const imageId = assets[type][index]
      await deleteCloudflareImage(imageId)
      
      const newAssets: LayoutAssets = {
        ...assets,
        [type]: assets[type].filter((_, i) => i !== index)
      }
      await saveAssets(newAssets)
      setAssets(newAssets)
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs font-medium text-center">
              {type === 'banners' ? 'Banner' : type === 'promotions' ? 'Promoção' : 'Popup'} #{i + 1}
            </p>
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Info size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-title font-bold text-gray-800">Sobre a Empresa</h2>
              <p className="text-sm text-gray-500">Texto exibido na home</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                value={companyTitle}
                onChange={(e) => setCompanyTitle(e.target.value)}
                placeholder="Ex: Sobre Nós"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="Descreva sua empresa..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-title font-bold text-gray-800">Configurações Gerais</h2>
              <p className="text-sm text-gray-500">WhatsApp e outros ajustes</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                WhatsApp
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex: 5589994333316"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Apenas números com DDI e DDD</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => void saveCompanyInfo()}
          className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Salvar Configurações
        </button>
      </div>

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
            <p className="text-sm text-gray-500">Cards de ofertas especiais</p>
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
            <p className="text-sm text-gray-500">Modais promocionais</p>
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
    </div>
  )
}