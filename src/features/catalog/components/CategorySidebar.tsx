// src/features/catalog/components/CategorySidebar.tsx
import { memo, useState } from 'react'
import { Search, Grid, X, Filter } from 'lucide-react'

interface Props {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  search: string
  onSearch: (term: string) => void
}

export default memo(function CategorySidebar({ categories, selected, onSelect, search, onSearch }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão Mobile - Barra Fixa na Base */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3">
              <Filter size={20} />
              <span>Filtros e Busca</span>
            </div>
            <div className="flex items-center gap-2">
              {selected !== 'Todos' && (
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs truncate max-w-[100px]">
                  {selected}
                </span>
              )}
              {search && (
                <span className="px-2 py-1 bg-accent text-dark rounded-full text-xs font-bold">
                  🔍
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky bottom-0 lg:top-28 left-0 right-0 lg:left-auto lg:right-auto
        h-[85vh] lg:h-fit w-full lg:w-auto z-50 lg:z-auto
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        overflow-hidden lg:overflow-visible
        rounded-t-3xl lg:rounded-none shadow-2xl lg:shadow-none
        bg-white lg:bg-transparent
      `}>
        {/* Header Mobile */}
        <div className="lg:hidden bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter size={24} />
            <h3 className="font-title font-bold text-lg">Filtros</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 lg:p-0 space-y-6 overflow-y-auto max-h-[calc(85vh-180px)] lg:max-h-none">
          {/* Campo de Busca */}
          <div className="bg-white rounded-2xl shadow-card p-4 lg:p-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {search && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-2xl shadow-card p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Grid className="text-primary" size={20} />
              <h3 className="font-title font-bold text-lg text-dark">Categorias</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelect('Todos')
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selected === 'Todos'
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
                }`}
              >
                Todos os produtos
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelect(cat)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selected === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de Ação Mobile */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
          {(selected !== 'Todos' || search) && (
            <button
              onClick={() => {
                onSelect('Todos')
                onSearch('')
              }}
              className="w-full py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Limpar Filtros
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Ver Resultados
          </button>
        </div>
      </aside>
    </>
  )
})