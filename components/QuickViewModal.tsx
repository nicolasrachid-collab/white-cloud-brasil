import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Star, CreditCard, Minus, Plus, Heart } from './Icons';
import { Button } from './Button';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../hooks/useToast';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullDetails?: (product: Product) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onViewFullDetails }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const favorited = product ? isFavorite(product.id) : false;

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedFlavor(product.flavors?.[0] || '');
      setImageLoaded(false);
    }
  }, [product]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      // Salvar o scroll atual
      const scrollY = window.scrollY;
      // Bloquear scroll do body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurar scroll do body
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      // Cleanup: garantir que o scroll seja restaurado
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedFlavor: selectedFlavor || undefined });
    showSuccess(`${product.name} adicionado ao carrinho!`);
    onClose();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    if (favorited) {
      showSuccess(`${product.name} removido dos favoritos`);
    } else {
      showSuccess(`${product.name} adicionado aos favoritos`);
    }
  };

  const handleViewFullDetails = () => {
    if (onViewFullDetails) {
      onViewFullDetails(product);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-none sm:rounded-xl md:rounded-2xl max-w-4xl w-full min-h-screen sm:min-h-0 sm:max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl modal-animate my-0 sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Exibição Rápida</h2>
          <div className="flex items-center gap-2">
            {/* Botão favorito no header (mobile) */}
            <button
              onClick={handleToggleFavorite}
              className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 active:text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] sm:max-h-[calc(95vh-120px)] md:max-h-[calc(90vh-140px)]">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6">
            {/* Imagem */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="aspect-[4/3] sm:aspect-square bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white border border-gray-100 rounded-lg p-1 sm:p-1.5 md:p-2 cursor-pointer hover:border-primary-500 active:border-primary-600 transition-colors touch-manipulation min-h-[44px]">
                      <img src={img} alt={`Vista ${idx + 1} de ${product.name}`} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="space-y-3 sm:space-y-4 relative">
              {/* Categoria e Nome */}
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{product.category}</div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">({product.reviewsCount} avaliações)</span>
                </div>
              </div>

              {/* Botão Favorito - Desktop apenas (mobile está no header) */}
              <button
                onClick={handleToggleFavorite}
                className="hidden md:flex absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
                aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-6 h-6 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Preço */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 border border-primary-100">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                  {product.originalPrice && (
                    <>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                  {!product.originalPrice && (
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <p className="text-xs sm:text-sm text-primary-600 font-semibold flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> 
                    5% de desconto no PIX
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">ou em até 12x no cartão</p>
                </div>
              </div>

              {/* Opções de Sabor */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                    Sabor: {selectedFlavor && <span className="text-primary-600 font-normal text-xs sm:text-sm">({selectedFlavor})</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-3 py-2.5 sm:py-2 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all touch-manipulation min-h-[44px] ${
                          selectedFlavor === flavor
                            ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 active:border-primary-400 active:bg-gray-50'
                        }`}
                        aria-label={`Selecionar sabor ${flavor}`}
                        aria-pressed={selectedFlavor === flavor}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade e Botões */}
              <div className="space-y-4 sm:space-y-5">
                {/* Quantidade */}
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                  <label className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">Quantidade:</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg bg-white">
                    <button 
                      className="p-2.5 sm:p-3 hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-14 sm:w-16 text-center font-bold text-base sm:text-lg min-h-[44px] flex items-center justify-center border-x border-gray-200" aria-label={`Quantidade: ${quantity}`}>
                      {quantity}
                    </span>
                    <button 
                      className="p-2.5 sm:p-3 hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 w-full order-2 sm:order-1 min-h-[48px] sm:min-h-[44px]"
                    onClick={handleViewFullDetails}
                  >
                    <span className="text-sm sm:text-base">Ver Detalhes Completos</span>
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 w-full order-1 sm:order-2 flex items-center justify-center gap-2 min-h-[52px] sm:min-h-[48px] font-semibold"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                    <span className="text-base sm:text-lg">Comprar Agora</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

