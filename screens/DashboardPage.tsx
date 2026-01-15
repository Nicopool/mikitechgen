
import React from 'react';
import { Link } from 'react-router-dom';
import { ImageGenerator } from '../components/ImageGenerator';
import { VideoGenerator } from '../components/VideoGenerator';
import { Order } from '../types';

// Interface for Dashboard props received from App.tsx
interface DashboardProps {
  user: any;
  orders: Order[];
}

export const DashboardPage: React.FC<DashboardProps> = ({ user, orders }) => {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-[#111318] dark:text-white">
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#e5e7eb] dark:border-[#2b303b] bg-white dark:bg-[#111621] fixed h-full z-10">
        <div className="flex h-16 items-center px-6 border-b border-[#e5e7eb] dark:border-[#2b303b]">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined !text-[28px] font-bold">memory</span>
            <span className="text-xl font-bold tracking-tight text-[#111318] dark:text-white">mikitech</span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 gap-1 px-3 py-4 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-blue-400 font-medium"><span className="material-symbols-outlined !text-[22px] filled">dashboard</span>Dashboard</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#636f88] dark:text-[#9ca3af] hover:bg-[#f0f2f4] dark:hover:bg-[#1f2937]"><span className="material-symbols-outlined !text-[22px]">package_2</span>Orders</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#636f88] dark:text-[#9ca3af] hover:bg-[#f0f2f4] dark:hover:bg-[#1f2937]"><span className="material-symbols-outlined !text-[22px]">auto_awesome</span>AI Labs</a>
        </div>
        <div className="p-3 mt-auto">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#636f88] dark:text-[#9ca3af] hover:bg-[#f0f2f4] dark:hover:bg-[#1f2937]"><span className="material-symbols-outlined !text-[22px]">logout</span>Log Out</Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        <div className="flex-1 p-6 lg:p-10 space-y-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white">Welcome back, {user?.name || 'User'}</h1>
              <p className="text-slate-500 text-sm">Monitor your projects and generate new hardware concepts.</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">New Project</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
               <div className="rounded-xl border border-[#e5e7eb] dark:border-[#2b303b] bg-white dark:bg-[#1e232e] shadow-sm flex flex-col overflow-hidden mb-8">
                <div className="p-6 border-b border-[#e5e7eb] dark:border-[#2b303b] flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#111318] dark:text-white">Active Orders</h3>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="text-xs font-semibold text-[#636f88] dark:text-[#9ca3af] border-b border-[#e5e7eb] dark:border-[#2b303b]"><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Product</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Action</th></tr></thead>
                    <tbody className="text-sm divide-y divide-[#e5e7eb] dark:divide-[#2b303b]">
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 font-medium text-[#111318] dark:text-white">{order.id}</td>
                          <td className="px-6 py-4">{order.subOrders[0]?.items[0]?.name || 'Kit Component'}</td>
                          <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">{order.status}</span></td>
                          <td className="px-6 py-4 text-right"><Link to="/tracking" className="text-primary font-semibold text-xs">Track</Link></td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No active orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ImageGenerator />
            </div>
            
            <div className="lg:col-span-6">
              <VideoGenerator />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
