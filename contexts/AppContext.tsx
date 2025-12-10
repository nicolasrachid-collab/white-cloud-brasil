import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  navigate: (view: ViewState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [view, setView] = useState<ViewState>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const navigate = (newView: ViewState) => {
    setView(newView);
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














