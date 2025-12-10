import { ContentSection } from '../types';
import { MOCK_CONTENT_SECTIONS } from '../constants';

const STORAGE_KEY = 'white_cloud_brasil_content_sections';

export const getContentSections = (): ContentSection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não houver seções salvas, usa as seções mock como padrão
    saveContentSections(MOCK_CONTENT_SECTIONS);
    return MOCK_CONTENT_SECTIONS;
  } catch (e) {
    console.error('Erro ao carregar seções de conteúdo:', e);
    return MOCK_CONTENT_SECTIONS;
  }
};

export const saveContentSections = (sections: ContentSection[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  } catch (e) {
    console.error('Erro ao salvar seções de conteúdo:', e);
  }
};

export const addContentSection = (section: ContentSection): ContentSection[] => {
  const sections = getContentSections();
  const updated = [...sections, section];
  saveContentSections(updated);
  return updated;
};

export const updateContentSection = (section: ContentSection): ContentSection[] => {
  const sections = getContentSections();
  const updated = sections.map(s => s.id === section.id ? section : s);
  saveContentSections(updated);
  return updated;
};

export const deleteContentSection = (sectionId: string): ContentSection[] => {
  const sections = getContentSections();
  const updated = sections.filter(s => s.id !== sectionId);
  saveContentSections(updated);
  return updated;
};










