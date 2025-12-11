import { Product } from '../types';

const STORAGE_KEY = 'white_cloud_brasil_favorites';

export const getFavorites = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveFavorites = (favorites: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const addFavorite = (product: Product): Product[] => {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === product.id)) {
    const updated = [...favorites, product];
    saveFavorites(updated);
    return updated;
  }
  return favorites;
};

export const removeFavorite = (productId: string): Product[] => {
  const favorites = getFavorites();
  const updated = favorites.filter(f => f.id !== productId);
  saveFavorites(updated);
  return updated;
};

export const isFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(f => f.id === productId);
};
















