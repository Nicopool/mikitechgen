
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Product, Kit, Order, AppUser, SubOrder } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../contexts/DataContext';
import {
  Bar,
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ToggleLeft as Toggle,
  Eye,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  Download
} from 'lucide-react';
import { KitBuilder } from '../components/KitBuilder';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SupplierProps {
  user: AppUser;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const VendorHome = ({ user, products, orders }: { user: AppUser, products: Product[], orders: Order[] }) => {
  const myProducts = products.filter(p => p.vendorId === user.id);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  const salesData = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    datasets: [
      {
        label: 'Ventas de la Semana ($)',
        data: [400, 300, 600, 800, 500, 1200, 1100],
        backgroundColor: 'black',
        borderRadius: 12,
      },
    ],
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Ventas del Mes', value: '$4,250.00', icon: <TrendingUp size={20} />, trend: '+15%', color: 'border-black' },
          { label: 'Órdenes Pendientes', value: pendingOrders.toString(), icon: <ClipboardList size={20} />, trend: 'Requiere Acción', color: 'border-black' },
          { label: 'Productos Activos', value: myProducts.length.toString(), icon: <Package size={20} />, trend: 'En terminal', color: 'border-gray-100' },
          { label: 'Stock Crítico', value: '2', icon: <AlertTriangle size={20} />, trend: 'Revisar', color: 'border-red-100 text-red-500' },
        ].map((kpi, i) => (
          <div key={i} className={`p-8 border-2 ${kpi.color} rounded-[32px] bg-white hover:scale-[1.02] transition-all group`}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                {kpi.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{kpi.label}</p>
            <p className="text-3xl font-black">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10">Rendimiento Semanal</h3>
          <div className="h-[300px]">
            <Bar
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
                  x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                }
              }}
            />
          </div>
        </div>

        <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black uppercase tracking-tight">Top Ventas</h3>
            <span className="text-[10px] font-black uppercase text-gray-400">Este Mes</span>
          </div>
          <div className="space-y-6">
            {myProducts.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="text-lg font-black text-gray-200">0{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden border">
                  <img src={p.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase text-[10px] truncate">{p.name}</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{p.category}</p>
                </div>
                <p className="font-black text-xs text-black">12 uds</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black uppercase tracking-tight">Órdenes Recientes</h3>
          <Link to="/supplier/orders" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">Ver todas <ArrowRight size={14} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total Bruto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-6 py-4 font-black uppercase text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Alex Rivers</td>
                  <td className="px-6 py-4 font-black">${o.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-black text-white text-[8px] font-black uppercase rounded-full">{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white text-[9px] font-black uppercase rounded-xl transition-all">Procesar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductCRUD = ({ user, products }: { user: AppUser, products: Product[] }) => {
  const { refreshData } = useData();
  const [showModal, setShowModal] = useState(false);
  const myProducts = products.filter(p => p.vendorId === user.id);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Mis <span className="text-gray-300">Productos</span></h2>
          <p className="text-gray-500 font-medium">Gestión integral del inventario gaming.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-black/20"
        >
          <Plus size={16} /> Añadir Producto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input className="w-full bg-white border-2 border-gray-100 rounded-[28px] py-5 pl-16 pr-8 text-sm font-bold focus:border-black outline-none transition-all placeholder:text-gray-300" placeholder="Buscar por Nombre o SKU..." />
        </div>
        <button className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:border-black transition-all">
          <Filter size={18} /> Filtros Avanzados
        </button>
      </div>

      <div className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-white">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <tr className="border-b-2 border-gray-50">
              <th className="px-10 py-8">Imagen</th>
              <th className="px-10 py-8">Producto / SKU</th>
              <th className="px-10 py-8">Categoría</th>
              <th className="px-10 py-8">Precio</th>
              <th className="px-10 py-8">Stock</th>
              <th className="px-10 py-8">Estado</th>
              <th className="px-10 py-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {myProducts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-10 py-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                </td>
                <td className="px-10 py-6">
                  <p className="font-black uppercase tracking-tight text-sm leading-none mb-2">{p.name}</p>
                  <p className="text-[10px] font-black text-gray-400 tracking-widest">{p.sku}</p>
                </td>
                <td className="px-10 py-6">
                  <span className="text-[10px] font-black uppercase px-3 py-1 bg-gray-100 rounded-full">{p.category}</span>
                </td>
                <td className="px-10 py-6 font-black text-lg">${p.price.toFixed(2)}</td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="font-black text-sm">{p.stock} uds</span>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2">
                    <Toggle className={p.status === 'ACTIVE' ? 'text-black' : 'text-gray-300'} size={24} />
                    <span className="text-[9px] font-black uppercase text-gray-400">{p.status === 'ACTIVE' ? 'Activo' : 'Pausado'}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"><Edit size={16} /></button>
                    <button className="p-3 bg-gray-100 rounded-xl hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myProducts.length === 0 && <div className="py-20 text-center text-gray-400 font-black uppercase text-xs">No tienes productos publicados.</div>}
      </div>
    </div>
  );
};
const KitCRUD = ({ user, products }: { user: AppUser, products: Product[] }) => {
  const { kits, refreshData } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const myKits = kits.filter(k => k.vendorId === user.id);
  const [newKit, setNewKit] = useState<Partial<Kit>>({
    name: '',
    description: '',
    products: [],
    price: 0,
    status: 'ACTIVE',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400'
  });

  const myProducts = products.filter(p => p.vendorId === user.id);
  const originalPrice = (newKit.products || []).reduce((acc, kp) => {
    const p = myProducts.find(x => x.id === kp.productId);
    return acc + (p?.price || 0) * kp.quantity;
  }, 0);

  const handleAddProductToKit = (productId: string) => {
    const exists = newKit.products?.find(p => p.productId === productId);
    if (exists) return;
    setNewKit({
      ...newKit,
      products: [...(newKit.products || []), { productId, quantity: 1 }]
    });
  };

  const updateKitProductQty = (productId: string, qty: number) => {
    setNewKit({
      ...newKit,
      products: (newKit.products || []).map(p => p.productId === productId ? { ...p, quantity: Math.max(1, qty) } : p)
    });
  };

  const removeProductFromKit = (productId: string) => {
    setNewKit({
      ...newKit,
      products: (newKit.products || []).filter(p => p.productId !== productId)
    });
  };

  const handleCreateKit = async (kitData: Partial<Kit>) => {
    const kitToSave = {
      ...kitData,
      vendor_id: user.id,
    };

    const { error } = await supabase.from('kits').insert([kitToSave]);
    if (error) {
      alert('Error al crear kit: ' + error.message);
    } else {
      setShowAdd(false);
      refreshData();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Gestión de <span className="text-gray-300">Kits</span></h2>
          <p className="text-gray-500 font-medium text-sm">Crea y administra tus kits de productos</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-3 px-10 py-5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
        >
          <Plus size={16} /> Crear Nuevo Kit
        </button>
      </div>

      {/* Kit Builder Modal */}
      {showAdd && (
        <KitBuilder
          products={myProducts}
          vendorId={user.id}
          onSave={handleCreateKit}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Existing Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myKits.map(k => (
          <div key={k.id} className="p-8 border-2 border-gray-100 bg-white group hover:border-black transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-gray-50 overflow-hidden border">
                <img src={k.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 transition-colors"><Edit size={14} /></button>
                <button className="p-2 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2 truncate">{k.name}</h3>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gray-50 text-[8px] font-bold uppercase">{k.products.length} Productos</span>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-bold uppercase">Activo</span>
            </div>
            <div className="flex items-end justify-between border-t-2 border-dashed border-gray-50 pt-6">
              <div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Precio Kit</p>
                <p className="text-2xl font-black">${k.price.toFixed(2)}</p>
              </div>
              <p className="text-[8px] font-bold text-gray-300 line-through">${k.originalPrice?.toFixed(2)}</p>
            </div>
          </div>
        ))}
        <div className="p-12 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center group hover:border-black transition-all cursor-pointer bg-white h-full min-h-[300px]" onClick={() => setShowAdd(true)}>
          <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-black transition-all">
            <Plus className="text-gray-300 group-hover:text-white" size={32} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Crear Nuevo Kit</p>
        </div>
      </div>
    </div>
  );
};

export const SupplierPage: React.FC<SupplierProps> = ({ user, products }) => {
  const { orders } = useData();

  return (
    <DashboardLayout role="VENDOR">
      <Routes>
        <Route index element={<VendorHome user={user} products={products} orders={orders} />} />
        <Route path="products" element={<ProductCRUD user={user} products={products} />} />
        <Route path="kits" element={<KitCRUD user={user} products={products} />} />
        <Route path="orders" element={
          <div className="space-y-10 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Centro de <span className="text-gray-300">Órdenes</span></h2>
            <div className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                    <th className="px-10 py-8">ID Órden</th>
                    <th className="px-10 py-8">Fecha Recepción</th>
                    <th className="px-10 py-8">Estado Sub-Orden</th>
                    <th className="px-10 py-8">Total Neto</th>
                    <th className="px-10 py-8 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-black">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-10 py-8 text-xs uppercase">#{o.id.slice(0, 8)}</td>
                      <td className="px-10 py-8 text-xs text-gray-400 uppercase">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-10 py-8">
                        <select className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-black">
                          <option value="PENDING">Pendiente</option>
                          <option value="ACCEPTED">Aceptado</option>
                          <option value="SHIPPED">Enviado / Transfiriendo</option>
                          <option value="COMPLETED">Entregado / Finalizado</option>
                        </select>
                      </td>
                      <td className="px-10 py-8 text-lg">${o.totalAmount.toFixed(2)}</td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        } />
        <Route path="inventory" element={
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Control de <span className="text-gray-300">Inventario</span></h2>
              <button className="flex items-center gap-3 px-8 py-4 border-2 border-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                <Download size={16} /> Exportar CSV
              </button>
            </div>
            <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-8 bg-gray-50 rounded-[32px] border-2 border-gray-100">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Total de Árticulos</p>
                  <p className="text-3xl font-black">245 Units</p>
                </div>
                <div className="p-8 bg-red-50 rounded-[32px] border-2 border-red-100">
                  <p className="text-[10px] font-black uppercase text-red-400 mb-2">Agotados (Stock 0)</p>
                  <p className="text-3xl font-black text-red-600">3 Items</p>
                </div>
                <div className="p-8 bg-black rounded-[32px] text-white">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Valor Total Inventario</p>
                  <p className="text-3xl font-black">$34,200.00</p>
                </div>
              </div>
              {/* Simplified Inventory Table */}
              <div className="space-y-4">
                {products.filter(p => p.vendorId === user.id).map(p => (
                  <div key={p.id} className="flex justify-between items-center p-6 border-2 border-gray-50 rounded-3xl group hover:border-black transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl border overflow-hidden"><img src={p.image} className="w-full h-full object-cover" /></div>
                      <div>
                        <p className="font-black uppercase text-xs">{p.name}</p>
                        <p className="text-[9px] font-bold text-gray-400">SKU: {p.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Stock Actual</p>
                        <p className="font-black">{p.stock} uds</p>
                      </div>
                      <button className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all">Ajustar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        } />
        <Route path="reports" element={
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Reportes de <span className="text-gray-300">Ventas</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8">Venta Mensual Historica</h3>
                <div className="h-[300px]"><Line data={{ labels: ['E', 'F', 'M', 'A', 'M', 'J'], datasets: [{ label: 'Ventas', data: [10, 25, 15, 40, 35, 60], borderColor: 'black', tension: 0.4 }] }} /></div>
              </div>
              <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8">Órdenes por Estado</h3>
                <div className="h-[300px]"><Bar data={{ labels: ['Pendiente', 'Aceptado', 'Enviado', 'Completado'], datasets: [{ data: [5, 12, 8, 45], backgroundColor: 'black' }] }} /></div>
              </div>
            </div>
          </div>
        } />
        <Route path="store" element={
          <div className="max-w-4xl animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Configuración de <span className="text-gray-300">Tienda</span></h2>
            <div className="p-12 border-2 border-gray-100 rounded-[40px] bg-white space-y-12">
              <div className="flex items-center gap-10">
                <div className="w-32 h-32 bg-gray-50 border-2 border-gray-100 rounded-[40px] flex items-center justify-center relative group">
                  <Store size={48} className="text-gray-200 group-hover:text-black transition-all" />
                  <div className="absolute inset-0 bg-black/60 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-white">edit</span></div>
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2">{user.name} Expert Store</h3>
                  <div className="flex gap-3">
                    <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-full tracking-widest">Verificado</span>
                    <span className="px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase rounded-full tracking-widest">Tier Pro</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nombre Comercial</label>
                  <input className="w-full p-5 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all" value={user.name + " Digital"} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nicho / Especialidad</label>
                  <select className="w-full p-5 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all">
                    <option>Gaming PC & Optimization</option>
                    <option>Streaming Design</option>
                    <option>Laptop Mods</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Políticas de Devolución Digital</label>
                <textarea className="w-full p-6 border-2 border-gray-100 rounded-[32px] h-32 font-medium focus:border-black outline-none transition-all resize-none" defaultValue="Nuestras guías digitales cuentan con acceso de por vida. Las devoluciones se procesan únicamente en caso de fallos técnicos demostrables en los archivos descargables." />
              </div>

              <div className="pt-6">
                <button className="px-12 py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-black/20">Actualizar Punto de Venta</button>
              </div>
            </div>
          </div>
        } />
        <Route path="support" element={
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Soporte para <span className="text-gray-300">Expertos</span></h2>
            <p className="text-gray-500 mb-12 uppercase text-[11px] font-black tracking-widest">Terminal de ayuda técnica para vendedores.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Base de Conocimientos', icon: <Layers size={32} />, desc: 'Guías sobre cómo optimizar tus listados digitales.' },
                { title: 'Chat con Admin', icon: <TrendingUp size={32} />, desc: 'Habla directamente con el equipo de moderación.' },
                { title: 'API & Integración', icon: <Package size={32} />, desc: 'Documentación para conexión automatizada.' }
              ].map((box, i) => (
                <div key={i} className="p-10 border-2 border-gray-100 rounded-[40px] bg-white hover:border-black transition-all group">
                  <div className="mb-8 p-4 bg-gray-50 rounded-2xl w-fit group-hover:bg-black group-hover:text-white transition-all">{box.icon}</div>
                  <h4 className="font-black uppercase tracking-tight text-lg mb-2">{box.title}</h4>
                  <p className="text-gray-400 text-sm font-medium">{box.desc}</p>
                </div>
              ))}
            </div>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  );
};
