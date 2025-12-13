import React from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from './Icons';
import { useCart } from '../contexts/CartContext';
import { useNavigate as useNavigateRouter } from 'react-router-dom';
import { Button } from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigateRouter = useNavigateRouter();

  // Prevenir scroll do body quando drawer está aberto
  React.useEffect(() => {
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
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-[147px] sm:top-[163px] lg:top-[221px] right-0 h-[calc(100vh-147px)] sm:h-[calc(100vh-163px)] lg:h-[calc(100vh-221px)] w-full sm:w-full sm:max-w-md bg-white shadow-2xl z-[90] transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              Meu Carrinho {cart.length > 0 && `(${cart.length})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation flex-shrink-0 ml-2"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg font-medium mb-2">Seu carrinho está vazio</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Adicione produtos para começar</p>
              <Button onClick={onClose} className="w-full sm:w-auto">Continuar Comprando</Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-white">
                  {/* Imagem do produto */}
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Informações do produto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    {item.selectedFlavor && (
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">Sabor: {item.selectedFlavor}</p>
                    )}
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                      R$ {item.price.toFixed(2)}
                    </p>

                    {/* Controles de quantidade */}
                    <div className="flex items-center gap-2 sm:gap-3 sm:gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 sm:px-4 min-h-[44px] flex items-center justify-center font-medium text-xs sm:text-sm" aria-label={`Quantidade: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 sm:px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                          aria-label={`Aumentar quantidade de ${item.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 p-2 hover:bg-red-50 active:bg-red-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation flex-shrink-0"
                        aria-label={`Remover ${item.name} do carrinho`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com resumo e botões */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 sticky bottom-0">
            {/* Resumo */}
            <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Desconto</span>
                <span className="font-medium text-green-600">-R$ 0,00</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] touch-manipulation"
              >
                Continuar Comprando
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigateRouter('/checkout');
                }}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors min-h-[44px] touch-manipulation"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

