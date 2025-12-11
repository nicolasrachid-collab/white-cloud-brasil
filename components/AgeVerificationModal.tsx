import React, { useState, useEffect } from 'react';

const LOGO_URL = "/images/logo-whitecloud.png";

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já confirmou a idade
    const ageVerified = localStorage.getItem('white_cloud_age_verified');
    if (!ageVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('white_cloud_age_verified', 'true');
    setIsOpen(false);
  };

  const handleReject = () => {
    // Redireciona para uma página externa ou fecha a aba
    window.location.href = 'https://www.google.com';
  };

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop com blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 sm:p-10 text-center animate-fade-in">
        {/* Logo centralizado */}
        <div className="flex justify-center mb-6">
          <img 
            src={LOGO_URL} 
            alt="White Cloud Brasil" 
            className="h-16 sm:h-20 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-black tracking-tighter text-gray-900">WHITE CLOUD <span class="text-primary-600">BRASIL</span></span>';
            }}
          />
        </div>

        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-tight">
          APENAS MAIORES DE 18 ANOS PODEM ACESSAR NOSSO SITE.
        </h2>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
          <button
            onClick={handleReject}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[44px] whitespace-nowrap"
          >
            SOU MENOR DE IDADE
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors min-h-[44px] whitespace-nowrap"
          >
            TENHO MAIS DE 18 ANOS
          </button>
        </div>
      </div>
    </div>
  );
}

