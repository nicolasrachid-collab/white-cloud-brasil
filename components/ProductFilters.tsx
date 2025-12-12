import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, ChevronDown, ChevronUp, Search } from './Icons';
import { Product } from '../types';

export interface FilterState {
  priceRange: [number, number];
  inStock: boolean;
  outOfStock: boolean;
  flavors: string[];
  flavorProfiles: string[]; // Perfis de sabor: Frutados, Doces, Gelados/Ice, etc.
  nicotine: string[];
  brands: string[];
  colors: string[];
  categories: string[];
}

// Mapeamento de perfis de sabor
const FLAVOR_PROFILES = {
  'Frutados': ['fruit', 'berry', 'berries', 'grape', 'apple', 'banana', 'strawberry', 'blueberry', 'watermelon', 'mango', 'peach', 'pineapple', 'kiwi', 'dragon', 'pomegranate', 'coconut', 'cherry', 'raspberry', 'blackberry', 'cranberry', 'aloe'],
  'Doces': ['sweet', 'cotton candy', 'candy', 'sugar', 'honey', 'caramel', 'toffee', 'bubblegum', 'gum'],
  'Gelados / Ice': ['ice', 'icy', 'frost', 'freeze', 'chill', 'cool', 'frozen'],
  'Cítricos': ['citrus', 'lemon', 'lime', 'orange', 'tangerine', 'grapefruit', 'lemonade'],
  'Mentolados': ['menthol', 'mint', 'minty', 'peppermint', 'spearmint', 'cool mint'],
  'Tropicais': ['tropical', 'tropic', 'island', 'beach', 'coconut', 'pineapple', 'mango', 'passion', 'punch'],
  'Clássicos': ['tobacco', 'classic', 'traditional', 'original'],
  'Sobremesa / Dessert': ['dessert', 'cream', 'custard', 'vanilla', 'chocolate', 'cake', 'pie', 'pudding', 'tiramisu', 'cheesecake', 'flan'],
  'Bebidas': ['cola', 'soda', 'coffee', 'latte', 'cappuccino', 'tea', 'lemonade', 'juice', 'drink', 'energy', 'smoothie']
};

// Função para determinar o perfil de sabor de um sabor
function getFlavorProfile(flavor: string): string[] {
  const flavorLower = flavor.toLowerCase();
  const profiles: string[] = [];
  
  // Verificar cada perfil
  Object.entries(FLAVOR_PROFILES).forEach(([profile, keywords]) => {
    if (keywords.some(keyword => {
      // Busca exata ou como parte da palavra
      return flavorLower.includes(keyword) || 
             flavorLower.split(/[\s\/-]+/).some(word => word === keyword || word.startsWith(keyword));
    })) {
      profiles.push(profile);
    }
  });
  
  // Se não encontrou nenhum perfil, tentar inferir por palavras comuns
  if (profiles.length === 0) {
    if (flavorLower.includes('ice') || flavorLower.endsWith(' ice')) {
      profiles.push('Gelados / Ice');
    }
    if (flavorLower.includes('fruit') || flavorLower.includes('berry')) {
      profiles.push('Frutados');
    }
  }
  
  return profiles.length > 0 ? profiles : ['Frutados']; // Default para Frutados se não encontrar
}

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<FilterState>;
}

interface FilterGroup {
  id: string;
  title: string;
  options: { value: string; label: string; count: number }[];
  searchPlaceholder: string;
  isExpanded: boolean;
}

