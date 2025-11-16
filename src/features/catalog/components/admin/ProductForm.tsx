import { useState } from 'react'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../core/lib/firebase'
import { useCategories } from '../../../../core/hooks/useCategories'
import { uploadToCloudflare } from '../../../../core/lib/cloudflare'
import { fetchProductGroupFromSheet } from '../../../../core/lib/googleSheets' // 👈 NOVO
import { X, Upload } from 'lucide-react'
import type { ProductVariation } from '../../../../types/product'

export default function ProductForm() {
  const [nome, setNome] = useState('')
  const [sku, setSku] = useState('')
  const [descricao, setDescricao] = useState('')
  const [destaque, setDestaque] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')

  const [variations, setVariations] = useState<
    Array<{ cor: string; image: File | null; preview: string }>
  >([])
  const [currentColor, setCurrentColor] = useState('')
  const [mainColor, setMainColor] = useState('') // 👈 cor principal escolhida

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 👇 loading só da planilha
  const [sheetLoading, setSheetLoading] = useState(false)

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
      const newColor = currentColor.trim()
      const newVariations = [
        ...variations,
        { cor: newColor, image: null, preview: '' },
      ]
      setVariations(newVariations)

      // se ainda não tem cor principal, assume a primeira que adicionar
      if (!mainColor) {
        setMainColor(newColor)
      }

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
    const removedColor = variations[index]?.cor
    const newVariations = variations.filter((_, i) => i !== index)
    setVariations(newVariations)

    // se removeu a cor principal, tenta definir outra
    setMainColor((prev) => {
      if (prev && prev === removedColor) {
        return newVariations[0]?.cor ?? ''
      }
      return prev
    })
  }

  async function uploadOriginal(
    file: File,
    pathWithoutExt: string
  ): Promise<string> {
    const ext = file.name.split('.').pop() || 'jpg'
    const storageRef = ref(storage, `${pathWithoutExt}.${ext}`)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleSkuBlur = async () => {
    const value = sku.trim()
    if (!value) return

    setSheetLoading(true)
    setMessage('')

    try {
      const group = await fetchProductGroupFromSheet(value)

      if (!group) {
        setMessage('Nenhum produto encontrado na planilha com esse código.')
        return
      }

      // 👉 Garante que o sku fica sempre no formato base (1000_115)
      setSku(group.baseSku)

      // Nome sem cor
      if (group.nome) {
        setNome(group.nome)
      }

      // Descrição
      if (group.descricao) {
        setDescricao(group.descricao)
      }

      // Categorias: marca as que vierem da planilha
      if (group.categorias?.length) {
        setSelectedCategories(group.categorias)
      }

      // Destaque
      setDestaque(group.destaque)

      // Variações: cada cor da planilha vira uma variação no form
      if (group.variacoes?.length) {
        const novasVariacoes = group.variacoes.map((v: { cor: string }) => ({
          cor: v.cor,
          image: null,
          preview: '',
        }))
        setVariations(novasVariacoes)

        // define cor principal vinda da planilha:
        // prioridade: cor com "preto" no nome, senão a primeira
        const preta = group.variacoes.find((v: { cor: string }) =>
          v.cor.toLowerCase().includes('preto')
        )
        if (preta) {
          setMainColor(preta.cor)
        } else if (group.variacoes[0]) {
          setMainColor(group.variacoes[0].cor)
        } else {
          setMainColor('')
        }
      } else {
        setVariations([])
        setMainColor('')
      }

      setMessage('Dados preenchidos a partir da planilha ✅')
    } catch (err) {
      console.error(err)
      setMessage('Erro ao buscar dados na planilha.')
    } finally {
      setSheetLoading(false)
    }
  }

  // src/features/catalog/components/admin/ProductForm.tsx - handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!sku.trim()) throw new Error('Informe um código/SKU')

      const allImageIds: string[] = []
      const variationsData: ProductVariation[] = []

      let mainImageId: string | null = null

      // mapa de cor -> imageId (para poder escolher a principal pela cor)
      const variationImageByColor: Record<string, string> = {}

      // 1) Faz upload das variações primeiro
      for (const variation of variations) {
        if (!variation.image) continue

        const imageId = await uploadToCloudflare(variation.image, {
          folder: `produtos/${sku}/variacoes`,
          productId: sku,
          variation: variation.cor,
          type: 'variation',
        })

        variationsData.push({
          cor: variation.cor,
          imagem_url: imageId,
          thumb_url: imageId,
        })

        allImageIds.push(imageId)
        variationImageByColor[variation.cor] = imageId
      }

      // 2) Se o usuário enviou imagem principal, ela manda em tudo
      if (mainImage) {
        mainImageId = await uploadToCloudflare(mainImage, {
          folder: `produtos/${sku}`,
          productId: sku,
          type: 'main',
        })

        // principal sempre na frente do array
        allImageIds.unshift(mainImageId)
      } else {
        // 3) Se NÃO tem imagem principal, tenta usar a cor principal escolhida
        if (mainColor && variationImageByColor[mainColor]) {
          mainImageId = variationImageByColor[mainColor]
        } else {
          // se não escolher cor principal, prioridade pra uma variação com "preto"
          const pretaKey = Object.keys(variationImageByColor).find((c) =>
            c.toLowerCase().includes('preto')
          )

          if (pretaKey) {
            mainImageId = variationImageByColor[pretaKey]
          } else {
            // fallback: primeira variação com imagem
            const firstImageId = Object.values(variationImageByColor)[0]
            if (firstImageId) {
              mainImageId = firstImageId
            }
          }
        }
      }

      if (!mainImageId) {
        throw new Error(
          'Envie pelo menos uma imagem (principal ou de alguma variação).'
        )
      }

      await setDoc(doc(collection(db, 'produtos'), sku), {
        id: sku,
        nome,
        descricao,
        categorias: selectedCategories,
        destaque,
        variacoes: variationsData,
        imagem_url: mainImageId,
        thumb_url: mainImageId,
        imagens_urls: allImageIds,
        thumbs_urls: allImageIds,
        createdAt: serverTimestamp(),
      })

      setMessage('Produto salvo com sucesso!')
      setNome('')
      setSku('')
      setDescricao('')
      setDestaque(false)
      setSelectedCategories([])
      setMainImage(null)
      setMainImagePreview('')
      setVariations([])
      setCurrentColor('')
      setMainColor('')
    } catch (err) {
      console.error(err)
      setMessage(err instanceof Error ? err.message : 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-title font-bold mb-6">Adicionar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              SKU/Código
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                onBlur={handleSkuBlur} // 👈 busca automática ao sair do campo
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={handleSkuBlur}
                disabled={sheetLoading}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                {sheetLoading ? 'Buscando...' : 'Planilha'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Categorias</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.nome)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories((prev) => [...prev, cat.nome])
                    } else {
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c !== cat.nome)
                      )
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
          <label className="flex items-center gap-2">
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
          <label className="block text-sm font-semibold mb-2">
            Imagem Principal (opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {mainImagePreview ? (
              <div className="relative aspect-square max-w-xs mx-auto">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null)
                    setMainImagePreview('')
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="text-gray-400" size={48} />
                <span className="text-sm text-gray-600">
                  Clique para selecionar imagem principal (opcional)
                </span>
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
          <label className="block text-sm font-semibold mb-2">
            Variações de Cor
          </label>

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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddVariation}
              className="bg-primary hover:opacity-90 text-text-primary px-4 py-2 rounded-lg font-semibold"
            >
              Adicionar
            </button>
          </div>

          {variations.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Cor principal
              </label>
              <select
                value={mainColor}
                onChange={(e) => setMainColor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione a cor principal</option>
                {variations.map((variation, index) => (
                  <option key={variation.cor + index} value={variation.cor}>
                    {variation.cor}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Essa cor será usada como principal se você não enviar imagem
                principal do produto.
              </p>
            </div>
          )}

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
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
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
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p
            className={`text-center font-semibold ${
              message.includes('sucesso') || message.includes('planilha')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:opacity-90 text-text-primary font-bold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </form>
    </div>
  )
}
