import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useParams, useNavigate as useNavigateRouter } from 'react-router-dom';
import { 
  ShoppingCart, Search, Menu, X, User, Star, Truck, ShieldCheck, 
  CreditCard, ArrowRight, Minus, Plus, Trash2, 
  MapPin, CheckCircle, TrendingUp, DollarSign, 
  Users, ChevronLeft, ChevronRight, Mail, Instagram, Facebook, Youtube, Twitter,
  Heart, Eye, Share2
} from './components/Icons';
import { Button } from './components/Button';
import Toast from './components/Toast';
import { EmailCapture } from './components/EmailCapture';
import { CartBadge } from './components/CartBadge';
import { FavoritesBadge } from './components/FavoritesBadge';
import { QuickViewModal } from './components/QuickViewModal';
import { ProductCardSkeleton, ProductGridSkeleton, ProductDetailSkeleton } from './components/Skeleton';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useToast } from './hooks/useToast';
import { useDebounce } from './hooks/useDebounce';
import { useCart } from './contexts/CartContext';
import { useApp } from './contexts/AppContext';
import { useFavorites } from './contexts/FavoritesContext';
import { useProducts } from './contexts/ProductsContext';
import { MOCK_PRODUCTS, CATEGORIES, HERO_BANNERS, BRANDS } from './constants';
import { Product, CartItem, ViewState, Order, Review } from './types';

// --- CONFIGURAÇÃO DO LOGOTIPO ---
// IMPORTANTE: Caminhos locais (C:\Users...) NÃO funcionam em navegadores web.
// Mova seu arquivo 'logo.png' para a pasta 'public/images/' do projeto.
const LOGO_URL = "/images/logo-whitecloud.png";

// --- COMPONENTS ---

