
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, User } from '../types';

interface SupplierProps {
  user: User;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const SupplierPage: React.FC<SupplierProps> = ({ user, products, setProducts }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: 'Accesorios', desc: '', img: '' });

  const addProduct = () => {
    if (!form.name || !form.price) return;
    const newP: Product = {
      id: Date.now().toString(),
      name: form.name,
      sku: 'SUP-' + Date.now(),
      price: parseFloat(form.price),
      stock: 100,
      category: form.category,
      image: form.img || 'https://picsum.photos/seed/' + form.name + '/400/400',
      status: 'ACTIVE',
      vendorId: user.id,
      vendorName: user.name,
      description: form.desc
    };
    setProducts([...products, newP]);
    setForm({ name: '', price: '', category: 'Accesorios', desc: '', img: '' });
    setShowAdd(false);
  };

  return (
    <div className="flex h-screen bg-dark-950">
      <aside className="w-72 border-r border-white/5 bg-dark-900 p-8 flex flex-col">
        <h2 className="text-2xl font-black text-white mb-12 flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-500">storefront</span> VENDEDOR
        </h2>
        
        <div className="p-6 bg-white/5 rounded-3xl mb-8">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Nombre Comercial</p>
          <p className="text-lg font-bold text-white">{user.name}</p>
        </div>

        <button className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold mb-4">Mi Inventario</button>
        <button className="w-full py-4 text-slate-500 font-bold mb-4">Ventas</button>
        
        {/* Fix: Link component imported from react-router-dom */}
        <Link to="/" className="mt-auto p-4 border border-white/10 rounded-2xl text-center text-slate-500 hover:text-white font-bold transition-all">Regresar a Tienda</Link>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-white">Gestión de Catálogo</h2>
          <button onClick={() => setShowAdd(true)} className="px-8 py-4 bg-brand-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 flex items-center gap-2 hover:scale-105 transition-all">
            <span className="material-symbols-outlined">add</span> Nuevo Producto
          </button>
        </div>

        {showAdd && (
          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] mb-12 animate-in slide-in-from-top-4">
            <h3 className="text-2xl font-black text-white mb-8">Información del Producto</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Nombre</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white focus:border-brand-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Precio (USD)</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white focus:border-brand-500" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-slate-500 uppercase ml-2">Descripción Corta</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white focus:border-brand-500 h-32" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button onClick={addProduct} className="px-10 py-4 bg-white text-dark-950 font-black rounded-2xl">Publicar Producto</button>
              <button onClick={() => setShowAdd(false)} className="px-10 py-4 text-slate-500 font-bold">Cancelar</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {products.filter(p => p.vendorId === user.id || p.vendorId === 'v1').map(p => (
            <div key={p.id} className="p-6 bg-white/5 border border-white/5 rounded-[32px] flex items-center gap-8 group">
              <img src={p.image} className="size-24 rounded-[20px] object-cover group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white">{p.name}</h4>
                <p className="text-sm text-slate-500">{p.category}</p>
                <p className="text-2xl font-black text-brand-400 mt-2">${p.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400"><span className="material-symbols-outlined">edit</span></button>
                <button className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-red-500"><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
