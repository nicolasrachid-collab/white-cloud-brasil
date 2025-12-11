export interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string; // Descrição completa e detalhada do produto
  brand?: string; // Marca do produto
  sku?: string; // SKU do produto
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  flavors?: string[];
  nicotine?: string[];
  specifications?: { [key: string]: string }; // Especificações técnicas (ex: { "Medidas": "73mm x 36mm x 14mm", "Potência": "8-12W" })
  includedItems?: string[]; // Itens inclusos na embalagem
  warranty?: string; // Texto de garantia
  paymentOptions?: string; // Opções de pagamento (ex: "Em até 12x sem juros")
}

export interface CartItem extends Product {
  quantity: number;
  selectedFlavor?: string;
  selectedNicotine?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  total: number;
  items: CartItem[];
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  registrationDate: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerPhoto?: string;
  rating: number; // 1 a 5
  comment: string;
  date: string; // ISO date string
}

export type ViewState = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'account' | 'tracking' | 'favorites';