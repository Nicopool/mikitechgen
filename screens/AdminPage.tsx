
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product, User } from '../types';

interface AdminProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  products: Product[];
}

export const AdminPage: React.FC<AdminProps> = ({ categories, setCategories, users, setUsers, products }) => {
  const [view, setView] = useState<'DASHBOARD' | 'CATEGORIES' | 'USERS'>('DASHBOARD');
  const [newCat, setNewCat] = useState({ label: '', icon: 'category' });

  const addCategory = () => {
    if (!newCat.label) return;
    setCategories([...categories, { id: Date.now().toString(), label: newCat.label, icon: newCat.icon, color: 'blue' }]);
    setNewCat({ label: '', icon: 'category' });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  return (
    <div className="flex h-screen bg-dark-950">
      <aside className="w-72 border-r border-white/5 bg-dark-900 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="size-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black">A</div>
          <h1 className="text-xl font-black text-white">ADMINISTRACIÓN</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('DASHBOARD')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${view === 'DASHBOARD' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">analytics</span> Resumen
          </button>
          <button onClick={() => setView('CATEGORIES')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${view === 'CATEGORIES' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">category</span> Categorías
          </button>
          <button onClick={() => setView('USERS')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${view === 'USERS' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">group</span> Usuarios
          </button>
        </nav>

        <Link to="/" className="p-4 border border-white/10 rounded-2xl text-center text-red-400 font-bold hover:bg-red-500/10">Cerrar Sesión</Link>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
        {view === 'DASHBOARD' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-black text-white">Vista General del Mercado</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                <p className="text-slate-500 font-bold uppercase text-xs mb-2">Ingresos Totales</p>
                <h3 className="text-4xl font-black text-white">$42,500.00</h3>
              </div>
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                <p className="text-slate-500 font-bold uppercase text-xs mb-2">Usuarios Registrados</p>
                <h3 className="text-4xl font-black text-white">{users.length}</h3>
              </div>
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                <p className="text-slate-500 font-bold uppercase text-xs mb-2">Productos en Tienda</p>
                <h3 className="text-4xl font-black text-white">{products.length}</h3>
              </div>
            </div>
          </div>
        )}

        {view === 'CATEGORIES' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-white">Gestión de Categorías</h2>
              <div className="flex gap-4">
                <input placeholder="Nombre de categoría" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" value={newCat.label} onChange={e => setNewCat({ ...newCat, label: e.target.value })} />
                <button onClick={addCategory} className="bg-brand-500 text-white px-8 py-2 rounded-xl font-bold">Añadir</button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-brand-400">{cat.icon}</span>
                    <p className="font-bold text-white">{cat.label}</p>
                  </div>
                  <button className="text-red-500 hover:underline text-xs">Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'USERS' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white">Usuarios y Permisos</h2>
            <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Rol</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acción</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase">{u.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {u.status === 'ACTIVE' ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => toggleUserStatus(u.id)} className="text-xs font-bold hover:underline">
                          {u.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
