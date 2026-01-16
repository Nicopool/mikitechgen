import { Product, Kit, Order, AppUser, Category } from '../types';

// Real demo data for testing

export const DEMO_CATEGORIES: Category[] = [
    { id: 'cat-1', label: 'Procesadores', icon: 'memory', color: 'black' },
    { id: 'cat-2', label: 'Tarjetas Gráficas', icon: 'videogame_asset', color: 'black' },
    { id: 'cat-3', label: 'Memorias RAM', icon: 'storage', color: 'black' },
    { id: 'cat-4', label: 'Almacenamiento', icon: 'save', color: 'black' },
    { id: 'cat-5', label: 'Placas Madre', icon: 'developer_board', color: 'black' },
    { id: 'cat-6', label: 'Fuentes de Poder', icon: 'power', color: 'black' },
];

export const DEMO_PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        name: 'AMD Ryzen 9 7950X',
        sku: 'CPU-AMD-7950X',
        price: 699.99,
        stock: 15,
        category: 'Procesadores',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'Procesador de 16 núcleos y 32 hilos, ideal para gaming y productividad extrema.',
        metadata: {}
    },
    {
        id: 'prod-2',
        name: 'NVIDIA RTX 4090',
        sku: 'GPU-NV-4090',
        price: 1599.99,
        stock: 8,
        category: 'Tarjetas Gráficas',
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'La tarjeta gráfica más potente del mercado, 24GB GDDR6X.',
        metadata: {}
    },
    {
        id: 'prod-3',
        name: 'Corsair Vengeance RGB 32GB',
        sku: 'RAM-COR-32GB',
        price: 159.99,
        stock: 25,
        category: 'Memorias RAM',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'Kit de 2x16GB DDR5 6000MHz con iluminación RGB.',
        metadata: {}
    },
    {
        id: 'prod-4',
        name: 'Samsung 990 PRO 2TB',
        sku: 'SSD-SAM-2TB',
        price: 249.99,
        stock: 30,
        category: 'Almacenamiento',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'SSD NVMe Gen4 con velocidades de hasta 7,450 MB/s.',
        metadata: {}
    },
    {
        id: 'prod-5',
        name: 'ASUS ROG Strix X670E',
        sku: 'MB-ASUS-X670E',
        price: 449.99,
        stock: 12,
        category: 'Placas Madre',
        image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'Placa madre premium con soporte PCIe 5.0 y DDR5.',
        metadata: {}
    },
    {
        id: 'prod-6',
        name: 'Corsair RM1000x',
        sku: 'PSU-COR-1000W',
        price: 189.99,
        stock: 18,
        category: 'Fuentes de Poder',
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'Fuente modular 1000W 80+ Gold, totalmente silenciosa.',
        metadata: {}
    },
    {
        id: 'prod-7',
        name: 'Intel Core i9-14900K',
        sku: 'CPU-INT-14900K',
        price: 589.99,
        stock: 10,
        category: 'Procesadores',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'Procesador de 24 núcleos con tecnología Raptor Lake.',
        metadata: {}
    },
    {
        id: 'prod-8',
        name: 'AMD Radeon RX 7900 XTX',
        sku: 'GPU-AMD-7900XTX',
        price: 999.99,
        stock: 6,
        category: 'Tarjetas Gráficas',
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'GPU de alto rendimiento con 24GB GDDR6.',
        metadata: {}
    },
    {
        id: 'prod-9',
        name: 'G.Skill Trident Z5 64GB',
        sku: 'RAM-GSK-64GB',
        price: 299.99,
        stock: 3,
        category: 'Memorias RAM',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'Kit de 2x32GB DDR5 7200MHz para máximo rendimiento.',
        metadata: {}
    },
    {
        id: 'prod-10',
        name: 'WD Black SN850X 4TB',
        sku: 'SSD-WD-4TB',
        price: 449.99,
        stock: 0,
        category: 'Almacenamiento',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        vendorName: 'Proveedor Demo',
        description: 'SSD NVMe Gen4 de alta capacidad para profesionales.',
        metadata: {}
    },
];

export const DEMO_KITS: Kit[] = [
    {
        id: 'kit-1',
        name: 'Kit Gaming Extremo',
        description: 'Configuración tope de gama para gaming 4K y streaming profesional.',
        products: [
            { productId: 'prod-1', quantity: 1 },
            { productId: 'prod-2', quantity: 1 },
            { productId: 'prod-3', quantity: 1 },
            { productId: 'prod-4', quantity: 1 },
            { productId: 'prod-5', quantity: 1 },
            { productId: 'prod-6', quantity: 1 },
        ],
        price: 3299.99,
        originalPrice: 3549.93,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        category: 'Gaming PC'
    },
    {
        id: 'kit-2',
        name: 'Kit Workstation Pro',
        description: 'Ideal para edición de video, renderizado 3D y desarrollo.',
        products: [
            { productId: 'prod-7', quantity: 1 },
            { productId: 'prod-8', quantity: 1 },
            { productId: 'prod-9', quantity: 1 },
            { productId: 'prod-10', quantity: 1 },
        ],
        price: 2199.99,
        originalPrice: 2339.96,
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        category: 'Workstation'
    },
    {
        id: 'kit-3',
        name: 'Kit Streamer Starter',
        description: 'Todo lo necesario para comenzar tu carrera como streamer.',
        products: [
            { productId: 'prod-7', quantity: 1 },
            { productId: 'prod-3', quantity: 1 },
            { productId: 'prod-4', quantity: 1 },
        ],
        price: 999.99,
        originalPrice: 1099.97,
        image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800',
        status: 'ACTIVE',
        vendorId: 'demo-vendor-001',
        category: 'Streaming'
    },
];

