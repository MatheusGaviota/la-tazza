'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/Cards/ProductCard';
import { ProductFilters } from '@/components/Products';
import {
  Filter,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
} from 'lucide-react';
import { PageHero } from '@/components/Layout';
import { getProducts } from '@/lib/admin.service';
import { Product } from '@/types/admin.types';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name';

export interface ProductFiltersState {
  categories: string[];
  origins: string[];
  roasts: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<ProductFiltersState>({
    categories: [],
    origins: [],
    roasts: [],
    priceRange: [0, 200],
    inStockOnly: false,
  });

  // Update page title for SEO
  useEffect(() => {
    document.title = 'Produtos - Cafés Especiais | La Tazza';
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Não foi possível carregar os produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Aplicar filtros
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    if (filters.origins.length > 0 && filters.origins.some((o) => o)) {
      filtered = filtered.filter(
        (p) => p.origin && filters.origins.includes(p.origin)
      );
    }

    if (filters.roasts.length > 0 && filters.roasts.some((r) => r)) {
      filtered = filtered.filter(
        (p) => p.roast && filters.roasts.includes(p.roast)
      );
    }

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
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
  }, [products, filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      origins: [],
      roasts: [],
      priceRange: [0, 200],
      inStockOnly: false,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHero
          title="Nossos Produtos"
          description="Descubra nossa seleção exclusiva de cafés especiais, cuidadosamente escolhidos para proporcionar a melhor experiência."
        />
        <div className="max-w-[1400px] mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent mb-4" />
            <p className="text-foreground/70">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen">
        <PageHero
          title="Nossos Produtos"
          description="Descubra nossa seleção exclusiva de cafés especiais, cuidadosamente escolhidos para proporcionar a melhor experiência."
        />
        <div className="max-w-[1400px] mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Erro ao Carregar Produtos
            </h3>
            <p className="text-foreground/70 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header da Página */}
      <PageHero
        title="Nossos Produtos"
        description="Descubra nossa seleção exclusiva de cafés especiais, cuidadosamente escolhidos para proporcionar a melhor experiência."
      />

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
                  {filteredProducts.length === 1
                    ? 'produto encontrado'
                    : 'produtos encontrados'}
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
