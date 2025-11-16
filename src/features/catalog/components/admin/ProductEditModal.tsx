// src/features/catalog/components/admin/ProductEditModal.tsx
import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { useCategories } from '../../../../core/hooks/useCategories'
import { uploadToCloudflare, deleteCloudflareImage, optimizeUrl } from '../../../../core/lib/cloudflare'
import { X, Upload } from 'lucide-react'
import type { Product, ProductVariation } from '../../../../types/product'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductEditModal({ product, onClose }: Props) {
  const [nome, setNome] = useState(product.nome || '')
  const [descricao, setDescricao] = useState(product.descricao || '')
  const [destaque, setDestaque] = useState(product.destaque || false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(product.categorias || [])
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState(
    product.imagem_url ? optimizeUrl(product.imagem_url, 'public') : ''
  )
  const [variations, setVariations] = useState<Array<{ 
    cor: string
    image: File | null
    preview: string
    existingUrl?: string 
  }>>(
    product.variacoes?.map(v => ({ 
      cor: v.cor, 
      image: null, 
      preview: optimizeUrl(v.imagem_url, 'public'), 
      existingUrl: v.imagem_url 
    })) || []
  )
  const [currentColor, setCurrentColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { data: categories = [] } = useCategories()

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddVariation = () => {
    if (currentColor.trim()) {
      setVariations([...variations, { cor: currentColor.trim(), image: null, preview: '' }])
      setCurrentColor('')
    }
  }

  const handleVariationImageChange = (index: number, file: File) => {
    const newVariations = [...variations]
    newVariations[index].image = file
    newVariations[index].preview = URL.createObjectURL(file)
    setVariations(newVariations)
  }

  const handleRemoveVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let mainImageId = product.imagem_url

      if (mainImage) {
        mainImageId = await uploadToCloudflare(mainImage, {
          folder: `produtos/${product.id}`,
          productId: product.id,
          type: 'main'
        })
        
        if (product.imagem_url && product.imagem_url !== mainImageId) {
          await deleteCloudflareImage(product.imagem_url)
        }
      }

      const variationsData: ProductVariation[] = []
      const allImageIds: string[] = [mainImageId]
      const oldVariationImages = product.variacoes?.map(v => v.imagem_url) || []

      for (const variation of variations) {
        if (variation.image) {
          const imageId = await uploadToCloudflare(variation.image, {
            folder: `produtos/${product.id}/variacoes`,
            productId: product.id,
            variation: variation.cor,
            type: 'variation'
          })
          
          variationsData.push({ cor: variation.cor, imagem_url: imageId, thumb_url: imageId })
          allImageIds.push(imageId)
          
          if (variation.existingUrl && variation.existingUrl !== imageId) {
            const oldImageIndex = oldVariationImages.indexOf(variation.existingUrl)
            if (oldImageIndex > -1) oldVariationImages.splice(oldImageIndex, 1)
          }
        } else if (variation.existingUrl) {
          const existing = product.variacoes?.find(v => v.cor === variation.cor)
          if (existing) {
            variationsData.push(existing)
            allImageIds.push(existing.imagem_url)
            
            const oldImageIndex = oldVariationImages.indexOf(existing.imagem_url)
            if (oldImageIndex > -1) oldVariationImages.splice(oldImageIndex, 1)
          }
        }
      }

      for (const oldImage of oldVariationImages) {
        await deleteCloudflareImage(oldImage)
      }

      await updateDoc(doc(db, 'produtos', product.id), {
        nome,
        descricao,
        categorias: selectedCategories,
        destaque,
        variacoes: variationsData,
        imagem_url: mainImageId,
        thumb_url: mainImageId,
        imagens_urls: allImageIds,
        thumbs_urls: allImageIds,
      })

      setMessage('Produto atualizado com sucesso!')
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      console.error(err)
      setMessage(err instanceof Error ? err.message : 'Erro ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-title font-bold">Editar Produto</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nome</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">SKU/Código</label>
              <input 
                type="text" 
                value={product.id} 
                disabled 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              rows={3} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Categorias</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label 
                  key={cat.id} 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.nome)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories((prev) => [...prev, cat.nome])
                      } else {
                        setSelectedCategories((prev) => prev.filter((c) => c !== cat.nome))
                      }
                    }} 
                    className="rounded" 
                  />
                  <span className="text-sm">{cat.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={destaque} 
                onChange={(e) => setDestaque(e.target.checked)} 
                className="rounded" 
              />
              <span className="text-sm font-semibold">Produto em destaque</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Imagem Principal</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {mainImagePreview ? (
                <div className="relative aspect-square max-w-xs mx-auto">
                  <img 
                    src={mainImagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                  />
                  <label className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:opacity-90 shadow-lg transition-opacity">
                    <Upload size={16} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleMainImageChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="text-gray-400" size={48} />
                  <span className="text-sm text-gray-600">Clique para selecionar imagem principal</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleMainImageChange} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Variações de Cor</label>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={currentColor} 
                onChange={(e) => setCurrentColor(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddVariation()
                  }
                }} 
                placeholder="Nome da cor (ex: Vermelho, Preto fosco)" 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
              />
              <button 
                type="button" 
                onClick={handleAddVariation} 
                className="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {variations.map((variation, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-2">{variation.cor}</p>
                    {variation.preview ? (
                      <div className="relative w-24 h-24">
                        <img 
                          src={variation.preview} 
                          alt={variation.cor} 
                          className="w-full h-full object-cover rounded" 
                        />
                        <label className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded cursor-pointer hover:opacity-90 shadow-md transition-opacity">
                          <Upload size={12} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleVariationImageChange(index, file)
                            }} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload size={16} />
                        <span className="text-xs">Adicionar imagem</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleVariationImageChange(index, file)
                          }} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveVariation(index)} 
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-center font-semibold ${message.includes('sucesso') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}