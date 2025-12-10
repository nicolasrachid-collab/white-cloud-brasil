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
    <section className="bg-primary-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
        <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <Mail className="w-8 h-8 text-primary-300" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Entre para o Clube VIP</h2>
        <p className="text-primary-100 mb-8 text-lg">
          Receba ofertas exclusivas, cupons de desconto e novidades em primeira mão diretamente no seu e-mail.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              {...register('email')}
              type="email"
              placeholder="Seu melhor e-mail"
              className={`w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-500/50 ${
                errors.email ? 'ring-2 ring-red-500' : ''
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-300 text-sm mt-2 text-left ml-6" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
          >
            {isSubmitting ? 'Cadastrando...' : 'CADASTRAR'}
          </button>
        </form>
      </div>
    </section>
  );
}














