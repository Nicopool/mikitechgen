
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, Kit, Category } from '../types';

interface ShopProps {
  products: Product[];
  kits: Kit[];
  categories: Category[];
}

export const Shop: React.FC<ShopProps> = ({ products, kits, categories }) => {
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="h-20 flex items-center justify-between px-8 border-b border-white/5 glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-black">M</div>
          <span className="text-xl font-black text-white tracking-tighter">MIKITECH</span>
        </Link>
        <div className="flex gap-8 text-sm font-bold text-slate-400">
          <Link to="/" className="hover:text-white">Inicio</Link>
          <Link to="/shop" className="text-white">Explorar</Link>
          <Link to="/support" className="hover:text-white">Soporte</Link>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/login" className="bg-white text-dark-950 px-6 py-2 rounded-full font-bold text-sm">Entrar</Link>
        </div>
      </nav>

      <div className="flex p-10 gap-10 max-w-[1400px] mx-auto">
        <aside className="w-64 space-y-8 shrink-0">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Filtrar</h3>
            <div className="space-y-2">
              {['ALL', 'PRODUCT', 'KIT'].map(t => (
                <button key={t} onClick={() => setFilter(t)} className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === t ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                  {t === 'ALL' ? 'Todo' : t === 'PRODUCT' ? 'Productos' : 'Kits Combo'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Categorías</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer">
                  <input type="checkbox" className="size-4 accent-brand-500" />
                  <span className="text-sm text-slate-400">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden group hover:border-brand-500/20 transition-all flex flex-col">
              <img src={p.image} className="h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-[10px] text-brand-400 font-bold uppercase mb-1">{p.category}</p>
                <h4 className="text-lg font-bold text-white mb-2">{p.name}</h4>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{p.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-xl font-black text-white">${p.price.toFixed(2)}</p>
                  <Link to="/product" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">Ver Detalle</Link>
                </div>
              </div>
            </div>
          ))}
          {kits.map(k => (
            <div key={k.id} className="bg-gradient-to-br from-brand-900/10 to-dark-900 border border-brand-500/20 rounded-[32px] overflow-hidden group hover:border-brand-500/40 transition-all flex flex-col">
              <img src={k.image} className="h-64 object-cover" alt={k.name} />
              <div className="p-6">
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase mb-3 inline-block">KIT AHORRO</span>
                <h4 className="text-lg font-bold text-white mb-2">{k.name}</h4>
                <p className="text-xl font-black text-white">${k.price.toFixed(2)} <span className="text-sm text-slate-500 line-through font-normal ml-2">${k.originalPrice.toFixed(2)}</span></p>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
