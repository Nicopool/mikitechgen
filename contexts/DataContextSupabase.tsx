import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Category, Kit, Order, AppUser } from '../types';
import { db, subscribeToTable } from '../lib/supabase';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_KITS, DEMO_ORDERS, DEMO_USERS } from '../lib/demoData';

interface DataContextType {
    products: Product[];
    categories: Category[];
    kits: Kit[];
    orders: Order[];
    users: AppUser[];
    loading: boolean;
    usingSupabase: boolean; // Flag to indicate we are using Supabase
    refreshData: () => Promise<void>;
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
    setKits: React.Dispatch<React.SetStateAction<Kit[]>>;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [kits, setKits] = useState<Kit[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFromSupabase = async () => {
        try {
            console.log('⚡ Fetching data from Supabase...');
            setLoading(true);

            const [productsData, categoriesData, kitsData, ordersData, usersData] = await Promise.all([
                db.products.getAll(),
                db.categories.getAll(),
                db.kits.getAll(),
                db.orders.getAll(),
                db.users.getAll()
            ]);

            // === PRODUCTS ===
            if (productsData.data && productsData.data.length > 0) {
                // Transform if necessary, but types should mostly match if schema is 1:1
                // @ts-ignore - Supabase types might slightly mismatch App types, handling manually
                const mappedProducts: Product[] = productsData.data.map(p => ({
                    id: p.id.toString(),
                    name: p.name,
                    slug: p.slug,
                    sku: p.sku || '',
                    price: p.price,
                    stock: p.stock,
                    image: p.image_url || '',
                    description: p.description || '',
                    category: 'General', // TODO: Join with categories if needed for display
                    status: p.active ? 'ACTIVE' : 'INACTIVE',
                    vendorId: p.provider_id?.toString() || '',
                    vendorName: 'Unknown' // TODO: Join with users
                }));
                setProducts(mappedProducts);
            } else {
                console.warn('⚠️ No products found in Supabase. Loading DEMO products.');
                setProducts(DEMO_PRODUCTS);
            }

            // === CATEGORIES ===
            if (categoriesData.data && categoriesData.data.length > 0) {
                const mappedCategories: Category[] = categoriesData.data.map(c => ({
                    id: c.id.toString(),
                    label: c.name,
                    icon: 'package', // Default
                    color: 'black'
                }));
                setCategories(mappedCategories);
            } else {
                console.warn('⚠️ No categories found in Supabase. Loading DEMO categories.');
                setCategories(DEMO_CATEGORIES);
            }

            // === KITS ===
            if (kitsData.data && kitsData.data.length > 0) {
                // @ts-ignore
                const mappedKits: Kit[] = kitsData.data.map(k => ({
                    id: k.id.toString(),
                    name: k.name,
                    slug: k.slug,
                    description: k.description || '',
                    price: k.price,
                    originalPrice: k.price * 1.2, // Mock original price
                    image: k.image_url || '',
                    status: k.status,
                    products: k.kit_items.map((ki: any) => ({
                        productId: ki.product_id.toString(),
                        quantity: ki.quantity
                    }))
                }));
                setKits(mappedKits);
            } else {
                console.warn('⚠️ No kits found in Supabase. Loading DEMO kits.');
                setKits(DEMO_KITS);
            }

            // === USERS ===
            if (usersData.data && usersData.data.length > 0) {
                // @ts-ignore
                const mappedUsers: AppUser[] = usersData.data.map(u => ({
                    id: u.id.toString(),
                    email: u.email,
                    name: `${u.first_name} ${u.last_name}`,
                    role: u.role === 'PROVIDER' ? 'VENDOR' : u.role,
                    status: u.enabled ? 'ACTIVE' : 'INACTIVE',
                    phone: u.phone,
                    createdAt: u.created_at
                }));
                setUsers(mappedUsers);
            } else {
                console.warn('⚠️ No users found in Supabase. Loading DEMO users.');
                setUsers(DEMO_USERS);
            }

            // === ORDERS ===
            if (ordersData.data && ordersData.data.length > 0) {
                // @ts-ignore
                const mappedOrders: Order[] = ordersData.data.map(o => ({
                    id: o.id.toString(),
                    userId: o.user_id.toString(),
                    userName: `${o.users?.first_name} ${o.users?.last_name}`,
                    userEmail: o.users?.email,
                    totalAmount: o.total_amount,
                    status: o.status,
                    createdAt: o.created_at,
                    updatedAt: o.updated_at,
                    subOrders: [] // TODO: Implement sub-order grouping if needed
                }));
                setOrders(mappedOrders);
            } else {
                console.warn('⚠️ No orders found in Supabase. Loading DEMO orders.');
                setOrders(DEMO_ORDERS);
            }

            console.log('✅ Data loaded (Supabase + Demo Fallback)');

        } catch (error) {
            console.error('❌ Error fetching from Supabase:', error);
            // Fallback EVERYTHING
            setProducts(DEMO_PRODUCTS);
            setCategories(DEMO_CATEGORIES);
            setKits(DEMO_KITS);
            setUsers(DEMO_USERS);
            setOrders(DEMO_ORDERS);
        } finally {
            setLoading(false);
        }
    };

    const setupRealtimeSubscriptions = () => {
        // Subscribe to changes
        const unsubProducts = subscribeToTable('products', (payload) => {
            console.log('🔄 Product change:', payload);
            fetchFromSupabase(); // Specific update logic is better, but this handles all cases
        });

        const unsubOrders = subscribeToTable('orders', (payload) => {
            console.log('🔄 Order change:', payload);
            fetchFromSupabase(); // Simple refresh
        });

        return () => {
            unsubProducts();
            unsubOrders();
        };
    };

    useEffect(() => {
        fetchFromSupabase();
        const cleanup = setupRealtimeSubscriptions();
        return cleanup;
    }, []);

    const refreshData = async () => {
        await fetchFromSupabase();
    };

    return (
        <DataContext.Provider value={{
            products,
            categories,
            kits,
            orders,
            users,
            loading,
            usingSupabase: true,
            refreshData,
            setProducts,
            setCategories,
            setUsers,
            setKits,
            setOrders
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
};
