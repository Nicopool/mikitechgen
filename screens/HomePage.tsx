
import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';

interface HomeProps {
  categories: Category[];
  products: Product[];
}

export const HomePage: React.FC<HomeProps> = ({ categories, products }) => {
  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="h-20 flex items-center justify-between px-10 border-b border-white/5 glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black text-xl">M</div>
          <span className="text-2xl font-black tracking-tighter text-white">MIKITECH</span>
        </div>
        <div className="flex gap-10 text-sm font-bold text-slate-400">
          <Link to="/shop" className="hover:text-white transition-colors">Tienda</Link>
          <Link to="/support" className="hover:text-white transition-colors">Soporte</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-6 py-2.5 bg-white text-dark-950 font-black rounded-full hover:bg-slate-200 transition-all">Acceder</Link>
        </div>
      </nav>

      <main className="p-10 max-w-[1400px] mx-auto space-y-20">
        <header className="relative h-[60vh] rounded-[48px] overflow-hidden flex flex-col justify-center px-16 border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/60 to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 size-full object-cover" alt="" />
          <div className="relative z-20 max-w-2xl space-y-6">
            <span className="px-3 py-1 bg-brand-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase">Tecnología de Vanguardia</span>
            <h1 className="text-7xl font-black text-white leading-[0.9] tracking-tighter">CONSTRUYE <br/>EL FUTURO.</h1>
            <p className="text-lg text-slate-400">La primera plataforma de hardware multi-proveedor para ingenieros y entusiastas.</p>
            <Link to="/shop" className="inline-block px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-brand-600/30">Explorar la Tienda</Link>
          </div>
        </header>

        <section>
          <h2 className="text-3xl font-black text-white mb-10">Categorías Populares</h2>
          <div className="grid grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link key={cat.id} to="/shop" className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-brand-500/30 transition-all group">
                <div className="size-16 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cat.label}</h3>
                <p className="text-xs text-slate-500">Explorar componentes</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-black text-white">Novedades de Vendedores</h2>
            <Link to="/shop" className="text-brand-400 font-bold hover:underline">Ver todo</Link>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {products.slice(0, 3).map(p => (
              <div key={p.id} className="bg-white/5 rounded-[40px] overflow-hidden border border-white/5 group">
                <img src={p.image} className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="p-8">
                  <h4 className="text-xl font-bold text-white mb-4">{p.name}</h4>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-white">${p.price.toFixed(2)}</p>
                    <Link to="/product" className="px-6 py-2 bg-white text-dark-950 font-bold rounded-xl">Detalles</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
