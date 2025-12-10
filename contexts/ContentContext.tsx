import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContentSection } from '../types';
import { getContentSections, saveContentSections, updateContentSection as updateSectionService, addContentSection as addSectionService, deleteContentSection as deleteSectionService } from '../services/contentService';

interface ContentContextType {
  contentSections: ContentSection[];
  setContentSections: (sections: ContentSection[]) => void;
  updateSection: (section: ContentSection) => void;
  addSection: (section: Omit<ContentSection, 'id'>) => void;
  deleteSection: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [contentSections, setContentSectionsState] = useState<ContentSection[]>([]);

  // Carregar seções do localStorage ao montar
  useEffect(() => {
    setContentSectionsState(getContentSections());
  }, []);

  // Salvar seções no localStorage sempre que mudar
  useEffect(() => {
    if (contentSections.length > 0) {
      saveContentSections(contentSections);
    }
  }, [contentSections]);

  const setContentSections = (sections: ContentSection[]) => {
    setContentSectionsState(sections);
    saveContentSections(sections);
  };

  const updateSection = (section: ContentSection) => {
    setContentSectionsState(prev => {
      const updated = prev.map(s => s.id === section.id ? section : s);
      updateSectionService(section);
      return updated;
    });
  };

  const addSection = (sectionData: Omit<ContentSection, 'id'>) => {
    const newSection: ContentSection = {
      ...sectionData,
      id: `CONT-${Date.now()}`,
    };
    setContentSectionsState(prev => {
      const updated = [...prev, newSection];
      addSectionService(newSection);
      return updated;
    });
  };

  const deleteSection = (id: string) => {
    setContentSectionsState(prev => {
      const updated = prev.filter(s => s.id !== id);
      deleteSectionService(id);
      return updated;
    });
  };

  const value: ContentContextType = {
    contentSections,
    setContentSections,
    updateSection,
    addSection,
    deleteSection,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};



