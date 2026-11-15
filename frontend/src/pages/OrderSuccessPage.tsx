import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, Home, ShoppingBag, Truck } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'MN-849201';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner animate-bounce-short">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Order Confirmed &amp; Payment Received
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Thank You for Shopping on MarketNest!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your order ID is <strong className="text-slate-900 dark:text-white font-mono">{orderNumber}</strong>. We've dispatched an electronic receipt to your registered email.
        </p>
      </div>

      {/* Tracker Status Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xl text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Truck className="w-4 h-4 text-brand-600" />
            <span>Delivery Tracking</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 text-[10px] font-bold">
            Processing
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-500">
          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xs">✓</div>
            <div className="text-emerald-600 font-bold">Confirmed</div>
          </div>
          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto text-xs">2</div>
            <div className="text-brand-600 font-bold">Packing</div>
          </div>
          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto text-xs flex items-center justify-center">3</div>
            <div>In Transit</div>
          </div>
          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto text-xs flex items-center justify-center">4</div>
            <div>Delivered</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/dashboard/user?tab=orders"
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
        >
          <PackageCheck className="w-4 h-4" />
          <span>View in Order History</span>
        </Link>

        <Link
          to="/"
          className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>

    </div>
  );
};

