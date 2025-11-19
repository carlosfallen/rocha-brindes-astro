// src/features/catalog/CatalogPage.tsx
import { useMemo, lazy, Suspense, useState, useEffect } from 'react'
import { useCatalog } from '../../core/hooks/useCatalog'
import { useCart } from '../../core/store/cart'
import Layout from '../../components/Layout'
import Providers from '../../components/Providers'
import type { Product } from '../../types/product'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CategorySidebar = lazy(() => import('./components/CategorySidebar'))
const ProductGrid = lazy(() => import('./components/ProductGrid'))
const CartSidebar = lazy(() => import('../cart/CartSidebar'))

function CatalogContent() {
  const { data, isLoading } = useCatalog(1000)
  const { category, search, setCategory, setSearch } = useCart()
  const [page, setPage] = useState(0)
  const pageSize = 12

  useEffect(() => {
    setPage(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category, search])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.products.filter((p: Product) => {
      const matchCat = category === 'Todos' || p.categorias?.includes(category)
      const matchSearch = !search || 
        p.nome.toLowerCase().includes(search.toLowerCase()) || 
        p.id.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [data, category, search])

  const paginatedProducts = useMemo(() => {
    const start = page * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const totalPages = Math.ceil(filtered.length / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const skeleton = (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
      ))}
    </div>
  )

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages: (number | string)[] = []
      const showEllipsisStart = page > 2
      const showEllipsisEnd = page < totalPages - 3

      if (totalPages <= 7) {
        for (let i = 0; i < totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(0)
        if (showEllipsisStart) pages.push('...')
        
        const start = Math.max(1, page - 1)
        const end = Math.min(totalPages - 2, page + 1)
        
        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) pages.push(i)
        }
        
        if (showEllipsisEnd) pages.push('...')
        if (!pages.includes(totalPages - 1)) pages.push(totalPages - 1)
      }

      return pages
    }

    return (
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-all font-medium text-sm"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400">
                    ...
                  </span>
                )
              }

              const pageIndex = pageNum as number
              const isActive = pageIndex === page

              return (
                <button
                  key={pageIndex}
                  onClick={() => handlePageChange(pageIndex)}
                  className={`min-w-[40px] h-[40px] px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-110'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-primary'
                  }`}
                >
                  {pageIndex + 1}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-all font-medium text-sm"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="text-sm text-gray-600 font-medium">
          Página <span className="font-bold text-primary">{page + 1}</span> de{' '}
          <span className="font-bold">{totalPages}</span>
          <span className="hidden sm:inline"> • {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}</span>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-title font-bold text-3xl md:text-4xl text-dark mb-2">
              Catálogo de Produtos
            </h1>
            <p className="text-gray-600">
              Explore nossa linha completa de brindes personalizados
            </p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <Suspense fallback={null}>
              <CategorySidebar
                categories={data?.categories.map(c => c.nome) || []}
                selected={category}
                onSelect={setCategory}
                search={search}
                onSearch={setSearch}
              />
            </Suspense>

            <div>
              {isLoading ? skeleton : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500">Nenhum produto encontrado</p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
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
                      <span className="font-semibold">{filtered.length}</span> {filtered.length === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>

                  <Suspense fallback={skeleton}>
                    <ProductGrid products={paginatedProducts} linkToPage />
                  </Suspense>
                  
                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <CartSidebar />
      </Suspense>
    </Layout>
  )
}

export default function CatalogPage() {
  return (
    <Providers>
      <CatalogContent />
    </Providers>
  )
}