import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(500, 'Mensagem muito longa'),
});

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  paymentMethod: z.enum(['credit', 'debit', 'pix', 'boleto'], {
    errorMap: () => ({ message: 'Método de pagamento inválido' }),
  }),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;




















