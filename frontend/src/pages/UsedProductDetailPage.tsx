import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Flag, 
  MessageSquare, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Calendar, 
  ShieldAlert,
  Send,
  X
} from 'lucide-react';
import { apiService } from '../services/api';
import { UsedProductListing } from '../types';
import { useCart } from '../context/CartContext';
import { UsedProductCard } from '../components/UsedProductCard';

export const UsedProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, showToast } = useCart();

  const [product, setProduct] = useState<UsedProductListing | null>(null);
  const [similar, setSimilar] = useState<UsedProductListing[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Negotiation Offer Modal State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSent, setOfferSent] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'INCORRECT_INFO' | 'COUNTERFEIT' | 'SCAM' | 'OFFENSIVE' | 'OTHER'>('INCORRECT_INFO');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setLoading(true);
      const item = await apiService.getUsedProductById(Number(id));
      setProduct(item);
      if (item) {
        setOfferedPrice(item.sellingPrice - 2000);
        const all = await apiService.getUsedProducts();
        setSimilar(all.filter((p: UsedProductListing) => p.id !== item.id && p.category === item.category).slice(0, 4));
      }
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
        <Link to="/used-products" className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Back to Used Marketplace
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discount = Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.sendInquiry({
      listingId: product.id,
      listingTitle: product.title,
      listingImage: product.images[0],
      offeredPrice: offeredPrice,
      message: offerMessage || `Hi, I am interested in your ${product.title}. Would you consider ₹${offeredPrice}?`,
    });
    setOfferSent(true);
    showToast('Your offer was delivered to the seller!');
    setTimeout(() => {
      setOfferSent(false);
      setOfferModalOpen(false);
    }, 2000);
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.reportProduct({
      productId: product.id,
      productType: 'USED',
      productTitle: product.title,
      reason: reportReason,
      details: reportDetails,
    });
    setReportSent(true);
    showToast('Listing reported to moderation team');
    setTimeout(() => {
      setReportSent(false);
      setReportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-black border border-slate-200/80 dark:border-white/10 shadow-xl">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            <span className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-md">
              {product.condition.replace('_', ' ')}
            </span>

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
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx ? 'border-brand-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safe Trading Tips */}
          <div className="p-5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/50 space-y-2">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>MarketNest Safe Buyer Tips</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Always inspect the device physically and verify IMEI/serial number before releasing final funds. Use our built-in offer chat for recorded communication.
            </p>
          </div>
        </div>

        {/* Right Column: Listing Details & Seller Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-bold text-brand-600 dark:text-brand-400">{product.category}</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.location}, {product.city}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Brand / Model</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{product.brand} - {product.model}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Product Age</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{product.productAgeMonths} months</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Warranty Status</span>
              <span className={`font-bold ${product.warrantyStatus ? 'text-emerald-600' : 'text-slate-500'}`}>
                {product.warrantyStatus ? 'Under Brand Warranty' : 'Expired'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Listing Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Included Accessories */}
          {product.accessories && product.accessories.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Included Accessories</h4>
              <div className="flex flex-wrap gap-2">
                {product.accessories.map((acc, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{acc}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Seller's Description</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Seller Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                {product.sellerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{product.sellerName}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.sellerRating}</span>
                  <span>({product.sellerReviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Seller</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOfferModalOpen(true)}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Make an Offer</span>
              </button>

              <a
                href={product.sellerPhone ? `tel:${product.sellerPhone}` : '#'}
                onClick={(e) => {
                  if (!product.sellerPhone) {
                    e.preventDefault();
                    setOfferModalOpen(true);
                  }
                }}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Seller</span>
              </a>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Product link copied to clipboard!');
                }}
                className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Listing</span>
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="hover:text-rose-600 flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Inaccuracy</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Similar Listings */}
      {similar.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-white/10">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Similar Pre-Owned Listings in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((p) => (
              <UsedProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* MAKE AN OFFER MODAL */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-black rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 relative">
            <button
              onClick={() => setOfferModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">Negotiate &amp; Make an Offer</h3>
            <p className="text-xs text-slate-500 mt-1">
              Current asking price is <strong className="text-slate-800 dark:text-slate-200">₹{product.sellingPrice.toLocaleString('en-IN')}</strong>. Propose a fair price:
            </p>

            {offerSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Offer Sent Successfully!</h4>
                <p className="text-xs text-slate-500">The seller will receive your notification and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Offered Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Message to Seller (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Hi, I can pick up today from Indiranagar. Would you consider this offer?"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Offer to {product.sellerName}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-black rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 relative">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">Report Listing</h3>
            <p className="text-xs text-slate-500 mt-1">Help keep MarketNest safe and transparent for all members.</p>

            {reportSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Report Submitted</h4>
                <p className="text-xs text-slate-500">Our safety compliance team will review this item within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Reason for Report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="INCORRECT_INFO">Inaccurate Specs / Condition Misrepresentation</option>
                    <option value="COUNTERFEIT">Counterfeit / Replica Item</option>
                    <option value="SCAM">Suspicious / Scam Behavior</option>
                    <option value="OFFENSIVE">Inappropriate Photos or Content</option>
                    <option value="OTHER">Other Reason</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Please specify why this listing violates MarketNest policy..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition"
                >
                  Submit Flagged Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
