import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { AppUser } from '../types';
import { apiClient } from '../lib/apiClient';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: AppUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
    demoLogin: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
    demoLogin: async () => false
});

// Demo users for testing
const DEMO_USERS: AppUser[] = [
    {
        id: 'demo-admin-001',
        email: 'admin@mikitech.com',
        name: 'Admin Mikitech',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    },
    {
        id: 'demo-vendor-001',
        email: 'proveedor@mikitech.com',
        name: 'Proveedor Demo',
        role: 'VENDOR',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    },
    {
        id: 'demo-user-001',
        email: 'cliente@mikitech.com',
        name: 'Cliente Demo',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    }
];

const DEMO_PASSWORDS: { [key: string]: string } = {
    'admin@mikitech.com': 'admin123',
    'proveedor@mikitech.com': 'proveedor123',
    'cliente@mikitech.com': 'cliente123'
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
            console.warn('🎭 Supabase not configured. Running in DEMO MODE.');
            console.log('📝 Demo credentials:');
            console.log('   Admin: admin@mikitech.com / admin123');
            console.log('   Proveedor: proveedor@mikitech.com / proveedor123');
            console.log('   Cliente: cliente@mikitech.com / cliente123');
            setIsDemoMode(true);

            // Check if there's a saved demo session
            const savedProfile = localStorage.getItem('demo_profile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
                setUser({ email: JSON.parse(savedProfile).email } as User);
            }

            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            // Updated to query 'users' table, assuming migrated data or schema alignment
            // If the table is 'profiles' (from schema.sql), use that. 
            // Earlier check showed 'profiles' in schema, but migration script implies 'users'.
            // Let's try 'users' first as migration usually wins, or 'profiles' if that fails.
            // Actually, based on previous step schema view, the table IS 'profiles' in the SQL file,
            // BUT the Supabase dashboard usually has `users` in `auth.users`.
            // The public table for app data seems to be `profiles` based on `supabase_schema.sql` BUT `lib/supabase.ts` uses `users`.
            // Consistency is key. `lib/supabase.ts` is the active library for DataContext.
            // I will align this with `lib/supabase.ts` which uses `users`.
            // Wait, schema.sql says `profiles`. Migration script says `users`.
            // If migration script ran, `users` exists.

            const { data, error } = await supabase
                .from('users') // Aligning with lib/supabase.ts and migration script
                .select('*')
                .eq('id', userId) // CAREFUL: userId from auth is UUID, users.id might be int if migrated from MySQL directly?
                // If Migration preserved IDs as INT, we have a problem linking Auth (UUID) to User (Int).
                // However, usually we match by Email.
                .maybeSingle();

            if (data) {
                // Found by ID (if UUIDs match)
                setProfile({
                    id: data.id.toString(),
                    email: data.email,
                    name: `${data.first_name} ${data.last_name}`,
                    role: data.role === 'PROVIDER' ? 'VENDOR' : data.role,
                    status: data.enabled ? 'ACTIVE' : 'INACTIVE',
                    phone: data.phone,
                    createdAt: data.created_at
                });
            } else {
                // Try by Email as fallback (common in migration scenarios)
                const { data: userByEmail } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', user?.email) // session user email
                    .maybeSingle();

                if (userByEmail) {
                    setProfile({
                        id: userByEmail.id.toString(),
                        email: userByEmail.email,
                        name: `${userByEmail.first_name} ${userByEmail.last_name}`,
                        role: userByEmail.role === 'PROVIDER' ? 'VENDOR' : userByEmail.role,
                        status: userByEmail.enabled ? 'ACTIVE' : 'INACTIVE',
                        phone: userByEmail.phone,
                        createdAt: userByEmail.created_at
                    });
                } else {
                    console.warn('Profile not found in public.users');
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const demoLogin = async (email: string, password: string): Promise<boolean> => {
        try {
            // Try MySQL Login
            const data = await apiClient.login(email, password);
            if (data && data.user) {
                setProfile(data.user);
                setUser({ email: data.user.email, id: data.user.id } as User);

                // Save to localStorage
                localStorage.setItem('demo_profile', JSON.stringify(data.user));
                return true;
            }
        } catch (error) {
            console.error('MySQL login failed, falling back to demo check:', error);
        }

        if (!isDemoMode) return false;

        // Fallback: Validate credentials manually if backend fails (e.g. offline)
        if (DEMO_PASSWORDS[email] !== password) {
            return false;
        }

        // Find user
        const demoUser = DEMO_USERS.find(u => u.email === email);
        if (!demoUser) return false;

        // Set session
        setProfile(demoUser);
        setUser({ email: demoUser.email } as User);

        // Save to localStorage
        localStorage.setItem('demo_profile', JSON.stringify(demoUser));

        return true;
    };

    const signOut = async () => {
        if (isDemoMode) {
            setProfile(null);
            setUser(null);
            localStorage.removeItem('demo_profile');
        } else {
            await supabase.auth.signOut();
            setProfile(null);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, signOut, demoLogin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
