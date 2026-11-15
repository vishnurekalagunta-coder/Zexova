import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Lock, 
  CheckCircle2, 
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, discount, shippingFee, total, clearCart, showToast } = useCart();

  // Address State
  const [street, setStreet] = useState(user?.address?.street || '100 Feet Road, 4th Block, Indiranagar');
  const [city, setCity] = useState(user?.address?.city || 'Bengaluru');
  const [state, setState] = useState(user?.address?.state || 'Karnataka');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '560038');
  const [phone, setPhone] = useState(user?.phone || '+91 98450 12345');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [processing, setProcessing] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const order = await apiService.createOrder({
        items: items.map((i, idx) => ({
          id: idx + 1,
          productId: i.productId,
          productType: i.productType,
          productTitle: i.title,
          productImage: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: total,
        shippingFee,
        discountAmount: discount,
        paymentMethod,
        shippingAddress: {
          street,
          city,
          state,
          zipCode,
          country: 'India',
        },
      });

      clearCart();
      showToast('Order confirmed! Tracking details generated.');
      navigate(`/order-success?orderNumber=${order.orderNumber}`);
    } catch {
      showToast('Failed to create order, please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cart</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        Checkout &amp; Payment
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white dark:bg-black p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <Truck className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Delivery Address</h3>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-black p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Payment Method</h3>
            </div>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'RAZORPAY' ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 shadow-sm' : 'border-slate-200 dark:border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="w-4 h-4 text-brand-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Razorpay Secure Gateway</span>
                      <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-600 text-[10px]">Instant</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Credit / Debit Card, UPI (Google Pay, PhonePe), NetBanking</div>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-slate-400" />
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 shadow-sm' : 'border-slate-200 dark:border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-brand-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery / In-Store Pickup</div>
                    <div className="text-[11px] text-slate-500">Pay upon physical inspection at doorstep or store counter</div>
                  </div>
                </div>
                <Banknote className="w-4 h-4 text-slate-400" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Form: Order Summary Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-black p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-100 dark:border-white/10">
              Review Cart Items ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <img src={i.image} alt="" className="w-10 h-10 rounded-lg object-contain bg-slate-50 dark:bg-black p-1 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{i.title}</div>
                      <div className="text-[10px] text-slate-400">Qty: {i.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white flex-shrink-0">
                    ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-white/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                <span>Total Due</span>
                <span className="text-brand-600 dark:text-brand-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-xl shadow-brand-600/25 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Processing Payment...' : `Pay ₹${total.toLocaleString('en-IN')} & Confirm Order`}</span>
            </button>

            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit encrypted SSL checkout session powered by Razorpay</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

