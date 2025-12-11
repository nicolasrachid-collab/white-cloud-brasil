import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

export function FavoritesBadge() {
  const { favoritesCount } = useFavorites();
  
  if (favoritesCount === 0) return null;
  
  return (
    <span 
      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse"
      aria-label={`${favoritesCount} favorito${favoritesCount !== 1 ? 's' : ''}`}
    >
      {favoritesCount > 99 ? '99+' : favoritesCount}
    </span>
  );
}













