import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ShoppingCart, 
  Zap, 
  Heart, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Store, 
  MessageSquare
} from 'lucide-react';
import { apiService } from '../services/api';
import { NewProduct, Review } from '../types';
import { useCart } from '../context/CartContext';
import { MOCK_REVIEWS } from '../services/mockData';

export const NewProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist, showToast } = useCart();

  const [product, setProduct] = useState<NewProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setLoading(true);
      const item = await apiService.getNewProductById(Number(id));
      setProduct(item);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/new-products" className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Back to New Products
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
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
    }, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const reviewItem: Review = {
      id: Date.now(),
      userId: 99,
      userName: 'You (Verified Buyer)',
      rating: newReviewRating,
      comment: newReviewText,
      createdAt: 'Just now',
    };
    setReviews([reviewItem, ...reviews]);
    setNewReviewText('');
    showToast('Your customer review was posted!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to catalog</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10 p-6 flex items-center justify-center shadow-xl">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />

            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition ${
                wishlisted ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 dark:bg-black text-slate-700 dark:text-slate-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-slate-50 dark:bg-black border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                    selectedImageIndex === idx ? 'border-brand-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-blue-500 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Brand Warranty</div>
              <div className="text-[10px] text-slate-400">{product.warrantyPeriod}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-center space-y-1">
              <Truck className="w-5 h-5 text-emerald-500 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Express Delivery</div>
              <div className="text-[10px] text-slate-400">Insured 2-3 Day Transit</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-center space-y-1">
              <RotateCcw className="w-5 h-5 text-amber-500 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">7 Days Replacement</div>
              <div className="text-[10px] text-slate-400">If defective or damaged</div>
            </div>
          </div>
        </div>

        {/* Right Column: Purchasing & Specifications */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-bold text-brand-600 dark:text-brand-400">{product.category}</span>
              <span>•</span>
              <span>{product.brand}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Ratings & Merchant Info */}
            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 dark:text-amber-300">{product.rating}</span>
              </div>
              <span className="text-slate-500">({product.reviewsCount} customer reviews)</span>
              <span>•</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Stock ({product.stockQuantity} units)</span>
              </span>
            </div>

            {/* Pricing Section */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Inclusive of all applicable taxes &amp; GST invoice.</p>
            </div>
          </div>

          {/* Quantity Stepper & CTAs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Registered Merchant Shop Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{product.shopName}</h4>
              </div>
              {product.shopVerified && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Merchant</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Authorized brand retail partner. Ships directly from physical store inventory.
            </p>
          </div>

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Specifications</h3>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-xs">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div key={key} className={`flex p-3 ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-black/50' : 'bg-white dark:bg-black'}`}>
                    <span className="w-1/3 text-slate-500 font-medium">{key}</span>
                    <span className="w-2/3 font-bold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Product Overview</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Reviews &amp; Ratings ({reviews.length})
        </h2>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="p-6 rounded-3xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 space-y-4 max-w-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Write an Verified Customer Review
          </h4>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Your Rating:</span>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setNewReviewRating(s)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star className={`w-5 h-5 ${s <= newReviewRating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            required
            placeholder="Share details about performance, build quality, and delivery speed..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition"
          >
            Post Customer Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4 max-w-2xl">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
              </div>
              <div className="flex items-center text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

