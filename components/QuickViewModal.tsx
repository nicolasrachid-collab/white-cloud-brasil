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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl modal-animate mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Exibição Rápida</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 active:text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6">
            {/* Imagem */}
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-square bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden p-4 sm:p-6 md:p-8 flex items-center justify-center relative">
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
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white border border-gray-100 rounded-lg p-1.5 sm:p-2 cursor-pointer hover:border-primary-500 active:border-primary-600 transition-colors touch-manipulation min-h-[44px]">
                      <img src={img} alt={`Vista ${idx + 1} de ${product.name}`} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Informações */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category}</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviewsCount} avaliações)</span>
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className={`w-6 h-6 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Preço */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
                <div className="flex items-end gap-2 sm:gap-3 mb-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-base sm:text-lg text-gray-400 line-through mb-1">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-primary-600 font-medium flex items-center gap-1">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 5% de desconto no PIX
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2">ou em até 12x no cartão</p>
              </div>

              {/* Opções de Sabor */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                    Sabor: {selectedFlavor && <span className="text-primary-600 font-normal">({selectedFlavor})</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-3 py-2 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all touch-manipulation min-h-[44px] ${
                          selectedFlavor === flavor
                            ? 'border-primary-600 bg-primary-50 text-primary-700 active:bg-primary-100'
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
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <label className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">Quantidade:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button 
                      className="p-2 sm:p-2.5 hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 sm:w-14 text-center font-bold min-h-[44px] flex items-center justify-center" aria-label={`Quantidade: ${quantity}`}>{quantity}</span>
                    <button 
                      className="p-2 sm:p-2.5 hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 w-full sm:w-auto"
                    onClick={handleViewFullDetails}
                  >
                    <span className="hidden sm:inline">Ver Detalhes Completos</span>
                    <span className="sm:hidden">Ver Detalhes</span>
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>Comprar</span>
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

