
import { Product, Kit, Order, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', label: 'Pantallas', icon: 'monitor', color: 'blue' },
  { id: 'cat2', label: 'Robótica', icon: 'smart_toy', color: 'purple' },
  { id: 'cat3', label: 'Controladores', icon: 'memory', color: 'orange' },
  { id: 'cat4', label: 'Sensores', icon: 'settings_input_antenna', color: 'green' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Set de Interruptores Mecánicos', sku: 'MS-88-BLUE', price: 45.00, stock: 120, category: 'Accesorios', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400', status: 'ACTIVE', vendorId: 'v1', vendorName: 'Volt Dynamics', description: 'Interruptores táctiles premium para teclados mecánicos personalizados.' },
  { id: 'p2', name: 'Controlador Micro-LED', sku: 'MLC-X1', price: 29.99, stock: 45, category: 'Controladores', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400', status: 'ACTIVE', vendorId: 'v2', vendorName: 'NanoLogic', description: 'Controlador LED avanzado con soporte WiFi y Bluetooth.' },
];

export const INITIAL_KITS: Kit[] = [
  { id: 'k1', name: 'Kit de Inicio Pro Gamer', description: 'Todo lo que necesitas para construir tu primer teclado mecánico profesional.', products: [{ productId: 'p1', quantity: 1 }], price: 115.00, originalPrice: 134.00, image: 'https://images.unsplash.com/photo-1618384881928-22c42883d38f?auto=format&fit=crop&q=80&w=400', status: 'ACTIVE', vendorId: 'v1' },
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: 'MK-2024-1025', 
    userId: 'u1', 
    userName: 'Alex Rivers', 
    date: '2024-05-15', 
    total: 154.00, 
    status: 'PAID',
    subOrders: [
      { id: 'SO-01', vendorId: 'v1', vendorName: 'Volt Dynamics', status: 'PACKED', items: [{ productId: 'p1', name: 'Set de Interruptores', price: 45.00, quantity: 1 }] }
    ]
  }
];

export const MOCK_ADMIN_USERS = [
  { id: 'u1', name: 'Alex Rivers', email: 'alex@rivers.com', role: 'USER', status: 'ACTIVE', joinDate: '2023-11-12' },
  { id: 'u3', name: 'Marcus D.', email: 'marcus@volt.com', role: 'VENDOR', status: 'ACTIVE', joinDate: '2024-02-20' },
];
