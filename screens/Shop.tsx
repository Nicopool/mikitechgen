import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Kit, Category } from '../types';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, X, Plus, Minus, Check, Search, Filter, ArrowRight } from 'lucide-react';
import { MainLayout } from '../components/MainLayout';
import { apiClient } from '../lib/apiClient';

export const Shop: React.FC = () => {
  const { addToCart, items, total, removeFromCart, updateQuantity, itemCount } = useCart();
  const [filter, setFilter] = useState('ALL');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);

  // State for API data
  const [products, setProducts] = useState<Product[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, kitsData, categoriesData] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getKits(),
          apiClient.getCategories()
        ]);
        setProducts(productsData);
        setKits(kitsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const filteredItems = [
    ...(filter === 'ALL' || filter === 'PRODUCT' ? products.map(p => ({ ...p, type: 'PRODUCT' as const })) : []),
    ...(filter === 'ALL' || filter === 'KIT' ? kits.map(k => ({ ...k, type: 'KIT' as const })) : [])
  ].filter(item => {
    // Determine category ID for the item
    // For products, use categoryId. For kits, we might not have it yet so check logic.
    // Assuming backend returns categoryId for products now.
    const itemCatId = (item as any).categoryId;
    const categoryMatch = selectedCategories.length === 0 || (itemCatId && selectedCategories.includes(itemCatId));
    return categoryMatch;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Cargando productos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowCart(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 rounded-l-[40px] border-l border-gray-100">
              <div className="h-full flex flex-col p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={24} className="text-black" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">Tu Compra</h2>
                  </div>
                  <button onClick={() => setShowCart(false)} className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all text-gray-400 hover:text-black">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                      <ShoppingBag size={64} className="text-gray-300" />
                      <p className="text-xs font-bold uppercase tracking-widest">Tu carrito está vacío</p>
                    </div>
                  ) : items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl group hover:border-black transition-all">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-1">{item.category}</h4>
                        <h3 className="font-bold text-sm uppercase mb-2 leading-tight">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white rounded-lg border border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-500"
                            ><Minus size={12} /></button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-500"
                            ><Plus size={12} /></button>
                          </div>
                          <p className="text-lg font-black">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 self-start p-1 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-100 mt-auto">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Total a Pagar</p>
                      <p className="text-4xl font-black tracking-tight">${total.toFixed(2)}</p>
                    </div>
                  </div>
                  <Link
                    to={items.length > 0 ? "/checkout" : "#"}
                    className={`w-full py-5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${items.length === 0 ? 'opacity-50 pointer-events-none' : 'shadow-xl shadow-black/20 hover:scale-[1.02]'}`}
                  >
                    Proceder al Pago
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform relative"
        >
          <ShoppingBag size={24} />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#ff3b30] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <div className="pt-12 pb-20 px-6 lg:px-12 bg-gray-50 min-h-screen">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={18} className="text-black" />
                <p className="text-xs font-bold uppercase tracking-widest text-black">Tienda Oficial</p>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter text-black mb-4">Explora el <span className="text-gray-400 font-serif italic font-normal">Catálogo</span></h1>
              <p className="text-lg text-gray-500 font-medium max-w-2xl">Encuentra los mejores componentes y kits pre-configurados para tu flujo de trabajo.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">

            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-28 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-gray-400">
                  <Filter size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Filtros</h3>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-black uppercase text-black mb-4">Tipo de Producto</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'ALL', label: 'Todo' },
                        { id: 'PRODUCT', label: 'Componentes' },
                        { id: 'KIT', label: 'Kits / Bundles' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setFilter(type.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-between ${filter === type.id ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                        >
                          {type.label}
                          {filter === type.id && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase text-black mb-4">Categorías</h4>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">{filteredItems.length} Productos Disponibles</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                  <Search size={14} className="text-gray-400" />
                  <input type="text" placeholder="Buscar..." className="bg-transparent border-none text-xs font-bold uppercase placeholder-gray-400 focus:outline-none w-32 md:w-48" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl flex flex-col relative"
                  >
                    {item.type === 'KIT' && (item as any).originalPrice && Number((item as any).originalPrice) > Number(item.price) && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-[#ff3b30] text-white text-[9px] font-bold uppercase rounded-full shadow-lg tracking-widest">
                          Ahorra {Math.round((Number((item as any).originalPrice) - Number(item.price)) / Number((item as any).originalPrice) * 100)}%
                        </span>
                      </div>
                    )}

                    <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />

                      {/* Detailed View Link */}
                      <Link
                        to={item.type === 'KIT' ? `/kit/${item.id}` : '#'}
                        className="absolute bottom-4 left-4 right-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-lg text-black hover:bg-black hover:text-white"
                      >
                        <Search size={14} /> Ver Detalles
                      </Link>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 border border-gray-200 inline-block px-2 py-1 rounded self-start">{item.category || 'Producto'}</p>
                      <h3 className="text-lg font-black font-display uppercase tracking-tight mb-4 leading-tight min-h-[3rem]">
                        {item.name}
                      </h3>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div>
                          {item.type === 'KIT' && (item as any).originalPrice && Number((item as any).originalPrice) > Number(item.price) && (
                            <p className="text-[10px] text-gray-400 line-through font-bold">${Number((item as any).originalPrice).toFixed(0)}</p>
                          )}
                          <span className="text-2xl font-black text-black">${Number(item.price || 0).toFixed(0)}</span>
                        </div>
                        <button
                          onClick={() => addToCart(item as any, item.type)}
                          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:bg-[#ff3b30]"
                        >
                          <ShoppingBag size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};