/**
 * Utilitários para formatação de valores
 */

/**
 * Formata um número como preço em reais (formato brasileiro)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como "R$ X,XX"
 */
export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Formata um número como preço sem o símbolo R$
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como "X,XX"
 */
export function formatPriceValue(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

