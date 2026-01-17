
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Order, AppUser, Invoice, SupportTicket } from '../types';
import {
  Line,
  Doughnut,
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import {
  Search,
  Filter,
  Eye,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  FileText,
  User,
  X
} from 'lucide-react';
import { generatePDFReport } from '../lib/pdfGenerator';
import { apiClient } from '../lib/apiClient';
import { useData } from '../contexts/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  user: AppUser;
  orders: Order[];
}

// Modal para ver detalles de pedidos (Reutilizado y adaptado)
const OrderDetailsModal = ({ order, onClose }: { order: Order | null, onClose: () => void }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="bg-white rounded-[48px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Mi Pedido</h2>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">ID: #{order.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Pagado</p>
              <p className="font-black text-2xl">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Estado Actual</p>
              <span className="px-4 py-1.5 bg-black text-white text-[9px] uppercase rounded-full inline-block">{order.status}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Productos del Pedido</h3>
            <div className="space-y-4">
              {order.subOrders.map((subOrder, idx) => (
                <div key={idx} className="space-y-3">
                  {subOrder.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between p-4 border-2 border-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ShoppingBag size={20} className="text-gray-300" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase">{item.name}</p>
                          <p className="text-[10px] text-gray-400">Cantidad: {item.quantity} | {subOrder.vendorName}</p>
                        </div>
                      </div>
                      <p className="font-black">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for User Dashboard
const UserHome = ({ user, orders, onViewOrder }: { user: AppUser, orders: Order[], onViewOrder: (o: Order) => void }) => {
  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const activeOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'ACCEPTED').length;

  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Gasto Mensual ($)',
        data: [120, 190, 300, 250, 480, 450],
        borderColor: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const statusData = {
    labels: ['Completados', 'Pendientes', 'Cancelados'],
    datasets: [
      {
        data: [
          orders.filter(o => o.status === 'COMPLETED').length,
          orders.filter(o => o.status === 'PENDING').length,
          orders.filter(o => o.status === 'CANCELLED').length,
        ],
        backgroundColor: ['#000000', '#f3f4f6', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Pedidos Activos', value: activeOrders.toString(), icon: <ShoppingBag size={20} />, trend: 'Actualizado' },
          { label: 'Total Gastado', value: `$${totalSpent.toFixed(2)}`, icon: <CreditCard size={20} />, trend: '+12% este mes' },
          { label: 'Última Compra', value: orders[0]?.createdAt ? new Date(orders[0].createdAt).toLocaleDateString() : 'N/A', icon: <Clock size={20} />, trend: orders[0]?.status || '' },
          { label: 'Ahorro por Kits', value: '$45.00', icon: <TrendingUp size={20} />, trend: 'En 3 compras' },
        ].map((kpi, i) => (
          <div key={i} className="p-8 border-2 border-gray-100 rounded-[32px] bg-white hover:border-black transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                {kpi.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{kpi.label}</p>
            <p className="text-3xl font-black">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black uppercase tracking-tight">Historial de Gastos</h3>
            <select className="bg-gray-50 border-none text-[10px] font-black uppercase rounded-full px-4 py-2 outline-none cursor-pointer">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-[300px]">
            <Line
              data={chartData}
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

        {/* Doughnut Chart */}
        <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10">Estado de Pedidos</h3>
          <div className="h-[200px] flex items-center justify-center relative">
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 10 }, boxWidth: 10 } } },
                cutout: '70%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders Short List */}
      <div className="p-10 border-2 border-gray-100 rounded-[40px] bg-white">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black uppercase tracking-tight">Pedidos en curso</h3>
          <Link to="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all flex items-center gap-2">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center justify-between p-6 border-2 border-gray-50 rounded-3xl hover:border-black transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Orden #{order.id.slice(0, 8)}</p>
                  <p className="font-black uppercase text-sm">{order.subOrders[0]?.items[0]?.name || 'Kit Digital'}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Estado</p>
                  <span className="px-3 py-1 bg-black text-white text-[8px] font-black uppercase rounded-full">{order.status}</span>
                </div>
                <button
                  onClick={() => onViewOrder(order)}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center py-10 text-gray-400 font-bold uppercase text-[10px]">No hay pedidos activos.</p>}
        </div>
      </div>
    </div>
  );
};

const MisPedidos = ({ orders, onViewOrder }: { orders: Order[], onViewOrder: (o: Order) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadInvoice = (order: Order) => {
    generatePDFReport({
      title: 'Factura Digital Mikitech',
      subtitle: `Cliente: ${order.userName || 'Usuario MIKITECH'}`,
      fileName: `factura-${order.id.slice(0, 8)}.pdf`,
      type: 'sales',
      columns: [
        { header: 'Producto', dataKey: 'name' },
        { header: 'Precio Unitario', dataKey: 'price' },
        { header: 'Cantidad', dataKey: 'quantity' },
        { header: 'Subtotal', dataKey: 'subtotal' }
      ],
      data: order.subOrders.flatMap(so => so.items.map(i => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        total: order.totalAmount // Para que el generador calcule el resumen si es necesario
      })))
    });
  };

  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Mis <span className="text-gray-300">Pedidos</span></h2>
          <p className="text-gray-500 font-medium">Gestionar historial y seguimiento de compras.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar #orden..."
              className="pl-12 pr-6 py-4 border-2 border-gray-100 rounded-2xl bg-white outline-none focus:border-black transition-all text-sm font-bold w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-4 border-2 border-gray-100 rounded-2xl bg-white hover:border-black transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-xl shadow-black/0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b-2 border-gray-100">
              <th className="px-10 py-8"># Orden</th>
              <th className="px-10 py-8">Fecha</th>
              <th className="px-10 py-8">Total</th>
              <th className="px-10 py-8">Vendores</th>
              <th className="px-10 py-8">Estado</th>
              <th className="px-10 py-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-10 py-8 font-black uppercase tracking-tighter text-sm">#{o.id.slice(0, 8)}</td>
                <td className="px-10 py-8 text-[11px] font-bold text-gray-500 uppercase">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-10 py-8 font-black text-lg">${o.totalAmount.toFixed(2)}</td>
                <td className="px-10 py-8 text-[10px] font-black uppercase text-gray-400">{o.subOrders.length} Proveedores</td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                    o.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                      'bg-black text-white'
                    }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => onViewOrder(o)}
                      className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"
                      title="Ver Detalle"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(o)}
                      className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"
                      title="Descargar Factura"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <div className="py-20 text-center text-gray-400 font-black uppercase text-xs tracking-widest">No se encontraron órdenes.</div>}
      </div>
    </div>
  );
};

