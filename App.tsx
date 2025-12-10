import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ShoppingCart, Search, Menu, X, User, Star, Truck, ShieldCheck, 
  CreditCard, ArrowRight, Minus, Plus, Trash2, LayoutDashboard, 
  Package, LogOut, MapPin, CheckCircle, TrendingUp, DollarSign, 
  Users, ChevronLeft, ChevronRight, Mail, Instagram, Facebook, Youtube, Twitter,
  Wand2, Upload, Sparkles, Image as ImageIcon, Copy, FileText, Heart, Eye
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
import { useContent } from './contexts/ContentContext';
import { useFavorites } from './contexts/FavoritesContext';
import { useProducts } from './contexts/ProductsContext';
import { MOCK_PRODUCTS, CATEGORIES, HERO_BANNERS, BRANDS, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_CONTENT_SECTIONS } from './constants';
import { Product, CartItem, ViewState, Order } from './types';
import { getOrders, saveOrders } from './services/ordersService';
import { getImages, saveImages, addImage, deleteImage } from './services/imagesService';
import { OrdersManager } from './components/admin/OrdersManager';
import { CustomersManager } from './components/admin/CustomersManager';
import { ProductsManager } from './components/admin/ProductsManager';
import { ContentManager } from './components/admin/ContentManager';

// --- CONFIGURAÇÃO DO LOGOTIPO ---
// IMPORTANTE: Caminhos locais (C:\Users...) NÃO funcionam em navegadores web.
// Mova seu arquivo 'logo.png' para a pasta 'public/images/' do projeto.
const LOGO_URL = "/images/logo-whitecloud.png";

// --- COMPONENTS ---

