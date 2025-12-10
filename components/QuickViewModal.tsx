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
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Exibição Rápida</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Imagem */}
            <div className="space-y-4">
              <div className="aspect-square bg-white border border-gray-100 rounded-xl overflow-hidden p-8 flex items-center justify-center relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              
              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white border border-gray-100 rounded-lg p-2 cursor-pointer hover:border-primary-500 transition-colors">
                      <img src={img} alt="" className="w-full h-full object-contain" />
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
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through mb-1">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-primary-600 font-medium flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" /> 5% de desconto no PIX
                </p>
                <p className="text-xs text-gray-400 mt-2">ou em até 12x no cartão</p>
              </div>

              {/* Descrição */}
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">{product.description}</p>

              {/* Opções de Sabor */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Sabor: {selectedFlavor && <span className="text-primary-600 font-normal">({selectedFlavor})</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedFlavor === flavor
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade e Botões */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-900">Quantidade:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button 
                      className="p-2 hover:bg-gray-50 text-gray-600" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <button 
                      className="p-2 hover:bg-gray-50 text-gray-600" 
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleViewFullDetails}
                  >
                    Ver Detalhes Completos
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Comprar
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