export function ProductFilters({ 
  products, 
  onFilterChange, 
  onClearFilters,
  initialFilters 
}: ProductFiltersProps) {
  // Calcular min e max de preço
  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map(p => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  // Estados dos filtros
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || priceRange,
    inStock: initialFilters?.inStock !== undefined ? initialFilters.inStock : true,
    outOfStock: initialFilters?.outOfStock || false,
    flavors: initialFilters?.flavors || [],
    flavorProfiles: initialFilters?.flavorProfiles || [],
    nicotine: initialFilters?.nicotine || [],
    brands: initialFilters?.brands || [],
    colors: initialFilters?.colors || [],
    categories: initialFilters?.categories || [],
  });

  // Estados de busca dentro dos filtros
  const [filterSearches, setFilterSearches] = useState<{ [key: string]: string }>({});
  
  // Estados de expansão dos grupos
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    price: true,
    stock: true,
    flavorProfiles: true,
    flavors: false,
    nicotine: false,
    brands: true, // Expandido por padrão
    colors: false,
  });

  // Atualizar priceRange quando products mudar
  useEffect(() => {
    if (priceRange[0] !== filters.priceRange[0] || priceRange[1] !== filters.priceRange[1]) {
      setFilters(prev => ({
        ...prev,
        priceRange: priceRange,
      }));
    }
  }, [priceRange]);

  // Função auxiliar para calcular opções disponíveis de um tipo específico
  const getAvailableOptionsForType = useCallback((type: 'flavors' | 'nicotine' | 'brands' | 'colors') => {
    // Aplicar filtros básicos (preço e estoque) + outros atributos (exceto o tipo atual)
    const baseFiltered = products.filter(p => {
      const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const stockMatch = 
        (filters.inStock && p.stock > 0) || 
        (filters.outOfStock && p.stock === 0);
      if (!priceMatch || !stockMatch) return false;

      // Aplicar filtro de perfis de sabor
      if (filters.flavorProfiles.length > 0) {
        const productFlavorProfiles = new Set<string>();
        p.flavors?.forEach(flavor => {
          const profiles = getFlavorProfile(flavor);
          profiles.forEach(profile => productFlavorProfiles.add(profile));
        });
        const hasProfile = filters.flavorProfiles.some(profile => productFlavorProfiles.has(profile));
        if (!hasProfile) return false;
      }

      // Aplicar outros filtros de atributos (exceto o tipo que estamos calculando)
      if (type !== 'flavors' && filters.flavors.length > 0) {
        const hasFlavor = filters.flavors.some(f => p.flavors?.includes(f));
        if (!hasFlavor) return false;
      }
      if (type !== 'nicotine' && filters.nicotine.length > 0) {
        const hasNicotine = filters.nicotine.some(n => p.nicotine?.includes(n));
        if (!hasNicotine) return false;
      }
      if (type !== 'brands' && filters.brands.length > 0) {
        if (!p.brand || !filters.brands.includes(p.brand)) return false;
      }
      if (type !== 'colors' && filters.colors.length > 0) {
        if (!p.specifications?.Cor || !filters.colors.includes(p.specifications.Cor)) return false;
      }

      return true;
    });

    // Extrair opções do tipo específico
    const options = new Set<string>();
    baseFiltered.forEach(p => {
      switch (type) {
        case 'flavors':
          p.flavors?.forEach(f => options.add(f));
          break;
        case 'nicotine':
          p.nicotine?.forEach(n => options.add(n));
          break;
        case 'brands':
          if (p.brand) options.add(p.brand);
          break;
        case 'colors':
          if (p.specifications?.Cor) options.add(p.specifications.Cor);
          break;
      }
    });

    return Array.from(options).sort();
  }, [products, filters]);

  // Função para calcular perfis de sabor disponíveis
  const getAvailableFlavorProfiles = useCallback(() => {
    const baseFiltered = products.filter(p => {
      const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const stockMatch = 
        (filters.inStock && p.stock > 0) || 
        (filters.outOfStock && p.stock === 0);
      if (!priceMatch || !stockMatch) return false;

      // Aplicar outros filtros (exceto flavorProfiles)
      if (filters.flavors.length > 0) {
        const hasFlavor = filters.flavors.some(f => p.flavors?.includes(f));
        if (!hasFlavor) return false;
      }
      if (filters.nicotine.length > 0) {
        const hasNicotine = filters.nicotine.some(n => p.nicotine?.includes(n));
        if (!hasNicotine) return false;
      }
      if (filters.brands.length > 0) {
        if (!p.brand || !filters.brands.includes(p.brand)) return false;
      }
      if (filters.colors.length > 0) {
        if (!p.specifications?.Cor || !filters.colors.includes(p.specifications.Cor)) return false;
      }

      return true;
    });

    // Extrair perfis de sabor disponíveis
    const profiles = new Set<string>();
    baseFiltered.forEach(p => {
      p.flavors?.forEach(flavor => {
        const flavorProfiles = getFlavorProfile(flavor);
        flavorProfiles.forEach(profile => profiles.add(profile));
      });
    });

    return Array.from(profiles).sort();
  }, [products, filters]);

  // Extrair opções disponíveis dos produtos (com filtro em cascata)
  const availableOptions = useMemo(() => {
    return {
      flavors: getAvailableOptionsForType('flavors'),
      nicotine: getAvailableOptionsForType('nicotine'),
      brands: getAvailableOptionsForType('brands'),
      colors: getAvailableOptionsForType('colors'),
    };
  }, [getAvailableOptionsForType]);

  // Contar produtos por perfil de sabor
  const getFlavorProfileCount = useCallback((profile: string) => {
    return products.filter(p => {
      const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const stockMatch = 
        (filters.inStock && p.stock > 0) || 
        (filters.outOfStock && p.stock === 0);
      if (!priceMatch || !stockMatch) return false;

      // Aplicar outros filtros (exceto flavorProfiles)
      const otherFilters = {
        flavorProfiles: filters.flavorProfiles.filter(p => p !== profile),
        flavors: filters.flavors,
        nicotine: filters.nicotine,
        brands: filters.brands,
        colors: filters.colors,
      };

      if (otherFilters.flavorProfiles.length > 0) {
        const productFlavorProfiles = new Set<string>();
        p.flavors?.forEach(flavor => {
          const profiles = getFlavorProfile(flavor);
          profiles.forEach(prof => productFlavorProfiles.add(prof));
        });
        const hasOtherProfile = otherFilters.flavorProfiles.some(prof => productFlavorProfiles.has(prof));
        if (!hasOtherProfile) return false;
      }

      if (otherFilters.flavors.length > 0) {
        const hasFlavor = otherFilters.flavors.some(f => p.flavors?.includes(f));
        if (!hasFlavor) return false;
      }
      if (otherFilters.nicotine.length > 0) {
        const hasNicotine = otherFilters.nicotine.some(n => p.nicotine?.includes(n));
        if (!hasNicotine) return false;
      }
      if (otherFilters.brands.length > 0) {
        if (!p.brand || !otherFilters.brands.includes(p.brand)) return false;
      }
      if (otherFilters.colors.length > 0) {
        if (!p.specifications?.Cor || !otherFilters.colors.includes(p.specifications.Cor)) return false;
      }

      // Verificar se o produto tem este perfil de sabor
      const productFlavorProfiles = new Set<string>();
      p.flavors?.forEach(flavor => {
        const profiles = getFlavorProfile(flavor);
        profiles.forEach(prof => productFlavorProfiles.add(prof));
      });
      return productFlavorProfiles.has(profile);
    }).length;
  }, [products, filters]);

  // Contar produtos por opção
  const getOptionCount = useCallback((type: 'flavors' | 'nicotine' | 'brands' | 'colors', value: string) => {
    return products.filter(p => {
      const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const stockMatch = 
        (filters.inStock && p.stock > 0) || 
        (filters.outOfStock && p.stock === 0);
      
      if (!priceMatch || !stockMatch) return false;

      // Aplicar outros filtros do mesmo tipo
      const otherFilters = {
        flavorProfiles: filters.flavorProfiles,
        flavors: filters.flavors.filter(f => f !== value),
        nicotine: filters.nicotine.filter(n => n !== value),
        brands: filters.brands.filter(b => b !== value),
        colors: filters.colors.filter(c => c !== value),
      };

      // Verificar perfis de sabor
      if (otherFilters.flavorProfiles.length > 0) {
        const productFlavorProfiles = new Set<string>();
        p.flavors?.forEach(flavor => {
          const profiles = getFlavorProfile(flavor);
          profiles.forEach(prof => productFlavorProfiles.add(prof));
        });
        const hasProfile = otherFilters.flavorProfiles.some(prof => productFlavorProfiles.has(prof));
        if (!hasProfile) return false;
      }

      const matchesOtherFlavors = otherFilters.flavors.length === 0 || 
        otherFilters.flavors.some(f => p.flavors?.includes(f));
      const matchesOtherNicotine = otherFilters.nicotine.length === 0 || 
        otherFilters.nicotine.some(n => p.nicotine?.includes(n));
      const matchesOtherBrands = otherFilters.brands.length === 0 || 
        (p.brand && otherFilters.brands.includes(p.brand));
      const matchesOtherColors = otherFilters.colors.length === 0 || 
        (p.specifications?.Cor && otherFilters.colors.includes(p.specifications.Cor));

      if (!matchesOtherFlavors || !matchesOtherNicotine || !matchesOtherBrands || !matchesOtherColors) {
        return false;
      }

      // Verificar se o produto tem esta opção específica
      switch (type) {
        case 'flavors':
          return p.flavors?.includes(value) || false;
        case 'nicotine':
          return p.nicotine?.includes(value) || false;
        case 'brands':
          return p.brand === value;
        case 'colors':
          return p.specifications?.Cor === value;
        default:
          return false;
      }
    }).length;
  }, [products, filters]);

  // Aplicar filtros aos produtos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Filtro de preço
      const priceMatch = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      if (!priceMatch) return false;

      // Filtro de estoque
      const stockMatch = 
        (filters.inStock && p.stock > 0) || 
        (filters.outOfStock && p.stock === 0);
      if (!stockMatch) return false;

      // Filtro de perfis de sabor
      if (filters.flavorProfiles.length > 0) {
        const productFlavorProfiles = new Set<string>();
        p.flavors?.forEach(flavor => {
          const profiles = getFlavorProfile(flavor);
          profiles.forEach(profile => productFlavorProfiles.add(profile));
        });
        const hasProfile = filters.flavorProfiles.some(profile => productFlavorProfiles.has(profile));
        if (!hasProfile) return false;
      }

      // Filtro de sabores
      if (filters.flavors.length > 0) {
        const hasFlavor = filters.flavors.some(f => p.flavors?.includes(f));
        if (!hasFlavor) return false;
      }

      // Filtro de nicotina
      if (filters.nicotine.length > 0) {
        const hasNicotine = filters.nicotine.some(n => p.nicotine?.includes(n));
        if (!hasNicotine) return false;
      }

      // Filtro de marcas
      if (filters.brands.length > 0) {
        if (!p.brand || !filters.brands.includes(p.brand)) return false;
      }

      // Filtro de cores
      if (filters.colors.length > 0) {
        if (!p.specifications?.Cor || !filters.colors.includes(p.specifications.Cor)) return false;
      }

      return true;
    });
  }, [products, filters]);

  // Notificar mudanças nos filtros
  useEffect(() => {
    onFilterChange(filteredProducts);
  }, [filteredProducts, onFilterChange]);

  // Persistir filtros no localStorage
  useEffect(() => {
    localStorage.setItem('product_filters', JSON.stringify(filters));
  }, [filters]);

  // Carregar filtros do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('product_filters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFilters(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // Ignorar erro
      }
    }
  }, []);

  // Handlers
  const handlePriceChange = (index: 0 | 1, value: number) => {
    setFilters(prev => {
      const newRange: [number, number] = [...prev.priceRange];
      newRange[index] = value;
      if (newRange[0] > newRange[1]) {
        if (index === 0) newRange[1] = newRange[0];
        else newRange[0] = newRange[1];
      }
      return { ...prev, priceRange: newRange };
    });
  };

  const handleToggleFilter = (type: 'flavors' | 'flavorProfiles' | 'nicotine' | 'brands' | 'colors', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: newValue };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: priceRange,
      inStock: true,
      outOfStock: false,
      flavors: [],
      flavorProfiles: [],
      nicotine: [],
      brands: [],
      colors: [],
      categories: [],
    });
    setFilterSearches({});
    onClearFilters();
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Filtrar opções por busca
  const getFilteredOptions = (type: 'flavors' | 'nicotine' | 'brands' | 'colors') => {
    const searchTerm = filterSearches[type]?.toLowerCase() || '';
    const options = availableOptions[type];
    return options
      .filter(opt => opt.toLowerCase().includes(searchTerm))
      .map(opt => ({
        value: opt,
        label: opt,
        count: getOptionCount(type, opt),
      }))
      .filter(opt => opt.count > 0); // Mostrar apenas opções com produtos disponíveis
  };

  const hasActiveFilters = 
    filters.flavorProfiles.length > 0 ||
    filters.flavors.length > 0 ||
    filters.nicotine.length > 0 ||
    filters.brands.length > 0 ||
    filters.colors.length > 0 ||
    !filters.inStock ||
    filters.outOfStock ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header com botão Limpar */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 active:text-primary-700 transition-colors flex items-center gap-1 min-h-[44px] px-2 touch-manipulation"
            aria-label="Limpar todos os filtros"
          >
            <X className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Filtro de Estoque */}
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <button
          onClick={() => toggleGroup('stock')}
          className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
          aria-expanded={expandedGroups.stock}
          aria-controls="stock-filter-content"
        >
          <h4 className="text-sm sm:text-base font-semibold text-gray-900">Disponibilidade</h4>
          {expandedGroups.stock ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
          )}
        </button>
        
        {expandedGroups.stock && (
          <div id="stock-filter-content" className="space-y-2 sm:space-y-3">
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px] px-1 touch-manipulation hover:bg-gray-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="w-5 h-5 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                aria-label="Filtrar produtos em estoque"
              />
              <span className="text-sm text-gray-700">Em Estoque</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px] px-1 touch-manipulation hover:bg-gray-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.outOfStock}
                onChange={(e) => setFilters(prev => ({ ...prev, outOfStock: e.target.checked }))}
                className="w-5 h-5 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                aria-label="Filtrar produtos fora de estoque"
              />
              <span className="text-sm text-gray-700">Fora de Estoque</span>
            </label>
          </div>
        )}
      </div>

      {/* Filtro de Perfis de Sabor */}
      {getAvailableFlavorProfiles().length > 0 && (
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <button
            onClick={() => toggleGroup('flavorProfiles')}
            className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
            aria-expanded={expandedGroups.flavorProfiles}
            aria-controls="flavorProfiles-filter-content"
          >
            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Perfis de Sabor</h4>
            {expandedGroups.flavorProfiles ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            )}
          </button>
          
          {expandedGroups.flavorProfiles && (
            <div id="flavorProfiles-filter-content" className="space-y-2">
              {Object.keys(FLAVOR_PROFILES).map(profile => {
                const count = getFlavorProfileCount(profile);
                if (count === 0) return null;
                
                return (
                  <label key={profile} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-2 rounded min-h-[44px] touch-manipulation transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.flavorProfiles.includes(profile)}
                      onChange={() => handleToggleFilter('flavorProfiles', profile)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                      aria-label={`Filtrar por perfil de sabor ${profile}`}
                    />
                    <span className="text-sm text-gray-700 flex-1">{profile}</span>
                    <span className="text-xs text-gray-500">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filtro de Sabores */}
      {availableOptions.flavors.length > 0 && (
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <button
            onClick={() => toggleGroup('flavors')}
            className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
            aria-expanded={expandedGroups.flavors}
            aria-controls="flavors-filter-content"
          >
            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Sabores</h4>
            {expandedGroups.flavors ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            )}
          </button>
          
          {expandedGroups.flavors && (
            <div id="flavors-filter-content" className="space-y-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar sabor..."
                  value={filterSearches.flavors || ''}
                  onChange={(e) => setFilterSearches(prev => ({ ...prev, flavors: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                  aria-label="Buscar sabor"
                />
              </div>

              {/* Lista de opções */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {getFilteredOptions('flavors').map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-2 rounded min-h-[44px] touch-manipulation transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.flavors.includes(option.value)}
                      onChange={() => handleToggleFilter('flavors', option.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                      aria-label={`Filtrar por sabor ${option.label}`}
                    />
                    <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtro de Nicotina */}
      {availableOptions.nicotine.length > 0 && (
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <button
            onClick={() => toggleGroup('nicotine')}
            className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
            aria-expanded={expandedGroups.nicotine}
            aria-controls="nicotine-filter-content"
          >
            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Teor de Nicotina</h4>
            {expandedGroups.nicotine ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            )}
          </button>
          
          {expandedGroups.nicotine && (
            <div id="nicotine-filter-content" className="space-y-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar teor..."
                  value={filterSearches.nicotine || ''}
                  onChange={(e) => setFilterSearches(prev => ({ ...prev, nicotine: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                  aria-label="Buscar teor de nicotina"
                />
              </div>

              {/* Lista de opções */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {getFilteredOptions('nicotine').map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-2 rounded min-h-[44px] touch-manipulation transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.nicotine.includes(option.value)}
                      onChange={() => handleToggleFilter('nicotine', option.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                      aria-label={`Filtrar por teor de nicotina ${option.label}`}
                    />
                    <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtro de Marcas */}
      {availableOptions.brands.length > 0 && (
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <button
            onClick={() => toggleGroup('brands')}
            className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
            aria-expanded={expandedGroups.brands}
            aria-controls="brands-filter-content"
          >
            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Marcas</h4>
            {expandedGroups.brands ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            )}
          </button>
          
          {expandedGroups.brands && (
            <div id="brands-filter-content" className="space-y-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar marca..."
                  value={filterSearches.brands || ''}
                  onChange={(e) => setFilterSearches(prev => ({ ...prev, brands: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                  aria-label="Buscar marca"
                />
              </div>

              {/* Lista de opções */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {getFilteredOptions('brands').map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-2 rounded min-h-[44px] touch-manipulation transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(option.value)}
                      onChange={() => handleToggleFilter('brands', option.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                      aria-label={`Filtrar por marca ${option.value}`}
                    />
                    <span className="text-sm text-gray-700 flex-1">{option.value}</span>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtro de Cores */}
      {availableOptions.colors.length > 0 && (
        <div className="border-b border-gray-200 pb-3 sm:pb-4">
          <button
            onClick={() => toggleGroup('colors')}
            className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
            aria-expanded={expandedGroups.colors}
            aria-controls="colors-filter-content"
          >
            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Cores</h4>
            {expandedGroups.colors ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            )}
          </button>
          
          {expandedGroups.colors && (
            <div id="colors-filter-content" className="space-y-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar cor..."
                  value={filterSearches.colors || ''}
                  onChange={(e) => setFilterSearches(prev => ({ ...prev, colors: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                  aria-label="Buscar cor"
                />
              </div>

              {/* Lista de opções */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {getFilteredOptions('colors').map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 p-2 rounded min-h-[44px] touch-manipulation transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(option.value)}
                      onChange={() => handleToggleFilter('colors', option.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                      aria-label={`Filtrar por cor ${option.value}`}
                    />
                    <span className="text-sm text-gray-700 flex-1">{option.value}</span>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtro de Preço - Sempre o último */}
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <button
          onClick={() => toggleGroup('price')}
          className="w-full flex items-center justify-between text-left mb-2 sm:mb-3 min-h-[44px] px-1 touch-manipulation"
          aria-expanded={expandedGroups.price}
          aria-controls="price-filter-content"
        >
          <h4 className="text-sm sm:text-base font-semibold text-gray-900">Preço</h4>
          {expandedGroups.price ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
          )}
        </button>
        
        {expandedGroups.price && (
          <div id="price-filter-content" className="space-y-3 sm:space-y-4">
            {/* Slider Duplo */}
            <div className="relative h-10 sm:h-8 touch-manipulation">
              {/* Track de fundo */}
              <div className="absolute top-1/2 left-0 right-0 h-2.5 sm:h-2 bg-gray-200 rounded-lg -translate-y-1/2"></div>
              
              {/* Track ativo (entre os dois valores) */}
              <div 
                className="absolute top-1/2 h-2.5 sm:h-2 bg-primary-600 rounded-lg -translate-y-1/2"
                style={{
                  left: `${((filters.priceRange[0] - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
                  width: `${((filters.priceRange[1] - filters.priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
                }}
              ></div>
              
              {/* Slider mínimo */}
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handlePriceChange(0, Math.min(val, filters.priceRange[1]));
                }}
                className="absolute top-1/2 w-full h-6 sm:h-4 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb z-10 -translate-y-1/2 touch-manipulation"
                aria-label="Preço mínimo"
                aria-valuemin={priceRange[0]}
                aria-valuemax={priceRange[1]}
                aria-valuenow={filters.priceRange[0]}
              />
              
              {/* Slider máximo */}
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handlePriceChange(1, Math.max(val, filters.priceRange[0]));
                }}
                className="absolute top-1/2 w-full h-6 sm:h-4 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb z-10 -translate-y-1/2 touch-manipulation"
                aria-label="Preço máximo"
                aria-valuemin={priceRange[0]}
                aria-valuemax={priceRange[1]}
                aria-valuenow={filters.priceRange[1]}
              />
            </div>

            {/* Valores */}
            <div className="flex items-end justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block" htmlFor="price-min">Mínimo</label>
                <div className="relative">
                  <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input
                    id="price-min"
                    type="number"
                    min={priceRange[0]}
                    max={filters.priceRange[1]}
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || priceRange[0])}
                    className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                    aria-label="Preço mínimo em reais"
                  />
                </div>
              </div>
              <span className="text-gray-400 mb-2 sm:mb-0">-</span>
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block" htmlFor="price-max">Máximo</label>
                <div className="relative">
                  <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input
                    id="price-max"
                    type="number"
                    min={filters.priceRange[0]}
                    max={priceRange[1]}
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || priceRange[1])}
                    className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-h-[44px]"
                    aria-label="Preço máximo em reais"
                  />
                </div>
              </div>
            </div>

            {/* Display atual */}
            <div className="text-center text-sm font-medium text-primary-600">
              R$ {filters.priceRange[0]} – R$ {filters.priceRange[1]}
            </div>
          </div>
        )}
      </div>

      {/* Botão Limpar no final */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] touch-manipulation"
          aria-label="Limpar todos os filtros aplicados"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
}

