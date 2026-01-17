
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Category, Product, AppUser, Order } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../contexts/DataContext';
import {
  Bar,
  Doughnut,
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Search,
  Filter,
  Eye,
  UserX,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Users,
  Store,
  Package,
  Layers,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  Settings,
  AlertCircle,
  FileText,
  Download,
  X,
  Check,
  XCircle,
  Edit
} from 'lucide-react';
import { generatePDFReport } from '../lib/pdfGenerator';
import { ConfirmModal } from '../components/ConfirmModal';
import { KitBuilder } from '../components/KitBuilder';
import { Kit } from '../types';
import { apiClient } from '../lib/apiClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  products: Product[];
}

// Modal para ver detalles de pedidos
const OrderDetailsModal = ({ order, onClose }: { order: Order | null, onClose: () => void }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="bg-white rounded-[48px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Detalles del Pedido</h2>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">ID: #{order.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cliente</p>
              <p className="font-black text-lg">User ID: {order.userId.slice(0, 8)}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total</p>
              <p className="font-black text-2xl">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Estado</p>
              <span className="px-4 py-1.5 bg-black text-white text-[9px] uppercase rounded-full inline-block">{order.status}</span>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Fecha</p>
              <p className="font-black">{order.createdAt || 'N/A'}</p>
            </div>
          </div>

          {/* Sub-órdenes */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Sub-órdenes por Proveedor</h3>
            <div className="space-y-4">
              {order.subOrders.map((subOrder, idx) => (
                <div key={idx} className="p-6 border-2 border-gray-100 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black uppercase text-sm">Proveedor: {subOrder.vendorName || 'N/A'}</p>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${subOrder.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                      subOrder.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                      {subOrder.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {subOrder.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-xs">{item.name}</p>
                            <p className="text-[10px] text-gray-400">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-black">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                    <p className="text-xs font-black uppercase text-gray-400">Subtotal</p>
                    <p className="font-black text-lg">${subOrder.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AdminHome = ({ users, products, orders, navigate }: { users: AppUser[], products: Product[], orders: Order[], navigate: any }) => {
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingVendors = users.filter(u => u.role === 'VENDOR' && u.status === 'PENDING').length;

  const salesChart = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    datasets: [{ label: 'Ventas Globales', data: [4500, 6200, 5800, 8900, 7200, 12000, 15000], backgroundColor: 'black', borderRadius: 8 }]
  };

  const statusPie = {
    labels: ['Entregados', 'Pendientes', 'Incidencias'],
    datasets: [{ data: [65, 25, 10], backgroundColor: ['#000000', '#f3f4f6', '#d1d5db'], borderWidth: 0 }]
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Report Actions */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => generatePDFReport({
            title: 'Reporte de Ventas',
            subtitle: 'Histórico de transacciones',
            fileName: 'reporte-ventas.pdf',
            type: 'sales',
            data: orders.map(o => ({
              date: new Date(o.createdAt).toLocaleDateString(),
              id: o.id.slice(0, 8),
              customer: o.userId.slice(0, 8),
              total: o.totalAmount
            })),
            columns: [
              { header: 'Fecha', dataKey: 'date' },
              { header: 'ID', dataKey: 'id' },
              { header: 'Cliente', dataKey: 'customer' },
              { header: 'Total', dataKey: 'total' }
            ]
          })}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
        >
          <Download size={16} /> Descargar Reporte de Ventas (PDF)
        </button>
        <button
          onClick={() => generatePDFReport({
            title: 'Reporte de Inventario',
            subtitle: 'Estado actual de productos',
            fileName: 'reporte-inventario.pdf',
            type: 'inventory',
            data: products.map(p => ({
              name: p.name,
              sku: p.sku,
              price: p.price,
              stock: p.stock
            })),
            columns: [
              { header: 'Producto', dataKey: 'name' },
              { header: 'SKU', dataKey: 'sku' },
              { header: 'Precio', dataKey: 'price' },
              { header: 'Stock', dataKey: 'stock' }
            ]
          })}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-black text-xs font-bold uppercase rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <FileText size={16} /> Descargar Inventario (PDF)
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Ventas Totales', value: `$${totalSales.toFixed(2)}`, icon: <TrendingUp size={20} />, trend: '+24% este mes' },
          { label: 'Pedidos Hoy', value: '42', icon: <ClipboardList size={20} />, trend: '12 por procesar' },
          { label: 'Proveedores Activos', value: users.filter(u => u.role === 'VENDOR').length.toString(), icon: <Store size={20} />, trend: `${pendingVendors} pendientes` },
          { label: 'Inventario Crítico', value: '8', icon: <Package size={20} />, trend: 'Moderación requerida', color: 'text-red-500' },
        ].map((kpi, i) => (
          <div key={i} className="p-8 border-2 border-gray-100 rounded-[32px] bg-white group hover:border-black transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${kpi.color || 'text-green-500'}`}>{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{kpi.label}</p>
            <p className="text-3xl font-black">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10">Volumen de Transacciones</h3>
          <div className="h-[300px]"><Bar data={salesChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { display: false } }, x: { grid: { display: false } } } }} /></div>
        </div>
        <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10">Salud de la Operación</h3>
          <div className="h-[250px]"><Doughnut data={statusPie} options={{ cutout: '75%', plugins: { legend: { position: 'bottom' } } }} /></div>
          <div className="mt-8 p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center gap-4">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Se detectaron 3 pedidos con demora superior a 24h.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10">Proveedores por Aprobar</h3>
          <div className="space-y-4">
            {users.filter(u => u.role === 'VENDOR' && u.status === 'PENDING').slice(0, 3).map(v => (
              <div key={v.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl hover:bg-black group transition-all cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black group-hover:text-black">{v.name[0]}</div>
                  <div>
                    <p className="font-black uppercase text-xs group-hover:text-white">{v.name}</p>
                    <p className="text-[10px] font-bold text-gray-400">{v.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('vendors')}
                  className="px-6 py-2.5 bg-white text-black text-[9px] font-black uppercase rounded-xl hover:scale-105 transition-all"
                >
                  Revisar
                </button>
              </div>
            ))}
            {pendingVendors === 0 && <p className="text-center py-10 text-gray-400 text-xs font-black uppercase tracking-widest">No hay pendientes.</p>}
          </div>
        </div>
        <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10">Alertas de Moderación</h3>
          <div className="space-y-4">
            {products.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between p-6 border-2 border-gray-50 rounded-3xl">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100"><img src={p.image} className="w-full h-full object-cover" /></div>
                  <div>
                    <p className="font-black uppercase text-[10px]">{p.name}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Proveedor: {p.vendorName || 'N/A'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-[8px] font-black uppercase rounded-full">Bajo Stock</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ users }: { users: AppUser[] }) => {
  const { refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const response = await fetch(`http://localhost:3001/api/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: next })
      });
      if (response.ok) {
        await refreshData();
      } else {
        alert('Error updating user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error de conexión');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    let matchDate = true;
    if (startDate && endDate && user.createdAt) {
      const userDate = new Date(user.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Ajustar end date para incluir todo el día
      end.setHours(23, 59, 59, 999);
      matchDate = userDate >= start && userDate <= end;
    }

    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Gestión de <span className="text-gray-300">Usuarios</span></h2>

        {/* Filtros */}
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-black text-gray-400">Buscar</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre o Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold w-48 focus:border-black outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-black text-gray-400">Desde</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold focus:border-black outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-black text-gray-400">Hasta</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold focus:border-black outline-none transition-all"
            />
          </div>
          {(searchTerm || startDate || endDate) && (
            <button
              onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); }}
              className="p-2 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all text-[10px] uppercase font-black"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-black/0">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <tr className="border-b-2 border-gray-50">
              <th className="px-10 py-8">Identidad Digital</th>
              <th className="px-10 py-8">Rol</th>
              <th className="px-10 py-8">Estado</th>
              <th className="px-10 py-8">Fecha Registro</th>
              <th className="px-10 py-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-10 py-8">
                  <p className="font-black uppercase tracking-tight text-sm mb-1">{u.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">{u.email}</p>
                </td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : u.role === 'VENDOR' ? 'bg-blue-50 text-blue-600' : 'border-2 border-gray-100 text-gray-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[9px] font-black uppercase text-gray-400">{u.status}</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-[11px] font-bold text-gray-500 uppercase">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : (u.joinDate || 'N/A')}
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    {u.status === 'ACTIVE' ? (
                      <button onClick={() => toggleStatus(u.id, u.status)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><UserX size={18} /></button>
                    ) : (
                      <button onClick={() => toggleStatus(u.id, u.status)} className="p-3 bg-green-50 text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition-all"><UserCheck size={18} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-10 py-8 text-center text-xs font-black uppercase text-gray-400">
                  No se encontraron usuarios con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminPage: React.FC<AdminProps> = ({ categories, users, products }) => {
  const { orders, refreshData } = useData();
  const [newCat, setNewCat] = useState({ label: '', icon: 'grid_view' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [config, setConfig] = useState({ tax: '16', threshold: '5' });

  // Estados para filtros de proveedores
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStartDate, setVendorStartDate] = useState('');
  const [vendorEndDate, setVendorEndDate] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    type?: "danger" | "success";
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const handleAddCategory = async () => {
    if (!newCat.label) return;
    try {
      // Usar API de MySQL (puerto 3001)
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCat.label,
          slug: newCat.label.toLowerCase().replace(/\s+/g, '-'),
          active: true
        })
      });

      if (!response.ok) throw new Error('Error al crear categoría');

      setNewCat({ label: '', icon: 'grid_view' });
      await refreshData();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error al agregar la categoría');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar categoría');

      await refreshData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar producto');

      await refreshData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleApproveVendor = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      });

      if (!response.ok) throw new Error('Error al aprobar proveedor');

      await refreshData();
    } catch (error) {
      console.error('Error approving vendor:', error);
      alert('Error al aprobar el proveedor');
    }
  };

  const handleRejectVendor = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });

      if (!response.ok) throw new Error('Error al rechazar proveedor');

      await refreshData();
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      alert('Error al rechazar el proveedor');
    }
  };

  // Gestor de Kits
  const KitsManagement = ({ products }: { products: Product[] }) => {
    const [kits, setKits] = useState<Kit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingKit, setEditingKit] = useState<Kit | null>(null);
    const { profile } = useAuth(); // Assuming useAuth is available/imported or accessible

    const fetchKits = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getKits();
        setKits(data);
      } catch (error) {
        console.error('Error fetching kits:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchKits();
    }, []);

    const handleSaveKit = async (kitData: Partial<Kit>) => {
      try {
        const kitToSave = {
          ...kitData,
          vendorId: profile?.id || 'admin', // Placeholder or current admin ID
          status: kitData.status || 'ACTIVE'
        };

        if (editingKit) {
          await apiClient.updateKit(editingKit.id, kitToSave);
        } else {
          await apiClient.createKit(kitToSave);
        }

        await fetchKits();
        setShowAdd(false);
        setEditingKit(null);
      } catch (error) {
        console.error('Error saving kit:', error);
        alert('Error al guardar kit');
      }
    };

    const handleDeleteKit = async (id: string) => {
      if (!confirm('¿Estás seguro de eliminar este kit?')) return;
      try {
        await apiClient.deleteKit(id);
        await fetchKits();
      } catch (error) {
        console.error('Error deleting kit:', error);
        alert('Error al eliminar kit');
      }
    };

    if (loading) return <div>Cargando kits...</div>;

    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Gestión de <span className="text-gray-300">Kits</span></h2>
            <p className="text-gray-500 font-medium text-sm">Administra todos los kits de la plataforma</p>
          </div>
          <button
            onClick={() => { setEditingKit(null); setShowAdd(true); }}
            className="flex items-center gap-3 px-10 py-5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            <Plus size={16} /> Crear Nuevo Kit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map(kit => (
            <div key={kit.id} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all group">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-6 relative">
                <img src={kit.image || '/default-kit.png'} alt={kit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => { setEditingKit(kit); setShowAdd(true); }} className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-black hover:text-white transition-all">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeleteKit(kit.id)} className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-black uppercase tracking-tight text-lg mb-2">{kit.name}</h3>
              <p className="text-gray-400 text-xs mb-4 line-clamp-2">{kit.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-black text-xl">${kit.price.toFixed(2)}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${kit.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{kit.status}</span>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <KitBuilder
            products={products}
            vendorId={profile?.id || 'admin'}
            onSave={handleSaveKit}
            onCancel={() => { setShowAdd(false); setEditingKit(null); }}
            initialKit={editingKit || undefined}
          />
        )}
      </div>
    );
  };

  const navigate = useNavigate();

  // Filtrado de proveedores
  const filteredVendors = users.filter(u => {
    if (u.role !== 'VENDOR') return false;

    const matchSearch = u.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(vendorSearch.toLowerCase());

    let matchDate = true;
    if (vendorStartDate && vendorEndDate && u.createdAt) {
      const userDate = new Date(u.createdAt);
      const start = new Date(vendorStartDate);
      const end = new Date(vendorEndDate);
      end.setHours(23, 59, 59, 999);
      matchDate = userDate >= start && userDate <= end;
    }

    return matchSearch && matchDate;
  });

  return (
    <DashboardLayout role="ADMIN">
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
      <Routes>
        <Route index element={<AdminHome users={users} products={products} orders={orders} navigate={navigate} />} />
        <Route path="users" element={<UserManagement users={users} />} />
        <Route path="kits" element={<KitsManagement products={products} />} />
        <Route path="vendors" element={
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Control de <span className="text-gray-300">Proveedores</span></h2>

              {/* Filtros Proveedores */}
              <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-400">Buscar</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Proveedor"
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold w-48 focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-400">Desde</label>
                  <input
                    type="date"
                    value={vendorStartDate}
                    onChange={(e) => setVendorStartDate(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-400">Hasta</label>
                  <input
                    type="date"
                    value={vendorEndDate}
                    onChange={(e) => setVendorEndDate(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold focus:border-black outline-none transition-all"
                  />
                </div>
                {(vendorSearch || vendorStartDate || vendorEndDate) && (
                  <button
                    onClick={() => { setVendorSearch(''); setVendorStartDate(''); setVendorEndDate(''); }}
                    className="p-2 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all text-[10px] uppercase font-black"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            <div className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-white">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                  <tr>
                    <th className="px-10 py-8">Proveedor</th>
                    <th className="px-10 py-8">Estado MIKITECH</th>
                    <th className="px-10 py-8">Ventas Brutas</th>
                    <th className="px-10 py-8 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVendors.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-10 py-8">
                        <p className="font-black uppercase transition-all group-hover:underline">{v.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.status}</p>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${v.status === 'ACTIVE' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {v.status === 'ACTIVE' ? 'Partner Verificado' : 'Pendiente / Revisión'}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-black text-lg">$2,450.00</td>
                      <td className="px-10 py-8 text-right flex items-center justify-end gap-3 mt-4">
                        {v.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                title: 'Aprobar Proveedor',
                                message: `¿Estás seguro de aprobar a ${v.name} como proveedor verificado?`,
                                confirmText: 'Aprobar',
                                type: 'success',
                                onConfirm: () => handleApproveVendor(v.id)
                              })}
                              className="px-6 py-2.5 bg-green-500 text-white text-[9px] font-black uppercase rounded-xl hover:scale-105 transition-all"
                            >
                              <Check size={16} className="inline mr-1" /> Aprobar
                            </button>
                            <button
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                title: 'Rechazar Proveedor',
                                message: `¿Estás seguro de rechazar a ${v.name}?`,
                                confirmText: 'Rechazar',
                                type: 'danger',
                                onConfirm: () => handleRejectVendor(v.id)
                              })}
                              className="px-6 py-2.5 bg-red-500 text-white text-[9px] font-black uppercase rounded-xl hover:scale-105 transition-all"
                            >
                              <XCircle size={16} className="inline mr-1" /> Rechazar
                            </button>
                          </>
                        )}
                        {v.status === 'ACTIVE' && (
                          <span className="px-4 py-2 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-xl">✓ Verificado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        } />
        <Route path="catalog" element={
          <div className="space-y-10 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Moderación de <span className="text-gray-300">Catálogo</span></h2>
            <div className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-white">
              <table className="w-full text-left font-black">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                  <tr>
                    <th className="px-10 py-8">Tipo / Item</th>
                    <th className="px-10 py-8">Proveedor</th>
                    <th className="px-10 py-8">Stock</th>
                    <th className="px-10 py-8 text-right">Moderación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-gray-50 border rounded-xl overflow-hidden"><img src={p.image} className="w-full h-full object-cover" /></div>
                          <div>
                            <p className="font-black uppercase text-sm">{p.name}</p>
                            <p className="text-[9px] font-black text-gray-400 tracking-[0.2em]">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-xs text-gray-400 uppercase tracking-widest">{p.vendorName || 'Sistema'}</td>
                      <td className="px-10 py-8 text-sm">{p.stock} uds</td>
                      <td className="px-10 py-8 text-right">
                        <button
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            title: 'Eliminar Producto',
                            message: `¿Estás seguro de eliminar "${p.name}" del catálogo?`,
                            confirmText: 'Eliminar',
                            type: 'danger',
                            onConfirm: () => handleDeleteProduct(p.id)
                          })}
                          className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        } />
        <Route path="categories" element={
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end bg-black p-12 rounded-[48px] text-white">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Editor de Taxonomía</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Estructura del Mercado Digital</p>
              </div>
              <div className="flex gap-4">
                <input
                  placeholder="Nombre Categoría"
                  className="bg-white/10 border-2 border-white/10 rounded-2xl py-4 px-8 focus:border-white outline-none text-white text-sm font-bold"
                  value={newCat.label}
                  onChange={e => setNewCat({ ...newCat, label: e.target.value })}
                />
                <button onClick={handleAddCategory} className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase rounded-2xl hover:scale-105 transition-all">Vincular</button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map(c => (
                <div key={c.id} className="p-8 border-2 border-gray-100 rounded-[40px] bg-white group hover:border-black transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all"><span className="material-symbols-outlined text-xl">{c.icon}</span></div>
                    <p className="font-black uppercase text-xs">{c.label}</p>
                  </div>
                  <button
                    onClick={() => setConfirmModal({
                      isOpen: true,
                      title: 'Eliminar Categoría',
                      message: `¿Estás seguro de eliminar la categoría "${c.label}"?`,
                      confirmText: 'Eliminar',
                      type: 'danger',
                      onConfirm: () => handleDeleteCategory(c.id)
                    })}
                    className="text-gray-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        } />
        <Route path="orders" element={
          <div className="space-y-10 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Historial Global de <span className="text-gray-300">Pedidos</span></h2>
            <div className="border-2 border-gray-100 rounded-[48px] overflow-hidden bg-white shadow-xl shadow-black/0">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                  <tr>
                    <th className="px-10 py-8">Orden</th>
                    <th className="px-10 py-8">Usuario</th>
                    <th className="px-10 py-8">Vendedores</th>
                    <th className="px-10 py-8">Monto</th>
                    <th className="px-10 py-8">Estado Global</th>
                    <th className="px-10 py-8 text-right">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-black">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-10 py-8 text-xs">#{o.id.slice(0, 8)}</td>
                      <td className="px-10 py-8 text-xs text-gray-400 uppercase tracking-tighter">User ID: {o.userId.slice(0, 8)}</td>
                      <td className="px-10 py-8 text-[10px] uppercase text-gray-400">{o.subOrders.length} Proveedores</td>
                      <td className="px-10 py-8 text-lg">${o.totalAmount.toFixed(2)}</td>
                      <td className="px-10 py-8"><span className="px-4 py-1.5 bg-black text-white text-[9px] uppercase rounded-full">{o.status}</span></td>
                      <td className="px-10 py-8 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        } />
        <Route path="reports" element={
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 text-black">Insights <span className="text-gray-300">Ejecutivos</span></h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="p-12 border-2 border-gray-100 rounded-[48px] bg-white">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Crecimiento de Plataforma</h3>
                <div className="h-[350px]"><Line data={{ labels: ['E', 'F', 'M', 'A', 'M', 'J'], datasets: [{ label: 'Usuarios', data: [100, 250, 450, 780, 1200, 2400], borderColor: 'black', tension: 0.4, fill: true, backgroundColor: 'rgba(0,0,0,0.02)' }] }} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              </div>
              <div className="p-12 border-2 border-gray-100 rounded-[48px] bg-white">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Distribución por Categoría</h3>
                <div className="h-[350px]"><Bar data={{ labels: ['PC', 'Portátil', 'Stream', 'Set'], datasets: [{ data: [450, 320, 680, 210], backgroundColor: 'black', borderRadius: 10 }] }} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              </div>
            </div>

            {/* Export Section */}
            <div className="mt-12 p-12 border-2 border-gray-100 rounded-[48px] bg-white">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">Centro de Exportación</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Generación de Documentos Oficiales</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => {
                    try {
                      console.log('Generando reporte de ventas...', orders);
                      if (!orders || orders.length === 0) {
                        alert('No hay órdenes para generar el reporte');
                        return;
                      }
                      generatePDFReport({
                        title: 'Reporte de Ventas Global',
                        subtitle: `Total acumulado: $${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}`,
                        fileName: `ventas-mikitech-${new Date().toISOString().split('T')[0]}.pdf`,
                        type: 'sales',
                        columns: [
                          { header: 'ID Orden', dataKey: 'id' },
                          { header: 'Cliente', dataKey: 'userName' },
                          { header: 'Fecha', dataKey: 'createdAt' },
                          { header: 'Estado', dataKey: 'status' },
                          { header: 'Total', dataKey: 'totalAmount' }
                        ],
                        data: orders.map(o => ({
                          id: o.id,
                          userName: o.userName || 'N/A',
                          createdAt: o.createdAt || new Date().toISOString(),
                          status: o.status,
                          totalAmount: o.totalAmount,
                          total: o.totalAmount // Para el cálculo del resumen
                        }))
                      });
                      console.log('PDF de ventas generado exitosamente');
                    } catch (error) {
                      console.error('Error generando PDF de ventas:', error);
                      alert('Error al generar el PDF de ventas');
                    }
                  }}
                  className="p-8 bg-gray-50 rounded-[32px] hover:bg-black hover:text-white transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <p className="font-black uppercase text-sm mb-1">Reporte de Ventas</p>
                  <p className="text-[10px] font-bold text-gray-400 group-hover:text-gray-300">Transacciones y Ingresos</p>
                </button>

                <button
                  onClick={() => {
                    try {
                      console.log('Generando reporte de inventario...', products);
                      if (!products || products.length === 0) {
                        alert('No hay productos para generar el reporte');
                        return;
                      }
                      generatePDFReport({
                        title: 'Inventario Master',
                        subtitle: `${products.length} productos registrados en catálogo`,
                        fileName: `inventario-mikitech-${new Date().toISOString().split('T')[0]}.pdf`,
                        type: 'inventory',
                        columns: [
                          { header: 'SKU', dataKey: 'sku' },
                          { header: 'Producto', dataKey: 'name' },
                          { header: 'Categoría', dataKey: 'category' },
                          { header: 'Precio', dataKey: 'price' },
                          { header: 'Stock', dataKey: 'stock' }
                        ],
                        data: products.map(p => ({
                          sku: p.sku || 'N/A',
                          name: p.name,
                          category: p.category || 'Sin categoría',
                          price: p.price,
                          stock: p.stock
                        }))
                      });
                      console.log('PDF de inventario generado exitosamente');
                    } catch (error) {
                      console.error('Error generando PDF de inventario:', error);
                      alert('Error al generar el PDF de inventario');
                    }
                  }}
                  className="p-8 bg-gray-50 rounded-[32px] hover:bg-black hover:text-white transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <p className="font-black uppercase text-sm mb-1">Inventario Global</p>
                  <p className="text-[10px] font-bold text-gray-400 group-hover:text-gray-300">Stock y Valorización</p>
                </button>

                <button
                  onClick={() => {
                    try {
                      console.log('Generando reporte de usuarios...', users);
                      if (!users || users.length === 0) {
                        alert('No hay usuarios para generar el reporte');
                        return;
                      }
                      generatePDFReport({
                        title: 'Base de Usuarios',
                        subtitle: `${users.length} cuentas registradas (Clientes y Proveedores)`,
                        fileName: `usuarios-mikitech-${new Date().toISOString().split('T')[0]}.pdf`,
                        type: 'users',
                        columns: [
                          { header: 'ID', dataKey: 'id' },
                          { header: 'Nombre', dataKey: 'name' },
                          { header: 'Email', dataKey: 'email' },
                          { header: 'Rol', dataKey: 'role' },
                          { header: 'Estado', dataKey: 'status' }
                        ],
                        data: users.map(u => ({
                          id: u.id,
                          name: u.name,
                          email: u.email,
                          role: u.role,
                          status: u.status
                        }))
                      });
                      console.log('PDF de usuarios generado exitosamente');
                    } catch (error) {
                      console.error('Error generando PDF de usuarios:', error);
                      alert('Error al generar el PDF de usuarios');
                    }
                  }}
                  className="p-8 bg-gray-50 rounded-[32px] hover:bg-black hover:text-white transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <p className="font-black uppercase text-sm mb-1">Reporte de Usuarios</p>
                  <p className="text-[10px] font-bold text-gray-400 group-hover:text-gray-300">Actividad y Roles</p>
                </button>
              </div>
            </div>
          </div>
        } />
        <Route path="config" element={
          <div className="max-w-4xl animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Parámetros del <span className="text-gray-300">Sistema</span></h2>
            <div className="p-12 border-2 border-gray-100 rounded-[40px] bg-white space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Impuesto Aplicado (%)</label>
                  <input
                    className="w-full p-5 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                    value={config.tax}
                    onChange={(e) => setConfig({ ...config, tax: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Umbral Stock Bajo (Uds)</label>
                  <input
                    className="w-full p-5 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                    value={config.threshold}
                    onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-8 bg-black rounded-[32px] text-white">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Mantenimiento de Red</p>
                  <p className="font-bold">{isMaintenance ? 'SISTEMA EN MANTENIMIENTO' : 'Sistema Operativo'}</p>
                </div>
                <div
                  onClick={() => setIsMaintenance(!isMaintenance)}
                  className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all ${isMaintenance ? 'bg-red-500' : 'bg-gray-800'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-all transform ${isMaintenance ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              <button
                onClick={() => alert(`Cambios nucleares desplegados: Tax ${config.tax}%, Stock Threshold ${config.threshold}`)}
                className="px-12 py-6 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-black/20"
              >
                Desplegar Cambios Nucleares
              </button>
            </div>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  );
};
