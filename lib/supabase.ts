/**
 * Configuración de Supabase para Mikitech
 * Cliente con soporte para tiempo real
 */

import { createClient } from '@supabase/supabase-js';

// Obtener credenciales de variables de entorno (o usar placeholders para evitar crash)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase credentials not found. App will load in Demo/Offline mode.');
}

// Crear cliente de Supabase con configuración de tiempo real
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
    db: {
        schema: 'public',
    },
});

// Tipos de base de datos
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: number;
                    first_name: string;
                    last_name: string;
                    email: string;
                    password: string;
                    role: 'ADMIN' | 'USER' | 'PROVIDER';
                    enabled: boolean;
                    phone: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            products: {
                Row: {
                    id: number;
                    provider_id: number | null;
                    name: string;
                    slug: string;
                    description: string | null;
                    sku: string | null;
                    price: number;
                    stock: number;
                    image_url: string | null;
                    active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['products']['Insert']>;
            };
            categories: {
                Row: {
                    id: number;
                    name: string;
                    slug: string;
                    active: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['categories']['Insert']>;
            };
            kits: {
                Row: {
                    id: number;
                    provider_id: number;
                    name: string;
                    slug: string;
                    description: string | null;
                    price: number;
                    status: 'ACTIVE' | 'INACTIVE';
                    image_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['kits']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['kits']['Insert']>;
            };
            orders: {
                Row: {
                    id: number;
                    user_id: number;
                    status: 'CREATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
                    total_amount: number;
                    shipping_address: string | null;
                    shipping_city: string | null;
                    shipping_phone: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['orders']['Insert']>;
            };
        };
    };
}

// Helper para suscribirse a cambios en tiempo real
export function subscribeToTable<T extends keyof Database['public']['Tables']>(
    table: T,
    callback: (payload: any) => void,
    filter?: string
) {
    const channel = supabase
        .channel(`${table}-changes`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: table,
                filter: filter,
            },
            callback
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// Helper para autenticación
export const auth = {
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    signUp: async (email: string, password: string, metadata?: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};

// Helper para operaciones CRUD
export const db = {
    // Productos
    products: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        getById: async (id: number) => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            return { data, error };
        },

        create: async (product: Database['public']['Tables']['products']['Insert']) => {
            const { data, error } = await supabase
                .from('products')
                .insert(product)
                .select()
                .single();
            return { data, error };
        },

        update: async (id: number, updates: Database['public']['Tables']['products']['Update']) => {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            return { data, error };
        },

        delete: async (id: number) => {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            return { error };
        },
    },

    // Categorías
    categories: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('active', true);
            return { data, error };
        },
    },

    // Kits
    kits: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('kits')
                .select(`
          *,
          kit_items (
            quantity,
            product_id,
            products (*)
          )
        `)
                .eq('status', 'ACTIVE')
                .order('created_at', { ascending: false });
            return { data, error };
        },

        getById: async (id: number) => {
            const { data, error } = await supabase
                .from('kits')
                .select(`
          *,
          kit_items (
            quantity,
            product_id,
            products (*)
          )
        `)
                .eq('id', id)
                .single();
            return { data, error };
        },

        create: async (kit: Database['public']['Tables']['kits']['Insert']) => {
            const { data, error } = await supabase
                .from('kits')
                .insert(kit)
                .select()
                .single();
            return { data, error };
        },
    },

    // Órdenes
    orders: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          users (first_name, last_name, email),
          order_items (
            *,
            products (name, image_url)
          )
        `)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        getByUserId: async (userId: number) => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        create: async (order: Database['public']['Tables']['orders']['Insert']) => {
            const { data, error } = await supabase
                .from('orders')
                .insert(order)
                .select()
                .single();
            return { data, error };
        },

        updateStatus: async (id: number, status: Database['public']['Tables']['orders']['Row']['status']) => {
            const { data, error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', id)
                .select()
                .single();
            return { data, error };
        },
    },

    // Usuarios
    users: {
        getAll: async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id, first_name, last_name, email, role, enabled, phone, created_at')
                .order('created_at', { ascending: false });
            return { data, error };
        },

        getById: async (id: number) => {
            const { data, error } = await supabase
                .from('users')
                .select('id, first_name, last_name, email, role, enabled, phone, created_at')
                .eq('id', id)
                .single();
            return { data, error };
        },

        update: async (id: number, updates: Database['public']['Tables']['users']['Update']) => {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id)
                .select('id, first_name, last_name, email, role, enabled, phone')
                .single();
            return { data, error };
        },
    },
};

// Helper para almacenamiento de archivos
export const storage = {
    uploadProductImage: async (file: File, productId: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (error) return { data: null, error };

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return { data: { path: filePath, url: publicUrl }, error: null };
    },

    deleteProductImage: async (path: string) => {
        const { error } = await supabase.storage
            .from('product-images')
            .remove([path]);
        return { error };
    },
};

export default supabase;
