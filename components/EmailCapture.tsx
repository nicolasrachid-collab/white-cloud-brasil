import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, EmailFormData } from '../schemas/validation';
import { Mail } from './Icons';
import { useToast } from '../hooks/useToast';

export function EmailCapture() {
  const { showSuccess, showError } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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
    <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white pt-16 sm:pt-20 md:pt-24 pb-0 relative overflow-hidden">
      {/* Padrão de fundo melhorado */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:32px_32px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05))] [background-size:40px_40px]"></div>
      </div>
      
      {/* Efeito de brilho animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer-email"></div>
      
      {/* Círculos decorativos */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-3xl">
        {/* Ícone melhorado */}
        <div className="bg-white/10 backdrop-blur-md w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20 transform transition-transform hover:scale-110 hover:rotate-3">
          <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-primary-300" />
        </div>
        
        {/* Título melhorado */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
          Entre para o Clube VIP
        </h2>
        
        {/* Descrição melhorada */}
        <p className="text-primary-100 mb-8 sm:mb-10 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Receba ofertas exclusivas, cupons de desconto e novidades em primeira mão diretamente no seu e-mail.
        </p>
        
        {/* Formulário melhorado */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <input
              {...register('email')}
              type="email"
              placeholder="Seu melhor e-mail"
              className={`w-full px-6 py-4 sm:py-5 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all shadow-xl ${
                errors.email ? 'ring-2 ring-red-500 bg-red-50' : 'bg-white'
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-300 text-sm mt-2 text-left ml-6 font-medium" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold shadow-2xl transition-all hover:scale-105 hover:shadow-primary-500/50 active:scale-95 whitespace-nowrap"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Cadastrando...
              </span>
            ) : (
              'CADASTRAR'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}















