import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  Bell, 
  Settings, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { apiService } from '../../services/api';
import { Order, SellerInquiry, PriceEstimationResult, UsedProductListing } from '../../types';

export const UserDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [estimations, setEstimations] = useState<PriceEstimationResult[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<UsedProductListing[]>([]);

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const [ordList, inqList, estList, allUsed] = await Promise.all([
        apiService.getOrders(),
        apiService.getInquiries(),
        apiService.getEstimationHistory(),
        apiService.getUsedProducts()
      ]);
      setOrders(ordList);
      setInquiries(inqList);
      setEstimations(estList);
      setWishlistProducts(allUsed.filter((p: UsedProductListing) => wishlist.includes(p.id)));
    };
    loadUserData();
  }, [wishlist]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      address: {
        street,
        city,
        state: 'Karnataka',
        zipCode: '560038',
        country: 'India'
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: wishlist.length },
    { id: 'inquiries', label: 'Negotiations & Offers', icon: MessageSquare, count: inquiries.length },
    { id: 'estimations', label: 'AI Valuations', icon: Sparkles, count: estimations.length },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile Header */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-300">{user?.email}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <MapPin className="w-3 h-3 text-brand-400" />
              <span>{user?.address?.city || 'Bengaluru, India'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/sell"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            + Sell Product
          </Link>
          <Link
            to="/estimator"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition"
          >
            AI Price Check
          </Link>
        </div>
      </div>

      {/* Main Dashboard Navigation & Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4 opacity-80" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Body */}
        <main className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase">Completed Orders</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% On-time delivery</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase">Wishlist Items</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{wishlist.length}</div>
                  <span className="text-[10px] text-brand-600 font-semibold">Saved for quick purchasing</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase">Valuations Created</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{estimations.length}</div>
                  <span className="text-[10px] text-amber-600 font-semibold">AI resale calculations</span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Order History</h3>
                  <button onClick={() => setSearchParams({ tab: 'orders' })} className="text-xs text-brand-600 font-bold hover:underline">
                    View All
                  </button>
                </div>

                {orders.slice(0, 2).map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Order {ord.orderNumber}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{ord.items.length} item(s) • Total: ₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                      {ord.orderStatus}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">My Order History</h2>
              {orders.length > 0 ? (
                orders.map((ord) => (
                  <div key={ord.id} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 text-xs gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Order #{ord.orderNumber}</span>
                        <span className="text-slate-400 block text-[11px]">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xs">
                          {ord.orderStatus}
                        </span>
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img src={item.productImage} alt="" className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-900 p-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.productTitle}</h4>
                            <p className="text-slate-400 text-[11px]">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border text-xs text-slate-500">
                  No orders placed yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Saved Wishlist Items</h2>
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 truncate">
                        <img src={p.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="truncate">
                          <Link to={`/used-products/${p.id}`} className="font-bold text-slate-900 dark:text-white truncate block hover:underline">
                            {p.title}
                          </Link>
                          <span className="font-black text-brand-600 dark:text-brand-400">₹{p.sellingPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex-shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border text-xs text-slate-500">
                  Your wishlist is empty.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INQUIRIES & OFFERS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Negotiations &amp; Direct Offers</h2>
              {inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{inq.listingTitle}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                        {inq.status}
                      </span>
                    </div>
                    {inq.offeredPrice && (
                      <div className="text-brand-600 font-bold">Proposed Price: ₹{inq.offeredPrice.toLocaleString('en-IN')}</div>
                    )}
                    <p className="text-slate-500 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl">{inq.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border text-xs text-slate-500">
                  No active negotiations or inquiries.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ESTIMATIONS */}
          {activeTab === 'estimations' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Recent AI Resale Valuations</h2>
              {estimations.length > 0 ? (
                estimations.map((est, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900 dark:text-white">{est.brand} {est.model} ({est.category})</span>
                      <span className="text-brand-600 dark:text-brand-400 font-black">₹{est.recommendedSellingPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-slate-500">{est.pricingExplanation}</p>
                    <div className="text-[10px] text-slate-400">Estimated on {new Date(est.estimatedAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border text-xs text-slate-500">
                  No price checks performed yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 max-w-xl">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Profile &amp; Delivery Address</h2>
              
              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                  Profile updated successfully!
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition"
              >
                Save Changes
              </button>
            </form>
          )}

        </main>

      </div>
    </div>
  );
};
