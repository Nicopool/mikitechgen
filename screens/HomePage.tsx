import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Category, Kit } from '../types';
import { ArrowRight, Check } from 'lucide-react';
import { MainLayout } from '../components/MainLayout';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  kits: Kit[];
}

export const HomePage: React.FC<HomePageProps> = ({ categories, products, kits }) => {
  return (
    <MainLayout>
      {/* Hero Section - Clean & Simple */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 mb-8">
                <span className="w-2 h-2 bg-[#ff3b30] rounded-full"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Nuevos Kits Disponibles</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-display font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                Encuentra Tu Kit Ideal
              </h1>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-xl">
                Configuraciones completas diseñadas para gaming, streaming, diseño y productividad. Todo lo que necesitas en un solo paquete.
              </p>

              <div className="flex flex-wrap gap-4 mb-16">
                <Link
                  to="/shop"
                  className="px-10 py-4 bg-black text-white text-[9px] font-bold uppercase tracking-[0.25em] hover:bg-zinc-800 transition-colors"
                >
                  Ver Catálogo
                </Link>
                <Link
                  to="/shop?filter=KIT"
                  className="px-10 py-4 border border-black text-black text-[9px] font-bold uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all"
                >
                  Kits Pre-Armados
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#ff3b30]" />
                  <span className="text-gray-600">Instalación y configuración incluida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#ff3b30]" />
                  <span className="text-gray-600">Garantía extendida 12 meses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#ff3b30]" />
                  <span className="text-gray-600">Asesoría personalizada gratis</span>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                <img
                  src="/mikitech_hero.png"
                  alt="Kits Mikitech - Empaque Premium"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white p-6 border border-gray-200 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black mb-1">500+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Builds</div>
                  </div>
                  <div className="border-x border-gray-200">
                    <div className="text-2xl font-black mb-1">4.9★</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black mb-1">24/7</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Soporte</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Kits - Clean Grid */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-16 pb-8 border-b border-gray-200">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display font-black uppercase tracking-tight mb-3">
                Los Más Populares
              </h2>
              <p className="text-gray-500">Kits más vendidos, probados por cientos de usuarios satisfechos</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              Ver Todos <ArrowRight size={16} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.slice(0, 6).map((kit) => (
              <Link
                key={kit.id}
                to={`/kit/${kit.id}`}
                className="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#ff3b30] text-white text-xs font-bold uppercase tracking-wider">
                    -{Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                      {kit.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 leading-tight">
                    {kit.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                    {kit.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-black">${kit.price.toFixed(0)}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${kit.originalPrice.toFixed(0)}
                      </span>
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-12 text-center md:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Ver Todos los Kits
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Simple 3 Column */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black uppercase tracking-tight mb-4">
              ¿Por Qué Elegir Un Kit?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Ahorra tiempo y dinero con configuraciones probadas y optimizadas por expertos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Compatibilidad Garantizada",
                desc: "Todos los componentes han sido probados juntos. Cero problemas de incompatibilidad o cuellos de botella.",
                number: "01"
              },
              {
                title: "Ahorro Significativo",
                desc: "Hasta 20% más barato que comprar componentes por separado. Precios especiales por volumen.",
                number: "02"
              },
              {
                title: "Listo Para Usar",
                desc: "Sistema operativo instalado, drivers actualizados y software básico incluido. Solo conecta y juega.",
                number: "03"
              }
            ].map((item) => (
              <div key={item.number} className="border-t-2 border-black pt-8">
                <div className="text-6xl font-black text-gray-100 mb-6">{item.number}</div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Simple Grid */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black uppercase tracking-tight mb-4">
              Kits Por Uso
            </h2>
            <p className="text-gray-500">Cada kit está optimizado para un propósito específico</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/shop"
                className="group bg-white border border-gray-200 p-8 hover:border-black transition-all text-center"
              >
                <div className="w-16 h-16 bg-gray-50 mx-auto mb-6 flex items-center justify-center group-hover:bg-black transition-colors">
                  <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-white transition-colors">
                    {cat.icon}
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest">{cat.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Clean */}
      <section className="py-32 px-6 lg:px-12 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-display font-black uppercase tracking-tight mb-8 leading-tight">
            ¿Listo Para Tu Nuevo Kit?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Más de 500 kits entregados. Calificación promedio de 4.9 estrellas. Envío gratis en compras mayores a $500.
          </p>
          <Link
            to="/shop"
            className="inline-block px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-gray-100 transition-colors"
          >
            Comenzar Ahora
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};
