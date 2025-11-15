// src/features/catalog/components/admin/CategoryManager.tsx
import { useState } from 'react'
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { uploadToCloudflare } from '../../../../core/lib/cloudflare'
import { db } from '../../../../core/lib/firebase'
import { useCategories } from '../../../../core/hooks/useCategories'
import { optimizeUrl } from '../../../../shared/utils/image'
import { Trash2, Upload, X } from 'lucide-react'

type Cat = {
  id: string
  nome: string
  productCount?: number
  popular?: boolean
  imagePath?: string
}

export default function CategoryManager() {
  const [nome, setNome] = useState('')
  const [popular, setPopular] = useState(false)
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { data: categories = [], refetch } = useCategories()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCategoryImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const id = nome.toLowerCase().replace(/\s+/g, '-')

      let imagePath = ''
      if (categoryImage) {
        const imageId = await uploadToCloudflare(categoryImage)
        imagePath = imageId
      }

      await setDoc(doc(db, 'categorias', id), {
        id,
        nome,
        productCount: 0,
        popular,
        imagePath,
      })

      setNome('')
      setPopular(false)
      setCategoryImage(null)
      setImagePreview('')
      refetch()
    } catch (error) {
      console.error(error)
      alert('Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return
    try {
      await deleteDoc(doc(db, 'categorias', id))
      refetch()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir categoria')
    }
  }

  const togglePopular = async (cat: Cat) => {
    try {
      await updateDoc(doc(db, 'categorias', cat.id), {
        popular: !cat.popular,
      })
      refetch()
    } catch (e) {
      console.error(e)
      alert('Não foi possível atualizar popular')
    }
  }

  const updateCategoryImage = async (cat: Cat, file: File) => {
    try {
      const imageId = await uploadToCloudflare(file)
      await updateDoc(doc(db, 'categorias', cat.id), { imagePath: imageId })
      refetch()
    } catch (e) {
      console.error(e)
      alert('Não foi possível atualizar a imagem')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-title font-bold mb-6">Gerenciar Categorias</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nome da categoria
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da categoria"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Imagem da categoria
            </label>
            {imagePreview ? (
              <div className="relative w-full h-24">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCategoryImage(null)
                    setImagePreview('')
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload size={16} />
                <span className="text-sm">Selecionar imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={popular}
            onChange={(e) => setPopular(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-semibold">
            Marcar como categoria popular
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:opacity-90 text-text-primary font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Categoria'}
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((cat: Cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4 flex-1">
              {cat.imagePath && (
                <img
                  src={optimizeUrl(cat.imagePath, 'public')}
                  alt={cat.nome}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{cat.nome}</h3>
                <p className="text-sm text-gray-500">
                  {cat.productCount || 0} produtos
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => void togglePopular(cat)}
                    className={`px-3 py-1 rounded border text-sm ${
                      cat.popular
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {cat.popular ? 'Popular ✓' : 'Marcar como popular'}
                  </button>
                  <label className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                    <Upload size={14} />
                    <span className="text-xs">Alterar imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) void updateCategoryImage(cat, file)
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={() => void handleDelete(cat.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}