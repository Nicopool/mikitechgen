export type UserRole = 'ADMIN' | 'VENDOR' | 'USER';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  joinDate?: string;
  createdAt?: string;
  avatar?: string;
};

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  slug?: string;
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  categoryId?: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  vendorId?: string;
  vendorName?: string;
  description: string;
  metadata?: any;
  updatedAt?: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  products: { productId: string; quantity: number; name?: string; price?: number }[];
  price: number;
  originalPrice: number;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  vendorId?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  subOrders: SubOrder[];
  paymentMethod?: string;
  address?: string;
}

export interface SubOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  trackingNumber?: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  type: 'PRODUCT' | 'KIT';
}

export interface Invoice {
  id: string;
  orderId: string;
  date: string;
  total: number;
  pdfUrl?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  createdAt: string;
  category: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  video?: string;
  groundingLinks?: { title: string; uri: string }[];
}

export enum AISize {
  S1K = '1K',
  S2K = '2K',
  S4K = '4K',
}
