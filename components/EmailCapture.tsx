import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, EmailFormData } from '../schemas/validation';
import { Mail } from './Icons';
import { useToast } from '../hooks/useToast';

export function EmailCapture() {
  const { showSuccess, showError } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    // Animação de entrada suave com delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: EmailFormData) => {
    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showSuccess('Email cadastrado com sucesso! Você receberá nossas ofertas em breve.');
      reset();
    } catch (error) {
      showError('Erro ao cadastrar email. Tente novamente.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24 relative overflow-hidden">
      {/* Camada de profundidade - Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/95 to-primary-950/95"></div>
      
      {/* Background Patterns - Mais sutis e refinados */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] [background-size:48px_48px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_28%,rgba(255,255,255,0.025)_28%,rgba(255,255,255,0.025)_50%,transparent_50%,transparent_72%,rgba(255,255,255,0.025)_72%,rgba(255,255,255,0.025))] [background-size:56px_56px]"></div>
      </div>
      
      {/* Efeito de brilho animado sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2.5 to-transparent -skew-x-12 animate-shimmer-email"></div>
      
      {/* Elementos decorativos flutuantes - Mais distribuídos */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/12 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/3 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-primary-300/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/2.5 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-primary-200/6 rounded-full blur-xl animate-float" style={{ animationDelay: '2.5s' }}></div>
      
      {/* Linhas de gradiente diagonais decorativas - Mais sutis */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]">
        <div className="absolute top-1/4 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-1/4 right-0 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent transform -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-1/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-6"></div>
      </div>
      
      {/* Efeito de profundidade com sombras */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-950/50 to-transparent"></div>
      </div>
      
      <div className={`container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-3xl transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Ícone com glassmorphism aprimorado e glow effect */}
        <div className={`bg-white/10 backdrop-blur-xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-[0_8px_32px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)] border border-white/20 transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-[0_12px_40px_0_rgba(255,255,255,0.15),0_0_60px_rgba(39,89,255,0.2)] hover:bg-white/15 group relative ${
          isVisible ? 'animate-fade-in-up' : ''
        }`}>
          {/* Glow effect no hover */}
          <div className="absolute inset-0 rounded-3xl bg-primary-400/0 group-hover:bg-primary-400/10 blur-xl transition-all duration-500"></div>
          <Mail className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary-300 group-hover:text-primary-200 transition-colors duration-300 relative z-10" />
        </div>
        
        {/* Título com gradiente aprimorado e animação */}
        <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-transparent leading-tight tracking-tight ${
          isVisible ? 'animate-fade-in-up' : ''
        }`} style={{ animationDelay: '100ms' }}>
          Entre para o Clube VIP
        </h2>
        
        {/* Descrição melhorada com melhor contraste */}
        <p className={`text-primary-100/95 mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-4 ${
          isVisible ? 'animate-fade-in-up' : ''
        }`} style={{ animationDelay: '200ms' }}>
          Receba ofertas exclusivas, cupons de desconto e novidades em primeira mão diretamente no seu e-mail.
        </p>
        
        {/* Formulário modernizado com animação */}
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto px-4 ${
          isVisible ? 'animate-fade-in-up' : ''
        }`} style={{ animationDelay: '300ms' }}>
          <div className="flex-1 relative">
            <input
              {...register('email')}
              type="email"
              placeholder="Seu melhor e-mail"
              className={`w-full px-6 py-4 sm:py-5 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] focus:scale-[1.02] ${
                errors.email 
                  ? 'ring-2 ring-red-400 bg-red-50 focus:ring-red-400/50' 
                  : 'bg-white/98 backdrop-blur-sm focus:bg-white border border-white/20'
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-300 text-sm mt-2 text-left ml-6 font-medium animate-fade-in" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-600 hover:from-primary-400 hover:via-primary-500 hover:to-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(39,89,255,0.4)] active:scale-95 whitespace-nowrap min-h-[56px] flex items-center justify-center relative overflow-hidden group/btn"
          >
            {/* Efeito de brilho no botão */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span className="hidden sm:inline">Cadastrando...</span>
                <span className="sm:hidden">...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <span>CADASTRAR</span>
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 group-hover/btn:opacity-100 transition-opacity" />
              </span>
            )}
          </button>
        </form>
        
        {/* Badge de confiança com animação */}
        <div className={`mt-8 sm:mt-10 flex items-center justify-center gap-2 text-primary-200/85 text-xs sm:text-sm ${
          isVisible ? 'animate-fade-in-up' : ''
        }`} style={{ animationDelay: '400ms' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Seus dados estão seguros conosco</span>
        </div>
      </div>
    </section>
  );
}















