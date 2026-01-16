import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Group items by vendorId
      const groupedByVendor = items.reduce((acc: any, item) => {
        const vId = item.vendorId || 'system';
        if (!acc[vId]) acc[vId] = { vendorId: vId, vendorName: item.vendorName || 'Sistema', items: [] };
        acc[vId].items.push(item);
        return acc;
      }, {});

      const subOrders = Object.values(groupedByVendor).map((group: any) => ({
        id: crypto.randomUUID(),
        vendorId: group.vendorId,
        vendorName: group.vendorName,
        status: 'PENDING',
        items: group.items
      }));

      const { data: order, error } = await supabase.from('orders').insert([{
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        total_amount: total,
        status: 'COMPLETED',
        sub_orders: subOrders,
        payment_method: 'Digital Walllet',
        address: 'Digital Delivery'
      }]).select().single();

      if (error) throw error;

      alert('¡Compra exitosa! La transferencia de datos ha finalizado. Tus kits ahora están en tu terminal.');
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error crítico en el protocolo de transacción.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-white">
        <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border-2 border-gray-100 opacity-20">
          <span className="material-symbols-outlined text-5xl">shopping_cart</span>
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">Terminal de Compra Vacío</h2>
        <Link to="/shop" className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all border-b-2 border-black pb-2">Volver al Mercado Digital</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white border-2 border-black rounded-[48px] shadow-2xl overflow-hidden flex flex-col lg:flex-row shadow-black/5 animate-in fade-in zoom-in-95 duration-700">

        {/* Order Summary */}
        <div className="flex-1 p-16 border-b lg:border-b-0 lg:border-r-2 border-gray-100">
          <div className="flex items-center gap-3 mb-12">
            <span className="w-8 h-0.5 bg-black" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Resumen de Transacción</h2>
          </div>

          <div className="space-y-8">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-50 group-hover:border-black transition-all">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.category}</p>
                    <h4 className="text-lg font-black uppercase tracking-tight leading-none mb-2">{item.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-2xl font-black">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t-2 border-dashed border-gray-100">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Total de Transferencia</p>
                <p className="text-6xl font-black">${total.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-green-500 mb-2">Protocolo de Encriptación Activo</p>
                <span className="material-symbols-outlined text-gray-200">security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment / Confirm */}
        <div className="w-full lg:w-[420px] p-16 bg-white flex flex-col justify-center border-t-2 lg:border-t-0 border-gray-100">
          <div className="mb-12">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Protocolo Final</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-widest">Al confirmar, los assets digitales se transferirán de manera instantánea a tu terminal personal.</p>
          </div>

          <div className="space-y-4 mb-12">
            <div className="p-8 border-2 border-black rounded-[32px] flex items-center justify-between shadow-2xl shadow-black/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-black">credit_card</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Facturación Estándar</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Entrega de Datos Inmediata</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            </div>
          </div>

          {!user ? (
            <div className="text-center space-y-6">
              <div className="p-8 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Se requiere autenticación de red para proceder con la transacción.</p>
              </div>
              <Link to="/login" className="block w-full py-6 px-10 bg-black text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-black/20">Identificarse en Terminal</Link>
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-7 px-10 bg-black text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-black/20 disabled:opacity-50"
            >
              {loading ? 'Transfiriendo Datos...' : 'Confirmar y Ejecutar Pago'}
            </button>
          )}

          <button
            onClick={() => navigate('/shop')}
            className="mt-10 w-full text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black transition-all"
          >
            ← Cancelar y Abortar
          </button>
        </div>
      </div>
    </div>
  );
};
