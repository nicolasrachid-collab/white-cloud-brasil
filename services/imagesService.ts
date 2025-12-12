const STORAGE_KEY = 'white_cloud_brasil_images';

export const getImages = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Erro ao carregar imagens:', e);
    return [];
  }
};

export const saveImages = (images: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (e) {
    console.error('Erro ao salvar imagens:', e);
  }
};

export const addImage = (image: string): string[] => {
  const images = getImages();
  const updated = [image, ...images]; // Adiciona no início
  saveImages(updated);
  return updated;
};

export const deleteImage = (imageIndex: number): string[] => {
  const images = getImages();
  const updated = images.filter((_, index) => index !== imageIndex);
  saveImages(updated);
  return updated;
};













