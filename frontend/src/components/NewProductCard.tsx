import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ShieldCheck, Heart, Zap } from 'lucide-react';
import { NewProduct } from '../types';
import { useCart } from '../context/CartContext';
import Product3DTilt from './Product3DTilt';

interface Props {
  product: NewProduct;
}

export const NewProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const wishlisted = isInWishlist(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `new-${product.id}`,
      productId: product.id,
      productType: 'NEW',
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      shopName: product.shopName,
      maxStock: product.stockQuantity,
    }, 1);
    navigate('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `new-${product.id}`,
      productId: product.id,
      productType: 'NEW',
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      shopName: product.shopName,
      maxStock: product.stockQuantity,
    }, 1);
  };

  return (
    <div className="group bg-white dark:bg-[#111114] rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
      
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

        {/* Discount Tag */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
            {product.discountPercentage}% OFF
          </span>
        )}

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
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#111114]">
        <div>
          {/* Shop with Verification Badge */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="truncate max-w-[170px]">{product.shopName}</span>
            {product.shopVerified && (
              <span title="Verified Merchant Shop">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/new-products/${product.id}`} className="block">
            <h3 className="font-black text-black dark:text-white text-sm line-clamp-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-black dark:text-white">{product.rating}</span>
            <span className="text-[11px] text-zinc-500">({product.reviewsCount} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-black text-black dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - Clean Monochrome */}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/10 transition active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-sm transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewProductCard;
