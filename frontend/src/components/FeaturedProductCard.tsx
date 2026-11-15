import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Zap, ShieldCheck, Sparkles, Cpu, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FeaturedProductCard: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();

  const productData = {
    id: 201,
    title: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
    price: 249900,
    originalPrice: 289900,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    shopName: 'iWorld Authorized Apple Reseller',
    stockQuantity: 12,
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: 'new-201-featured',
        productId: productData.id,
        productType: 'NEW',
        title: productData.title,
        price: productData.price,
        originalPrice: productData.originalPrice,
        image: productData.image,
        shopName: productData.shopName,
        maxStock: productData.stockQuantity,
      },
      1
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="relative group max-w-sm w-full">
      {/* Outer Neon Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 rounded-3xl blur-md opacity-30 group-hover:opacity-75 transition duration-500"></div>

      {/* Main Glass Card */}
      <div className="relative p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl text-white space-y-4">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Apple Flagship</span>
          </span>

          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>4.9</span>
            <span className="text-[10px] text-slate-400 font-normal">(128 reviews)</span>
          </div>
        </div>

        {/* Product Title & Spec Pills */}
        <div>
          <h3 className="font-extrabold text-lg text-white group-hover:text-sky-300 transition-colors tracking-tight">
            MacBook Pro 16" M3 Max
          </h3>
          <p className="text-xs text-slate-300/90 mt-1 leading-relaxed">
            Supercharged by Apple M3 Max with Liquid Retina XDR display &amp; all-day battery life.
          </p>

          <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-semibold text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-sky-400" /> 36GB Unified RAM
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> 1TB Blazing SSD
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-400">
              ● Ready to Ship
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              ₹2,49,900
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 line-through">₹2,89,900</span>
              <span className="text-emerald-400 font-bold">Save 14% (₹40,000 Off)</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Brand Warranty</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleAddToCart}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeaturedProductCard;
