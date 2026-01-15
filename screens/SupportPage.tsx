
import React from 'react';
import { Link } from 'react-router-dom';
import { LiveSupport } from '../components/LiveSupport';

export const SupportPage: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111318] dark:text-gray-100">
      <header className="sticky top-0 z-40 w-full bg-surface-light dark:bg-surface-dark border-b border-[#f0f2f4] dark:border-gray-800">
        <div className="flex items-center justify-between px-6 lg:px-10 py-3 max-w-[1440px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-4 text-[#111318] dark:text-white">
            <div className="size-6 text-primary"><span className="material-symbols-outlined text-3xl">build_circle</span></div>
            <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">mikitech</h2>
          </Link>
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link to="/product" className="text-[#111318] dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium">Shop</Link>
              <Link to="/dashboard" className="text-[#111318] dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium">Account</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center w-full">
        <div className="w-full bg-surface-light dark:bg-surface-dark border-b border-[#f0f2f4] dark:border-gray-800">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="relative overflow-hidden rounded-xl bg-cover bg-center min-h-[360px] md:min-h-[420px] flex flex-col items-center justify-center text-center p-6 gap-6 md:gap-8" style={{backgroundImage: 'linear-gradient(rgba(17, 22, 33, 0.7) 0%, rgba(17, 22, 33, 0.85) 100%), url("https://picsum.photos/seed/support/1200/600")'}}>
              <div className="flex flex-col gap-3 max-w-2xl z-10">
                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Engineering Support Center</h1>
                <p className="text-gray-200 text-sm md:text-lg font-normal leading-relaxed">Find assembly guides, troubleshoot code, and connect with peers.</p>
              </div>
              <div className="w-full max-w-[560px] z-10">
                <div className="flex w-full items-stretch rounded-lg h-12 md:h-14 shadow-lg overflow-hidden">
                  <input className="flex w-full min-w-0 flex-1 bg-white px-3 border-0 text-slate-900 focus:ring-0" placeholder="How can we help?"/>
                  <button className="flex items-center justify-center px-6 bg-primary text-white font-bold hover:bg-blue-700 transition-colors">Search</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="layout-content-container flex flex-col max-w-[1280px] w-full flex-1 px-4 sm:px-6 lg:px-8 py-10 gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <section className="lg:col-span-8">
                <h2 className="text-[#111318] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-6">Browse Knowledge Base</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    {icon: 'build', title: 'Assembly Guides'},
                    {icon: 'terminal', title: 'Software & Firmware'},
                    {icon: 'local_shipping', title: 'Shipping & Returns'},
                    {icon: 'verified_user', title: 'Warranty Info'}
                ].map((card, i) => (
                    <a key={i} href="#" className="group flex flex-col gap-4 rounded-xl border border-[#dcdfe5] dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                    <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <div>
                        <h3 className="text-[#111318] dark:text-white text-lg font-bold leading-tight mb-1">{card.title}</h3>
                        <p className="text-xs text-slate-500">View articles and step-by-step instructions.</p>
                    </div>
                    </a>
                ))}
                </div>
            </section>
            
            <section className="lg:col-span-4">
                <LiveSupport />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