const Header = () => {
  const { searchTerm, setSearchTerm } = useApp();
  const navigateRouter = useNavigateRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fecha o menu se a tela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Impede o scroll do body quando o menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      {/* Top Black Bar */}
      <div className="bg-black text-white text-xs py-2 text-center font-medium tracking-wide relative z-[60]">
        PROIBIDO PARA MENORES DE 18 ANOS
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-3 sm:px-4 h-20 sm:h-24 md:h-28 flex items-center justify-between gap-3 sm:gap-6 md:gap-8">
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
                // Fallback caso a imagem não exista
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-gray-900">WHITE CLOUD <span class="text-primary-600">BRASIL</span></span>';
              }}
            />
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="O que você está buscando?"
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
              onClick={() => navigateRouter('/carrinho')}
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
            <ul className="flex items-center justify-between text-sm font-medium text-gray-600 py-3">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => navigateRouter('/catalogo')}
                    className={`hover:text-primary-600 transition-colors py-1 relative group ${cat.isHighlight ? 'text-white bg-black px-3 rounded-full hover:bg-gray-800 hover:text-white' : ''}`}
                  >
                    {cat.name}
                    {!cat.isHighlight && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>}
                  </button>
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
                      ? 'bg-black text-white font-bold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span>{cat.name}</span>
                  {!cat.isHighlight && <ChevronRight className="w-4 h-4 text-gray-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">© 2023 White Cloud Brasil</p>
          </div>
        </div>
      </aside>
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
      className="group bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full relative hover:shadow-xl sm:hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-primary-200 hover:z-10"
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

      {/* Botão de Favorito */}
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
        
        {/* Overlay com botões no hover */}
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
              aria-label="Exibição rápida"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Exibição Rápida</span>
              <span className="sm:hidden">Ver</span>
            </button>
            
            <button 
              className="w-full bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-lg min-h-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickAdd) {
                  onQuickAdd(product);
                } else {
                  onClick();
                }
              }}
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category}</div>
        <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
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
            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">à vista</span>
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

  const displayBanners = HERO_BANNERS;

  useEffect(() => {
    if (displayBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  if (displayBanners.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden bg-gray-900">
      <div 
        className="flex transition-transform duration-700 ease-out h-full" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {displayBanners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            {/* Background Image */}
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center space-x-2">
        {displayBanners.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'bg-white w-6' : 'bg-white/40'}`}
            onClick={() => setCurrent(idx)}
          />
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
            { icon: CheckCircle, title: "Entrega em até 24h", sub: "Para capitais selecionadas" },
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
    <section className="container mx-auto px-3 sm:px-4">
      <SectionHeader title="Novidades Chegando" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {(products || []).slice(0, 5).map(product => (
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
            <p className="mb-4 text-gray-200">A melhor tecnologia em suas mãos.</p>
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

    {/* 6. Best Sellers Layout (Banner Left + Grid Right) */}
    <section className="bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <SectionHeader title="Os Mais Vendidos" onLinkClick={() => navigateRouter('/catalogo')} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Large Vertical Banner */}
          <div className="hidden lg:block lg:col-span-1 relative rounded-xl overflow-hidden h-full min-h-[400px]">
            <img src="https://placehold.co/400x800/0f172a/FFF?text=BEST+SELLER+POD" className="w-full h-full object-cover absolute inset-0" alt="Destaque" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-amber-400 font-bold mb-2">TOP #1</span>
              <h3 className="text-3xl font-bold leading-tight mb-4">O preferido da galera</h3>
              <Button className="w-full bg-white text-black hover:bg-gray-100">Comprar Agora</Button>
            </div>
          </div>
          
          {/* Grid */}
          <div className="col-span-1 lg:col-span-3">
             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {(products || []).filter(p => p.isBestSeller).slice(0, 6).map(product => (
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
        </div>
      </div>
    </section>

    {/* 7. Best Offers */}
    <section className="container mx-auto px-3 sm:px-4">
      <SectionHeader title="Ofertas Relâmpago" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {(products || []).map(product => (
           <ProductCard 
             key={`offer-${product.id}`} 
             product={{...product, price: product.price * 0.8, originalPrice: product.price}} 
             onClick={() => handleProductClick(product.id)}
             onQuickView={onQuickView}
             onQuickAdd={onQuickAdd}
           />
        )).slice(0, 6)}
      </div>
    </section>

    {/* 8. Customer Favorites */}
    <section className="container mx-auto px-3 sm:px-4">
      <SectionHeader title="Queridinhos dos Clientes" onLinkClick={() => navigateRouter('/catalogo')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {(products || []).slice(2, 6).map(product => (
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
    {/* #region agent log */}
    {(() => {
      fetch('http://127.0.0.1:7242/ingest/2dc4085e-d764-46ce-8c5f-25813aefd5f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:641',message:'Rendering Logos3 component',data:{brandsFromConstants:BRANDS.length,firstBrandUrl:BRANDS[0]?.logo,firstBrandHas222:BRANDS[0]?.logo?.includes('/222/'),firstBrandHasFFFFFF:BRANDS[0]?.logo?.includes('/FFFFFF/')},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
      return null;
    })()}
    {/* #endregion */}
    <Logos3 heading="As Melhores Marcas" />

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
                    Ver produtos →
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

    {/* 10. Email Capture */}
    <EmailCapture />
  </div>
  );
};

// --- OTHER VIEWS (Simplified for brevity, maintaining functionality) ---

const Catalog = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { searchTerm, activeCategory, setActiveCategory } = useApp();
  const navigateRouter = useNavigateRouter();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const handleProductClick = (id: string) => {
    navigateRouter(`/produto/${id}`);
  };
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Simular loading ao filtrar (pode ser removido quando houver API real)
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [searchTerm, debouncedSearchTerm, activeCategory]);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Botão para mostrar/ocultar filtros em mobile */}
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
        <aside className={`w-full lg:w-64 flex-shrink-0 space-y-6 lg:space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Categorias</h3>
            <ul className="space-y-1">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm min-h-[44px] ${
                      activeCategory === cat.id 
                        ? 'bg-primary-50 text-primary-700 font-bold' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowFilters(false); // Fechar filtros em mobile após seleção
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Filtrar por Preço</h3>
            <div className="flex items-center space-x-2">
              <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm min-h-[44px]" />
              <span className="text-gray-400">-</span>
              <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm min-h-[44px]" />
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full min-h-[44px]">Aplicar Filtro</Button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 shadow-sm">
            <span className="text-gray-500 font-medium text-sm sm:text-base">{filteredProducts.length} produtos encontrados</span>
            <select className="border-none text-xs sm:text-sm font-medium focus:ring-0 text-gray-700 bg-transparent cursor-pointer hover:text-primary-600 min-h-[44px]">
              <option>Mais Relevantes</option>
              <option>Menor Preço</option>
              <option>Maior Preço</option>
              <option>Mais Recentes</option>
            </select>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">Nenhum produto encontrado</p>
              <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => handleProductClick(product.id)}
                  onQuickView={onQuickView}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
        <p className="text-gray-500 mb-8">O produto que você está procurando não está disponível.</p>
        <Button onClick={() => navigateRouter('/catalogo')}>Voltar para Catálogo</Button>
      </div>
    );
  }
  
  return <ProductDetail product={product} />;
};

const ProductDetail = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const navigateRouter = useNavigateRouter();
  const { products } = useProducts();
  const { showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || '');
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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
    addToCart(product, quantity, { selectedFlavor });
    showSuccess(`${product.name} adicionado ao carrinho!`);
  };
  
  const handleProductClick = (id: string) => {
    navigateRouter(`/produto/${id}`);
  };
  
  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    setSelectedImageIndex(0);
    setSelectedFlavor(product.flavors?.[0] || '');
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [product.id, product.flavors]);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
        <Button onClick={() => navigateRouter('/catalogo')}>Voltar para Catálogo</Button>
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
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
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
      {/* Breadcrumb */}
      <button onClick={() => navigateRouter('/catalogo')} className="text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 flex items-center text-sm font-medium group min-h-[44px]">
        <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" /> Voltar para loja
      </button>

      {/* 1. SEÇÃO PRINCIPAL: Galeria + Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12">
        {/* Coluna Esquerda: Galeria de Imagens */}
        <div className="space-y-3 sm:space-y-4">
          {/* Foto Principal */}
          <div className="aspect-square bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-8 flex items-center justify-center relative shadow-sm hover:shadow-md transition-shadow">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img 
              src={product.images[selectedImageIndex] || product.images[0]} 
              alt={product.name} 
              loading="eager"
              decoding="async"
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Miniaturas das Imagens */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setImageLoaded(false);
                }}
                className={`aspect-square bg-white border rounded-lg p-2 cursor-pointer hover:border-primary-500 transition-colors ${
                  selectedImageIndex === idx ? 'border-primary-500 border-2' : 'border-gray-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Informações Principais */}
        <div className="space-y-4 sm:space-y-6">
          {/* 1. Nome do Produto (H1) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>
          
          {/* 2. Marca do Produto */}
          {product.brand && (
            <div className="mb-2">
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-semibold text-gray-700">Marca:</span>{' '}
                <span className="text-primary-600 font-medium">{product.brand}</span>
              </p>
            </div>
          )}

          {/* SKU e Categorias */}
          <div className="mb-2 space-y-1 text-xs sm:text-sm text-gray-500">
            {product.sku && (
              <p><span className="font-medium">SKU:</span> {product.sku}</p>
            )}
            <p>
              <span className="font-medium">Categorias:</span>{' '}
              {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
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

          {/* 4. Preço (DESTAQUE MÁXIMO) */}
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
          
          {/* Descrição Curta */}
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* 5. Variações (Sabores/Cores/Modelos) */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                Sabores
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {product.flavors.map((flavor) => {
                  const isAvailable = Math.random() > 0.3; // Mock: 70% disponível
                  const isSelected = selectedFlavor === flavor;
                  
                  return (
                    <button
                      key={flavor}
                      onClick={() => isAvailable && setSelectedFlavor(flavor)}
                      disabled={!isAvailable}
                      className={`
                        px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all
                        min-h-[44px] flex items-center justify-center text-center
                        ${isSelected && isAvailable
                          ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-md'
                          : isAvailable
                          ? 'bg-white text-gray-700 border border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 line-through cursor-not-allowed'
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
            {/* Botão Secundário */}
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
        </div>
      </div>

      {/* 8. BLOCO DE INFORMAÇÕES RÁPIDAS */}
      <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Formas de Pagamento */}
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Formas de Pagamento</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {product.paymentOptions || 'Em até 12x sem juros'}
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
                  <span className="text-xs sm:text-sm font-bold">W</span>
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
                  onClick={() => handleShare('email')}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Compartilhar por email"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. DESCRIÇÃO DETALHADA */}
      {product.detailedDescription && (
        <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 pb-3 border-b-2 border-gray-200">
            Descrição
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            {product.detailedDescription.split('\n').map((paragraph, idx) => {
              if (!paragraph.trim()) return null;
              
              // Detectar títulos principais (linhas em maiúsculas ou curtas que parecem títulos)
              const isMainTitle = paragraph.length < 100 && (
                paragraph === paragraph.toUpperCase() || 
                (paragraph.match(/^[A-Z][^.!?]*$/) && paragraph.length < 80)
              );
              
              // Detectar subtítulos (linhas que começam com números ou têm padrão de título)
              const isSubtitle = paragraph.match(/^[\d•\-]/) || 
                (paragraph.length < 60 && paragraph.match(/^[A-Z]/));
              
              if (isMainTitle) {
                return (
                  <h3 key={idx} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 first:mt-0 pt-4 first:pt-0 border-t border-gray-200 first:border-t-0">
                    {paragraph}
                  </h3>
                );
              }
              
              if (isSubtitle) {
                return (
                  <h4 key={idx} className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mt-4 mb-2">
                    {paragraph.replace(/^[•\-\d.]+\s*/, '')}
                  </h4>
                );
              }
              
              // Detectar listas (linhas que começam com •, -, ou números)
              if (paragraph.match(/^[•\-\d]/)) {
                return (
                  <li key={idx} className="mb-2 ml-5 list-disc text-sm sm:text-base">
                    {paragraph.replace(/^[•\-\d.]+\s*/, '')}
                  </li>
                );
              }
              
              return (
                <p key={idx} className="mb-3 last:mb-0 text-sm sm:text-base">
                  {paragraph}
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
                    
                    {/* Avaliação de Estrelas */}
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
                    
                    {/* Texto do Comentário */}
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
            Comece a adicionar produtos aos seus favoritos para encontrá-los facilmente depois!
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

const TrackingPage = () => <div className="p-12 text-center">Rastreamento (Simulado)</div>;

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
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
          <Route path="/catalogo" element={<Catalog onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
          <Route path="/produto/:id" element={<ProductDetailWrapper />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/favoritos" element={<Favorites onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
          <Route path="/checkout" element={
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold">Checkout Simulado</h2>
              <Button onClick={() => navigateRouter('/')} className="mt-4">Voltar</Button>
            </div>
          } />
          <Route path="/rastreamento" element={<TrackingPage />} />
          <Route path="/conta" element={<div className="text-center py-20 font-bold">Minha Conta</div>} />
          <Route path="*" element={<Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />} />
        </Routes>
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
                <li className="flex items-center"><User className="w-4 h-4 mr-2" /> (11) 99999-9999</li>
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Seg. a Sex. 9h às 18h</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Institucional</h4>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-white transition-colors">Quem Somos</button></li>
                <li><button className="hover:text-white transition-colors">Política de Privacidade</button></li>
                <li><button className="hover:text-white transition-colors">Termos de Uso</button></li>
                <li><button className="hover:text-white transition-colors">Trabalhe Conosco</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Ajuda</h4>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-white transition-colors">Rastrear Pedido</button></li>
                <li><button className="hover:text-white transition-colors">Trocas e Devoluções</button></li>
                <li><button className="hover:text-white transition-colors">Envio e Prazos</button></li>
                <li><button className="hover:text-white transition-colors">Perguntas Frequentes</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Siga-nos</h4>
              <div className="flex space-x-4 mb-8">
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Instagram className="w-5 h-5" /></button>
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Facebook className="w-5 h-5" /></button>
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Youtube className="w-5 h-5" /></button>
                <button className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"><Twitter className="w-5 h-5" /></button>
              </div>
              <h4 className="text-white font-bold text-lg mb-4">Pagamento</h4>
              <div className="flex gap-2">
                 <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><CreditCard className="text-black w-5 h-5"/></div>
                 <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><DollarSign className="text-black w-5 h-5"/></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2023 White Cloud Brasil. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
               <ShieldCheck className="w-4 h-4" /> <span>Site Seguro</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
