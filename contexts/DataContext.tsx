import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Category, Kit, Order, AppUser } from '../types';
import { apiClient, checkBackendConnection } from '../lib/apiClient';

interface DataContextType {
    products: Product[];
    categories: Category[];
    kits: Kit[];
    orders: Order[];
    users: AppUser[];
    loading: boolean;
    usingBackend: boolean;
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
    const [usingBackend, setUsingBackend] = useState(false);

    const fetchFromBackend = async () => {
        try {
            console.log('📡 Fetching data from MySQL backend...');

            const [productsData, categoriesData, kitsData, ordersData, usersData] = await Promise.all([
                apiClient.getProducts(),
                apiClient.getCategories(),
                apiClient.getKits(),
                apiClient.getOrders(),
                apiClient.getUsers()
            ]);

            setProducts(productsData);
            setCategories(categoriesData);
            setKits(kitsData);

            // Transform users
            setUsers(usersData.map((u: any) => ({
                id: u.id,
                email: u.email,
                name: u.name,
                role: u.role === 'PROVIDER' ? 'VENDOR' : u.role,
                status: u.status,
                joinDate: new Date(u.createdAt).toLocaleDateString(),
                createdAt: u.createdAt
            })));

            // Transform orders to group items into subOrders
            const transformedOrders = ordersData.map((o: any) => {
                const subOrdersMap = new Map();

                if (o.items) {
                    o.items.forEach((item: any) => {
                        const vendorId = item.vendorId || 'unknown';
                        if (!subOrdersMap.has(vendorId)) {
                            subOrdersMap.set(vendorId, {
                                id: `${o.id}-${vendorId}`,
                                vendorId: vendorId,
                                vendorName: item.vendorName || 'Unknown Vendor',
                                status: o.status,
                                items: []
                            });
                        }
                        subOrdersMap.get(vendorId).items.push({
                            id: item.productId,
                            name: item.productName || 'Unknown Product',
                            price: parseFloat(item.price),
                            quantity: item.quantity,
                            image: '',
                            type: 'PRODUCT'
                        });
                    });
                }

                return {
                    id: o.id,
                    userId: o.userId,
                    userName: o.userName,
                    userEmail: o.userEmail,
                    totalAmount: parseFloat(o.totalAmount),
                    status: o.status,
                    createdAt: o.createdAt,
                    updatedAt: o.updatedAt,
                    subOrders: Array.from(subOrdersMap.values())
                };
            });

            setOrders(transformedOrders);

            console.log('✅ Data loaded from MySQL backend');
            console.log(`📊 Stats: ${usersData.length} users, ${productsData.length} products, ${kitsData.length} kits, ${ordersData.length} orders`);

            setUsingBackend(true);
        } catch (error) {
            console.error('❌ Error fetching from backend:', error);
            throw error;
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            // Check if backend is available
            const backendAvailable = await checkBackendConnection();

            if (backendAvailable) {
                await fetchFromBackend();
            } else {
                console.warn('⚠️ Backend not available');
                setUsingBackend(false);
            }
        } catch (error) {
            console.error('❌ Error loading data:', error);
            setUsingBackend(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const refreshData = async () => {
        await fetchAll();
    };

    return (
        <DataContext.Provider value={{
            products,
            categories,
            kits,
            orders,
            users,
            loading,
            usingBackend,
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
