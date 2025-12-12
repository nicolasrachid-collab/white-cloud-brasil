import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Routes, Route, useParams, useNavigate as useNavigateRouter } from 'react-router-dom';
import { 
  ShoppingCart, Search, Menu, X, User, Star, Truck, ShieldCheck, 
  CreditCard, ArrowRight, Minus, Plus, Trash2, 
  MapPin, CheckCircle, TrendingUp, DollarSign, 
  Users, ChevronLeft, ChevronRight, ChevronDown, Mail, Instagram, Facebook, Youtube, Twitter,
  Heart, Eye, Share2, Calendar, MessageCircle
} from './components/Icons';
import { Button } from './components/Button';
import Toast from './components/Toast';
import { EmailCapture } from './components/EmailCapture';
import { CartBadge } from './components/CartBadge';
import { FavoritesBadge } from './components/FavoritesBadge';
import { QuickViewModal } from './components/QuickViewModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductCardSkeleton, ProductGridSkeleton, ProductDetailSkeleton } from './components/Skeleton';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProductFilters } from './components/ProductFilters';
import { useToast } from './hooks/useToast';
import { useDebounce } from './hooks/useDebounce';
import { useCart } from './contexts/CartContext';
import { useApp } from './contexts/AppContext';
import { useFavorites } from './contexts/FavoritesContext';
import { useProducts } from './contexts/ProductsContext';
import { MOCK_PRODUCTS, CATEGORIES, HERO_BANNERS, BRANDS, MenuItem } from './constants';
import { Logos3 } from './components/ui/Logos3';
import { Product, CartItem, ViewState, Order, Review } from './types';

// --- CONFIGURAÃ‡ÃƒO DO LOGOTIPO ---
// IMPORTANTE: Caminhos locais (C:\Users...) NÃƒO funcionam em navegadores web.
// Mova seu arquivo 'logo.png' para a pasta 'public/images/' do projeto.
const LOGO_URL = "/images/logo-whitecloud.png";

// --- COMPONENTS ---

