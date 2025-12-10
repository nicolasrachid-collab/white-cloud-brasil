import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Tag, Save, X, Plus, Trash2 } from '../Icons';
import { Button } from '../Button';

interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'banner' | 'category';
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

interface ContentManagerProps {
  sections: ContentSection[];
  categories: Array<{ id: string; name: string }>;
  onSave: (section: ContentSection) => void;
  onDelete: (id: string) => void;
  onAdd: (section: Omit<ContentSection, 'id'>) => void;
}

export function ContentManager({ 
  sections, 
  categories, 
  onSave, 
  onDelete, 
  onAdd 
}: ContentManagerProps) {
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentSection>>({
    type: 'text',
    title: '',
    content: '',
    isActive: true,
    order: sections.length + 1,
  });

  const handleSave = () => {
    if (selectedSection) {
      onSave({ ...selectedSection, ...formData } as ContentSection);
    } else if (isAdding) {
      onAdd(formData as Omit<ContentSection, 'id'>);
      setIsAdding(false);
      setFormData({ type: 'text', title: '', content: '', isActive: true, order: sections.length + 1 });
    }
    setSelectedSection(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Conteúdo</h2>
          <p className="text-sm text-gray-500 mt-1">Gerencie textos, imagens, seções e categorias do site</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Seção
        </Button>
      </div>

      {/* Grid de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => {
          const Icon = section.type === 'image' ? ImageIcon : section.type === 'category' ? Tag : FileText;
          return (
            <div
              key={section.id}
              className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedSection?.id === section.id ? 'border-primary-500' : 'border-gray-200'
              } ${!section.isActive ? 'opacity-50' : ''}`}
              onClick={() => {
                setSelectedSection(section);
                setFormData(section);
                setIsAdding(false);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary-600" />
                  <span className="text-xs font-medium text-gray-500 uppercase">{section.type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${section.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {section.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{section.title}</h3>
              {section.imageUrl && (
                <img src={section.imageUrl} alt={section.title} className="w-full h-32 object-cover rounded mb-2" />
              )}
              <p className="text-sm text-gray-600 line-clamp-2">{section.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Ordem: {section.order}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(section.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Edição */}
      {(selectedSection || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => {
          setSelectedSection(null);
          setIsAdding(false);
        }}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {isAdding ? 'Adicionar Nova Seção' : 'Editar Seção'}
              </h3>
              <button onClick={() => {
                setSelectedSection(null);
                setIsAdding(false);
              }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentSection['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="text">Texto</option>
                    <option value="image">Imagem</option>
                    <option value="banner">Banner</option>
                    <option value="category">Categoria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Título da seção"
                />
              </div>

              {(formData.type === 'text' || formData.type === 'banner') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Conteúdo da seção"
                  />
                </div>
              )}

              {(formData.type === 'image' || formData.type === 'banner') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                      <button
                        onClick={() => setFormData({ ...formData, imageUrl: undefined })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Clique para fazer upload</p>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {formData.type === 'banner' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão</label>
                    <input
                      type="text"
                      value={formData.cta || ''}
                      onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: Aproveitar Agora, Compre Agora, Ver Mais"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link/URL de Redirecionamento</label>
                    <input
                      type="text"
                      value={formData.link || ''}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: /catalog, /product/123, https://exemplo.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Use caminhos relativos (ex: /catalog) ou URLs completas (ex: https://exemplo.com)
                    </p>
                  </div>
                </>
              )}

              {formData.type === 'category' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Seção ativa
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSection(null);
                    setIsAdding(false);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

