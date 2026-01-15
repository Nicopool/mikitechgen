
import React from 'react';
import { Link } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111318] dark:text-white antialiased min-h-screen">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-4">
          <div className="text-primary">
            <svg fill="currentColor" height="32" viewBox="0 0 48 48" width="32"><path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path></svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#111318] dark:text-white">mikitech</h2>
        </Link>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-green-600">lock</span>
          <span className="text-sm font-medium hidden sm:block">Secure Checkout</span>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 flex flex-col gap-8">
            <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-6">Contact Information</h2>
              <label className="block">
                <span className="text-sm font-medium text-[#111318] dark:text-gray-300">Email address</span>
                <input className="mt-2 block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 p-3" placeholder="user@example.com" type="email"/>
              </label>
            </section>
            <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-6">Payment</h2>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Card number</label>
                  <div className="relative">
                    <input className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 p-3 pl-10" placeholder="0000 0000 0000 0000" type="text"/>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">credit_card</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:w-[400px] xl:w-[440px] flex-none">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-[#111318] dark:text-white">Order Summary</h2>
                </div>
                <div className="p-6 space-y-6 max-h-[320px] overflow-y-auto">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 flex-none rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
                      <img src="https://picsum.photos/seed/arduino/200/200" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="text-sm font-medium text-[#111318] dark:text-white">Arduino Starter Kit</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Rev 3.0</p>
                    </div>
                    <div className="flex flex-col justify-center text-right"><p className="text-sm font-medium text-[#111318] dark:text-white">$45.00</p></div>
                  </div>
                </div>
                <div className="p-6 space-y-3 bg-gray-50 dark:bg-[#151a23]">
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-base font-bold text-[#111318] dark:text-white">Total</span>
                    <span className="text-xl font-bold text-primary tracking-tight">$167.40</span>
                  </div>
                </div>
              </div>
              <Link to="/tracking" className="w-full rounded-lg bg-primary py-4 px-6 text-center text-base font-bold text-white shadow-lg hover:bg-blue-700 flex justify-center items-center gap-2 group transition-all active:scale-95">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-[20px]">lock</span>
                Pay $167.40
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
