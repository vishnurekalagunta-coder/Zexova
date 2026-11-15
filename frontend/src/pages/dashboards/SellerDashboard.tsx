import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Tag, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Trash2, 
  Eye, 
  Check, 
  X,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UsedProductListing, SellerInquiry } from '../../types';
import { useCart } from '../../context/CartContext';

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useCart();
  const [listings, setListings] = useState<UsedProductListing[]>([]);
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries' | 'earnings'>('listings');

  useEffect(() => {
    const fetchData = async () => {
      const [allListings, allInquiries] = await Promise.all([
        apiService.getUsedProducts(),
        apiService.getInquiries()
      ]);
      setListings(allListings);
      setInquiries(allInquiries);
    };
    fetchData();
  }, []);

  const totalEarnings = listings
    .filter(p => p.status === 'SOLD')
    .reduce((sum, p) => sum + p.sellingPrice, 0) || 124000;

  const markAsSold = (id: number) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'SOLD' } : l));
    showToast('Listing marked as SOLD!');
  };

  const removeListing = (id: number) => {
    setListings(listings.filter(l => l.id !== id));
    showToast('Listing removed');
  };

  const handleInquiryStatus = (id: number, status: 'ACCEPTED' | 'REJECTED') => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq));
    showToast(`Inquiry offer ${status.toLowerCase()}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Seller Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Individual Seller Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Seller Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">Manage your active pre-owned listings, negotiate offers, and review completed sales.</p>
        </div>

        <Link
          to="/sell"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Listings</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{listings.length}</div>
          <span className="text-[10px] text-brand-600 font-semibold">{listings.filter(l => l.status === 'ACTIVE').length} active right now</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Earnings</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{totalEarnings.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">Zero seller transaction fees</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Buyer Inquiries</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{inquiries.length}</div>
          <span className="text-[10px] text-slate-400">Direct bargaining proposals</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Seller Trust Rating</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">4.9 ★</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified Member Badge</span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'listings' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          My Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'inquiries' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Customer Offers ({inquiries.length})
        </button>
      </div>

      {/* Tab 1: Listings Table */}
      {activeTab === 'listings' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-xs text-slate-500">
            Active &amp; Sold Products
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {listings.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <img src={item.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">{item.category}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Listed for <strong className="text-slate-800 dark:text-slate-200">₹{item.sellingPrice.toLocaleString('en-IN')}</strong> • Condition: {item.condition}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    item.status === 'SOLD' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}>
                    {item.status}
                  </span>

                  {item.status !== 'SOLD' && (
                    <button
                      onClick={() => markAsSold(item.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 text-[11px]"
                    >
                      Mark as Sold
                    </button>
                  )}

                  <Link
                    to={`/used-products/${item.id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-brand-600"
                    title="View live page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => removeListing(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Inquiries Table */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length > 0 ? (
            inquiries.map((inq) => (
              <div key={inq.id} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{inq.listingTitle}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inq.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' :
                    inq.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-slate-400">Buyer Offer:</span>
                  <span className="font-black text-brand-600 dark:text-brand-400 text-sm">
                    ₹{inq.offeredPrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                  "{inq.message}"
                </p>

                {inq.status === 'PENDING' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleInquiryStatus(inq.id, 'ACCEPTED')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Offer</span>
                    </button>
                    <button
                      onClick={() => handleInquiryStatus(inq.id, 'REJECTED')}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border text-xs text-slate-500">
              No customer inquiries or bargaining offers received yet.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

