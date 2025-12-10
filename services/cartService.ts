import { CartItem } from '../types';

const STORAGE_KEY = 'white_cloud_brasil_cart';

export const getCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

export const calculateTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateInstallments = (total: number) => {
  return {
    count: 3,
    value: total / 3
  };
};