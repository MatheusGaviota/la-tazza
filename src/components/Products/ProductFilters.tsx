'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface ProductFiltersProps {
  filters: {
    categories: string[];
    origins: string[];
    roasts: string[];
    priceRange: [number, number];
    inStockOnly: boolean;
  };
  onFiltersChange: (filters: ProductFiltersProps['filters']) => void;
  onReset: () => void;
}

const categories = ['Café Especial', 'Café Premium', 'Café Orgânico', 'Café Tradicional'];
const origins = ['Brasil', 'Colômbia', 'Etiópia', 'Peru', 'Itália'];
const roasts = ['Claro', 'Médio', 'Escuro'];

export default function ProductFilters({
  filters,
  onFiltersChange,
  onReset,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'price', 'origins', 'roasts'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleOriginToggle = (origin: string) => {
    const newOrigins = filters.origins.includes(origin)
      ? filters.origins.filter((o) => o !== origin)
      : [...filters.origins, origin];
    onFiltersChange({ ...filters, origins: newOrigins });
  };

  const handleRoastToggle = (roast: string) => {
    const newRoasts = filters.roasts.includes(roast)
      ? filters.roasts.filter((r) => r !== roast)
      : [...filters.roasts, roast];
    onFiltersChange({ ...filters, roasts: newRoasts });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.origins.length > 0 ||
    filters.roasts.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100 ||
    filters.inStockOnly;

  return (
    <div className="bg-accent text-background border-2 border-accent rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-background/30">
        <h2 className="font-alumni text-2xl font-semibold text-background">
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-background hover:text-background/80 transition-colors font-medium"
            aria-label="Limpar todos os filtros"
          >
            <X size={16} />
            Limpar
          </button>
        )}
      </div>

      {/* Disponibilidade */}
      <div className="pb-4 border-b border-background/20">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFiltersChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-5 h-5 rounded border-2 border-background text-accent focus:ring-2 focus:ring-background cursor-pointer"
          />
          <span className="text-sm font-medium text-background group-hover:text-background/80 transition-colors">
            Apenas em estoque
          </span>
        </label>
      </div>

      {/* Categorias */}
      <div className="border-b border-background/20 pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between py-2 hover:text-background/80 transition-colors text-background"
          aria-expanded={expandedSections.has('categories')}
        >
          <h3 className="font-semibold text-base">Categoria</h3>
          {expandedSections.has('categories') ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
        {expandedSections.has('categories') && (
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 rounded border-2 border-background text-accent focus:ring-2 focus:ring-background cursor-pointer"
                />
                <span className="text-sm text-background group-hover:text-background/80 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Faixa de Preço */}
      <div className="border-b border-background/20 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 hover:text-background/80 transition-colors text-background"
          aria-expanded={expandedSections.has('price')}
        >
          <h3 className="font-semibold text-base">Preço</h3>
          {expandedSections.has('price') ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
        {expandedSections.has('price') && (
          <div className="mt-3 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label htmlFor="price-min" className="text-xs text-background/70 block mb-1">
                  Mínimo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-background/70">
                    R$
                  </span>
                  <input
                    id="price-min"
                    type="number"
                    min="0"
                    max={filters.priceRange[1]}
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(0, Number(e.target.value))
                    }
                    className="w-full pl-9 pr-3 py-2 border-2 border-background rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-background text-sm"
                  />
                </div>
              </div>
              <div className="pt-5 text-background/50">—</div>
              <div className="flex-1">
                <label htmlFor="price-max" className="text-xs text-background/70 block mb-1">
                  Máximo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-background/70">
                    R$
                  </span>
                  <input
                    id="price-max"
                    type="number"
                    min={filters.priceRange[0]}
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(1, Number(e.target.value))
                    }
                    className="w-full pl-9 pr-3 py-2 border-2 border-background rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-background text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full h-2 bg-background/20 rounded-lg appearance-none cursor-pointer accent-background"
                aria-label="Ajustar preço máximo"
              />
            </div>
          </div>
        )}
      </div>

      {/* Origem */}
      <div className="border-b border-background/20 pb-4">
        <button
          onClick={() => toggleSection('origins')}
          className="w-full flex items-center justify-between py-2 hover:text-background/80 transition-colors text-background"
          aria-expanded={expandedSections.has('origins')}
        >
          <h3 className="font-semibold text-base">Origem</h3>
          {expandedSections.has('origins') ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
        {expandedSections.has('origins') && (
          <div className="mt-3 space-y-2">
            {origins.map((origin) => (
              <label
                key={origin}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.origins.includes(origin)}
                  onChange={() => handleOriginToggle(origin)}
                  className="w-4 h-4 rounded border-2 border-background text-accent focus:ring-2 focus:ring-background cursor-pointer"
                />
                <span className="text-sm text-background group-hover:text-background/80 transition-colors">
                  {origin}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Torra */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection('roasts')}
          className="w-full flex items-center justify-between py-2 hover:text-background/80 transition-colors text-background"
          aria-expanded={expandedSections.has('roasts')}
        >
          <h3 className="font-semibold text-base">Torra</h3>
          {expandedSections.has('roasts') ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
        {expandedSections.has('roasts') && (
          <div className="mt-3 space-y-2">
            {roasts.map((roast) => (
              <label
                key={roast}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.roasts.includes(roast)}
                  onChange={() => handleRoastToggle(roast)}
                  className="w-4 h-4 rounded border-2 border-background text-accent focus:ring-2 focus:ring-background cursor-pointer"
                />
                <span className="text-sm text-background group-hover:text-background/80 transition-colors">
                  {roast}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
