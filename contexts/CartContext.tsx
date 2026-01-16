import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Kit } from '../types';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    type: 'PRODUCT' | 'KIT';
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Product | Kit, type: 'PRODUCT' | 'KIT') => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('mk_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('mk_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (item: Product | Kit, type: 'PRODUCT' | 'KIT') => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
                type
            }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
