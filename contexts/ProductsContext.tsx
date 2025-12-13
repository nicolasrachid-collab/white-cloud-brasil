import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { getProducts, saveProducts } from '../services/productsService';

interface ProductsContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  refreshProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>([]);

  // Carregar produtos do localStorage ao montar
  useEffect(() => {
    setProductsState(getProducts());
  }, []);

  // Salvar produtos no localStorage sempre que mudar
  useEffect(() => {
    if (products.length > 0) {
      saveProducts(products);
    }
  }, [products]);

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
    saveProducts(newProducts);
  };

  const refreshProducts = () => {
    setProductsState(getProducts());
  };

  const value: ProductsContextType = {
    products,
    setProducts,
    refreshProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

















