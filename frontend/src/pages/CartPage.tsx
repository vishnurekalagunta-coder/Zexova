import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Tag, 
  X, 
  ChevronRight, 
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    discount, 
    shippingFee, 
    total, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-black text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Explore our certified used marketplace or discover brand-new retail deals from authorized local merchant shops.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/used-products"
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-black text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-300 transition"
          >
            Explore Pre-Owned
          </Link>
          <Link
            to="/new-products"
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition"
          >
            Browse New Arrivals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selections before proceeding to secure checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-black border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-contain bg-slate-50 dark:bg-black p-1 flex-shrink-0"
                />
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    item.productType === 'NEW' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  }`}>
                    {item.productType === 'NEW' ? 'Brand New' : 'Certified Used'}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mt-1">
                    {item.title}
                  </h3>
                  {item.shopName && (
                    <p className="text-xs text-slate-400">{item.shopName}</p>
                  )}
                  <div className="text-sm font-black text-brand-600 dark:text-brand-400 mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Remove */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Guarantee Pill */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>Eligible for MarketNest 100% money-back guarantee and Razorpay secure payment gateway protection.</span>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-black rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedCoupon}' Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. ZEXOVA)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white uppercase font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-black text-white text-xs font-bold hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-white/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-base font-black text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-brand-600 dark:text-brand-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-black shadow-lg shadow-brand-600/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

