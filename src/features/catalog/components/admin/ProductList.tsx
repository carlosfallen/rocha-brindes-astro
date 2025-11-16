// src/features/catalog/components/admin/ProductList.tsx
import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  collection, query as fsQuery, orderBy, limit, startAfter,
  getDocs, deleteDoc, doc, QueryDocumentSnapshot, type DocumentData
} from 'firebase/firestore'
import { db } from '../../../../core/lib/firebase'
import { deleteMultipleImages } from '../../../../core/lib/cloudflare'
import { optimizeUrl } from '../../../../shared/utils/image'
import type { Product } from '../../../../types/product'
import { Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductEditModal from '../../../../features/catalog/components/admin/ProductEditModal'

export default function ProductList() {
  const [page, setPage] = useState(0)
  const [cursors, setCursors] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const pageSize = 50
  const qc = useQueryClient()

  const qRef = useMemo(() => {
    const base = fsQuery(
      collection(db, 'produtos'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    )
    if (page > 0 && cursors[page - 1]) {
      return fsQuery(
        collection(db, 'produtos'),
        orderBy('createdAt', 'desc'),
        startAfter(cursors[page - 1]),
        limit(pageSize)
      )
    }
    return base
  }, [page, cursors, pageSize])

  const { data: products = [], isLoading, refetch, isFetching } = useQuery<Product[]>({
    queryKey: ['admin-products', page, pageSize, cursors[page - 1]?.id],
    queryFn: async () => {
      const snapshot = await getDocs(qRef)
      const docs = snapshot.docs
      if (docs.length > 0) {
        setCursors(prev => {
          const next = [...prev]
          next[page] = docs[docs.length - 1]
          return next
        })
      }
      return docs.map(d => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }))
    },
    placeholderData: (prev) => prev ?? [],
    staleTime: 30_000,
  })

  const handleDelete = async (product: Product) => {
    if (!confirm(`Tem certeza que deseja excluir "${product.nome}"?`)) return
    
    setDeleting(product.id)
    try {
      const imageIds: string[] = []
      
      if (product.imagem_url) imageIds.push(product.imagem_url)
      if (product.thumb_url && product.thumb_url !== product.imagem_url) {
        imageIds.push(product.thumb_url)
      }
      
      if (product.imagens_urls?.length) {
        product.imagens_urls.forEach(url => {
          if (!imageIds.includes(url)) imageIds.push(url)
        })
      }
      
      if (product.thumbs_urls?.length) {
        product.thumbs_urls.forEach(url => {
          if (!imageIds.includes(url)) imageIds.push(url)
        })
      }
      
      if (product.variacoes?.length) {
        product.variacoes.forEach(v => {
          if (v.imagem_url && !imageIds.includes(v.imagem_url)) {
            imageIds.push(v.imagem_url)
          }
          if (v.thumb_url && !imageIds.includes(v.thumb_url)) {
            imageIds.push(v.thumb_url)
          }
        })
      }

      await deleteMultipleImages(imageIds)
      await deleteDoc(doc(db, 'produtos', product.id))
      await qc.invalidateQueries({ queryKey: ['admin-products'] })
      await refetch()
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      alert('Erro ao deletar produto')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleCloseEdit = () => {
    setEditingProduct(null)
    qc.invalidateQueries({ queryKey: ['admin-products'] })
    refetch()
  }

  if (isLoading && !products.length) {
    return <div className="text-center py-8">Carregando produtos...</div>
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-title font-bold">
            Produtos Cadastrados {isFetching && <span className="text-sm text-gray-400">(atualizando…)</span>}
          </h2>
        </div>

        <div className="max-h-[600px] overflow-auto divide-y">
          {products.map((product: Product) => {
            const imgId = product.thumb_url || product.imagem_url || product.imagens_urls?.[0]
            const imgUrl = imgId ? optimizeUrl(imgId, 'public') : ''
            
            return (
              <div key={product.id} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-50">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={product.nome ?? 'Produto'}
                    className="w-16 h-16 object-contain rounded bg-gray-50"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                    <span className="text-xs text-gray-400">Sem img</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{product.nome}</h3>
                  <p className="text-sm text-gray-500">SKU: {product.id}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {product.categorias?.map((cat: string) => (
                      <span key={cat} className="text-xs bg-gray-200 px-2 py-1 rounded">{cat}</span>
                    ))}
                  </div>
                  {product.variacoes && product.variacoes.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{product.variacoes.length} variações de cor</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(product)} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                    title="Editar"
                    disabled={deleting === product.id}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50" 
                    title="Excluir"
                    disabled={deleting === product.id}
                  >
                    {deleting === product.id ? (
                      <div className="w-[18px] h-[18px] border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
          >
            <ChevronLeft size={18} />
            Anterior
          </button>
          <span className="text-sm text-gray-600">Página {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={products.length < pageSize}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
          >
            Próximo
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {editingProduct && (
        <ProductEditModal product={editingProduct} onClose={handleCloseEdit} />
      )}
    </>
  )
}