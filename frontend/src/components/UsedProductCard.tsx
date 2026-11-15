import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { UsedProductListing } from '../types';
import { useCart } from '../context/CartContext';
import Product3DTilt from './Product3DTilt';

interface Props {
  product: UsedProductListing;
}

export const UsedProductCard: React.FC<Props> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'LIKE_NEW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'EXCELLENT': return 'bg-white/10 text-zinc-200 border-white/20';
      case 'GOOD': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'FAIR': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default: return 'bg-white/5 text-zinc-400 border-white/10';
    }
  };

  const discount = Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100);

  return (
    <div className="group bg-white dark:bg-[#111114] rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/20 overflow-hidden transition-all duration-300 flex flex-col relative shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
      
      {/* Top Image Container - pure matte finish */}
      <div className="relative aspect-[4/3] max-h-48 overflow-hidden bg-zinc-50/80 dark:bg-[#18181b] p-4 flex items-center justify-center border-b border-zinc-200/80 dark:border-white/[0.08]">
        <Product3DTilt maxRotation={10} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-36 sm:max-h-40 max-w-[85%] object-contain pointer-events-none"
            loading="lazy"
          />
        </Product3DTilt>

        {/* Condition Badge */}
        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md ${getConditionColor(product.condition)}`}>
          {product.condition.replace('_', ' ')}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/90 text-zinc-700 hover:text-rose-500 border border-zinc-200 dark:bg-black/90 dark:text-zinc-400 dark:hover:text-rose-400 dark:border-white/15'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-extrabold shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#111114]">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{product.category}</span>
            <span className="text-zinc-500 text-[11px]">{product.brand}</span>
          </div>

          {/* Title */}
          <Link to={`/used-products/${product.id}`} className="block">
            <h3 className="font-black text-black dark:text-white text-sm line-clamp-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-black text-black dark:text-white">
              ₹{product.sellingPrice.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {discount}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Location & Details Link */}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs">
          <span className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate max-w-[140px]">{product.location}</span>
          <Link
            to={`/used-products/${product.id}`}
            className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-black hover:text-white text-black border border-zinc-200 dark:bg-black dark:hover:bg-white dark:hover:text-black dark:border-white/15 dark:text-white font-bold text-[11px] transition"
          >
            Details
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UsedProductCard;
