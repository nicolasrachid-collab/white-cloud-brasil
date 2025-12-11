import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '../types';
import { getFavorites, saveFavorites } from '../services/favoritesService';

interface FavoritesContextType {
  favorites: Product[];
  favoritesCount: number;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Carregar favoritos do localStorage ao montar
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites(prev => {
      if (!prev.find(f => f.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== productId));
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some(f => f.id === productId);
  }, [favorites]);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === product.id);
      if (exists) {
        return prev.filter(f => f.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const favoritesCount = favorites.length;

  const value: FavoritesContextType = {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};











