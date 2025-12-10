import { Order } from '../types';
import { MOCK_ORDERS } from '../constants';

const STORAGE_KEY = 'white_cloud_brasil_orders';

export const getOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não houver pedidos salvos, usa os pedidos mock como padrão
    saveOrders(MOCK_ORDERS);
    return MOCK_ORDERS;
  } catch (e) {
    console.error('Erro ao carregar pedidos:', e);
    return MOCK_ORDERS;
  }
};

export const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Erro ao salvar pedidos:', e);
  }
};

export const addOrder = (order: Order): Order[] => {
  const orders = getOrders();
  const updated = [...orders, order];
  saveOrders(updated);
  return updated;
};

export const updateOrder = (order: Order): Order[] => {
  const orders = getOrders();
  const updated = orders.map(o => o.id === order.id ? order : o);
  saveOrders(updated);
  return updated;
};