const Header = () => {
  const { searchTerm, setSearchTerm } = useApp();
  const navigateRouter = useNavigateRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [categorySearch, setCategorySearch] = useState<Record<string, string>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fecha o menu se a tela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Impede o scroll do body quando o menu estÃ¡ aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Função para abrir dropdown com delay
  const handleMouseEnter = (categoryId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(categoryId);
  };

  // Função para fechar dropdown com delay
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200); // Delay de 200ms antes de fechar
  };

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Função para atualizar busca de uma categoria específica
  const handleCategorySearch = (categoryKey: string, value: string) => {
    setCategorySearch(prev => ({
      ...prev,
      [categoryKey]: value
    }));
  };

  // Função para filtrar itens baseado na busca
  const filterItems = (items: string[], searchValue: string) => {
    if (!searchValue) return items;
    return items.filter(item => 
      item.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  return (
    <>
      {/* Mini Banner de Destaque */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-b border-primary-100 relative z-[60] banner-shimmer">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base font-bold text-gray-900 mb-0.5">
                Mega Promoção Monstrinho Misterioso
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                A cada R$400,00 em compra, leve um Labubu Misterioso
              </p>
            </div>
            <button 
              onClick={() => navigateRouter('/catalogo')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors whitespace-nowrap text-sm sm:text-base shadow-md hover:shadow-lg relative z-10"
            >
              Confira
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 w-full overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 h-20 sm:h-24 md:h-28 flex items-center justify-between gap-3 sm:gap-6 md:gap-8 max-w-full">
          {/* Logo */}
          <div 
            className="cursor-pointer flex-shrink-0"
            onClick={() => navigateRouter('/')}
          >
            <img 
              src={LOGO_URL} 
              alt="White Cloud Brasil" 
              className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform hover:scale-105"
              onError={(e) => {
                // Fallback caso a imagem nÃ£o exista
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-gray-900">WHITE CLOUD <span class="text-primary-600">BRASIL</span></span>';
              }}
            />
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Pesquise seu produto na White Cloud :)"
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 text-sm font-medium text-gray-700">
             {/* Mobile Menu Trigger */}
             <button 
               className="lg:hidden p-2 -mr-2 text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center" 
               onClick={() => setIsMenuOpen(true)}
               aria-label="Abrir menu"
               aria-expanded={isMenuOpen}
             >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
             </button>

             {/* Login/Cadastro Button */}
             <button 
              className="hidden sm:flex items-center hover:text-primary-600 transition-colors min-h-[44px] cursor-pointer"
              onClick={() => navigateRouter('/conta')}
              aria-label="Entrar ou criar conta"
             >
               <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
               <div className="flex flex-col items-start leading-tight">
                 <span className="text-xs sm:text-sm font-medium">Entrar</span>
                 <span className="text-[10px] text-gray-500">ou criar conta</span>
               </div>
             </button>

             <button 
              className="relative cursor-pointer flex items-center hover:text-primary-600 transition-colors min-h-[44px]"
              onClick={() => navigateRouter('/favoritos')}
              aria-label="Ver favoritos"
             >
                <div className="relative p-1">
                   <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                   <FavoritesBadge />
                </div>
                <span className="hidden sm:block lg:block ml-2 leading-none">
                   Favoritos
                </span>
             </button>

             <button 
              className="relative cursor-pointer flex items-center hover:text-primary-600 transition-colors min-h-[44px]"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrinho"
             >
                <div className="relative p-1">
                   <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                   <CartBadge />
                </div>
                <span className="hidden sm:block lg:block ml-2 leading-none">
                   Carrinho
                </span>
             </button>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <nav className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <ul className="flex items-center justify-between gap-4 sm:gap-6 text-sm font-medium text-gray-600 py-3">
              {CATEGORIES.map(cat => (
                <li 
                  key={cat.id} 
                  className="relative"
                  onMouseEnter={() => cat.hasDropdown && handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {cat.hasDropdown ? (
                    <>
                  <button 
                        className={`hover:text-primary-600 transition-colors py-1 relative uppercase flex items-center gap-1 ${cat.isHighlight ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 px-3 rounded-full hover:from-primary-800 hover:to-primary-900 hover:text-white highlight-button-shimmer transition-all duration-300 ease-in-out' : ''}`}
                      >
                        <span className={cat.isHighlight ? 'relative z-10' : ''}>{cat.name}</span>
                        <ChevronDown className={`w-3 h-3 opacity-60 transition-all duration-300 ${openDropdown === cat.id ? 'opacity-100 rotate-180' : ''}`} />
                        {!cat.isHighlight && <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all ${openDropdown === cat.id ? 'w-full' : 'w-0'}`}></span>}
                      </button>
                      
                      {/* Dropdown Menu - Design Moderno */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[90vw] max-w-[900px] bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 z-[60] ${
                        openDropdown === cat.id 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      }`}>
                        {/* Padding invisível no topo para facilitar transição do mouse */}
                        <div className="absolute -top-4 left-0 right-0 h-4 pointer-events-auto"></div>
                        <div className="overflow-hidden">
                        {/* Header do Dropdown com gradiente sutil e campo de busca */}
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-100 px-6 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                {cat.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">Explore nossa seleção completa</p>
                            </div>
                          </div>
                          
                          {/* Campo de busca único */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="Buscar em todas as categorias..."
                              value={categorySearch[cat.id] || ''}
                              onChange={(e) => handleCategorySearch(cat.id, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        <div className="p-6">
                          {cat.submenu?.categories ? (
                            // Menu com categorias organizadas (Juices)
                            <div className="grid grid-cols-5 gap-6">
                              {cat.submenu.categories.map((category, idx) => {
                                const searchValue = categorySearch[cat.id] || '';
                                const filteredItems = filterItems(category.items, searchValue);
                                
                                return (
                                  <div key={idx} className="group/category">
                                    {/* Título da categoria com linha decorativa */}
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-primary-200 group-hover/category:border-primary-500 transition-colors">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                                        {category.title}
                                      </h4>
                                    </div>
                                    
                                    {/* Lista de itens filtrados */}
                                    <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                                      {filteredItems.length > 0 ? (
                                        filteredItems.map((item, itemIdx) => (
                                          <li key={itemIdx}>
                                            <button
                                              onClick={() => navigateRouter('/catalogo')}
                                              className="text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 text-left w-full px-2 py-1.5 rounded-md group/item"
                                            >
                                              <span className="relative">
                                                {item}
                                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover/item:w-full transition-all duration-200"></span>
                                              </span>
                                            </button>
                                          </li>
                                        ))
                                      ) : (
                                        <li className="text-xs text-gray-400 py-2 text-center">
                                          Nenhum item encontrado
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          ) : cat.submenu?.sections ? (
                            // Menu com seções (SaltNic) - Layout em 2 colunas
                            <div className="grid grid-cols-2 gap-8">
                              {cat.submenu.sections.map((section, idx) => {
                                const searchValue = categorySearch[cat.id] || '';
                                const filteredItems = filterItems(section.items, searchValue);
                                
                                return (
                                  <div key={idx} className="group/section">
                                    {/* Título da seção */}
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-primary-200 group-hover/section:border-primary-500 transition-colors">
                                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                                        {section.title}
                                      </h4>
                                    </div>
                                    
                                    {/* Grid de itens em 2 colunas filtrados */}
                                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-80 overflow-y-auto">
                                      {filteredItems.length > 0 ? (
                                        filteredItems.map((item, itemIdx) => (
                                          <li key={itemIdx}>
                                            <button
                                              onClick={() => navigateRouter('/catalogo')}
                                              className="text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 text-left w-full px-3 py-2 rounded-lg group/item"
                                            >
                                              <span className="relative">
                                                {item}
                                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover/item:w-full transition-all duration-200"></span>
                                              </span>
                                            </button>
                                          </li>
                                        ))
                                      ) : (
                                        <li className="col-span-2 text-sm text-gray-400 py-4 text-center">
                                          Nenhum item encontrado
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            // Menu simples (Pods, Coils, etc.) - Layout em grid moderno com busca
                            <div>
                              {/* Campo de busca global para menu simples */}
                              <div className="mb-4">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                  <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={categorySearch[cat.id] || ''}
                                    onChange={(e) => handleCategorySearch(cat.id, e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              
                              {/* Grid de itens filtrados */}
                              <div className="grid grid-cols-4 gap-4">
                                {filterItems(cat.submenu?.items || [], categorySearch[cat.id] || '').length > 0 ? (
                                  filterItems(cat.submenu?.items || [], categorySearch[cat.id] || '').map((item, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => navigateRouter('/catalogo')}
                                      className="group/item relative p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50 transition-all duration-200 text-left"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover/item:bg-primary-500 transition-colors"></div>
                                        <span className="text-sm font-medium text-gray-700 group-hover/item:text-primary-700 transition-colors">
                                          {item}
                                        </span>
                                      </div>
                                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover/item:w-full transition-all duration-200"></div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="col-span-4 text-sm text-gray-400 py-4 text-center">
                                    Nenhum item encontrado
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer do Dropdown */}
                        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3">
                          <button
                            onClick={() => navigateRouter('/catalogo')}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
                          >
                            Ver todos os produtos
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Link simples (Promoções e Perfumes)
                    <button 
                      onClick={() => navigateRouter('/catalogo')}
                      className={`hover:text-primary-600 transition-colors py-1 relative uppercase ${cat.isHighlight ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 px-3 rounded-full hover:from-primary-800 hover:to-primary-900 hover:text-white highlight-button-shimmer transition-all duration-300 ease-in-out' : ''}`}
                    >
                      <span className={cat.isHighlight ? 'relative z-10' : ''}>{cat.name}</span>
                    {!cat.isHighlight && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>}
                  </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay & Drawer */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside 
        className={`fixed top-0 left-0 z-[70] h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
            <img 
              src={LOGO_URL} 
              alt="White Cloud Brasil" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-lg font-black tracking-tighter text-gray-900">WHITE CLOUD <span class="text-primary-600">BRASIL</span></span>';
              }}
            />
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Mobile Search */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Account Links */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <button 
                onClick={() => { navigateRouter('/favoritos'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2 text-gray-700 font-medium hover:text-primary-600"
              >
                <div className="bg-red-50 p-2 rounded-full mr-3 relative">
                   <Heart className="w-5 h-5 text-red-500" />
                   <FavoritesBadge />
                </div>
                <span>Meus Favoritos</span>
              </button>

              <button 
                onClick={() => { navigateRouter('/conta'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2 text-gray-700 font-medium hover:text-primary-600 mt-2"
              >
                <div className="bg-primary-50 p-2 rounded-full mr-3">
                   <User className="w-5 h-5 text-primary-600" />
                </div>
                <span>Minha Conta</span>
              </button>
            </div>

            {/* Mobile Categories */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categorias</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => { navigateRouter('/catalogo'); setIsMenuOpen(false); }}
                  className={`flex items-center justify-between w-full text-left py-3 px-2 rounded-lg transition-colors ${
                    cat.isHighlight 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold highlight-button-shimmer' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span className={cat.isHighlight ? 'relative z-10' : ''}>{cat.name}</span>
                  {!cat.isHighlight && <ChevronRight className="w-4 h-4 text-gray-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">Â© 2025 White Cloud Brasil</p>
          </div>
        </div>
      </aside>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const ProductCard: React.FC<{ 
  product: Product; 
  onClick: () => void;
  onQuickView?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}> = ({ product, onClick, onQuickView, onQuickAdd }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showSuccess } = useToast();
  const hasSecondImage = product.images && product.images.length > 1;
  const mainImage = product.images[0];
  const hoverImage = hasSecondImage ? product.images[1] : null;
  const favorited = isFavorite(product.id);
  
  // Verificar se o produto tem opções de miligramagem
  const hasNicotineOptions = product.nicotine && product.nicotine.length > 0;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
    if (favorited) {
      showSuccess(`${product.name} removido dos favoritos`);
    } else {
      showSuccess(`${product.name} adicionado aos favoritos`);
    }
  };

  return (
    <div 
      className="group bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full w-full relative hover:shadow-xl sm:hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-primary-200 hover:z-10"
      onClick={onClick}
    >
      {/* Floating Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.originalPrice && (
          <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
        {product.isNew && (
          <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
            NOVO
          </span>
        )}
      </div>

      {/* BotÃ£o de Favorito */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 z-30 p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95 border border-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={favorited ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
      >
        <Heart 
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
            favorited 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400 hover:text-red-400'
          }`}
        />
      </button>

      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {/* Placeholder Skeleton */}
        <div className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        
        {/* Imagem principal */}
        <img 
          src={mainImage} 
          alt={product.name} 
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${hasSecondImage && hoverImageLoaded ? 'group-hover:opacity-0' : ''}`}
        />
        
        {/* Imagem hover (segunda imagem) */}
        {hasSecondImage && hoverImage && (
          <img 
            src={hoverImage} 
            alt={`${product.name} - Vista alternativa`} 
            loading="lazy"
            decoding="async"
            onLoad={() => setHoverImageLoaded(true)}
            className={`absolute inset-0 object-cover w-full h-full transition-all duration-700 group-hover:scale-105 ${
              hoverImageLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
            }`}
          />
        )}
        
        {/* Overlay com botÃµes no hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex items-center justify-center">
          <div className="flex flex-col gap-3 px-4 w-full max-w-[200px]">
            <button 
              className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg min-h-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickView) {
                  onQuickView(product);
                }
              }}
              aria-label="Compra rápida"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Compra rápida</span>
              <span className="sm:hidden">Ver</span>
            </button>
            
            <button 
              className="w-full bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-lg min-h-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                onClick(); // Sempre navega para a página do produto
              }}
              aria-label="Ver detalhes do produto"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Tags de Miligramagem */}
        {hasNicotineOptions && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {product.nicotine.map((nicotine) => (
              <span 
                key={nicotine}
                className="inline-block px-2.5 py-1.5 text-xs sm:text-sm bg-primary-50 text-primary-700 rounded-md font-medium hover:bg-primary-600 hover:text-white transition-colors cursor-pointer"
              >
                {nicotine}
              </span>
            ))}
          </div>
        )}
        
        <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through block mb-0.5">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <div className="flex items-end gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">Ã  vista</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">
            ou em até 12x no cartão
          </p>
        </div>
      </div>
    </div>
  );
};

const HeroSlider = () => {
  const { navigate } = useApp();
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const displayBanners = HERO_BANNERS;

  useEffect(() => {
    if (displayBanners.length === 0 || !isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length, isAutoPlay]);

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrent(prev => (prev + 1) % displayBanners.length);
    // Retomar autoplay após 10 segundos
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrev = () => {
    setIsAutoPlay(false);
    setCurrent(prev => (prev - 1 + displayBanners.length) % displayBanners.length);
    // Retomar autoplay após 10 segundos
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (displayBanners.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden bg-gray-900 group">
      <div 
        className="flex transition-transform duration-700 ease-out h-full" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {displayBanners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            {/* Background Image - Responsivo com Picture Element */}
            <picture className="absolute inset-0 w-full h-full">
              {/* Imagem Mobile (até 768px) */}
              <source 
                media="(max-width: 768px)" 
                srcSet={banner.imageMobile || banner.image}
              />
              {/* Imagem Desktop (acima de 768px) */}
              <source 
                media="(min-width: 769px)" 
                srcSet={banner.image}
              />
              {/* Fallback para navegadores que não suportam picture */}
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Próximo banner"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Navigation Dots - Melhorado para Mobile */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 w-full flex justify-center gap-0.5 sm:gap-1 px-4">
        {displayBanners.map((_, idx) => (
          <button
            key={idx}
            className="rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => {
              setIsAutoPlay(false);
              setCurrent(idx);
              setTimeout(() => setIsAutoPlay(true), 10000);
            }}
            aria-label={`Ir para slide ${idx + 1}`}
          >
            {/* Elemento visual interno - permite controle preciso do tamanho */}
            <span
              className={`rounded-full transition-all duration-300 block ${
                current === idx 
                  ? 'bg-white w-8 sm:w-8 md:w-6 h-2 sm:h-2 md:h-2' 
                  : 'bg-white/40 w-2 h-2 sm:w-2 md:w-2 sm:h-2 md:h-2 hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, linkText = "Ver todos", onLinkClick }: { title: string, linkText?: string, onLinkClick: () => void }) => (
  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
    <h2 className="text-2xl font-bold text-gray-900 relative pl-4">
      <span className="absolute left-0 top-1 w-1 h-6 bg-primary-500 rounded-full"></span>
      {title}
    </h2>
    <button onClick={onLinkClick} className="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center group">
      {linkText} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// --- AI EDITOR COMPONENT ---

// --- HOME SECTIONS ---

const Home = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { setActiveCategory } = useApp();
  const navigateRouter = useNavigateRouter();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleProductClick = (id: string) => {
    navigateRouter(`/produto/${id}`);
  };
  
  // Simular loading inicial (pode ser removido quando houver API real)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="space-y-16 pb-16">
        <div className="container mx-auto px-4">
          <ProductGridSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
  <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16">
    {/* 2. Hero Slider */}
    <HeroSlider />

    {/* 3. Feature Bar */}
    <section className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {[
            { icon: Truck, title: "Envio para todo Brasil", sub: "Entrega expressa e rastreada" },
            { icon: CreditCard, title: "Compra Facilitada", sub: "Parcelamos em até 12x" },
            { icon: ShieldCheck, title: "Compra 100% Segura", sub: "Seus dados protegidos" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-center space-x-4 pt-4 md:pt-0">
              <div className="text-primary-600">
                <item.icon className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 4. New Arrivals */}
    <section className="container mx-auto px-3 sm:px-4 md:px-6">
      <SectionHeader title="Novidades Chegando" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
        {(products || []).slice(0, 12).map(product => (
          <ProductCard 
            key={product.id} 
            product={{...product, isNew: true}} 
            onClick={() => handleProductClick(product.id)}
            onQuickView={onQuickView}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </section>

    {/* 5. Promotional Banners */}
    <section className="container mx-auto px-3 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative h-56 sm:h-64 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer">
          <img src="https://placehold.co/800x600/111/FFF?text=Pod+Systems+Promo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner 1" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Pod Systems</h3>
            <p className="mb-4 text-gray-200">A melhor tecnologia em suas mÃ£os.</p>
            <Button size="sm" variant="outline" className="w-fit border-white text-white hover:bg-white hover:text-black">Confira</Button>
          </div>
        </div>
        <div className="relative h-56 sm:h-64 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer">
          <img src="https://placehold.co/800x600/1e293b/FFF?text=Premium+Juices+Sale" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner 2" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Juices Premium</h3>
            <p className="mb-4 text-gray-200">Sabores importados selecionados.</p>
            <Button size="sm" variant="outline" className="w-fit border-white text-white hover:bg-white hover:text-black">Confira</Button>
          </div>
        </div>
      </div>
    </section>

    {/* 6. Best Sellers Layout */}
    <section className="bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <SectionHeader title="Os Mais Vendidos" onLinkClick={() => navigateRouter('/catalogo')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
          {(products || []).filter(p => p.isBestSeller).slice(0, 12).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => handleProductClick(product.id)}
              onQuickView={onQuickView}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </div>
    </section>

    {/* 7. Best Offers */}
    <section className="container mx-auto px-3 sm:px-4 md:px-6">
      <SectionHeader title="Ofertas Relâmpago" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
        {(products || []).map(product => (
           <ProductCard 
             key={`offer-${product.id}`} 
             product={{...product, price: product.price * 0.8, originalPrice: product.price}} 
             onClick={() => handleProductClick(product.id)}
             onQuickView={onQuickView}
             onQuickAdd={onQuickAdd}
           />
        )).slice(0, 12)}
      </div>
    </section>

    {/* 8. Customer Favorites */}
    <section className="container mx-auto px-3 sm:px-4 md:px-6">
      <SectionHeader title="Queridinhos dos Clientes" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
        {(products || []).slice(0, 12).map(product => (
           <ProductCard 
             key={`fav-${product.id}`} 
             product={product} 
             onClick={() => handleProductClick(product.id)}
             onQuickView={onQuickView}
             onQuickAdd={onQuickAdd}
           />
        ))}
      </div>
    </section>

    {/* 9. Brand Strip */}
    <section className="border-t border-b border-gray-100 bg-white py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <h3 className="text-center font-bold text-gray-400 text-sm tracking-widest uppercase mb-8">As Melhores Marcas</h3>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
           {BRANDS.map((brand, idx) => (
             <img key={idx} src={brand.logo} alt={brand.name} className="h-8 md:h-12 object-contain hover:scale-110 transition-transform cursor-pointer" />
           ))}
        </div>
      </div>
    </section>

    {/* 10. Category Banners */}
    <section className="container mx-auto px-3 sm:px-4">
      <SectionHeader title="Explore Nossas Categorias" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.filter(cat => cat.id !== 'all').map(category => {
          const categoryProducts = (products || []).filter(p => p.category === category.id);
          const productCount = categoryProducts.length;
          
          return (
            <div
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                navigateRouter('/catalogo');
              }}
              className={`group relative h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                category.isHighlight 
                  ? 'bg-gradient-to-br from-black to-gray-800' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-700'
              }`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              
              <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 text-white text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {category.name}
                </h3>
                {productCount > 0 && (
                  <p className="text-sm sm:text-base text-white/80">
                    {productCount} {productCount === 1 ? 'produto' : 'produtos'}
                  </p>
                )}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs sm:text-sm font-medium border border-white/50 px-3 py-1.5 rounded-full">
                    Ver produtos â†’
                  </span>
                </div>
              </div>
              
              {category.isHighlight && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full">
                  DESTAQUE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  </div>
  );
};

// --- OTHER VIEWS (Simplified for brevity, maintaining functionality) ---

const FinalizeOrderPage = () => {
  const { cart, cartTotal } = useCart();
  const navigateRouter = useNavigateRouter();
  const { showSuccess, showError } = useToast();
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    firstName: 'Nicolas',
    lastName: 'Rachid',
    cpf: '134.729.036-27',
    birthDate: '19/96/1219',
    gender: '',
    country: 'Brasil',
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'São Paulo',
    phone: '(32) 99161-3714',
    email: 'nicolasrachido@gmail.com',
    orderNotes: '',
  });

  const [showCouponBanner, setShowCouponBanner] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [differentShippingAddress, setDifferentShippingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estados do cartão de crédito
  const [cardData, setCardData] = useState({
    cardNumber: '1234 1234 1234 1234',
    cardholderName: '',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    installments: '12',
  });

  // Estados do endereço de entrega
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'Brasil',
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'São Paulo',
  });

  // Calcular subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Calcular desconto PIX (5%)
  const pixDiscount = useMemo(() => {
    return paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  }, [subtotal, paymentMethod]);

  // Calcular total
  const total = useMemo(() => {
    return subtotal - pixDiscount;
  }, [subtotal, pixDiscount]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 16) {
      return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    return value;
  };

  const handleCardDataChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  // Calcular parcelas
  const installments = useMemo(() => {
    const installmentsList = [];
    for (let i = 1; i <= 12; i++) {
      const installmentValue = total / i;
      const totalValue = total;
      installmentsList.push({
        value: i.toString(),
        label: i === 1 
          ? `À vista R$ ${totalValue.toFixed(2).replace('.', ',')}`
          : `${i}x de R$ ${installmentValue.toFixed(2).replace('.', ',')} (R$ ${totalValue.toFixed(2).replace('.', ',')})`
      });
    }
    return installmentsList;
  }, [total]);

  // Meses do ano
  const months = [
    { value: '01', label: '01 | Janeiro' },
    { value: '02', label: '02 | Fevereiro' },
    { value: '03', label: '03 | Março' },
    { value: '04', label: '04 | Abril' },
    { value: '05', label: '05 | Maio' },
    { value: '06', label: '06 | Junho' },
    { value: '07', label: '07 | Julho' },
    { value: '08', label: '08 | Agosto' },
    { value: '09', label: '09 | Setembro' },
    { value: '10', label: '10 | Outubro' },
    { value: '11', label: '11 | Novembro' },
    { value: '12', label: '12 | Dezembro' },
  ];

  // Anos (próximos 10 anos)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());
  }, []);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showError('Digite um código de cupom');
      return;
    }
    setAppliedCoupon(couponCode);
    showSuccess('Cupom aplicado com sucesso!');
  };

  const handleFinalizeOrder = () => {
    if (!termsAccepted) {
      showError('Você precisa aceitar os termos e condições');
      return;
    }
    // Aqui você processaria o pedido
    showSuccess('Pedido finalizado com sucesso!');
    // navigateRouter('/pedido-confirmado');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
          <Button onClick={() => navigateRouter('/catalogo')} className="min-h-[44px]">
            Continuar Comprando
          </Button>
        </div>
      </div>
    );
  }

  // Estados brasileiros
  const brazilianStates = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ];

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

      {/* Banner de Cupom */}
      {showCouponBanner && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="coupon-banner"
              checked={false}
              onChange={() => setShowCouponBanner(false)}
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="coupon-banner" className="flex-1 text-sm text-gray-700 cursor-pointer">
              Você tem um cupom de desconto? Clique aqui e informe o código do seu cupom de desconto
            </label>
            <button
              onClick={() => setShowCouponBanner(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Coluna Esquerda - Detalhes de Cobrança */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes de cobrança</h2>

            <div className="space-y-4">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Sobrenome* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* CPF e Data de Nascimento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                    maxLength={14}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="birthDate"
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', formatDate(e.target.value))}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* Gênero e País */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero* <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  >
                    <option value="">Selecionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="prefiro-nao-informar">Prefiro não informar</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    País* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* CEP */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                  CEP* <span className="text-red-500">*</span>
                </label>
                <input
                  id="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', formatCEP(e.target.value))}
                  maxLength={9}
                  placeholder="00000-000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                />
              </div>

              {/* Endereço e Número */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Nome da rua e número da casa"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                    Número* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="number"
                    type="text"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* Complemento e Bairro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-2">
                    Apartamento, suíte, unidade, etc. (opcional)
                  </label>
                  <input
                    id="complement"
                    type="text"
                    value={formData.complement}
                    onChange={(e) => handleInputChange('complement', e.target.value)}
                    placeholder="Apartamento, suíte, unidade, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro (opcional)
                  </label>
                  <input
                    id="neighborhood"
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado* <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  >
                    {brazilianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Telefone e Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                    maxLength={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço de e-mail* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                </div>
              </div>

              {/* Notas do Pedido */}
              <div>
                <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notas de Pedido (opcional)
                </label>
                <textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                  placeholder="Notas sobre seu pedido, por exemplo, instruções especiais para entrega."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Resumo e Pagamento */}
        <div className="w-full lg:w-96 flex-shrink-0">
          {/* Checkbox Endereço Diferente */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={differentShippingAddress}
                onChange={(e) => setDifferentShippingAddress(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Entregar em um endereço diferente?</span>
            </label>
          </div>

          {/* Campos de Endereço de Entrega */}
          {differentShippingAddress && (
            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço de Entrega</h3>
              
              <div className="space-y-4">
                {/* Nome e Sobrenome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shippingFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome* <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shippingFirstName"
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleShippingAddressChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="shippingLastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Sobrenome* <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shippingLastName"
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleShippingAddressChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                </div>

                {/* Nome da Empresa */}
                <div>
                  <label htmlFor="shippingCompanyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da empresa (opcional)
                  </label>
                  <input
                    id="shippingCompanyName"
                    type="text"
                    value={shippingAddress.companyName}
                    onChange={(e) => handleShippingAddressChange('companyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                  />
                </div>

                {/* País */}
                <div>
                  <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 mb-2">
                    País* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="shippingCountry"
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    readOnly
                  />
                </div>

                {/* CEP */}
                <div>
                  <label htmlFor="shippingZipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP* <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="shippingZipCode"
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleShippingAddressChange('zipCode', formatCEP(e.target.value))}
                    maxLength={9}
                    placeholder="00000-000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                  />
                </div>

                {/* Endereço e Número */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço* <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shippingAddress"
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => handleShippingAddressChange('address', e.target.value)}
                      placeholder="Nome da rua e número da casa"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="shippingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Número* <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shippingNumber"
                      type="text"
                      value={shippingAddress.number}
                      onChange={(e) => handleShippingAddressChange('number', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                </div>

                {/* Complemento e Bairro */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shippingComplement" className="block text-sm font-medium text-gray-700 mb-2">
                      Apartamento, suíte, unidade, etc. (opcional)
                    </label>
                    <input
                      id="shippingComplement"
                      type="text"
                      value={shippingAddress.complement}
                      onChange={(e) => handleShippingAddressChange('complement', e.target.value)}
                      placeholder="Apartamento, suíte, sala, etc. (opcional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="shippingNeighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro (opcional)
                    </label>
                    <input
                      id="shippingNeighborhood"
                      type="text"
                      value={shippingAddress.neighborhood}
                      onChange={(e) => handleShippingAddressChange('neighborhood', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade* <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shippingCity"
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado* <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="shippingState"
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                    >
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumo do Pedido */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seu pedido</h2>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-semibold text-gray-900">PRODUTO</th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-900">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-700">
                        {item.name} {item.selectedNicotine && `- ${item.selectedNicotine}`} * {item.quantity}
                      </td>
                      <td className="py-3 text-sm text-gray-700 text-right">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">SUBTOTAL</span>
                <span className="text-sm font-bold text-gray-900">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              {paymentMethod === 'pix' && pixDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm font-medium">DESCONTO PARA PIX</span>
                  <span className="text-sm font-bold">-R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">TOTAL</span>
                <span className="text-lg font-bold text-gray-900">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Métodos de pagamento</h2>
            
            <div className="space-y-4">
              {/* PIX */}
              <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-primary-500 rounded-lg bg-primary-50">
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Pix (5% de desconto)</div>
                </div>
              </label>

              {/* Instruções PIX */}
              {paymentMethod === 'pix' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Finalize a sua compra e abra o app do banco na opção Pix.</li>
                    <li>Aponte a câmera do celular para o QR Code ou copie e cole o código Pix.</li>
                    <li>Confira os dados e confirme o seu pagamento pelo app do Banco.</li>
                    <li>Assim que o pagamento for identificado, enviaremos uma mensagem de confirmação.</li>
                  </ol>
                </div>
              )}

              {/* Cartão de Crédito */}
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Cartão de Crédito</span>
                </div>
              </label>

              {/* Formulário de Cartão de Crédito */}
              {paymentMethod === 'credit' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pague com o cartão de crédito.</h3>
                  
                  {/* Logos das Bandeiras */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-xs text-gray-600 font-medium">Bandeiras aceitas:</div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                      <div className="w-10 h-6 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">ELO</div>
                      <div className="w-10 h-6 bg-yellow-600 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
                      <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">HIPER</div>
                      <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-bold">DC</div>
                    </div>
                  </div>

                  {/* Visualização do Cartão */}
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-12 h-8 bg-yellow-400 rounded flex items-center justify-center">
                          <div className="w-8 h-6 bg-yellow-300 rounded-sm"></div>
                        </div>
                        <CreditCard className="w-8 h-8 opacity-80" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-white/80 mb-1">NÚMERO DO CARTÃO</div>
                          <div className="text-lg font-mono tracking-wider">
                            {cardData.cardNumber || '•••• •••• •••• ••••'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/80 mb-1">NOME DO TITULAR</div>
                          <div className="text-base font-medium uppercase">
                            {cardData.cardholderName || 'NOME DO TITULAR'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-white/80 mb-1">VALID.</div>
                            <div className="text-sm font-mono">
                              {cardData.expiryMonth || 'MM'}/{cardData.expiryYear || 'AAAA'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/80 mb-1">CVV</div>
                            <div className="text-sm font-mono">
                              {cardData.cvv ? '•••' : '•••'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campos do Formulário */}
                  <div className="space-y-4">
                    {/* Número do Cartão */}
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Número do cartão* <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => handleCardDataChange('cardNumber', formatCardNumber(e.target.value))}
                        maxLength={19}
                        placeholder="1234 1234 1234 1234"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                      />
                    </div>

                    {/* Nome do Titular */}
                    <div>
                      <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome e sobrenome do titular* <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cardholderName"
                        type="text"
                        value={cardData.cardholderName}
                        onChange={(e) => handleCardDataChange('cardholderName', e.target.value.toUpperCase())}
                        placeholder="ex.: João Miguel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                      />
                    </div>

                    {/* Mês e Ano de Expiração */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-2">
                          Mês de Expiração* <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="expiryMonth"
                          value={cardData.expiryMonth}
                          onChange={(e) => handleCardDataChange('expiryMonth', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                        >
                          {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-2">
                          Ano de Expiração* <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="expiryYear"
                          value={cardData.expiryYear}
                          onChange={(e) => handleCardDataChange('expiryYear', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* CVV e Parcelas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                          Cod. de segurança (CVV)* <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-2">
                          N° de Parcelas* <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="installments"
                          value={cardData.installments}
                          onChange={(e) => handleCardDataChange('installments', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white"
                        >
                          {installments.map(inst => (
                            <option key={inst.value} value={inst.value}>{inst.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EQUIPE - WCB */}
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="team"
                  checked={paymentMethod === 'team'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="font-medium text-gray-900">EQUIPE - WCB</span>
              </label>
            </div>
          </div>

          {/* Termos e Condições */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <p className="text-xs text-gray-600 mb-4">
              Seus dados pessoais serão usados para processar seu pedido, apoiar sua experiência em todo este site e para outros fins descritos em nossa política de privacidade.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                Li e concordo com os termos e condições do site <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* Botão Finalizar Pedido */}
          <button
            onClick={handleFinalizeOrder}
            disabled={!termsAccepted}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            FINALIZAR PEDIDO
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigateRouter = useNavigateRouter();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const { showSuccess, showError } = useToast();

  // Calcular subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Calcular total (subtotal + frete - desconto do cupom)
  const total = useMemo(() => {
    let finalTotal = subtotal;
    if (shippingCost !== null) {
      finalTotal += shippingCost;
    }
    // Aqui você pode adicionar lógica de desconto do cupom se necessário
    return finalTotal;
  }, [subtotal, shippingCost]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showError('Digite um código de cupom');
      return;
    }
    // Simular aplicação de cupom (você pode implementar lógica real aqui)
    setAppliedCoupon(couponCode);
    showSuccess('Cupom aplicado com sucesso!');
  };

  const handleUpdateCart = () => {
    showSuccess('Carrinho atualizado!');
  };

  const handleCalculateShipping = () => {
    // Simular cálculo de frete (você pode implementar lógica real aqui)
    setShippingCost(15.90);
    showSuccess('Frete calculado!');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showError('Seu carrinho está vazio');
      return;
    }
    navigateRouter('/finalizar-pedido');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Adicione produtos ao carrinho para continuar</p>
          <Button onClick={() => navigateRouter('/catalogo')} className="min-h-[44px]">
            Continuar Comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <button 
              onClick={() => navigateRouter('/')}
              className="hover:text-gray-900 transition-colors"
            >
              Início
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <button 
              onClick={() => navigateRouter('/catalogo')}
              className="hover:text-gray-900 transition-colors"
            >
              Catálogo
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <span className="text-gray-900 font-medium">Carrinho</span>
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Carrinho de Compras</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Coluna Principal - Produtos */}
        <div className="flex-1">
          {/* Tabela de Produtos */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            {/* Cabeçalho da Tabela (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="col-span-1"></div>
              <div className="col-span-5 font-semibold text-gray-900 text-sm">PRODUTO</div>
              <div className="col-span-2 font-semibold text-gray-900 text-sm text-center">PREÇO</div>
              <div className="col-span-2 font-semibold text-gray-900 text-sm text-center">QUANTIDADE</div>
              <div className="col-span-2 font-semibold text-gray-900 text-sm text-right">SUBTOTAL</div>
            </div>

            {/* Lista de Produtos */}
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Botão Remover */}
                  <div className="col-span-12 md:col-span-1 flex items-start justify-start md:justify-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      aria-label="Remover produto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Imagem e Nome do Produto */}
                  <div className="col-span-12 md:col-span-5 flex gap-4">
                    <img
                      src={item.images[0] || '/images/product-placeholder.png'}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      {item.selectedNicotine && (
                        <p className="text-xs text-gray-500">Teor: {item.selectedNicotine}</p>
                      )}
                      {item.selectedFlavor && (
                        <p className="text-xs text-gray-500">Sabor: {item.selectedFlavor}</p>
                      )}
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="col-span-6 md:col-span-2 flex items-center">
                    <div className="md:hidden text-xs text-gray-500 mr-2">Preço:</div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Quantidade */}
                  <div className="col-span-6 md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          updateQuantity(item.id, newQuantity);
                        }}
                        min="1"
                        className="w-12 sm:w-16 text-center border-0 focus:ring-0 text-sm font-medium text-gray-900"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-12 md:col-span-2 flex items-center justify-end">
                    <div className="md:hidden text-xs text-gray-500 mr-2">Subtotal:</div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção de Cupom e Atualizar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              {/* Cupom */}
              <div className="flex-1 w-full sm:w-auto">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                  Cupom
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Cupom"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors whitespace-nowrap min-h-[44px]"
                  >
                    APLICAR CUPOM
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-1">Cupom "{appliedCoupon}" aplicado!</p>
                )}
              </div>

              {/* Botão Atualizar */}
              <div className="w-full sm:w-auto">
                <button
                  onClick={handleUpdateCart}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors min-h-[44px]"
                >
                  ATUALIZAR PRODUTOS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral - Resumo do Pedido */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Total no carrinho</h2>

            {/* Subtotal */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">SUBTOTAL</span>
              <span className="text-lg font-bold text-gray-900">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Entrega */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">ENTREGA</span>
              {shippingCost !== null ? (
                <span className="text-lg font-bold text-gray-900">
                  R$ {shippingCost.toFixed(2).replace('.', ',')}
                </span>
              ) : (
                <button
                  onClick={handleCalculateShipping}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Calcular entrega
                </button>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">TOTAL</span>
              <span className="text-2xl font-bold text-gray-900">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Botão Finalizar Compra */}
            <button
              onClick={handleCheckout}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px] text-lg"
            >
              FINALIZAR COMPRA
            </button>

            {/* Link Voltar */}
            <button
              onClick={() => navigateRouter('/catalogo')}
              className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors underline"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Catalog = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { searchTerm, activeCategory, setActiveCategory } = useApp();
  const navigateRouter = useNavigateRouter();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProductsFromFilters, setFilteredProductsFromFilters] = useState<Product[]>(products);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const handleProductClick = (id: string) => {
    navigateRouter(`/produto/${id}`);
  };

  // Filtrar produtos baseado em busca e categoria primeiro
  const productsByCategoryAndSearch = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = debouncedSearchTerm === '' || p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, activeCategory, debouncedSearchTerm]);

  // Produtos finais após aplicar filtros avançados
  const filteredProducts = useMemo(() => {
    return filteredProductsFromFilters;
  }, [filteredProductsFromFilters]);

  // Calcular produtos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts.length, itemsPerPage]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length, itemsPerPage]);
  
  // Simular loading ao filtrar (pode ser removido quando houver API real)
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [searchTerm, debouncedSearchTerm, activeCategory]);

  const handleFilterChange = useCallback((filtered: Product[]) => {
    setFilteredProductsFromFilters(filtered);
    setIsLoading(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilteredProductsFromFilters(productsByCategoryAndSearch);
  }, [productsByCategoryAndSearch]);

  // Atualizar produtos filtrados quando categoria ou busca mudar
  useEffect(() => {
    setFilteredProductsFromFilters(productsByCategoryAndSearch);
  }, [productsByCategoryAndSearch]);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* BotÃ£o para mostrar/ocultar filtros em mobile */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 min-h-[44px]"
        >
          <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className={`w-full lg:w-80 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Filtros Avançados */}
          <ProductFilters
            products={productsByCategoryAndSearch}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <div className="flex-1">
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 shadow-sm">
            <span className="text-gray-500 font-medium text-sm sm:text-base">{filteredProducts.length} produtos encontrados</span>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Dropdown Exibir por página */}
              <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  Exibir:
                </label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white cursor-pointer hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
                >
                  <option value={20}>20 por página</option>
                  <option value={40}>40 por página</option>
                  <option value={60}>60 por página</option>
                  <option value={80}>80 por página</option>
                  <option value={100}>100 por página</option>
                </select>
              </div>
              {/* Dropdown Ordenação */}
              <select className="border-none text-xs sm:text-sm font-medium focus:ring-0 text-gray-700 bg-transparent cursor-pointer hover:text-primary-600 min-h-[44px]">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Recentes</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">Nenhum produto encontrado</p>
              <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => handleProductClick(product.id)}
                    onQuickView={onQuickView}
                    onQuickAdd={onQuickAdd}
                  />
                ))}
              </div>
              
              {/* Controles de Paginação */}
              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] min-w-[44px] ${
                              currentPage === pageNum
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const navigateRouter = useNavigateRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (products && products.length > 0) {
      setIsInitialLoad(false);
    }
  }, [products]);
  
  const productsLoading = isInitialLoad && (!products || products.length === 0);
  
  if (productsLoading) {
    return <ProductDetailSkeleton />;
  }
  
  const product = (products || []).find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto nÃ£o encontrado</h2>
        <p className="text-gray-500 mb-8">O produto que vocÃª estÃ¡ procurando nÃ£o estÃ¡ disponÃ­vel.</p>
        <Button onClick={() => navigateRouter('/catalogo')}>Voltar para CatÃ¡logo</Button>
      </div>
    );
  }
  
  return <ProductDetail product={product} />;
};

const ProductDetail = ({ product }: { product: Product }) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:ProductDetail:entry',message:'ProductDetail rendered with product',data:{productId:product.id,productName:product.name,productNameLength:product.name?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
  const { addToCart } = useCart();
  const navigateRouter = useNavigateRouter();
  const { products } = useProducts();
  const { showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || '');
  const [selectedNicotine, setSelectedNicotine] = useState(product.nicotine?.[0] || '');
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredFlavorImageIndex, setHoveredFlavorImageIndex] = useState<number | null>(null);
  const [fixedFlavorImageIndex, setFixedFlavorImageIndex] = useState<number | null>(null);
  const [imageUpdateKey, setImageUpdateKey] = useState(0); // Contador para forçar atualização da imagem
  // Estados para notificação de estoque
  const [selectedFlavorsForNotification, setSelectedFlavorsForNotification] = useState<string[]>([]);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [isFlavorsDropdownOpen, setIsFlavorsDropdownOpen] = useState(false);
  const flavorsDropdownRef = useRef<HTMLDivElement>(null);
  // Estado para controlar expansão da seção "Fora de Estoque"
  const [isOutOfStockExpanded, setIsOutOfStockExpanded] = useState(false);
  // Estados para produtos complementares/kit
  const [selectedComplementaryProducts, setSelectedComplementaryProducts] = useState<string[]>([]);
  
  // Produtos relacionados (mesma categoria, excluindo o produto atual)
  const relatedProducts = (products || []).filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 8);
  
  // Mock de reviews (substituir por dados reais depois)
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      productId: product.id,
      customerName: 'João Silva',
      customerPhoto: 'https://ui-avatars.com/api/?name=João+Silva&background=3765FF&color=fff',
      rating: 5,
      comment: 'Produto excelente! Superou minhas expectativas. Qualidade premium e entrega rápida. Recomendo muito!',
      date: '2024-01-15',
    },
    {
      id: '2',
      productId: product.id,
      customerName: 'Maria Santos',
      customerPhoto: 'https://ui-avatars.com/api/?name=Maria+Santos&background=10b981&color=fff',
      rating: 4,
      comment: 'Muito bom produto, recomendo! A única coisa é que poderia ter mais opções de sabores disponíveis.',
      date: '2024-01-10',
    },
    {
      id: '3',
      productId: product.id,
      customerName: 'Pedro Oliveira',
      customerPhoto: 'https://ui-avatars.com/api/?name=Pedro+Oliveira&background=f59e0b&color=fff',
      rating: 5,
      comment: 'Perfeito! Exatamente como descrito. Vou comprar novamente com certeza.',
      date: '2024-01-05',
    },
  ]);
  
  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedFlavor, selectedNicotine });
    showSuccess(`${product.name} adicionado ao carrinho!`);
  };
  
  const handleProductClick = (id: string) => {
    navigateRouter(`/produto/${id}`);
  };

  // Função para alternar seleção de sabor para notificação
  const toggleFlavorForNotification = (flavor: string) => {
    setSelectedFlavorsForNotification(prev => {
      if (prev.includes(flavor)) {
        return prev.filter(f => f !== flavor);
      } else {
        return [...prev, flavor];
      }
    });
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (flavorsDropdownRef.current && !flavorsDropdownRef.current.contains(event.target as Node)) {
        setIsFlavorsDropdownOpen(false);
      }
    };

    if (isFlavorsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFlavorsDropdownOpen]);

  // Função para obter índice da imagem baseado no sabor
  const getImageIndexForFlavor = (flavor: string): number => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:getImageIndexForFlavor:entry',message:'getImageIndexForFlavor called',data:{flavor,flavorsLength:product.flavors?.length,imagesLength:product.images?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (!product.flavors || product.flavors.length === 0 || !product.images || product.images.length === 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:getImageIndexForFlavor:early-return',message:'Early return - missing data',data:{returnValue:0},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return 0;
    }
    const flavorIndex = product.flavors.indexOf(flavor);
    const result = flavorIndex % product.images.length;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:getImageIndexForFlavor:exit',message:'getImageIndexForFlavor result',data:{flavor,flavorIndex,imagesLength:product.images.length,result},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    // Distribui os sabores entre as imagens disponíveis
    return result;
  };

  // Função para lidar com hover no sabor
  const handleFlavorHover = (flavor: string) => {
    // #region agent log
    const logData = {location:'App.tsx:handleFlavorHover:entry',message:'handleFlavorHover called',data:{flavor},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'A'};
    console.log('[DEBUG]', logData);
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
    // #endregion
    const imageIndex = getImageIndexForFlavor(flavor);
    // #region agent log
    const logData2 = {location:'App.tsx:handleFlavorHover:before-setState',message:'About to set hoveredFlavorImageIndex',data:{flavor,imageIndex,currentHovered:hoveredFlavorImageIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'A'};
    console.log('[DEBUG]', logData2);
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
    // #endregion
    setHoveredFlavorImageIndex(imageIndex);
    setImageUpdateKey(prev => prev + 1); // Incrementar contador para forçar atualização
    setImageLoaded(false);
    // #region agent log
    const logData3 = {location:'App.tsx:handleFlavorHover:after-setState',message:'setHoveredFlavorImageIndex called',data:{flavor,imageIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'A'};
    console.log('[DEBUG]', logData3);
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
    // #endregion
  };

  // Função para lidar com saída do hover
  const handleFlavorLeave = () => {
    setHoveredFlavorImageIndex(null);
  };

  // Função para lidar com click no sabor (fixar imagem)
  const handleFlavorClick = (flavor: string) => {
    const imageIndex = getImageIndexForFlavor(flavor);
    setFixedFlavorImageIndex(imageIndex);
    setSelectedImageIndex(imageIndex);
    setImageLoaded(false);
    setHoveredFlavorImageIndex(null);
  };

  // Determinar qual imagem exibir (hover tem prioridade sobre fixado)
  const displayImageIndex = useMemo(() => {
    const result = hoveredFlavorImageIndex !== null
      ? hoveredFlavorImageIndex
      : (fixedFlavorImageIndex !== null ? fixedFlavorImageIndex : selectedImageIndex);
    // #region agent log
    const logData = {location:'App.tsx:displayImageIndex:calculation',message:'displayImageIndex being calculated',data:{result,hoveredFlavorImageIndex,fixedFlavorImageIndex,selectedImageIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'C'};
    console.log('[DEBUG]', logData);
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
    // #endregion
    return result;
  }, [hoveredFlavorImageIndex, fixedFlavorImageIndex, selectedImageIndex]);

  // Calcular src da imagem baseado no displayImageIndex
  const currentImageSrc = useMemo(() => {
    const src = product.images[displayImageIndex] || product.images[0];
    // #region agent log
    const logData = {location:'App.tsx:currentImageSrc:calculation',message:'currentImageSrc being calculated',data:{displayImageIndex,src,hoveredFlavorImageIndex,fixedFlavorImageIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'E'};
    console.log('[DEBUG]', logData);
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
    // #endregion
    return src;
  }, [displayImageIndex, product.images]);

  // Função para confirmar notificação
  const handleConfirmNotification = () => {
    if (!privacyPolicyAccepted) {
      showSuccess('Por favor, autorize o recebimento de notificações.');
      return;
    }
    if (selectedFlavorsForNotification.length === 0) {
      showSuccess('Por favor, selecione pelo menos um sabor para receber notificação.');
      return;
    }
    // Aqui você pode adicionar a lógica para salvar a notificação (localStorage, API, etc.)
    showSuccess(`Você será notificado quando os sabores selecionados estiverem disponíveis!`);
    // Limpar formulário
    setSelectedFlavorsForNotification([]);
    setPrivacyPolicyAccepted(false);
  };

  // Função para alternar seleção de produto complementar
  const toggleComplementaryProduct = (productId: string) => {
    setSelectedComplementaryProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Função para calcular o total dos produtos complementares selecionados
  const calculateComplementaryTotal = () => {
    if (!product.complementaryProducts || selectedComplementaryProducts.length === 0) {
      return 0;
    }
    
    const complementaryItems = (products || []).filter(p => 
      product.complementaryProducts?.includes(p.id) && 
      selectedComplementaryProducts.includes(p.id)
    );
    
    return complementaryItems.reduce((total, item) => total + item.price, 0);
  };

  // Função para comprar todos os produtos (principal + complementares)
  const handleBuyAllProducts = () => {
    // Adiciona o produto principal
    addToCart(product, quantity, { selectedFlavor, selectedNicotine });
    
    // Adiciona produtos complementares selecionados
    const complementaryItems = (products || []).filter(p => 
      selectedComplementaryProducts.includes(p.id)
    );
    
    complementaryItems.forEach(item => {
      addToCart(item, 1);
    });
    
    const totalItems = complementaryItems.length + 1;
    showSuccess(`${totalItems} produto(s) adicionado(s) ao carrinho!`);
    setSelectedComplementaryProducts([]);
  };

  // Calcular totais
  const totalComplementary = calculateComplementaryTotal();
  const totalWithMainProduct = product.price + totalComplementary;
  const pixDiscount = totalWithMainProduct * 0.02;
  const totalWithPix = totalWithMainProduct - pixDiscount;
  const installments = Math.ceil(totalWithMainProduct / 100);
  const installmentValue = totalWithMainProduct / installments;
  
  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    setSelectedImageIndex(0);
    setSelectedFlavor(product.flavors?.[0] || '');
    setSelectedNicotine(product.nicotine?.[0] || '');
    setHoveredFlavorImageIndex(null);
    // Fixar imagem do primeiro sabor ao carregar o produto
    if (product.flavors && product.flavors.length > 0 && product.images && product.images.length > 0) {
      const firstFlavorImageIndex = getImageIndexForFlavor(product.flavors[0]);
      // #region agent log
      const logData = {location:'App.tsx:useEffect:initialization',message:'Setting initial fixedFlavorImageIndex',data:{firstFlavorImageIndex,firstFlavor:product.flavors[0],initialImageSrc:product.images[firstFlavorImageIndex]},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'};
      console.log('[DEBUG]', logData);
      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
      // #endregion
      setFixedFlavorImageIndex(firstFlavorImageIndex);
      setSelectedImageIndex(firstFlavorImageIndex);
    } else {
      setFixedFlavorImageIndex(null);
    }
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [product.id, product.flavors, product.nicotine]);

  // Recarregar imagem quando displayImageIndex mudar
  useEffect(() => {
    // #region agent log
    const logData = {location:'App.tsx:useEffect:displayImageIndex',message:'displayImageIndex changed - resetting imageLoaded',data:{displayImageIndex,hoveredFlavorImageIndex,fixedFlavorImageIndex,selectedImageIndex,imageLoaded},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'D'};
    console.log('[DEBUG]', logData);
    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
    // #endregion
    setImageLoaded(false);
  }, [displayImageIndex]);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto nÃ£o encontrado</h2>
        <Button onClick={() => navigateRouter('/catalogo')}>Voltar para CatÃ¡logo</Button>
      </div>
    );
  }
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Formatar data do review
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calcular economia
  const calculateSavings = () => {
    if (!product.originalPrice) return null;
    const savingsPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const savingsValue = product.originalPrice - product.price;
    return { percent: savingsPercent, value: savingsValue };
  };

  const savings = calculateSavings();

  // Função para compartilhar
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Confira ${product.name} na White Cloud Brasil!`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'instagram':
        // Instagram não permite compartilhamento direto via URL, então copiamos o link para área de transferência
        navigator.clipboard.writeText(url).then(() => {
          window.open('https://www.instagram.com/', '_blank');
        });
        break;
    }
  };

  // Scroll para avaliações
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
          <li>
            <button 
              onClick={() => navigateRouter('/')}
              className="hover:text-gray-900 transition-colors"
            >
              Início
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <button 
              onClick={() => navigateRouter('/catalogo')}
              className="hover:text-gray-900 transition-colors"
            >
              loja
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <button 
              onClick={() => navigateRouter('/catalogo')}
              className="hover:text-gray-900 transition-colors"
            >
              {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <span className="text-gray-900">
              Ignite
            </span>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* 1. SEÃ‡ÃƒO PRINCIPAL: Galeria + InformaÃ§Ãµes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12">
        {/* Coluna Esquerda: Galeria de Imagens */}
        <div className="space-y-3 sm:space-y-4">
          {/* Foto Principal */}
          <div className="aspect-square bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-8 flex items-center justify-center relative shadow-sm hover:shadow-md transition-shadow">
            {(() => {
              // #region agent log
              const logData = {location:'App.tsx:img:render',message:'Image component rendering',data:{displayImageIndex,hoveredFlavorImageIndex,fixedFlavorImageIndex,selectedImageIndex,imageLoaded,imageSrc:product.images[displayImageIndex]},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'};
              console.log('[DEBUG]', logData);
              fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
              // #endregion
              return null;
            })()}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            {(() => {
              // #region agent log
              const logData = {location:'App.tsx:img:render',message:'Image component rendering',data:{displayImageIndex,currentImageSrc,hoveredFlavorImageIndex,fixedFlavorImageIndex,selectedImageIndex,imageLoaded},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'E'};
              console.log('[DEBUG]', logData);
              fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
              // #endregion
              return (
                <img 
                  key={`product-image-${displayImageIndex}-${product.id}-${hoveredFlavorImageIndex !== null ? `hover-${hoveredFlavorImageIndex}-${imageUpdateKey}` : fixedFlavorImageIndex !== null ? `fixed-${fixedFlavorImageIndex}` : `selected-${selectedImageIndex}`}`}
                  src={currentImageSrc}
                  alt={product.name} 
                  loading="eager"
                  decoding="async"
                  className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => {
                    // #region agent log
                    const logData = {location:'App.tsx:img:onLoad',message:'Image loaded',data:{displayImageIndex,currentImageSrc},timestamp:Date.now(),sessionId:'debug-session',runId:'fix-attempt',hypothesisId:'E'};
                    console.log('[DEBUG]', logData);
                    fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch((e)=>console.error('[DEBUG] Log failed:',e));
                    // #endregion
                    setImageLoaded(true);
                  }}
                  onError={() => setImageLoaded(true)}
                />
              );
            })()}
          </div>
          
          {/* Miniaturas das Imagens */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setImageLoaded(false);
                  setFixedFlavorImageIndex(null); // Resetar fixação de sabor ao clicar em miniatura
                  setHoveredFlavorImageIndex(null);
                }}
                className={`aspect-square bg-white border rounded-lg p-1 cursor-pointer hover:border-primary-500 transition-colors ${
                  selectedImageIndex === idx && fixedFlavorImageIndex === null ? 'border-primary-500 border-2' : 'border-gray-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>

          {/* PRODUTOS COMPLEMENTARES / KIT */}
          {product.complementaryProducts && product.complementaryProducts.length > 0 && (() => {
            const complementaryItems = (products || []).filter(p => 
              product.complementaryProducts?.includes(p.id)
            );
            
            if (complementaryItems.length === 0) return null;
            
            return (
              <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Complete seu Kit
                </h3>
                
                <div className="space-y-3 border-b border-dashed border-gray-300 pb-4 mb-4">
                  {complementaryItems.map((complementaryProduct) => {
                    const isSelected = selectedComplementaryProducts.includes(complementaryProduct.id);
                    
                    return (
                      <div 
                        key={complementaryProduct.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleComplementaryProduct(complementaryProduct.id)}
                          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                        />
                        
                        <div className="flex-1 flex items-start gap-3">
                          <img
                            src={complementaryProduct.images[0]}
                            alt={complementaryProduct.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg border border-gray-200 bg-white"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5 truncate">
                              Cód.: {complementaryProduct.sku || 'N/A'}
                            </p>
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                              {complementaryProduct.name}
                            </h4>
                            <p className="text-sm sm:text-base font-bold text-primary-600">
                              R$ {complementaryProduct.price.toFixed(2).replace('.', ',')}
                            </p>
                            <button
                              onClick={() => handleProductClick(complementaryProduct.id)}
                              className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                            >
                              Mais detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Resumo e Total */}
                {selectedComplementaryProducts.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-2xl text-gray-400">=</span>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-primary-600 mb-1">
                        R$ {totalWithMainProduct.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-xs text-gray-600 mb-0.5">
                        {installments}x de R$ {installmentValue.toFixed(2).replace('.', ',')} sem juros
                      </p>
                      <p className="text-xs text-gray-600">
                        R$ {totalWithPix.toFixed(2).replace('.', ',')} com PIX (-2%)
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Botão de compra */}
                <Button
                  onClick={handleBuyAllProducts}
                  disabled={selectedComplementaryProducts.length === 0}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold uppercase py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  COMPRAR OS {selectedComplementaryProducts.length + 1} PRODUTOS
                </Button>
              </div>
            );
          })()}
        </div>

        {/* Coluna Direita: InformaÃ§Ãµes Principais */}
        <div className="space-y-4 sm:space-y-6">
          {/* 1. Nome do Produto (H1) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>
          
          {/* 2. Marca do Produto */}
          {product.brand && (
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Marca:</span>
                <span className="text-base sm:text-lg font-bold text-primary-600">{product.brand}</span>
              </div>
            </div>
          )}

          {/* SKU e Marca */}
          <div className="mb-2 space-y-1 text-xs sm:text-sm text-gray-500">
            {product.sku && (
              <p><span className="font-medium">SKU:</span> {product.sku}</p>
            )}
            <p>
              <span className="font-medium">Marca:</span>{' '}
              <span className="text-primary-600 font-medium">Ignite</span>
            </p>
          </div>
          
          {/* 3. Avaliações */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <button 
              onClick={scrollToReviews}
              className="text-xs sm:text-sm text-gray-500 hover:text-primary-600 transition-colors underline"
            >
              {product.rating.toFixed(2)} de 5 ({product.reviewsCount} {product.reviewsCount === 1 ? 'avaliação' : 'avaliações'})
            </button>
          </div>

          {/* 4. Preço (DESTAQUE MÃXIMO) */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 border border-gray-200">
            <div className="flex items-end gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg sm:text-xl md:text-2xl text-gray-400 line-through mb-1">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  {savings && (
                    <span className="bg-red-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full mb-1">
                      -{savings.percent}%
                    </span>
                  )}
                </>
              )}
            </div>
            {savings && (
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Economia de R$ {savings.value.toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className="text-xs sm:text-sm text-primary-600 font-medium flex items-center">
              <CreditCard className="w-4 h-4 mr-1" /> 5% de desconto no PIX
            </p>
          </div>
          

          {/* 5. Variações (Sabores/Cores/Modelos) */}
          {(() => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:ProductDetail:flavors-section',message:'Rendering flavors section',data:{productId:product.id,hasFlavors:!!product.flavors,flavorsLength:product.flavors?.length,flavors:product.flavors},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            return product.flavors && product.flavors.length > 0 && (() => {
            // Definir quais sabores estão disponíveis (metade disponível, metade indisponível)
            const totalFlavors = product.flavors.length;
            const availableCount = Math.ceil(totalFlavors / 2);
            
            // Criar array com informações de disponibilidade
            const flavorsWithAvailability = product.flavors.map((flavor, index) => ({
              flavor,
              available: index < availableCount // Primeira metade disponível
            }));

            // Separar em disponíveis e indisponíveis
            const available = flavorsWithAvailability.filter(f => f.available);
            const unavailable = flavorsWithAvailability.filter(f => !f.available);

            return (
              <div className="mb-6 sm:mb-8">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                  Sabores
                </label>
                
                {/* Sabores Disponíveis - Destaque */}
                {available.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Disponíveis em Estoque</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                      {available.map(({ flavor }) => {
                        const isSelected = selectedFlavor === flavor;
                        return (
                          <button
                            key={flavor}
                            onClick={() => {
                              setSelectedFlavor(flavor);
                              handleFlavorClick(flavor);
                            }}
                            onMouseEnter={() => handleFlavorHover(flavor)}
                            onMouseLeave={() => handleFlavorLeave()}
                            className={`
                              px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all
                              min-h-[44px] flex items-center justify-center text-center shadow-sm
                              ${isSelected
                                ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 hover:shadow-md'
                              }
                            `}
                          >
                            {flavor}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sabores Indisponíveis - Menos Destaque */}
                {unavailable.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <button
                      onClick={() => setIsOutOfStockExpanded(!isOutOfStockExpanded)}
                      className="flex items-center gap-2 mb-3 w-full text-left hover:opacity-80 transition-opacity"
                    >
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex-1">Fora de Estoque</p>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                          isOutOfStockExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOutOfStockExpanded && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 opacity-50 animate-fade-in">
                        {unavailable.map(({ flavor }) => (
                          <button
                            key={flavor}
                            disabled
                            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium
                              bg-gray-50 text-gray-400 border border-dashed border-gray-300 line-through cursor-not-allowed
                              min-h-[44px] flex items-center justify-center text-center"
                          >
                            {flavor}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })();
          })()}

          {/* 5.5. Teor de Nicotina */}
          {product.nicotine && product.nicotine.length > 0 && product.id !== '1' && (
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                Teor
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.nicotine.map((nicotine) => {
                  const isSelected = selectedNicotine === nicotine;
                  return (
                    <button
                      key={nicotine}
                      onClick={() => setSelectedNicotine(nicotine)}
                      className={`
                        px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all
                        min-h-[44px] flex items-center justify-center
                        ${isSelected
                          ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                        }
                      `}
                    >
                      {nicotine}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Quantidade + CTAs */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white w-full sm:w-auto">
                <button 
                  className="p-3 hover:bg-gray-50 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold min-h-[44px] flex items-center justify-center" aria-label={`Quantidade: ${quantity}`}>
                  {quantity}
                </span>
                <button 
                  className="p-3 hover:bg-gray-50 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button 
                size="lg" 
                className="w-full sm:flex-1 text-base sm:text-lg min-h-[44px] font-bold uppercase shadow-lg hover:shadow-xl transition-shadow" 
                onClick={handleAddToCart}
                aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
              >
                Adicionar ao Carrinho
              </Button>
            </div>
            {/* BotÃ£o SecundÃ¡rio */}
            <Button 
              variant="outline"
              size="lg"
              className="w-full text-base sm:text-lg min-h-[44px] font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
              onClick={() => {
                handleAddToCart();
                navigateRouter('/carrinho');
              }}
            >
              Ir para o Carrinho
            </Button>
          </div>

          {/* 7. Calculadora de Frete */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Calcular Frete</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CEP"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                maxLength={9}
              />
              <Button className="min-h-[44px] px-6">
                Calcular
              </Button>
            </div>
          </div>

          {/* 7.5. Notificação de Reposição de Estoque */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm sm:text-base font-semibold text-red-600 mb-4">Avise-me quando chegar</h3>

              {/* Seleção de sabores com select customizado */}
              <div className="mb-4 relative" ref={flavorsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsFlavorsDropdownOpen(!isFlavorsDropdownOpen)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-h-[44px] bg-white text-left flex items-center justify-between"
                >
                  <span className={selectedFlavorsForNotification.length === 0 ? 'text-gray-400' : 'text-gray-700'}>
                    {selectedFlavorsForNotification.length === 0
                      ? 'Selecione os sabores que deseja ser notificado'
                      : `${selectedFlavorsForNotification.length} sabor(es) selecionado(s)`
                    }
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isFlavorsDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isFlavorsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {product.flavors.map((flavor) => {
                        const isSelected = selectedFlavorsForNotification.includes(flavor);
                        return (
                          <label
                            key={flavor}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleFlavorForNotification(flavor)}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                            />
                            <span className="text-xs sm:text-sm text-gray-700 flex-1">{flavor}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkbox de autorização */}
              <div className="mb-4 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy-policy-notification"
                  checked={privacyPolicyAccepted}
                  onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="privacy-policy-notification" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                  Autorizo receber notificações de reposição deste produto
                </label>
              </div>

              {/* Botão de confirmação */}
              <Button
                onClick={handleConfirmNotification}
                disabled={!privacyPolicyAccepted || selectedFlavorsForNotification.length === 0}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold uppercase py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                AVISAR AO CHEGAR!
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 8. BLOCO DE INFORMAÃ‡Ã•ES RÃPIDAS */}
      <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Formas de Pagamento */}
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Formas de Pagamento</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {product.paymentOptions || 'Em até 12x no cartão de crédito. 5% de desconto no pagamento via PIX.'}
              </p>
            </div>
          </div>

          {/* Avaliações */}
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Avaliações</h3>
              <button 
                onClick={scrollToReviews}
                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Ver todas as avaliações
              </button>
            </div>
          </div>

          {/* Compartilhar */}
          <div className="flex items-start gap-3">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Compartilhar</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
                  aria-label="Compartilhar no WhatsApp"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.089c0 1.87.487 3.697 1.411 5.312L0 24l8.554-2.289a11.882 11.882 0 003.496.515h.005c6.554 0 11.89-5.335 11.89-11.89a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
                  aria-label="Compartilhar no Twitter"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Compartilhar no Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleShare('instagram')}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white flex items-center justify-center transition-all"
                  aria-label="Compartilhar no Instagram"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 9. DESCRIÇÃO */}
      {(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:ProductDetail:description-check',message:'Checking detailedDescription',data:{productId:product.id,hasDetailedDescription:!!product.detailedDescription,detailedDescriptionLength:product.detailedDescription?.length,detailedDescriptionPreview:product.detailedDescription?.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        return product.detailedDescription;
      })() && (
        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
            Descrição
          </h2>
          <div className="text-gray-700 leading-relaxed">
            {product.detailedDescription.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              
              // Ignorar "DESCRIÇÃO" pois já temos o h2
              if (trimmed.toUpperCase() === 'DESCRIÇÃO') {
                return null;
              }
              
              // Detectar títulos: linhas que começam com letra maiúscula, sem pontuação final, 
              // não são listas, e têm características de título
              const isLikelyTitle = (
                trimmed.length < 100 && 
                trimmed.length > 5 &&
                !trimmed.match(/[.!?]$/) &&
                !trimmed.startsWith('•') &&
                !trimmed.startsWith('-') &&
                !trimmed.startsWith('1.') &&
                !trimmed.startsWith('2.') &&
                !trimmed.startsWith('3.') &&
                !trimmed.startsWith('4.') &&
                !trimmed.startsWith('5.') &&
                trimmed.match(/^[A-ZÁÊÔÇ]/) &&
                !trimmed.includes('.') &&
                !trimmed.includes('!') &&
                !trimmed.includes('?')
              );
              
              // Se for título claro, renderizar como h3
              if (isLikelyTitle) {
                return (
                  <h3 key={idx} className="text-lg sm:text-xl font-bold text-gray-900 mb-3 mt-6 first:mt-0">
                    {trimmed}
                  </h3>
                );
              }
              
              // Se tiver dois pontos e for curto, pode ser título com conteúdo
              if (trimmed.includes(':') && trimmed.length < 200) {
                const colonIndex = trimmed.indexOf(':');
                const titlePart = trimmed.substring(0, colonIndex).trim();
                const contentPart = trimmed.substring(colonIndex + 1).trim();
                
                // Se a parte antes dos dois pontos parece um título (curto, sem pontuação)
                if (titlePart.length < 80 && 
                    titlePart.length > 3 && 
                    !titlePart.match(/[.!?]$/) &&
                    contentPart.length > 0) {
                  return (
                    <div key={idx} className="mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 mt-6 first:mt-0">
                        {titlePart}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {contentPart}
                      </p>
                    </div>
                  );
                }
              }
              
              // Parágrafo normal
              return (
                <p key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </section>
      )}

      {/* 10. ESPECIFICAÇÕES TÉCNICAS */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
            Especificações Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(product.specifications).map(([key, value], idx) => (
              <div 
                key={idx} 
                className={`py-3 sm:py-4 ${idx < Object.keys(product.specifications).length - 2 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors rounded-lg px-2`}
              >
                <div className="grid grid-cols-[40%_60%] gap-4">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">{key}:</span>
                  <span className="text-gray-500 text-sm sm:text-base">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. ITENS INCLUSOS */}
      {product.includedItems && product.includedItems.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
            Itens Inclusos
          </h2>
          <ul className="space-y-3 ml-5">
            {product.includedItems.map((item, idx) => (
              <li key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed list-disc">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 12. GARANTIA */}
      {product.warranty && (
        <section className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Garantia
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.warranty}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 13. PRODUTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Produtos Relacionados</h2>
            <button
              onClick={() => navigateRouter('/catalogo')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onClick={() => handleProductClick(relatedProduct.id)}
                onQuickAdd={(p) => {
                  addToCart(p, 1);
                  showSuccess(`${p.name} adicionado ao carrinho!`);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 14. AVALIAÇÕES DOS CLIENTES */}
      <section id="reviews-section" className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Avaliações dos Clientes</h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Ainda não há avaliações para este produto.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  {/* Foto do Cliente */}
                  <div className="flex-shrink-0">
                    {review.customerPhoto ? (
                      <img
                        src={review.customerPhoto}
                        alt={review.customerName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {/* Nome e Data */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{review.customerName}</h3>
                      <span className="text-xs sm:text-sm text-gray-500">{formatReviewDate(review.date)}</span>
                    </div>
                    
                    {/* AvaliaÃ§Ã£o de Estrelas */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs sm:text-sm text-gray-500">({review.rating}/5)</span>
                    </div>
                    
                    {/* Texto do ComentÃ¡rio */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Favorites = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { favorites, removeFavorite } = useFavorites();
  const navigateRouter = useNavigateRouter();
  const { showSuccess } = useToast();

  const handleProductClick = (id: string) => {
    navigateRouter(`/produto/${id}`);
  };

  const handleRemoveFavorite = (product: Product) => {
    removeFavorite(product.id);
    showSuccess(`${product.name} removido dos favoritos`);
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nenhum favorito ainda</h2>
          <p className="text-gray-500 mb-8">
            Comece a adicionar produtos aos seus favoritos para encontrÃ¡-los facilmente depois!
          </p>
          <Button onClick={() => navigateRouter('/catalogo')}>
            Explorar Produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Meus Favoritos ({favorites.length})
        </h1>
        <button
          onClick={() => navigateRouter('/catalogo')}
          className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          Continuar Comprando
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {favorites.map(product => (
          <div key={product.id} className="relative">
            <ProductCard 
              product={product} 
              onClick={() => handleProductClick(product.id)}
              onQuickView={onQuickView}
              onQuickAdd={onQuickAdd}
            />
            <button
              onClick={() => handleRemoveFavorite(product)}
              className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Remover ${product.name} dos favoritos`}
            >
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
    const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
    const { navigate } = useApp();
    if (cart.length === 0) return <div className="p-8 sm:p-12 text-center text-gray-500">Carrinho Vazio</div>;
    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
             <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Seu Carrinho</h1>
             <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                <div className="flex-1 space-y-3 sm:space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-3 sm:gap-4 border p-3 sm:p-4 rounded-lg bg-white">
                            <img src={item.images[0]} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm sm:text-base truncate">{item.name}</h3>
                                <p className="text-sm sm:text-base">R$ {item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-3 sm:gap-4 mt-2">
                                     <div className="flex items-center border rounded">
                                        <button 
                                          className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 transition-colors" 
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          aria-label={`Diminuir quantidade de ${item.name}`}
                                        >
                                          -
                                        </button>
                                        <span className="px-3 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>
                                        <button 
                                          className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 transition-colors" 
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          aria-label={`Aumentar quantidade de ${item.name}`}
                                        >
                                          +
                                        </button>
                                     </div>
                                     <button 
                                       onClick={() => removeFromCart(item.id)} 
                                       className="text-red-500 p-2 hover:bg-red-50 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                       aria-label={`Remover ${item.name} do carrinho`}
                                     >
                                       <Trash2 className="w-4 h-4" />
                                     </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 rounded-lg h-fit sticky bottom-0 lg:sticky lg:top-8">
                    <div className="flex justify-between font-bold text-lg sm:text-xl mb-4">
                        <span>Total</span>
                        <span>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <Button fullWidth size="lg" onClick={() => navigateRouter('/checkout')} aria-label="Finalizar compra" className="min-h-[44px]">Finalizar Compra</Button>
                </div>
             </div>
        </div>
    );
};

const AccountPage = () => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  // Estados do formulário de login
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  // Estados do formulário de cadastro
  const [registerData, setRegisterData] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    email: '',
    senha: ''
  });

  const { showSuccess, showError } = useToast();
  const navigateRouter = useNavigateRouter();

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (showForgotPasswordModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForgotPasswordModal]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForgotPasswordModal) {
        setShowForgotPasswordModal(false);
        setForgotPasswordEmail('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showForgotPasswordModal]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.usernameOrEmail || !loginData.password) {
      showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    // Apenas visual - mostrar mensagem de sucesso
    showSuccess('Login realizado com sucesso!');
    navigateRouter('/');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.nome || !registerData.sobrenome || !registerData.email || !registerData.senha) {
      showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    if (!isHuman) {
      showError('Por favor, confirme que você é humano');
      return;
    }
    // Apenas visual - mostrar mensagem de sucesso
    showSuccess('Cadastro realizado com sucesso!');
    navigateRouter('/');
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers;
    }
    return numbers.slice(0, 11);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers;
    }
    return numbers.slice(0, 11);
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      showError('Por favor, digite seu nome de usuário ou e-mail');
      return;
    }
    // Apenas visual - mostrar mensagem de sucesso
    showSuccess('Link de redefinição de senha enviado para seu e-mail!');
    setShowForgotPasswordModal(false);
    setForgotPasswordEmail('');
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
        Minha Conta
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
        {/* Seção de Login */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">
          <div className="border-b-2 border-primary-600 mb-6"></div>
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Entrar</h2>
            
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de usuário ou e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  value={loginData.usernameOrEmail}
                  onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                  placeholder="Digite seu usuário ou e-mail"
                  required
                />
              </div>

              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="loginPassword"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Eye className={`w-5 h-5 ${showLoginPassword ? 'text-primary-600' : ''}`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
              >
                ACESSAR
              </button>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lembre-me</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  onClick={() => setShowForgotPasswordModal(true)}
                >
                  Perdeu sua senha?
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Seção de Cadastro */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">
          <div className="border-b-2 border-primary-600 mb-6"></div>
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Cadastre-se</h2>
            
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={registerData.nome}
                    onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700 mb-2">
                    Sobrenome<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="sobrenome"
                    value={registerData.sobrenome}
                    onChange={(e) => setRegisterData({ ...registerData, sobrenome: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={registerData.cpf}
                  onChange={(e) => setRegisterData({ ...registerData, cpf: formatCPF(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                  placeholder="apenas números ou será inválido"
                  maxLength={11}
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefone"
                  value={registerData.telefone}
                  onChange={(e) => setRegisterData({ ...registerData, telefone: formatPhone(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                  placeholder="apenas números ou será inválido"
                  maxLength={11}
                />
              </div>

              <div>
                <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">
                  Data Nascimento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="dataNascimento"
                    value={registerData.dataNascimento}
                    onChange={(e) => setRegisterData({ ...registerData, dataNascimento: formatDate(e.target.value) })}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                    placeholder="dd/mm/aaaa"
                    maxLength={10}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço de e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="registerPassword"
                    value={registerData.senha}
                    onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Eye className={`w-5 h-5 ${showRegisterPassword ? 'text-primary-600' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="isHuman"
                  checked={isHuman}
                  onChange={(e) => setIsHuman(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="isHuman" className="ml-2 text-sm text-gray-700">
                  Sou humano
                </label>
              </div>

              <div className="text-xs text-gray-500 space-y-1 pt-2">
                <p>
                  Seus dados pessoais serão usados para aprimorar a sua experiência em todo este site, para gerenciar o acesso a sua conta e para outros propósitos, como descritos em nossa{' '}
                  <button
                    type="button"
                    className="text-primary-600 hover:underline"
                    onClick={() => showError('Política de privacidade em desenvolvimento')}
                  >
                    política de privacidade
                  </button>
                  .
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors min-h-[44px] mt-4"
              >
                CADASTRE-SE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Recuperação de Senha */}
      {showForgotPasswordModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300"
            onClick={() => setShowForgotPasswordModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 animate-fade-in">
              {/* Linha azul no topo */}
              <div className="border-b-2 border-primary-600"></div>
              
              <div className="p-6 sm:p-8">
                {/* Texto explicativo */}
                <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">
                  Perdeu sua senha? Digite seu nome de usuário ou endereço de e-mail. Você receberá um link por e-mail para criar uma nova senha.
                </p>

                {/* Formulário */}
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome de usuário ou e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="forgotPasswordEmail"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px]"
                      placeholder="Digite seu usuário ou e-mail"
                      required
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(false);
                        setForgotPasswordEmail('');
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[44px]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors min-h-[44px] uppercase"
                    >
                      REDEFINIR SENHA
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TrackingPage = () => <div className="p-12 text-center">Rastreamento (Simulado)</div>;

// Chat Widget Flutuante
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevenir scroll do body quando chat está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[70] bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 min-h-[60px] min-w-[60px] flex items-center justify-center group"
        aria-label="Abrir chat de atendimento"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        {/* Indicador de notificação (opcional) */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Modal de Chat */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <div className="fixed bottom-6 right-6 z-[90] w-full max-w-md h-[600px] bg-white rounded-xl shadow-2xl flex flex-col animate-fade-in">
            {/* Header do Chat */}
            <div className="bg-primary-600 text-white p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Atendimento</h3>
                  <p className="text-xs text-white/80">Normalmente respondemos em alguns minutos</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* Mensagem de boas-vindas */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                  <p className="text-sm text-gray-700">
                    Olá! 👋 Como posso ajudá-lo hoje?
                  </p>
                </div>
              </div>

              {/* Mensagem de exemplo do usuário */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-primary-600 text-white rounded-lg p-3 shadow-sm max-w-[80%]">
                  <p className="text-sm">
                    Gostaria de saber sobre os produtos disponíveis
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Mensagem de resposta */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                  <p className="text-sm text-gray-700">
                    Claro! Temos uma ampla variedade de produtos. Você pode navegar pelo catálogo ou me dizer qual produto específico você está procurando.
                  </p>
                </div>
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[44px] text-sm"
                />
                <button
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-2.5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Enviar mensagem"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Horário de atendimento: Seg. a Sex. 9h às 18h
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// --- MAIN APP ---

export default function App() {
  const { navigate } = useApp();
  const { toast, showError, showSuccess, closeToast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    showSuccess(`${product.name} adicionado ao carrinho!`);
  };

  const handleViewFullDetails = (product: Product) => {
    navigateRouter(`/produto/${product.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white w-full overflow-x-hidden">
      <AgeVerificationModal />
      <Header />

      <main className="flex-1 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
          <Route path="/catalogo" element={<Catalog onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
          <Route path="/produto/:id" element={<ProductDetailWrapper />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/favoritos" element={<Favorites onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/finalizar-pedido" element={<FinalizeOrderPage />} />
          <Route path="/rastreamento" element={<TrackingPage />} />
          <Route path="/conta" element={<AccountPage />} />
          <Route path="*" element={<Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
        </Routes>
        <EmailCapture />
      </main>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleViewFullDetails}
      />

      {/* 11. Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center">Atendimento</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> sac@whitecloudbrasil.com</li>
                <li className="flex items-center"><User className="w-4 h-4 mr-2" /> +595 994 872020</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Seg. a Sex 9h ás 18h</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Institucional</h4>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-white transition-colors">Quem Somos</button></li>
                <li><button className="hover:text-white transition-colors">Guia Vape</button></li>
                <li><button className="hover:text-white transition-colors">Política de Envio e Entrega</button></li>
                <li><button className="hover:text-white transition-colors">Garantia & Trocas</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Central do Cliente</h4>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-white transition-colors">Política de Privacidade</button></li>
                <li><button className="hover:text-white transition-colors">Entre em Contato</button></li>
                <li><button className="hover:text-white transition-colors">Minha Conta</button></li>
                <li><button className="hover:text-white transition-colors">Rastrear Pedido</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Siga-nos</h4>
              <div className="flex space-x-4 mb-8">
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Instagram className="w-5 h-5" /></button>
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Youtube className="w-5 h-5" /></button>
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Twitter className="w-5 h-5" /></button>
              </div>
              <h4 className="text-white font-bold text-lg mb-4">Pagamento</h4>
              <div className="flex flex-wrap gap-2">
                 {/* Visa */}
                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">
                   <span className="text-[10px] font-bold text-white">VISA</span>
                 </div>
                 {/* Mastercard */}
                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">
                   <div className="flex items-center gap-0.5">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-orange-500 -ml-1.5"></div>
                   </div>
                 </div>
                 {/* Elo */}
                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">
                   <span className="text-[9px] font-bold text-white">elo</span>
                 </div>
                 {/* American Express */}
                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">
                   <span className="text-[7px] font-bold text-white">AMERICAN EXPRESS</span>
                 </div>
                 {/* Hipercard */}
                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">
                   <span className="text-[8px] font-bold text-white">Hipercard</span>
                 </div>
                 {/* PIX */}
                 <div className="h-10 w-16 rounded flex items-center justify-center px-1 border border-gray-700/50">
                   <span className="text-[9px] font-bold text-white">PIX</span>
                 </div>
                 {/* Boleto */}
                 <div className="h-10 w-16 rounded flex flex-col items-center justify-center px-1 border border-gray-700/50">
                   <div className="w-full h-2 bg-white/20 mb-0.5"></div>
                   <span className="text-[7px] font-bold text-white">BOLETO</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2025 White Cloud Brasil. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
               <ShieldCheck className="w-4 h-4" /> <span>Site Seguro</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Flutuante - Atendimento */}
      <ChatWidget />
    </div>
  );
}