
export type UserRole = 'ADMIN' | 'VENDOR' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  joinDate: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  vendorId: string;
  vendorName: string;
  description: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  products: { productId: string; quantity: number }[];
  price: number;
  originalPrice: number;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  vendorId: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  date: string;
  total: number;
  status: 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  items: any[];
  // Fix: added subOrders to match mock data in constants.tsx
  subOrders?: any[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  // Fix: added optional properties for AI media attachments and search grounding
  image?: string;
  video?: string;
  groundingLinks?: { title: string; uri: string }[];
}

export enum AISize {
  S1K = '1K',
  S2K = '2K',
  S4K = '4K',
}
