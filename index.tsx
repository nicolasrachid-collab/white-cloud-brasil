import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './contexts/CartContext';
import { AppProvider } from './contexts/AppContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Logs apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('Iniciando renderização do React...');
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppProvider>
            <ProductsProvider>
              <FavoritesProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </FavoritesProvider>
            </ProductsProvider>
          </AppProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  if (import.meta.env.DEV) {
    console.log('React renderizado com sucesso!');
  }
} catch (error) {
  console.error('Erro ao renderizar React:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1 style="color: red;">Erro ao carregar aplicação</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        }
      })
      .catch((error) => {
        // Sempre logar erros do Service Worker, mesmo em produção
        console.error('Falha ao registrar Service Worker:', error);
      });
  });
}