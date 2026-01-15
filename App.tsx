
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserRole, User, Product, Category, Order, Kit } from './types';
import { INITIAL_PRODUCTS, INITIAL_KITS, INITIAL_CATEGORIES, MOCK_ORDERS } from './constants';

// Screens
import { HomePage } from './screens/HomePage';
import { Shop } from './screens/Shop';
import { AdminPage } from './screens/AdminPage';
import { SupplierPage } from './screens/SupplierPage';
import { DashboardPage } from './screens/DashboardPage';
import { AIChatBot } from './components/AIChatBot';

// Sistema de Notificaciones Estilizadas
const useNotify = () => {
  return (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const color = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0e8ce9';
    const banner = document.createElement('div');
    banner.className = 'fixed top-6 right-6 z-[200] px-6 py-3 rounded-2xl text-white font-bold shadow-2xl animate-in slide-in-from-right-4 duration-300';
    banner.style.backgroundColor = color;
    banner.innerText = msg;
    document.body.appendChild(banner);
    setTimeout(() => {
      banner.classList.add('fade-out');
      setTimeout(() => banner.remove(), 300);
    }, 3000);
  };
};

const App = () => {
  const notify = useNotify();
  const navigate = useNavigate();

  // "BASE DE DATOS" - Inicialización con LocalStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mk_users');
    return saved ? JSON.parse(saved) : [
      { id: 'admin-1', name: 'Administrador', email: 'admin@mikitech.com', password: 'Admin@123', role: 'ADMIN', status: 'ACTIVE', joinDate: '2024-01-01' }
    ];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mk_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Fix: Initialize kits state to pass to Shop component
  const [kits] = useState<Kit[]>(() => {
    const saved = localStorage.getItem('mk_kits');
    return saved ? JSON.parse(saved) : INITIAL_KITS;
  });

  // Fix: Initialize orders state to pass to DashboardPage component
  const [orders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mk_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Persistencia de datos al cambiar estados
  useEffect(() => { localStorage.setItem('mk_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('mk_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mk_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('mk_kits', JSON.stringify(kits)); }, [kits]);
  useEffect(() => { localStorage.setItem('mk_orders', JSON.stringify(orders)); }, [orders]);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleLogin = (email: string, pass: string) => {
    const found = users.find(u => u.email === email && u.password === pass);
    if (!found) {
      notify("Correo o contraseña incorrectos", "error");
      return;
    }
    if (found.status === 'SUSPENDED') {
      notify("Tu cuenta ha sido suspendida", "error");
      return;
    }
    setCurrentUser(found);
    notify(`¡Bienvenido, ${found.name}!`, "success");
    const target = found.role === 'ADMIN' ? '/admin' : found.role === 'VENDOR' ? '/supplier' : '/dashboard';
    navigate(target);
  };

  const handleRegister = (name: string, email: string, pass: string, role: UserRole) => {
    if (users.some(u => u.email === email)) {
      notify("El correo ya está registrado", "error");
      return;
    }
    if (!validatePassword(pass)) {
      notify("La contraseña debe tener 8+ carac., mayúscula, número y símbolo", "error");
      return;
    }
    const newUser: User = { id: Date.now().toString(), name, email, password: pass, role, status: 'ACTIVE', joinDate: new Date().toLocaleDateString() };
    setUsers([...users, newUser]);
    notify("Cuenta creada con éxito. Ya puedes entrar.", "success");
  };

  const handleResetPassword = (email: string) => {
    if (!users.some(u => u.email === email)) {
      notify("Correo no encontrado", "error");
      return;
    }
    notify(`Se ha enviado un enlace de recuperación a ${email}. Revisa tu Gmail.`, "info");
  };

  const LoginScreen = () => {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [role, setRole] = useState<UserRole>('USER');

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-dark-950">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-10 glass shadow-2xl animate-float">
          <div className="text-center mb-8">
            <div className="size-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-brand-500/20">
              <span className="material-symbols-outlined text-3xl font-bold">memory</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              {mode === 'login' ? 'Acceder' : mode === 'register' ? 'Unirse' : 'Recuperar'}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {mode === 'login' ? 'Bienvenido a Mikitech Engineering' : mode === 'register' ? 'Crea tu perfil de hardware' : 'Te ayudamos a volver'}
            </p>
          </div>

          <div className="space-y-4">
            {mode === 'register' && (
              <input type="text" placeholder="Nombre completo" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-brand-500 transition-all" value={name} onChange={e => setName(e.target.value)} />
            )}
            <input type="email" placeholder="Correo electrónico (Gmail)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-brand-500 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            
            {mode !== 'forgot' && (
              <input type="password" placeholder="Contraseña segura" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-brand-500 transition-all" value={pass} onChange={e => setPass(e.target.value)} />
            )}

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRole('USER')} className={`py-3 rounded-xl text-xs font-bold border transition-all ${role === 'USER' ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>CLIENTE</button>
                <button onClick={() => setRole('VENDOR')} className={`py-3 rounded-xl text-xs font-bold border transition-all ${role === 'VENDOR' ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>VENDEDOR</button>
              </div>
            )}

            <button onClick={() => mode === 'login' ? handleLogin(email, pass) : mode === 'register' ? handleRegister(name, email, pass, role) : handleResetPassword(email)} className="w-full py-4 bg-white text-dark-950 font-black rounded-2xl hover:bg-slate-200 transition-all shadow-lg active:scale-95">
              {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Enviar Enlace'}
            </button>

            <div className="flex flex-col gap-3 text-center mt-6">
              {mode === 'login' && (
                <>
                  <button onClick={() => setMode('forgot')} className="text-xs text-slate-500 hover:text-brand-400">¿Olvidaste tu contraseña?</button>
                  <button onClick={() => setMode('register')} className="text-sm font-bold text-brand-400">¿No tienes cuenta? Regístrate</button>
                </>
              )}
              {(mode === 'register' || mode === 'forgot') && (
                <button onClick={() => setMode('login')} className="text-sm font-bold text-slate-400">Volver al inicio</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark-950 min-h-screen text-slate-200">
      <Routes>
        <Route path="/" element={<HomePage categories={categories} products={products} />} />
        {/* Fix: Pass kits prop to Shop screen */}
        <Route path="/shop" element={<Shop products={products} categories={categories} kits={kits} />} />
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/admin/*" element={currentUser?.role === 'ADMIN' ? <AdminPage categories={categories} setCategories={setCategories} users={users} setUsers={setUsers} products={products} /> : <LoginScreen />} />
        <Route path="/supplier/*" element={currentUser?.role === 'VENDOR' ? <SupplierPage user={currentUser} products={products} setProducts={setProducts} /> : <LoginScreen />} />
        {/* Fix: Pass orders prop to DashboardPage screen */}
        <Route path="/dashboard/*" element={currentUser ? <DashboardPage user={currentUser} orders={orders} /> : <LoginScreen />} />
      </Routes>
      <AIChatBot />
    </div>
  );
};

export default App;
