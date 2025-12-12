/**
 * Utilitários para otimização de imagens
 */

export const optimizeImageUrl = (url: string, width?: number, quality: number = 80): string => {
  // Se já for uma URL externa ou data URL, retornar como está
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  
  // Para imagens locais, pode adicionar parâmetros de otimização
  // quando houver um serviço de otimização de imagens
  return url;
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

