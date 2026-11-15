import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ShieldCheck, 
  Package, 
  TrendingUp, 
  Star, 
  MapPin, 
  Edit, 
  Check, 
  Truck,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { NewProduct, Shop, Order } from '../../types';
import { useCart } from '../../context/CartContext';

export const ShopOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useCart();
  const [products, setProducts] = useState<NewProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopInfo, setShopInfo] = useState<Shop | null>(null);

  useEffect(() => {
    const loadShopData = async () => {
      const [allNew, allShops, allOrders] = await Promise.all([
        apiService.getNewProducts(),
        apiService.getNearbyShops(),
        apiService.getOrders()
      ]);
      setProducts(allNew);
      if (allShops.length > 0) setShopInfo(allShops[0]);
      setOrders(allOrders);
    };
    loadShopData();
  }, []);

  const handleUpdateStock = (productId: number, delta: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p
    ));
    showToast('Inventory stock count updated');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Shop Partner Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
            <Store className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{shopInfo?.name || 'iWorld Authorized Store'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Retail Merchant</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{shopInfo?.address}, {shopInfo?.city}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
              <span>Hours: {shopInfo?.openingHours}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{shopInfo?.rating} ★ ({shopInfo?.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => showToast('Shop profile settings opened')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition"
        >
          Edit Shop Details
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Catalog Products</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{products.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Active in MarketNest search</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Fulfilled Orders</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">48</div>
          <span className="text-[10px] text-slate-400">Total volume this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Monthly Revenue</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹6,84,000</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Google Maps Footfall</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">312 visits</div>
          <span className="text-[10px] text-slate-400">Directions requested</span>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Store Inventory Management</h3>
            <p className="text-xs text-slate-400">Track and adjust real-time warehouse inventory for your products</p>
          </div>
          <button
            onClick={() => showToast('New retail item modal opened')}
            className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Retail SKU</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {products.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 p-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Price: <strong className="text-slate-800 dark:text-slate-200">₹{item.price.toLocaleString('en-IN')}</strong> • Category: {item.category}
                  </div>
                </div>
              </div>

              {/* Stock Stepper */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">In Stock:</span>
                  <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <button
                      onClick={() => handleUpdateStock(item.id, -1)}
                      className="px-2 py-0.5 font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="px-2 font-bold text-slate-900 dark:text-white">{item.stockQuantity}</span>
                    <button
                      onClick={() => handleUpdateStock(item.id, 1)}
                      className="px-2 py-0.5 font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.stockQuantity > 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {item.stockQuantity > 5 ? 'Available' : 'Low Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