export const DEMO_ORDERS: Order[] = [
    {
        id: 'order-1',
        userId: 'demo-user-001',
        userName: 'Cliente Demo',
        userEmail: 'cliente@mikitech.com',
        items: [
            { productId: 'prod-1', productName: 'AMD Ryzen 9 7950X', quantity: 1, price: 699.99 },
            { productId: 'prod-2', productName: 'NVIDIA RTX 4090', quantity: 1, price: 1599.99 },
        ],
        totalAmount: 2299.98,
        status: 'COMPLETED',
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-12T14:20:00Z'
    },
    {
        id: 'order-2',
        userId: 'demo-user-002',
        userName: 'Juan Pérez',
        userEmail: 'juan@example.com',
        items: [
            { productId: 'kit-1', productName: 'Kit Gaming Extremo', quantity: 1, price: 3299.99 },
        ],
        totalAmount: 3299.99,
        status: 'PENDING',
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
    },
    {
        id: 'order-3',
        userId: 'demo-user-003',
        userName: 'María González',
        userEmail: 'maria@example.com',
        items: [
            { productId: 'prod-3', productName: 'Corsair Vengeance RGB 32GB', quantity: 2, price: 159.99 },
            { productId: 'prod-4', productName: 'Samsung 990 PRO 2TB', quantity: 1, price: 249.99 },
        ],
        totalAmount: 569.97,
        status: 'SHIPPED',
        createdAt: '2024-01-14T16:45:00Z',
        updatedAt: '2024-01-15T08:30:00Z'
    },
    {
        id: 'order-4',
        userId: 'demo-user-004',
        userName: 'Carlos Rodríguez',
        userEmail: 'carlos@example.com',
        items: [
            { productId: 'kit-2', productName: 'Kit Workstation Pro', quantity: 1, price: 2199.99 },
        ],
        totalAmount: 2199.99,
        status: 'COMPLETED',
        createdAt: '2024-01-08T11:20:00Z',
        updatedAt: '2024-01-10T15:45:00Z'
    },
    {
        id: 'order-5',
        userId: 'demo-user-005',
        userName: 'Ana Martínez',
        userEmail: 'ana@example.com',
        items: [
            { productId: 'prod-5', productName: 'ASUS ROG Strix X670E', quantity: 1, price: 449.99 },
            { productId: 'prod-6', productName: 'Corsair RM1000x', quantity: 1, price: 189.99 },
        ],
        totalAmount: 639.98,
        status: 'PROCESSING',
        createdAt: '2024-01-16T07:00:00Z',
        updatedAt: '2024-01-16T07:00:00Z'
    },
];

export const DEMO_USERS: AppUser[] = [
    {
        id: 'demo-admin-001',
        email: 'admin@mikitech.com',
        name: 'Admin Mikitech',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2023-01-01T00:00:00Z'
    },
    {
        id: 'demo-vendor-001',
        email: 'proveedor@mikitech.com',
        name: 'Proveedor Demo',
        role: 'VENDOR',
        status: 'ACTIVE',
        createdAt: '2023-06-15T00:00:00Z'
    },
    {
        id: 'demo-user-001',
        email: 'cliente@mikitech.com',
        name: 'Cliente Demo',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2023-12-01T00:00:00Z'
    },
    {
        id: 'demo-user-002',
        email: 'juan@example.com',
        name: 'Juan Pérez',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2024-01-05T00:00:00Z'
    },
    {
        id: 'demo-user-003',
        email: 'maria@example.com',
        name: 'María González',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2024-01-10T00:00:00Z'
    },
    {
        id: 'demo-user-004',
        email: 'carlos@example.com',
        name: 'Carlos Rodríguez',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2023-11-20T00:00:00Z'
    },
    {
        id: 'demo-user-005',
        email: 'ana@example.com',
        name: 'Ana Martínez',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2024-01-12T00:00:00Z'
    },
];

// Sales data for charts
export const DEMO_SALES_DATA = {
    daily: [
        { date: '2024-01-10', sales: 2299.98, orders: 1 },
        { date: '2024-01-11', sales: 0, orders: 0 },
        { date: '2024-01-12', sales: 0, orders: 0 },
        { date: '2024-01-13', sales: 0, orders: 0 },
        { date: '2024-01-14', sales: 569.97, orders: 1 },
        { date: '2024-01-15', sales: 3299.99, orders: 1 },
        { date: '2024-01-16', sales: 639.98, orders: 1 },
    ],
    monthly: [
        { month: 'Ago', sales: 12500, orders: 15 },
        { month: 'Sep', sales: 18750, orders: 22 },
        { month: 'Oct', sales: 15200, orders: 18 },
        { month: 'Nov', sales: 22100, orders: 28 },
        { month: 'Dic', sales: 31500, orders: 35 },
        { month: 'Ene', sales: 8809.92, orders: 5 },
    ],
    byCategory: [
        { category: 'Procesadores', sales: 1289.98, percentage: 14.6 },
        { category: 'Tarjetas Gráficas', sales: 2599.98, percentage: 29.5 },
        { category: 'Memorias RAM', sales: 319.98, percentage: 3.6 },
        { category: 'Almacenamiento', sales: 249.99, percentage: 2.8 },
        { category: 'Kits Completos', sales: 4349.99, percentage: 49.4 },
    ]
};
