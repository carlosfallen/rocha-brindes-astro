// src/components/products/ProductsPage.tsx
import { useState, useMemo } from 'react'
import { useCatalog } from '../../core/hooks/useCatalog'
import { useCart } from '../../core/store/cart'
import CategorySidebar from '../../features/catalog/components/CategorySidebar'
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '../../types/product'

export default function ProductsPage() {
  const { data, isLoading } = useCatalog(1000)
  const { category, search, setCategory, setSearch } = useCart()
  const [page, setPage] = useState(0)
  const pageSize = 12

  const filtered = useMemo(() => {
    if (!data) return []
    return data.products.filter((p: Product) => {
      const matchCat = category === 'Todos' || p.categorias?.includes(category)
      const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [data, category, search])

  const paginatedProducts = useMemo(() => {
    const start = page * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-title font-bold text-dark mb-2">
          Nossos Produtos
        </h1>
        <p className="text-gray-600">
          Encontre os melhores brindes personalizados para sua empresa
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <CategorySidebar
          categories={data?.categories.map(c => c.nome) || []}
          selected={category}
          onSelect={setCategory}
          search={search}
          onSearch={setSearch}
        />

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 mb-4">Nenhum produto encontrado</p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold">{page * pageSize + 1}</span> -{' '}
                  <span className="font-semibold">{Math.min((page + 1) * pageSize, filtered.length)}</span> de{' '}
                  <span className="font-semibold">{filtered.length}</span> produtos
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-all"
                  >
                    <ChevronLeft size={18} />
                    Anterior
                  </button>

                  <span className="text-sm text-gray-600 font-medium">
                    Página {page + 1} de {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-all"
                  >
                    Próxima
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}