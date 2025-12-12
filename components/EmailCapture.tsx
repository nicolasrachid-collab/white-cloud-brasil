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
    <section className="bg-primary-900 text-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Receba ofertas exclusivas
        </h2>
        
        <p className="text-primary-100 mb-6 sm:mb-8 text-sm sm:text-base">
          Cadastre seu e-mail e receba novidades e promoções em primeira mão.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <input
              {...register('email')}
              type="email"
              placeholder="Seu e-mail"
              className={`w-full px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-base min-h-[44px] ${
                errors.email 
                  ? 'ring-2 ring-red-400 bg-red-50' 
                  : 'bg-white'
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-label="Campo de e-mail para cadastro"
            />
            {errors.email && (
              <p id="email-error" className="text-red-300 text-sm mt-2 text-left" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors min-h-[44px] whitespace-nowrap w-full sm:w-auto touch-manipulation"
            aria-label="Cadastrar e-mail"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span className="hidden sm:inline">Cadastrando...</span>
              </span>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-primary-200 text-xs sm:text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Seus dados estão seguros</span>
        </div>
      </div>
    </section>
  );
}










