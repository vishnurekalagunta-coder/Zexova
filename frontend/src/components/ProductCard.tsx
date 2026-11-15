import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Product3DTilt from './Product3DTilt';

export interface BestProductItem {
  id: number;
  type: 'NEW' | 'USED';
  title: string;
  tagline: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  shopName: string;
  detailUrl: string;
  videoLight?: string;
  videoDark?: string;
}

interface Props {
  product: BestProductItem;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist, showToast } = useCart();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: `${product.type.toLowerCase()}-${product.id}`,
        productId: product.id,
        productType: product.type,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        shopName: product.shopName,
        maxStock: 10,
      },
      1
    );
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: `${product.type.toLowerCase()}-${product.id}`,
        productId: product.id,
        productType: product.type,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        shopName: product.shopName,
        maxStock: 10,
      },
      1
    );
    navigate('/checkout');
  };

  return (
    <div className="group relative bg-transparent p-2 flex flex-col justify-between transition-all duration-300">
      
      {/* Top Media Area - Pure matte finish */}
      <div className="relative aspect-[4/3] max-h-48 flex items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#111114] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Product Image or Dual-Theme Video with 3D Tilt */}
        <Product3DTilt maxRotation={10} className="w-full h-full flex items-center justify-center">
          {product.videoLight && product.videoDark ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <video
                src={product.videoLight}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="max-h-36 sm:max-h-40 max-w-[90%] object-contain pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-300"
              />
              <video
                src={product.videoDark}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 m-auto max-h-36 sm:max-h-40 max-w-[90%] object-contain pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"
              />
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.title}
              className="max-h-36 sm:max-h-40 max-w-[85%] object-contain pointer-events-none"
              loading="lazy"
            />
          )}
        </Product3DTilt>

        {/* Discount Badge */}
        {product.discountPct > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
            {product.discountPct}% OFF
          </span>
        )}

        {/* Feature Pill */}
        {product.badge && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-zinc-200/90 text-zinc-900 dark:bg-white/10 dark:text-zinc-300 backdrop-blur-sm border border-zinc-300 dark:border-white/10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white/90 text-zinc-700 hover:text-rose-500 border border-zinc-200 dark:bg-black/40 dark:text-zinc-400 dark:hover:text-rose-400 dark:border-transparent'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Body - Clean & Unboxed */}
      <div className="pt-3 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Verified Merchant */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400">{product.category}</span>
            <span className="truncate max-w-[120px] flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-[10px]">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{product.shopName}</span>
            </span>
          </div>

          {/* Product Title */}
          <Link to={product.detailUrl} className="block group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
            <h3 className="font-black text-black dark:text-white text-sm tracking-tight line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
            {product.tagline}
          </p>

          {/* Star Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[11px] font-bold text-black dark:text-white">{product.rating}</span>
            <span className="text-[10px] text-zinc-500">({product.reviewsCount})</span>
          </div>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-black text-black dark:text-white tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200 dark:border-white/10">
          <button
            onClick={handleAddToCart}
            className="py-2 px-2.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300 dark:bg-black dark:hover:bg-white/10 dark:text-white dark:border-white/15 transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ShoppingCart className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="py-2 px-2.5 rounded-lg text-xs font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
