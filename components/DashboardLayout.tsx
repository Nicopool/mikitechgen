import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    FileText,
    User,
    HelpCircle,
    LogOut,
    Settings,
    Users,
    Store,
    Layers,
    Box,
    ClipboardList,
    BarChart3,
    Bell,
    Search,
    Menu,
    X
} from 'lucide-react';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'ADMIN' | 'VENDOR' | 'USER';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userNav: NavItem[] = [
        { label: 'Inicio', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { label: 'Tienda', icon: <ShoppingBag size={20} />, path: '/shop' },
        { label: 'Mis Pedidos', icon: <Package size={20} />, path: '/dashboard/orders' },
        { label: 'Facturas', icon: <FileText size={20} />, path: '/dashboard/invoices' },
        { label: 'Perfil', icon: <User size={20} />, path: '/dashboard/profile' },
        { label: 'Soporte', icon: <HelpCircle size={20} />, path: '/dashboard/support' },
    ];

    const vendorNav: NavItem[] = [
        { label: 'Inicio', icon: <LayoutDashboard size={20} />, path: '/supplier' },
        { label: 'Productos', icon: <Box size={20} />, path: '/supplier/products' },
        { label: 'Kits', icon: <Layers size={20} />, path: '/supplier/kits' },
        { label: 'Órdenes', icon: <ClipboardList size={20} />, path: '/supplier/orders' },
        { label: 'Inventario', icon: <Box size={20} />, path: '/supplier/inventory' },
        { label: 'Reportes', icon: <BarChart3 size={20} />, path: '/supplier/reports' },
        { label: 'Mi Tienda', icon: <Store size={20} />, path: '/supplier/store' },
        { label: 'Soporte', icon: <HelpCircle size={20} />, path: '/supplier/support' },
    ];

    const adminNav: NavItem[] = [
        { label: 'Inicio', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { label: 'Usuarios', icon: <Users size={20} />, path: '/admin/users' },
        { label: 'Proveedores', icon: <Store size={20} />, path: '/admin/vendors' },
        { label: 'Catálogo', icon: <Package size={20} />, path: '/admin/catalog' },
        { label: 'Categorías', icon: <Layers size={20} />, path: '/admin/categories' },
        { label: 'Pedidos', icon: <ClipboardList size={20} />, path: '/admin/orders' },
        { label: 'Reportes', icon: <BarChart3 size={20} />, path: '/admin/reports' },
        { label: 'Configuración', icon: <Settings size={20} />, path: '/admin/config' },
    ];

    const currentNav = role === 'ADMIN' ? adminNav : role === 'VENDOR' ? vendorNav : userNav;

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-black font-sans">
            {/* Sidebar Desktop */}
            <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-gray-200 bg-white lg:block z-40">
                <div className="flex h-full flex-col p-8">
                    <div className="mb-12 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                            <span className="material-symbols-outlined text-xl">sports_esports</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">MIKITECH</span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {currentNav.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${isActive
                                            ? 'bg-black text-white shadow-xl shadow-black/10'
                                            : 'text-gray-400 hover:bg-gray-100 hover:text-black'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <LogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col lg:pl-72">
                {/* Topbar */}
                <header className="sticky top-0 z-30 h-20 border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md">
                    <div className="flex h-full items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="relative hidden md:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscador global..."
                                    className="w-80 rounded-2xl border border-gray-100 bg-gray-50 py-2.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-black"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="relative rounded-2xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-black transition-all">
                                <Bell size={22} />
                                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-black ring-2 ring-white"></span>
                            </button>

                            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{profile?.name || 'Usuario'}</p>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">{role}</p>
                                </div>
                                <div className="h-10 w-10 overflow-hidden rounded-2xl bg-gray-100 border-2 border-gray-50">
                                    {profile?.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-black text-white">
                                            <User size={20} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-8 lg:p-12">
                    {children}
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="absolute left-0 top-0 h-full w-72 bg-white p-8 animate-in slide-in-from-left duration-300">
                        <div className="mb-12 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
                                    <span className="material-symbols-outlined text-lg">sports_esports</span>
                                </div>
                                <span className="text-lg font-black uppercase tracking-tighter">MIKITECH</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="space-y-4">
                            {currentNav.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === item.path ? 'bg-black text-white' : 'text-gray-400'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};
