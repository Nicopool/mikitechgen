import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useCart } from '../contexts/CartContext';
import {
    ArrowLeft,
    ShoppingBag,
    CheckCircle,
    Package,
    Layers,
    ShieldCheck,
    CloudDownload,
    Star,
    Monitor
} from 'lucide-react';
import { MainLayout } from '../components/MainLayout';

export const KitDetailPage = () => {
    const { id } = useParams();
    const { kits, products } = useData();
    const { addToCart } = useCart();

    const kit = kits.find(k => k.id === id);

    if (!kit) return (
        <MainLayout>
            <div className="h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-black uppercase mb-4">Kit no encontrado</h1>
                    <Link to="/shop" className="text-sm underline">Volver a la tienda</Link>
                </div>
            </div>
        </MainLayout>
    );

    const kitProducts = kit.products.map(kp => {
        const p = products.find(x => x.id === kp.productId);
        return { ...p, quantity: kp.quantity };
    });

    const savingAmount = kit.originalPrice - kit.price;
    const savingPercent = Math.round((savingAmount / kit.originalPrice) * 100);

    return (
        <MainLayout>
            <main className="pt-12 pb-24 px-6 lg:px-12 max-w-[1920px] mx-auto">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft size={14} /> Volver al Catálogo
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Images */}
                    <div className="space-y-8 sticky top-32">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden border border-gray-200 relative shadow-sm group">
                            <img
                                src={kit.image}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                                alt={kit.name}
                            />
                            <div className="absolute top-6 left-6 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                Kit Oficial Mikitech
                            </div>
                            <div className="absolute top-6 right-6 px-4 py-2 bg-[#ff3b30] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                Ahorra {savingPercent}%
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {kitProducts.slice(0, 3).map((p, i) => (
                                <div key={i} className="aspect-square bg-white border border-gray-200 overflow-hidden p-4 hover:border-black transition-all cursor-pointer">
                                    <div className="w-full h-full bg-white overflow-hidden">
                                        <img src={p.image} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Data */}
                    <div className="space-y-12">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest border border-gray-200">
                                    Bundle Completo
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600">
                                    <CheckCircle size={14} /> En Stock
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                                    <Star size={14} fill="currentColor" /> 4.9/5
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter mb-6 leading-tight text-black">{kit.name}</h1>
                            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 border-l-2 border-black pl-6">
                                {kit.description}
                            </p>

                            <div className="flex items-end gap-12 border-y border-gray-200 py-10">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Precio Total</p>
                                    <p className="text-6xl font-black text-black tracking-tighter">${kit.price.toFixed(2)}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Antes</p>
                                    <p className="text-2xl font-bold text-gray-400 line-through decoration-2">${kit.originalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                                <Package size={16} /> Contenido del Paquete
                            </h3>
                            <div className="divide-y divide-gray-100 border border-gray-200 overflow-hidden bg-white shadow-sm">
                                {kitProducts.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white overflow-hidden border border-gray-100 p-2">
                                                <img src={p.image} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase mb-1 font-display tracking-tight">{p.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold bg-gray-100 px-3 py-1 rounded">x{p.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => addToCart(kit as any, 'KIT')}
                                className="flex-1 flex items-center justify-center gap-3 py-6 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#ff3b30] hover:-translate-y-1 transition-all shadow-xl shadow-black/20"
                            >
                                <ShoppingBag size={18} />
                                Agregar al Carrito
                            </button>
                            <button className="px-10 py-6 border-2 border-gray-200 text-black text-xs font-bold uppercase tracking-[0.2em] hover:border-black transition-all">
                                Guardar
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-6 bg-gray-50 border border-gray-200">
                                <ShieldCheck className="text-black" size={24} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Garantía Mikitech</p>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">12 Meses de cobertura total ante fallos de hardware.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-gray-50 border border-gray-200">
                                <CloudDownload className="text-black" size={24} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Software Incluido</p>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Drivers pre-instalados & utilidades de optimización.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Objectives */}
                <section className="mt-32 pt-16 border-t border-gray-200">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-4">¿Para quién es este Kit?</h2>
                        <p className="text-gray-500 text-sm font-serif italic">Validado para los siguientes perfiles de uso</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Gaming Competitivo', desc: 'Máxima tasa de cuadros y latencia mínima para eSports.', icon: <Monitor size={32} /> },
                            { title: 'Streaming', desc: 'Capacidad de codificación y transmisión simultánea sin lag.', icon: <Layers size={32} /> },
                            { title: 'Productividad', desc: 'Multitasking fluido para edición de video y diseño.', icon: <Package size={32} /> }
                        ].map((obj, i) => (
                            <div key={i} className="p-10 bg-white border border-gray-200 hover:border-black transition-all hover:shadow-xl text-center flex flex-col items-center group">
                                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center text-black mb-8 group-hover:bg-black group-hover:text-white transition-colors">{obj.icon}</div>
                                <h4 className="font-black uppercase tracking-widest text-sm mb-4">{obj.title}</h4>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed px-4">{obj.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </MainLayout>
    );
};
