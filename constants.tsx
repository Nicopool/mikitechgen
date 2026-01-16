
import { Product, Kit, Order, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'gaming-pc', label: 'Gaming PC', icon: 'computer', color: 'black' },
  { id: 'laptops', label: 'Portátiles', icon: 'laptop_mac', color: 'black' },
  { id: 'streaming', label: 'Streaming Pro', icon: 'podcasts', color: 'black' },
  { id: 'gaming-sets', label: 'Sets Gaming', icon: 'grid_view', color: 'black' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Guía Maestra: Setup Gaming PC 2024',
    sku: 'DIG-PC-01',
    price: 19.99,
    stock: 9999,
    category: 'Gaming PC',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    vendorId: 'v1',
    vendorName: 'Mikitech Expert',
    description: 'Manual digital detallado para construir y optimizar tu PC Gamer desde cero.',
    metadata: { isDigital: true }
  },
  {
    id: 'p2',
    name: 'Pack Overlays Streaming Neon-Dark',
    sku: 'DIG-STR-01',
    price: 24.99,
    stock: 9999,
    category: 'Streaming Pro',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    vendorId: 'v1',
    vendorName: 'Mikitech Expert',
    description: 'Colección completa de escenas, alertas y marcos para OBS/Streamlabs con estética minimalist dark.',
    metadata: { isDigital: true }
  },
  {
    id: 'p3',
    name: 'Kit Optimización Portátil Gaming',
    sku: 'DIG-LAP-01',
    price: 14.50,
    stock: 9999,
    category: 'Portátiles',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    vendorId: 'v1',
    vendorName: 'Mikitech Expert',
    description: 'Software y guía paso a paso para reducir temperaturas y mejorar FPS en portátiles.',
    metadata: { isDigital: true }
  },
];

export const INITIAL_KITS: Kit[] = [
  {
    id: 'k1',
    name: 'Bundle Supremo Streamer',
    description: 'El kit definitivo para empezar tu carrera en streaming: Overlays + Guía de Audio + Configuración OBS.',
    products: [{ productId: 'p1', quantity: 1 }, { productId: 'p2', quantity: 1 }],
    price: 39.00,
    originalPrice: 44.98,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    vendorId: 'v1'
  },
  {
    id: 'k2',
    name: 'Estación de Trabajo Elite',
    description: 'Optimización total para productividad y desarrollo. Incluye guías de ergonomía y perfiles de software.',
    products: [{ productId: 'p3', quantity: 2 }],
    price: 25.00,
    originalPrice: 29.00,
    image: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    vendorId: 'v1'
  },
  {
    id: 'k3',
    name: 'Kit Creador de Contenido',
    description: 'Todo lo necesario para YouTube y Redes Sociales. Presets de video y guías de iluminación.',
    products: [{ productId: 'p1', quantity: 1 }, { productId: 'p3', quantity: 1 }],
    price: 29.99,
    originalPrice: 34.49,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400',
    status: 'ACTIVE',
    vendorId: 'v1'
  }
];
