import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, profile } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const getDashboardPath = () => {
        if (!profile) return '/login';
        if (profile.role === 'ADMIN') return '/admin';
        if (profile.role === 'VENDOR') return '/supplier';
        return '/dashboard';
    };

    const isLinkActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
            {/* 1. Top Bar (Marquee) */}
            <div className="bg-black text-white text-[9px] uppercase font-bold tracking-[0.2em] py-3 overflow-hidden whitespace-nowrap border-b border-gray-800 z-[60] relative">
                <div className="animate-marquee inline-block">
                    &nbsp; ENVIOS NACIONALES  •  GARANTIA 12 MESES  •  SOPORTE EXPERTO  •  DISTRIBUIDOR OFICIAL  •  ENVIOS NACIONALES  •  GARANTIA 12 MESES  •  SOPORTE EXPERTO  •  DISTRIBUIDOR OFICIAL &nbsp;
                </div>
            </div>

            {/* 2. Navbar */}
            <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
                <div className="max-w-[1920px] w-full mx-auto px-6 lg:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-baseline group">
                        <span className="text-2xl font-black tracking-tighter font-display">MIKI</span>
                        <span className="text-2xl font-light tracking-tighter font-display ml-px">tech.</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                        <Link to="/#hardware" className="hover:text-black transition-colors">Hardware</Link>
                        <Link to="/shop" className={`hover:text-black transition-colors ${isLinkActive('/shop') ? 'text-black' : ''}`}>Kits</Link>
                        <Link to="/about" className={`hover:text-black transition-colors ${isLinkActive('/about') ? 'text-black' : ''}`}>Sobre Nosotros</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to={getDashboardPath()} className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900 hover:text-gray-500 transition-colors">
                            {user ? 'Mi Cuenta' : 'Acceso'}
                        </Link>
                        <Link to="/shop" className="px-8 py-3 border border-black text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all">
                            Tienda
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-32 px-6 md:hidden">
                    <div className="flex flex-col gap-8 text-2xl font-black uppercase tracking-tight font-display">
                        <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Kits</Link>
                        <Link to="/#hardware" onClick={() => setMobileMenuOpen(false)}>Hardware</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Sobre Nosotros</Link>
                        <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>Cuenta</Link>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* 5. Footer */}
            <footer className="bg-black text-white py-24 px-6 border-t border-gray-900 mt-auto">
                <div className="max-w-[1920px] mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        <Link to="/" className="flex items-baseline">
                            <span className="text-2xl font-black tracking-tighter font-display">MIKI</span>
                            <span className="text-2xl font-light tracking-tighter font-display ml-px">tech.</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
                            Definiendo el estándar para espacios de trabajo digitales. Hardware de alto rendimiento para quienes construyen el futuro.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-8 text-gray-500">Explorar</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                            <li><Link to="/shop" className="hover:text-gray-400">Tienda</Link></li>
                            <li><Link to="/shop?filter=KIT" className="hover:text-gray-400">Kits</Link></li>
                            <li><a href="#" className="hover:text-gray-400">Soporte</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-8 text-gray-500">Legal</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                            <li><a href="#" className="hover:text-gray-400">Privacidad</a></li>
                            <li><a href="#" className="hover:text-gray-400">Términos</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-[1920px] mx-auto pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    <p>© 2025 MIKITECH SYSTEMS INC.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <span>INSTAGRAM</span>
                        <span>TWITTER (X)</span>
                        <span>LINKEDIN</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
