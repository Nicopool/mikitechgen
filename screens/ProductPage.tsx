
import React from 'react';
import { Link } from 'react-router-dom';

export const ProductPage: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111318] dark:text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-gray-800 bg-white dark:bg-[#111621] px-4 py-3 md:px-10">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-4 text-[#111318] dark:text-white">
            <div className="size-8 text-primary">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48"><path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path></svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">mikitech</h2>
          </Link>
          <div className="hidden md:flex items-center gap-9">
            {['Kits', 'Components', 'Microcontrollers', 'Sensors', 'Community'].map((link, i) => (
              <Link key={i} to="/product" className="text-sm font-medium leading-normal hover:text-primary transition-colors">{link}</Link>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/checkout" className="flex items-center justify-center rounded-lg size-10 bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-6 md:py-10 px-4 md:px-10 lg:px-40">
        <div className="max-w-[1200px] w-full flex flex-col gap-8">
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/" className="text-[#636f88] hover:text-primary transition-colors">Home</Link>
            <span className="text-[#636f88]">/</span>
            <span className="text-[#636f88]">Robotics</span>
            <span className="text-[#636f88]">/</span>
            <span className="font-medium text-[#111318] dark:text-gray-200">Advanced Series</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="w-full aspect-[4/3] bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
                <img src="https://picsum.photos/seed/roboticarm/800/600" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt="Product" />
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button key={i} className={`aspect-square rounded-lg border overflow-hidden relative ${i === 1 ? 'border-primary border-2' : 'border-transparent bg-gray-100 dark:bg-gray-800'}`}>
                    <img src={`https://picsum.photos/seed/armpart${i}/200/200`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="sticky top-24 flex flex-col gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-xs font-bold uppercase tracking-wide mb-3 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Intermediate: Python/C++ Required
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111318] dark:text-white leading-tight mb-2">Pro-Series 4-DOF Robotic Arm Kit with AI Vision</h1>
                  <p className="text-3xl font-bold text-primary">$499.00</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Build, code, and control your own desktop industrial robot. This advanced kit features 0.2mm precision, OpenCV integration for computer vision tasks, and a fully programmable Arduino-compatible microcontroller.</p>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Link to="/checkout" className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors">Add to Cart</Link>
                    <Link to="/checkout" className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">Buy Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