const Facturas = ({ orders }: { orders: Order[] }) => (
  <div className="animate-in fade-in duration-700">
    <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Mis <span className="text-gray-300">Facturas</span></h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.filter(o => o.status === 'COMPLETED').map(order => (
        <div key={order.id} className="p-8 border-2 border-gray-100 rounded-[32px] bg-white group hover:border-black transition-all flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black transition-all">
            <FileText size={24} className="text-gray-300 group-hover:text-white" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Factura #INV-{order.id.slice(0, 5)}</p>
          <p className="font-black uppercase mb-4 tracking-tight">Pedido #{order.id.slice(0, 8)}</p>
          <p className="text-sm font-bold text-gray-500 mb-8 uppercase">Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
          <button
            onClick={() => generatePDFReport({
              title: 'Factura Mikitech',
              subtitle: `Cliente: ${order.userName || 'Partner'}`,
              fileName: `invoice-${order.id.slice(0, 8)}.pdf`,
              type: 'sales',
              columns: [{ header: 'Concepto', dataKey: 'name' }, { header: 'Importe', dataKey: 'total' }],
              data: [{ name: `Total Pedido #${order.id.slice(0, 8)}`, total: order.totalAmount }]
            })}
            className="w-full py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <Download size={14} /> Descargar PDF
          </button>
        </div>
      ))}
      {orders.filter(o => o.status === 'COMPLETED').length === 0 && (
        <p className="col-span-3 text-center py-20 text-gray-400 font-bold uppercase text-xs">No hay facturas disponibles para descargar.</p>
      )}
    </div>
  </div>
);

const UserProfile = ({ user }: { user: AppUser }) => {
  const { refreshData } = useData();
  const [name, setName] = useState(user.name);

  const handleUpdate = async () => {
    try {
      await apiClient.updateUser(user.id, { ...user, name });
      alert('Perfil actualizado correctamente');
      await refreshData();
    } catch (error) {
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in duration-700">
      <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Mi <span className="text-gray-300">Perfil</span></h2>
      <div className="p-12 border-2 border-gray-100 rounded-[40px] bg-white space-y-10">
        <div className="flex items-center gap-10 border-b border-gray-100 pb-10">
          <div className="w-24 h-24 bg-black rounded-[32px] flex items-center justify-center text-white relative group">
            <User size={40} />
            <button className="absolute inset-0 bg-black/60 rounded-[32px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{user.name}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{user.role} | ACTIVO</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
            <input disabled className="w-full p-5 border-2 border-gray-50 rounded-2xl font-bold bg-gray-50/50" value={user.email} />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nombre Completo</label>
            <input
              className="w-full p-5 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleUpdate}
            className="px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-black/20"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC<{ user: AppUser, orders: Order[] }> = ({ user, orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <DashboardLayout role="USER">
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <Routes>
        <Route index element={<UserHome user={user} orders={orders} onViewOrder={setSelectedOrder} />} />
        <Route path="orders" element={<MisPedidos orders={orders} onViewOrder={setSelectedOrder} />} />
        <Route path="invoices" element={<Facturas orders={orders} />} />
        <Route path="profile" element={<UserProfile user={user} />} />
        <Route path="support" element={
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Centro de <span className="text-gray-300">Soporte</span></h2>
            <p className="text-gray-500 mb-12">Estamos aquí para optimizar tu experiencia.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <form
                className="p-12 border-2 border-gray-100 rounded-[40px] bg-white"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Ticket enviado correctamente a moderación.');
                  (e.target as HTMLFormElement).reset();
                }}
              >
                <h3 className="text-xl font-black uppercase tracking-tight mb-8">Crear Ticket</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Asunto</label>
                    <input required className="w-full p-5 border-2 border-gray-100 rounded-2xl focus:border-black outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Descripción</label>
                    <textarea required className="w-full p-5 border-2 border-gray-100 rounded-2xl focus:border-black outline-none transition-all font-bold h-40 resize-none" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all">Enviar Reporte</button>
                </div>
              </form>
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8">Preguntas Frecuentes</h3>
                {[
                  '¿Cómo descargar mis kits digitales?',
                  '¿Es el pago seguro a través de Mikitech?',
                  '¿Puedo solicitar una devolución?',
                  '¿Qué incluye el bundle supremo?'
                ].map((q, i) => (
                  <div key={i} className="p-6 border-2 border-gray-100 rounded-3xl hover:border-black transition-all cursor-pointer flex items-center justify-between group">
                    <span className="font-bold text-sm uppercase tracking-tight">{q}</span>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-black">arrow_forward</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  );
};