const Header = () => {
  const { navigate, searchTerm, setSearchTerm } = useApp();
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
            onClick={() => navigate('home')}
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
             <div className="hidden lg:flex items-center cursor-pointer hover:text-primary-600 transition-colors" onClick={() => navigate('admin')}>
                <LayoutDashboard className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-xs text-gray-400 font-normal">Area Restrita</div>
                  <div className="leading-none">Admin</div>
                </div>
             </div>
             
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
              onClick={() => navigate('favorites')}
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
              onClick={() => navigate('cart')}
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
                    onClick={() => navigate('catalog')}
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
            {/* Mobile AI Button */}
            <button 
                onClick={() => { navigate('ai-editor'); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center p-3 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Vape AI Studio
            </button>

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
                onClick={() => { navigate('favorites'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2 text-gray-700 font-medium hover:text-primary-600"
              >
                <div className="bg-red-50 p-2 rounded-full mr-3 relative">
                   <Heart className="w-5 h-5 text-red-500" />
                   <FavoritesBadge />
                </div>
                <span>Meus Favoritos</span>
              </button>

              <button 
                onClick={() => { navigate('account'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2 text-gray-700 font-medium hover:text-primary-600 mt-2"
              >
                <div className="bg-primary-50 p-2 rounded-full mr-3">
                   <User className="w-5 h-5 text-primary-600" />
                </div>
                <span>Minha Conta</span>
              </button>
              
              <button 
                onClick={() => { navigate('admin'); setIsMenuOpen(false); }}
                className="flex items-center w-full py-2 text-gray-700 font-medium hover:text-primary-600 mt-2"
              >
                <div className="bg-gray-200 p-2 rounded-full mr-3">
                   <LayoutDashboard className="w-5 h-5 text-gray-700" />
                </div>
                <span>Admin Panel</span>
              </button>
            </div>

            {/* Mobile Categories */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categorias</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => { navigate('catalog'); setIsMenuOpen(false); }}
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
  const { contentSections } = useContent();
  const [current, setCurrent] = useState(0);

  // Filtrar apenas banners ativos e ordenar
  const banners = contentSections
    .filter(section => section.type === 'banner' && section.isActive && section.imageUrl)
    .sort((a, b) => a.order - b.order);

  // Fallback para HERO_BANNERS se não houver banners no contexto
  const displayBanners = banners.length > 0 ? banners : HERO_BANNERS;

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
        {displayBanners.map((banner: any) => {
          // Se for do tipo ContentSection (tem imageUrl)
          const isContentSection = 'imageUrl' in banner;
          const image = isContentSection ? banner.imageUrl : banner.image;

          return (
            <div key={banner.id} className={`w-full h-full flex-shrink-0 relative`}>
              {/* Background Image */}
              <img 
                src={image} 
                alt={`Banner ${banner.id}`} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
          );
        })}
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

const AIStudio = ({ onError, onSuccess }: { onError?: (msg: string) => void; onSuccess?: (msg: string) => void }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const apiKey = import.meta.env.API_KEY || import.meta.env.GEMINI_API_KEY;
    if (!selectedImage || !prompt || !apiKey) return;
    
    setIsLoading(true);
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      
      // Extract base64 data (remove "data:image/jpeg;base64," prefix)
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.substring(selectedImage.indexOf(":") + 1, selectedImage.indexOf(";"));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            { text: prompt }
          ]
        }
      });

      // Find image part in response
      let foundImage = false;
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
            foundImage = true;
            break;
          }
        }
      }
      
      if (!foundImage) {
        onError?.("O modelo não retornou uma imagem. Tente reformular seu prompt para 'Edite esta imagem para...'.");
        return;
      }
      
      onSuccess?.("Imagem gerada com sucesso!");

    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      onError?.("Ocorreu um erro ao processar sua imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            Vape AI Studio
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mb-8">
            Personalize seus dispositivos ou crie conceitos únicos usando nossa Inteligência Artificial. 
            Faça upload, descreva sua ideia e veja a mágica acontecer.
          </p>
        </div>
        <Wand2 className="absolute right-0 bottom-0 w-64 h-64 text-white/5 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">1. Sua Imagem</h2>
          
          <div 
            className={`border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 relative overflow-hidden ${
              selectedImage ? 'border-primary-500 bg-gray-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Upload" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-6">
                <div className="bg-primary-50 p-4 rounded-full inline-flex mb-3">
                  <Upload className="w-8 h-8 text-primary-600" />
                </div>
                <p className="font-medium text-gray-600">Clique para fazer upload</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {selectedImage && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Trocar Imagem</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Seu Comando</h2>
          <div className="relative mb-6">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Adicione fumaça de vapor colorida ao redor do dispositivo"
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
            />
            <div className="absolute bottom-3 right-3">
              <Sparkles className="w-5 h-5 text-primary-400" />
            </div>
          </div>

          <Button 
            fullWidth 
            size="lg" 
            onClick={handleGenerate}
            disabled={!selectedImage || !prompt || isLoading}
            className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processando com Gemini...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" /> Gerar Edição
              </span>
            )}
          </Button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit min-h-[500px] flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Resultado</h2>
          
          <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden relative">
            {generatedImage ? (
              <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-gray-400 p-8">
                {isLoading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <Sparkles className="w-12 h-12 text-purple-300 mb-4 animate-spin-slow" />
                    <p>A Inteligência Artificial está trabalhando...</p>
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>A imagem gerada aparecerá aqui</p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {generatedImage && (
             <div className="mt-6 flex gap-4">
                <Button variant="outline" fullWidth onClick={() => setGeneratedImage(null)}>Descartar</Button>
                <a href={generatedImage} download="vape-ai-art.png" className="flex-1">
                  <Button fullWidth>Baixar Imagem</Button>
                </a>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- HOME SECTIONS ---

const Home = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { navigate, setSelectedProductId, setView } = useApp();
  const { contentSections } = useContent();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setView('product');
    window.scrollTo(0, 0);
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
      <SectionHeader title="Novidades Chegando" onLinkClick={() => navigate('catalog')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {products.slice(0, 5).map(product => (
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
        <SectionHeader title="Os Mais Vendidos" onLinkClick={() => navigate('catalog')} />
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
                {products.filter(p => p.isBestSeller).slice(0, 6).map(product => (
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
      <SectionHeader title="Ofertas Relâmpago" onLinkClick={() => navigate('catalog')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {products.map(product => (
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
      <SectionHeader title="Queridinhos dos Clientes" onLinkClick={() => navigate('catalog')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(2, 6).map(product => (
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
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {BRANDS.map((brand, idx) => (
             <img key={idx} src={brand.logo} alt={brand.name} className="h-8 md:h-12 object-contain hover:scale-110 transition-transform cursor-pointer" />
           ))}
        </div>
      </div>
    </section>

    {/* Renderizar seções de conteúdo ativas */}
    {contentSections
      .filter(section => section.isActive)
      .sort((a, b) => a.order - b.order)
      .map(section => {
        if (section.type === 'banner' && section.imageUrl) {
          return (
            <section key={section.id} className="container mx-auto px-4">
              <img 
                src={section.imageUrl} 
                alt={section.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {section.content && (
                <p className="text-center mt-4 text-gray-600">{section.content}</p>
              )}
            </section>
          );
        }
        
        if (section.type === 'image' && section.imageUrl) {
          return (
            <section key={section.id} className="container mx-auto px-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                <img 
                  src={section.imageUrl} 
                  alt={section.title}
                  className="w-full max-w-4xl mx-auto h-auto rounded-lg shadow-lg"
                />
                {section.content && (
                  <p className="mt-4 text-gray-600">{section.content}</p>
                )}
              </div>
            </section>
          );
        }
        
        if (section.type === 'text') {
          return (
            <section key={section.id} className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            </section>
          );
        }
        
        return null;
      })}

    {/* 10. Email Capture */}
    <EmailCapture />
  </div>
  );
};

// --- OTHER VIEWS (Simplified for brevity, maintaining functionality) ---

const Catalog = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { searchTerm, activeCategory, setActiveCategory, setSelectedProductId, setView } = useApp();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setView('product');
    window.scrollTo(0, 0);
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

const ProductDetail = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { navigate } = useApp();
  const { showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || '');
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedFlavor });
    showSuccess(`${product.name} adicionado ao carrinho!`);
  };
  
  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [product.id]);
  
  if (!product) return null;
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <button onClick={() => navigate('catalog')} className="text-gray-500 hover:text-gray-900 mb-4 sm:mb-6 flex items-center text-sm font-medium group min-h-[44px]">
        <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" /> Voltar para loja
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-square bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-8 flex items-center justify-center relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img 
              src={product.images[0]} 
              alt={product.name} 
              loading="eager"
              decoding="async"
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {product.images.map((img, idx) => (
              <div key={idx} className="aspect-square bg-white border border-gray-100 rounded-lg p-2 cursor-pointer hover:border-primary-500 transition-colors">
                <img src={img} alt="" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />)}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">({product.reviewsCount} avaliações)</span>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
            <div className="flex items-end gap-2 sm:gap-3 mb-2">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-gray-400 line-through mb-1">R$ {product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-primary-600 font-medium flex items-center">
              <CreditCard className="w-4 h-4 mr-1" /> 5% de desconto no PIX
            </p>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">{product.description}</p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white w-full sm:w-auto">
              <button 
                className="p-3 hover:bg-gray-50 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold min-h-[44px] flex items-center justify-center" aria-label={`Quantidade: ${quantity}`}>{quantity}</span>
              <button 
                className="p-3 hover:bg-gray-50 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center" 
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button 
              size="lg" 
              className="w-full sm:flex-1 text-base sm:text-lg min-h-[44px]" 
              onClick={handleAddToCart}
              aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
            >
              Comprar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Favorites = ({ onQuickView, onQuickAdd }: { onQuickView?: (product: Product) => void; onQuickAdd?: (product: Product) => void }) => {
  const { favorites, removeFavorite } = useFavorites();
  const { navigate, setSelectedProductId, setView } = useApp();
  const { showSuccess } = useToast();

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setView('product');
    window.scrollTo(0, 0);
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
          <Button onClick={() => navigate('catalog')}>
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
          onClick={() => navigate('catalog')}
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
                    <Button fullWidth size="lg" onClick={() => navigate('checkout')} aria-label="Finalizar compra" className="min-h-[44px]">Finalizar Compra</Button>
                </div>
             </div>
        </div>
    );
};

const TrackingPage = () => <div className="p-12 text-center">Rastreamento (Simulado)</div>;

const AdminDashboard = () => {
  const { showSuccess, showError } = useToast();
  const { contentSections, updateSection, addSection, deleteSection } = useContent();
  const { products, setProducts, refreshProducts } = useProducts();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [images, setImages] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers] = useState(MOCK_CUSTOMERS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    setOrders(getOrders());
    setImages(getImages());
  }, []);

  // Salvar pedidos automaticamente quando mudar
  useEffect(() => {
    if (orders.length > 0) {
      saveOrders(orders);
    }
  }, [orders]);

  // Salvar imagens automaticamente quando mudar
  useEffect(() => {
    saveImages(images);
  }, [images]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        const updated = addImage(imageData);
        setImages(updated);
        showSuccess('Imagem enviada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess('Link da imagem copiado!');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      saveOrders(updated);
      return updated;
    });
    showSuccess(`Status do pedido ${orderId} atualizado para ${status}`);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    showSuccess('Produto atualizado com sucesso!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    showSuccess('Produto excluído com sucesso!');
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `PROD-${Date.now()}`,
    };
    setProducts([...products, newProduct]);
    showSuccess('Produto adicionado com sucesso!');
  };

  const handleSaveContent = (section: typeof MOCK_CONTENT_SECTIONS[0]) => {
    updateSection(section);
    showSuccess('Seção atualizada com sucesso!');
  };

  const handleDeleteContent = (id: string) => {
    deleteSection(id);
    showSuccess('Seção excluída com sucesso!');
  };

  const handleAddContent = (sectionData: Omit<typeof MOCK_CONTENT_SECTIONS[0], 'id'>) => {
    addSection(sectionData);
    showSuccess('Seção adicionada com sucesso!');
  };

  // Estatísticas do Dashboard
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: Truck },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'content', label: 'Conteúdo', icon: FileText },
    { id: 'media', label: 'Galeria de Mídia', icon: ImageIcon },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-primary-50 text-primary-700 font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-sm text-gray-500">Visão geral do seu negócio</p>
              </div>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Receita Total</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">R$ {totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Pedidos Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingOrders}</p>
                    </div>
                    <Truck className="w-10 h-10 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg border border-primary-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary-600 font-medium">Total de Clientes</p>
                      <p className="text-2xl font-bold text-primary-900 mt-1">{totalCustomers}</p>
                    </div>
                    <Users className="w-10 h-10 text-primary-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Total de Produtos</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">{totalProducts}</p>
                    </div>
                    <Package className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Gráfico de Pedidos por Status */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pedidos por Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['pending', 'paid', 'shipped', 'delivered'] as Order['status'][]).map(status => {
                    const count = orders.filter(o => o.status === status).length;
                    const labels = {
                      pending: 'Pendente',
                      paid: 'Pago',
                      shipped: 'Enviado',
                      delivered: 'Entregue',
                    };
                    return (
                      <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-500 mt-1">{labels[status]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <ProductsManager
              products={products}
              onSave={handleSaveProduct}
              onDelete={handleDeleteProduct}
              onAdd={handleAddProduct}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersManager
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersManager customers={customers} />
          )}

          {activeTab === 'content' && (
            <ContentManager
              sections={contentSections}
              categories={CATEGORIES}
              onSave={handleSaveContent}
              onDelete={handleDeleteContent}
              onAdd={handleAddContent}
            />
          )}

          {activeTab === 'media' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Galeria de Mídia (Pasta Virtual)</h2>
                  <p className="text-sm text-gray-500">Gerencie e anexe imagens para seus produtos.</p>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleUpload} 
                  />
                  <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Imagem
                  </Button>
                </div>
              </div>

              {/* Upload Folder Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 mb-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Upload className="w-6 h-6 text-primary-500" />
                 </div>
                 <p className="text-gray-900 font-medium">Clique para enviar arquivos</p>
                 <p className="text-xs text-gray-500">JPG, PNG, WEBP</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    Nenhuma imagem na pasta ainda.
                  </div>
                )}
                {images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                       <button 
                        onClick={() => copyToClipboard(img)}
                        className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-gray-100"
                       >
                         <Copy className="w-3 h-3" /> Copiar Link
                       </button>
                       <button 
                        onClick={() => {
                          setImages(prev => {
                            const updated = deleteImage(idx);
                            return updated;
                          });
                          showSuccess('Imagem excluída!');
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-red-600"
                       >
                         <Trash2 className="w-3 h-3" /> Excluir
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  console.log('App component renderizando...');
  try {
    const { view, selectedProductId, navigate, setSelectedProductId, setView } = useApp();
    const { toast, showError, showSuccess, closeToast } = useToast();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();
    const { products } = useProducts();
    console.log('Hooks carregados, view:', view);

    const handleQuickView = (product: Product) => {
      setQuickViewProduct(product);
    };

    const handleQuickAdd = (product: Product) => {
      addToCart(product, 1);
      showSuccess(`${product.name} adicionado ao carrinho!`);
    };

    const handleViewFullDetails = (product: Product) => {
      setSelectedProductId(product.id);
      setView('product');
      window.scrollTo(0, 0);
    };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />

      <main className="flex-1">
        {view === 'home' && <Home onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />}
        {view === 'catalog' && <Catalog onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />}
        {view === 'product' && selectedProductId && (
          <ProductDetail 
            product={products.find(p => p.id === selectedProductId)!} 
          />
        )}
        {view === 'cart' && <Cart />}
        {view === 'favorites' && <Favorites onQuickView={handleQuickView} onQuickAdd={handleQuickAdd} />}
        {view === 'checkout' && <div className="text-center py-20"><h2 className="text-2xl font-bold">Checkout Simulado</h2><Button onClick={() => navigate('home')} className="mt-4">Voltar</Button></div>}
        {view === 'admin' && <AdminDashboard />}
        {view === 'tracking' && <TrackingPage />}
        {view === 'account' && <div className="text-center py-20 font-bold">Minha Conta</div>}
        {view === 'ai-editor' && <AIStudio onError={showError} onSuccess={showSuccess} />}
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
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center">Atendimento</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> suporte@whitecloudbrasil.com</li>
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
  } catch (error) {
    console.error('Erro no App:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar aplicação</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
}