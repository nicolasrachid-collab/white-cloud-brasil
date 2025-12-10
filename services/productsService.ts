import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const STORAGE_KEY = 'white_cloud_brasil_products';
const PRODUCTS_VERSION = '2.0'; // Versão para forçar atualização quando necessário
const VERSION_KEY = 'white_cloud_brasil_products_version';

// Verifica se os produtos precisam ser atualizados
const needsUpdate = (): boolean => {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  return storedVersion !== PRODUCTS_VERSION;
};

// Atualiza produtos antigos com as novas imagens
const updateProductsIfNeeded = (products: Product[]): Product[] => {
  if (!needsUpdate()) {
    return products;
  }
  
  // Mapeia produtos antigos para novos usando os IDs
  const updatedProducts = products.map(storedProduct => {
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === storedProduct.id);
    if (mockProduct) {
      // Mantém dados customizados do usuário, mas atualiza imagens
      return {
        ...storedProduct,
        images: mockProduct.images,
      };
    }
    return storedProduct;
  });
  
  // Adiciona novos produtos que não existem no localStorage
  MOCK_PRODUCTS.forEach(mockProduct => {
    if (!updatedProducts.find(p => p.id === mockProduct.id)) {
      updatedProducts.push(mockProduct);
    }
  });
  
  // Salva a nova versão
  localStorage.setItem(VERSION_KEY, PRODUCTS_VERSION);
  
  return updatedProducts;
};

export const getProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const products = JSON.parse(stored);
      // Verifica se precisa atualizar
      if (needsUpdate()) {
        const updatedProducts = updateProductsIfNeeded(products);
        saveProducts(updatedProducts);
        return updatedProducts;
      }
      return products;
    }
    // Se não houver produtos salvos, usa os produtos mock como padrão
    localStorage.setItem(VERSION_KEY, PRODUCTS_VERSION);
    saveProducts(MOCK_PRODUCTS);
    return MOCK_PRODUCTS;
  } catch (e) {
    console.error('Erro ao carregar produtos:', e);
    return MOCK_PRODUCTS;
  }
};

export const saveProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Erro ao salvar produtos:', e);
  }
};

export const addProduct = (product: Product): Product[] => {
  const products = getProducts();
  const updated = [...products, product];
  saveProducts(updated);
  return updated;
};

export const updateProduct = (product: Product): Product[] => {
  const products = getProducts();
  const updated = products.map(p => p.id === product.id ? product : p);
  saveProducts(updated);
  return updated;
};

export const deleteProduct = (productId: string): Product[] => {
  const products = getProducts();
  const updated = products.filter(p => p.id !== productId);
  saveProducts(updated);
  return updated;
};










