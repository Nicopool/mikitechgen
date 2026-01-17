import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { CartProvider } from './contexts/CartContext';

// Screens
import { HomePage } from './screens/HomePage';
import { Shop } from './screens/Shop';
import { AdminPage } from './screens/AdminPage';
import { SupplierPage } from './screens/SupplierPage';
import { DashboardPage } from './screens/DashboardPage';
import { LoginScreen } from './screens/LoginScreen';
import { CheckoutPage } from './screens/CheckoutPage';
import { KitDetailPage } from './screens/KitDetailPage';
import { AboutPage } from './screens/AboutPage';

// Wrapper to handle redirection based on auth
const AuthenticatedApp = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { products, categories, kits, orders, loading: dataLoading, setProducts, setCategories, setUsers, users } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      // Wait for profile to load if user exists
      if (!profile) return;

      if (window.location.pathname === '/login') {
        if (profile.role === 'ADMIN') navigate('/admin');
        else if (profile.role === 'VENDOR') navigate('/supplier');
        else navigate('/dashboard');
      }
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Cargando Mikitech...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Routes>
        <Route path="/" element={<HomePage categories={categories} products={products} kits={kits} />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/kit/:id" element={<KitDetailPage />} />
        <Route path="/about" element={<AboutPage />} /> {/* Added About Route */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginScreen />} />

        <Route path="/admin/*" element={profile?.role === 'ADMIN' ?
          <AdminPage
            categories={categories}
            setCategories={setCategories}
            users={users}
            setUsers={setUsers}
            products={products}
          /> : <LoginScreen />}
        />

        <Route path="/supplier/*" element={profile?.role === 'VENDOR' ?
          <SupplierPage
            user={profile}
            products={products}
            setProducts={setProducts}
          /> : <LoginScreen />}
        />

        <Route path="/dashboard/*" element={user ?
          <DashboardPage
            user={profile || { name: user.email }}
            orders={orders}
          /> : <LoginScreen />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <AuthenticatedApp />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
