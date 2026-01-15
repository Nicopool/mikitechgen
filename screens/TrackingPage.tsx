
import React from 'react';
import { Link } from 'react-router-dom';

export const TrackingPage: React.FC = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111318] dark:text-white overflow-hidden flex flex-col h-screen">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-gray-800 px-6 py-3 bg-white dark:bg-[#111621] z-20 shrink-0">
        <Link to="/" className="flex items-center gap-3 text-[#111318] dark:text-white">
          <div className="size-8 text-primary">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48"><path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path></svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">mikitech</h2>
        </Link>
        <div className="flex gap-2">
          <Link to="/support" className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#f0f2f4] dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 transition">Get Support</Link>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        <aside className="w-full lg:w-[480px] xl:w-[520px] bg-white dark:bg-[#111621] border-r border-[#f0f2f4] dark:border-gray-800 overflow-y-auto flex flex-col z-10 shadow-xl lg:shadow-none">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight mb-2">Arriving by 2:45 PM</h1>
              <p className="text-[#636f88] dark:text-gray-400 text-base">Your engineering kit is just around the corner.</p>
            </div>
            <div className="bg-background-light dark:bg-gray-800/50 border border-[#f0f2f4] dark:border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="size-12 rounded-full bg-gray-200 bg-center bg-cover border-2 border-white dark:border-gray-600" style={{backgroundImage: "url('https://picsum.photos/seed/driver/200/200')"}}></div>
                </div>
                <div>
                  <h3 className="font-bold text-[#111318] dark:text-white text-sm">Marcus D.</h3>
                  <p className="text-[#636f88] text-xs">Ford Transit • 4.9 ★</p>
                </div>
              </div>
            </div>
            <div className="relative pl-2 py-2">
              <div className="absolute left-[19px] top-4 bottom-8 w-0.5 bg-[#dcdfe5] dark:bg-gray-700 rounded-full"></div>
              <div className="relative flex gap-4 pb-8 group">
                <div className="relative z-10 flex items-center justify-center size-10 rounded-full bg-primary text-white shrink-0 shadow-md shadow-primary/20"><span className="material-symbols-outlined text-xl">check</span></div>
                <div className="flex flex-col pt-1"><span className="font-bold text-[#111318] dark:text-white text-base">Order Placed</span></div>
              </div>
              <div className="relative flex gap-4 pb-8 group">
                <div className="relative z-10 flex items-center justify-center size-10 rounded-full bg-white dark:bg-[#111621] border-[3px] border-primary text-primary shrink-0 animate-pulse"><span className="material-symbols-outlined text-xl">local_shipping</span></div>
                <div className="flex flex-col pt-1"><span className="font-bold text-primary text-base">Out for Delivery</span></div>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden h-[50vh] lg:h-auto">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/map/1200/800')", filter: "grayscale(10%) contrast(105%)"}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-2xl border-4 border-primary relative z-10 animate-bounce">
              <span className="material-symbols-outlined text-primary text-2xl block">local_shipping</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
