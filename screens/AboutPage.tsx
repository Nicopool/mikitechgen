import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { Layers, ShieldCheck, Zap, Users } from 'lucide-react';

export const AboutPage = () => {
    return (
        <MainLayout>
            <section className="bg-black text-white py-32 px-6 lg:px-12 relative overflow-hidden min-h-[60vh] flex items-center">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-800 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <p className="text-[#ff3b30] font-serif italic text-2xl mb-8">Nuestra Filosofía</p>
                    <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-tight mb-12">
                        Tecnología <br />
                        <span className="text-zinc-600">Invisible.</span>
                    </h1>
                </div>
            </section>

            <section className="py-32 px-6 lg:px-12 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <h2 className="text-4xl font-display font-black uppercase tracking-tight mb-8">El Manifiesto Mikitech</h2>
                        <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed">
                            <p>
                                En un mercado saturado de luces RGB innecesarias y diseños estidentes, Mikitech nació como una respuesta al ruido. Creemos que la mejor tecnología es la que desaparece, dejándote solo con tu creatividad y tu flujo de trabajo.
                            </p>
                            <p>
                                Curamos componentes de grado entusiasta, probados en escenarios reales de carga pesada. No vendemos especificaciones vacías; vendemos ecosistemas coherentes diseñados para durar.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-gray-100 p-8 flex flex-col justify-end">
                            <Layers size={32} className="mb-4" />
                            <p className="font-bold uppercase tracking-widest text-xs">Arquitectura Limpia</p>
                        </div>
                        <div className="aspect-square bg-black text-white p-8 flex flex-col justify-end translate-y-8">
                            <Zap size={32} className="mb-4 text-[#ff3b30]" />
                            <p className="font-bold uppercase tracking-widest text-xs">Rendimiento Puro</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { icon: <ShieldCheck size={32} />, title: "Garantía Real", desc: "Soporte directo y reemplazo inmediato. Sin burocracia." },
                        { icon: <Users size={32} />, title: "Comunidad Pro", desc: "Únete a una red de arquitectos, editores y desarrolladores." },
                        { icon: <Layers size={32} />, title: "Diseño Modular", desc: "Sistemas pensados para escalar contigo a medida que creces." }
                    ].map((item, i) => (
                        <div key={i} className="border-t border-black pt-8">
                            <div className="mb-6">{item.icon}</div>
                            <h3 className="font-display font-black uppercase text-xl mb-4">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
};
