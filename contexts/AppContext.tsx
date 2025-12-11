import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViewState } from '../types';

interface AppContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  navigate: (view: ViewState | string, productId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mapeamento de URLs para views (em português)
const urlToView: Record<string, ViewState> = {
  '/': 'home',
  '/catalogo': 'catalog',
  '/carrinho': 'cart',
  '/favoritos': 'favorites',
  '/checkout': 'checkout',
  '/conta': 'account',
  '/rastreamento': 'tracking',
};

// Mapeamento de views para URLs (em português)
const viewToUrl: Record<ViewState, string> = {
  home: '/',
  catalog: '/catalogo',
  product: '/produto', // Será completado com o ID
  cart: '/carrinho',
  favorites: '/favoritos',
  checkout: '/checkout',
  account: '/conta',
  tracking: '/rastreamento',
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const navigateRouter = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Determinar view baseado na URL
  const getViewFromUrl = (): ViewState => {
    const path = location.pathname;
    
    // Verificar rotas dinâmicas primeiro (em português)
    if (path.startsWith('/produto/')) {
      return 'product';
    }
    
    // Verificar rotas estáticas
    return urlToView[path] || 'home';
  };
  
  // Extrair productId da URL se estiver na rota de produto
  const getProductIdFromUrl = (): string | null => {
    const path = location.pathname;
    if (path.startsWith('/produto/')) {
      const parts = path.split('/');
      return parts[2] || null; // /produto/:id -> parts[2] é o ID
    }
    return null;
  };
  
  const [view, setView] = useState<ViewState>(getViewFromUrl());
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    getProductIdFromUrl()
  );

  // Sincronizar view com URL quando a rota mudar
  useEffect(() => {
    const newView = getViewFromUrl();
    setView(newView);
    
    // Extrair productId da URL se estiver na rota de produto
    const productId = getProductIdFromUrl();
    if (newView === 'product' && productId) {
      setSelectedProductId(productId);
    } else if (newView !== 'product') {
      setSelectedProductId(null);
    }
    
    // Extrair categoria da query string
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
    
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const navigate = (viewOrUrl: ViewState | string, productId?: string) => {
    let url: string;
    
    if (viewOrUrl.startsWith('/')) {
      // É uma URL direta
      url = viewOrUrl;
    } else {
      // É uma view - converter para URL
      const view = viewOrUrl as ViewState;
      url = viewToUrl[view];
      
      if (view === 'product' && productId) {
        url = `/produto/${productId}`;
      }
    }
    
    // Navegar para a URL usando replace: false para adicionar ao histórico
    // O useEffect vai sincronizar a view automaticamente quando a URL mudar
    try {
      navigateRouter(url, { replace: false });
    } catch (error) {
      console.error('Erro ao navegar:', error);
      // Fallback: usar window.location se navigateRouter falhar
      window.location.href = url;
    }
    window.scrollTo(0, 0);
  };

  const value: AppContextType = {
    view,
    setView,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    selectedProductId,
    setSelectedProductId,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};















