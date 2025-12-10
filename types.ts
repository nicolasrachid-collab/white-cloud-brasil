export interface Product {
  id: string;
  name: string;
  description: string;
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

export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'banner' | 'category';
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  cta?: string; // Texto do botão (ex: "Aproveitar Agora")
  link?: string; // Link/URL para redirecionamento (ex: "/catalog", "/product/123", "https://...")
  color?: string; // Gradiente Tailwind (ex: "from-purple-900 to-indigo-900")
}

export type ViewState = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'account' | 'admin' | 'tracking' | 'ai-editor' | 'favorites';