import React from 'react';
import { useCart } from '../contexts/CartContext';

export function CartBadge() {
  const { cartCount } = useCart();
  
  if (cartCount === 0) return null;
  
  return (
    <span 
      className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse"
      aria-label={`${cartCount} item${cartCount !== 1 ? 's' : ''} no carrinho`}
    >
      {cartCount > 99 ? '99+' : cartCount}
    </span>
  );
}

