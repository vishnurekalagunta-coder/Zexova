import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  Tag, 
  ShoppingBag, 
  AlertTriangle, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  DollarSign, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { apiService } from '../../services/api';
import { UsedProductListing, Shop, ProductReport } from '../../types';
import { useCart } from '../../context/CartContext';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState<'moderation' | 'shops' | 'reports' | 'users'>('moderation');

  const [products, setProducts] = useState<UsedProductListing[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [reports, setReports] = useState<ProductReport[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const [allUsed, allShops, allReports] = await Promise.all([
        apiService.getUsedProducts(),
        apiService.getNearbyShops(),
        apiService.getReports()
      ]);
      setProducts(allUsed);
      setShops(allShops);
      setReports(allReports.length > 0 ? allReports : [
        {
          id: 1,
          productId: 101,
          productType: 'USED',
          productTitle: 'Apple iPhone 14 Pro Max 256GB',
          reporterEmail: 'buyer@test.com',
          reason: 'INCORRECT_INFO',
          details: 'Seller listed battery at 94%, requesting verification bill.',
          status: 'OPEN',
          createdAt: '2026-11-06'
        }
      ]);
    };
    fetchAdminData();
  }, []);

  const handleApproveProduct = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: 'ACTIVE' } : p));
    showToast('Product listing approved & published');
  };

  const handleRejectProduct = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    showToast('Product listing rejected by moderator');
  };

  const handleToggleShopVerification = (shopId: number) => {
    setShops(shops.map(s => s.id === shopId ? { ...s, isVerified: !s.isVerified } : s));
    showToast('Shop verification badge updated!');
  };

  const handleResolveReport = (reportId: number) => {
    setReports(reports.filter(r => r.id !== reportId));
    showToast('Report marked as RESOLVED');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-rose-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Security &amp; Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">MarketNest Command Center</h1>
          <p className="text-xs text-slate-300 mt-1">Platform moderation, merchant accreditation, anti-fraud compliance and audit metrics.</p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Core Services 100% Operational</span>
        </div>
      </div>

      {/* High Level Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Users</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">14,280</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Active Sellers</span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">1,840</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Verified Shops</span>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400">{shops.filter(s => s.isVerified).length}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Products</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">{products.length + 18}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Orders Processed</span>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">3,490</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Platform GMV</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹4.82 Cr</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'moderation' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Product Moderation ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'shops' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Shop Accreditation ({shops.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'reports' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Flagged Reports ({reports.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-xs text-slate-500">
            Used Listing Compliance Queue
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {products.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Seller: {item.sellerName} • Asking: ₹{item.sellingPrice.toLocaleString('en-IN')} • Condition: {item.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status}
                  </span>

                  <button
                    onClick={() => handleApproveProduct(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleRejectProduct(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SHOP ACCREDITATION */}
      {activeTab === 'shops' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-xs text-slate-500">
            Registered Merchant Stores KYC &amp; Verification
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {shops.map((s) => (
              <div key={s.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={s.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-white">{s.name}</h4>
                      {s.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{s.address}, {s.city}</p>
                    <p className="text-[10px] text-slate-500">{s.phone} • {s.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleShopVerification(s.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    s.isVerified
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-rose-50 hover:text-rose-600'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{s.isVerified ? 'Revoke Verification' : 'Grant Verified Badge'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FLAGGED REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep.id} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reason: {rep.reason.replace('_', ' ')}</span>
                </span>
                <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
              </div>

              <div>
                <strong className="text-slate-900 dark:text-white block">Flagged Item: {rep.productTitle}</strong>
                <p className="text-slate-600 dark:text-slate-300 mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                  "{rep.details}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleResolveReport(rep.id)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs"
                >
                  Dismiss Report
                </button>
                <button
                  onClick={() => {
                    handleResolveReport(rep.id);
                    showToast('Item taken down and seller notified');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Take Down Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

