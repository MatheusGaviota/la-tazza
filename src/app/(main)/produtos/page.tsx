'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/Cards/ProductCard';
import { ProductFilters } from '@/components/Products';
import { Filter, LayoutGrid, LayoutList, SlidersHorizontal } from 'lucide-react';

// TODO: Remover dados mocados e buscar de uma API/banco de dados
const mockProducts = [
  {
    id: '1',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Expresso Masterpiece',
    description:
      'Blend exclusivo de grãos arábica para um café intenso e encorpado.',
    price: 45.9,
    category: 'Café Especial',
    origin: 'Brasil',
    roast: 'Escuro',
    inStock: true,
  },
  {
    id: '2',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Blend Suave',
    description: 'Combinação equilibrada para um café suave e aromático.',
    price: 39.9,
    category: 'Café Especial',
    origin: 'Colômbia',
    roast: 'Médio',
    inStock: true,
  },
  {
    id: '3',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Origens Premium',
    description: 'Seleção de grãos de origem única para paladares exigentes.',
    price: 59.9,
    category: 'Café Premium',
    origin: 'Etiópia',
    roast: 'Médio',
    inStock: true,
  },
  {
    id: '4',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Café Orgânico',
    description: 'Café cultivado de forma sustentável, sem agrotóxicos.',
    price: 52.9,
    category: 'Café Orgânico',
    origin: 'Peru',
    roast: 'Claro',
    inStock: true,
  },
  {
    id: '5',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Café Gourmet',
    description: 'Grãos selecionados com notas de chocolate e caramelo.',
    price: 68.9,
    category: 'Café Premium',
    origin: 'Brasil',
    roast: 'Escuro',
    inStock: true,
  },
  {
    id: '6',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Café Tradicional',
    description: 'O clássico café brasileiro para o dia a dia.',
    price: 29.9,
    category: 'Café Tradicional',
    origin: 'Brasil',
    roast: 'Médio',
    inStock: true,
  },
  {
    id: '7',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Café Descafeinado',
    description: 'Sabor completo sem cafeína, perfeito para qualquer hora.',
    price: 42.9,
    category: 'Café Especial',
    origin: 'Colômbia',
    roast: 'Médio',
    inStock: false,
  },
  {
    id: '8',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Café Italiano',
    description: 'Blend intenso e aromático ao estilo italiano.',
    price: 54.9,
    category: 'Café Premium',
    origin: 'Itália',
    roast: 'Escuro',
    inStock: true,
  },
];

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name';

export interface ProductFiltersState {
  categories: string[];
  origins: string[];
  roasts: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<ProductFiltersState>({
    categories: [],
    origins: [],
    roasts: [],
    priceRange: [0, 100],
    inStockOnly: false,
  });

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Aplicar filtros
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.origins.length > 0) {
      filtered = filtered.filter((p) => filters.origins.includes(p.origin));
    }

    if (filters.roasts.length > 0) {
      filtered = filtered.filter((p) => filters.roasts.includes(p.roast));
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // relevance - manter ordem original
        break;
    }

    return filtered;
  }, [filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      origins: [],
      roasts: [],
      priceRange: [0, 100],
      inStockOnly: false,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header da Página */}
      <section className="w-full bg-accent/10 border-b-2 border-foreground">
        <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
          <h1 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3">
            Nossos Produtos
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-2xl">
            Descubra nossa seleção exclusiva de cafés especiais, cuidadosamente
            escolhidos para proporcionar a melhor experiência.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-6">
          {/* Sidebar Desktop */}
          <aside
            className={`hidden lg:block transition-all duration-300 ease-in-out ${
              sidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'
            }`}
            aria-label="Filtros de produtos"
          >
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Área Principal */}
          <main className="flex-1 min-w-0">
            {/* Barra de Controles */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Toggle Sidebar (Desktop) */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 border-2 border-foreground rounded-lg hover:bg-accent/10 transition-colors"
                  aria-label={
                    sidebarOpen ? 'Esconder filtros' : 'Mostrar filtros'
                  }
                >
                  <SlidersHorizontal size={20} />
                  <span className="text-sm font-medium">
                    {sidebarOpen ? 'Esconder' : 'Filtros'}
                  </span>
                </button>

                {/* Filtros Mobile */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-foreground rounded-lg hover:bg-accent/10 transition-colors"
                  aria-label="Abrir filtros"
                >
                  <Filter size={20} />
                  <span className="text-sm font-medium">Filtros</span>
                </button>

                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-foreground">
                    {filteredProducts.length}
                  </span>{' '}
                  {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Ordenação */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex-1 sm:flex-none px-3 py-2 border-2 border-foreground rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  aria-label="Ordenar produtos"
                >
                  <option value="relevance">Relevância</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>

                {/* View Mode */}
                <div className="flex border-2 border-foreground rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-accent text-background'
                        : 'bg-background hover:bg-accent/10'
                    }`}
                    aria-label="Visualização em grade"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors border-l-2 border-foreground ${
                      viewMode === 'list'
                        ? 'bg-accent text-background'
                        : 'bg-background hover:bg-accent/10'
                    }`}
                    aria-label="Visualização em lista"
                    aria-pressed={viewMode === 'list'}
                  >
                    <LayoutList size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de Produtos */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    imageUrl={product.imageUrl}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center max-w-md">
                  <Filter
                    size={64}
                    className="mx-auto mb-4 text-foreground/30"
                  />
                  <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-foreground/70 mb-6">
                    Não encontramos produtos com os filtros selecionados. Tente
                    ajustar seus critérios de busca.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Filtros Mobile */}
      {mobileFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="bg-background w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b-2 border-foreground p-4 flex items-center justify-between">
              <h2 className="font-alumni text-2xl font-semibold">Filtros</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                aria-label="Fechar filtros"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleResetFilters}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-4 px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
