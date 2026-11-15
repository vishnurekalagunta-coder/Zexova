import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  TrendingDown, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpDown, 
  Calculator, 
  Tag, 
  SlidersHorizontal,
  RefreshCw,
  ShoppingBag,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { ProductComparisonItem } from '../types';

export const PriceComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [sortBy, setSortBy] = useState<'lowest' | 'discount' | 'relevance'>('lowest');
  const [products, setProducts] = useState<ProductComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 11 Core Electronics Categories
  const CATEGORY_TABS = [
    { id: 'All', name: 'All Categories' },
    { id: 'Smartphones', name: 'Smartphones' },
    { id: 'Laptops & Computers', name: 'Laptops & Computers' },
    { id: 'Smartwatches & Wearables', name: 'Smartwatches' },
    { id: 'Audio Products', name: 'Audio & Sound' },
    { id: 'Televisions & Entertainment', name: 'TVs & Entertainment' },
    { id: 'Cameras', name: 'Cameras' },
    { id: 'Tablets', name: 'Tablets' },
    { id: 'Home Electrical Appliances', name: 'Home Appliances' },
    { id: 'Kitchen Electrical Appliances', name: 'Kitchen Appliances' },
    { id: 'Gaming', name: 'Gaming' },
    { id: 'Other Electronics', name: 'Other Electronics' }
  ];

  // Popular Brands
  const BRANDS = [
    'All', 'Apple', 'Samsung', 'OnePlus', 'Dell', 'HP', 'Lenovo', 'Sony', 'boAt', 'LG', 'Philips', 'Sony PlayStation'
  ];

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const data = await apiService.compareProducts({
        query: query.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        brand: selectedBrand !== 'All' ? selectedBrand : undefined
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch comparisons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisons();
  }, [selectedCategory, selectedBrand]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComparisons();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchComparisons();
    setIsRefreshing(false);
  };

  // Sort items
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'lowest') return a.lowestPrice - b.lowestPrice;
    if (sortBy === 'discount') return b.bestDiscountPercent - a.bestDiscountPercent;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#09090b] text-black dark:text-white pb-20">
      
      {/* Top Header / Hero Banner */}
      <div className="border-b border-black/10 dark:border-white/10 bg-slate-50/50 dark:bg-black py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Dual-Platform Price Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                Amazon vs Flipkart Live Price Comparison
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                Real-time price intelligence across India's premier marketplaces. Compare verified new retail offers, spot instant savings, and estimate pre-owned resale value.
              </p>
            </div>

            {/* Platform Status Indicator */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-sm flex items-center gap-2.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <div className="font-bold text-black dark:text-white">Live Market Feeds</div>
                  <div className="text-[10px] text-slate-500">Amazon Creators & Flipkart API</div>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                title="Refresh Prices"
                disabled={isRefreshing}
                className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition text-slate-600 dark:text-slate-300"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search smartphones, laptops, smart TVs, PS5, headphones (e.g., Samsung Galaxy S24)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-black border border-black/20 dark:border-white/20 text-sm text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-black dark:focus:border-white shadow-sm transition"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition"
              >
                Compare
              </button>
            </div>
          </form>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                    : 'bg-white dark:bg-black text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Filters and Sorting Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
          
          {/* Brand Filter */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Brand:
            </span>
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedBrand === b
                    ? 'bg-slate-200 dark:bg-white/20 text-black dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
            >
              <option value="lowest">Lowest Price First</option>
              <option value="discount">Highest Discount %</option>
              <option value="relevance">Catalog Relevance</option>
            </select>
          </div>

        </div>

        {/* Results Count & Disclaimer */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Showing <strong className="text-black dark:text-white">{sortedProducts.length}</strong> verified electronics models with live marketplace tracking
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Prices and stock availability refresh continuously via official APIs</span>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-3xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black animate-pulse space-y-4">
                <div className="h-44 bg-slate-100 dark:bg-white/5 rounded-2xl"></div>
                <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-28 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
                  <div className="h-28 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/10 rounded-3xl p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-black dark:text-white">No Matching Products Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find marketplace matches for "{query}". Try checking your spelling or selecting "All Categories".
            </p>
            <button
              onClick={() => { setQuery(''); setSelectedCategory('All'); setSelectedBrand('All'); }}
              className="px-5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {sortedProducts.map((item) => {
              const hasAmazon = !!item.amazonOffer;
              const hasFlipkart = !!item.flipkartOffer;
              const isAmazonCheaper = item.lowestPriceSource === 'Amazon';
              const isFlipkartCheaper = item.lowestPriceSource === 'Flipkart';
              const isPriceEqual = item.lowestPriceSource === 'Equal';

              return (
                <div 
                  key={item.productId}
                  className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                >
                  
                  {/* Top Product Header */}
                  <div className="p-6 pb-4 space-y-4">
                    
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* Product Thumbnail & Details */}
                      <div className="flex gap-4">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                              {item.brand}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.category}</span>
                          </div>

                          <h3 className="text-base font-bold text-black dark:text-white line-clamp-2">
                            {item.title}
                          </h3>

                          {item.variant && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              Variant: {item.variant}
                            </p>
                          )}

                          {item.originalMrp && item.originalMrp > item.lowestPrice && (
                            <div className="flex items-center gap-2 pt-1 text-xs">
                              <span className="text-slate-400 line-through">
                                MRP ₹{item.originalMrp.toLocaleString('en-IN')}
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {item.bestDiscountPercent}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Best Deal Tag */}
                      {item.priceDifference > 0 && (
                        <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                            <TrendingDown className="w-3 h-3" />
                            <span>Save ₹{item.priceDifference.toLocaleString('en-IN')}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">on {item.lowestPriceSource}</span>
                        </div>
                      )}

                    </div>

                    {/* Specifications Snippet */}
                    {item.specifications && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 border-t border-black/5 dark:border-white/5">
                        {item.specifications}
                      </p>
                    )}

                  </div>

                  {/* Dual Comparison Boxes: Amazon vs Flipkart */}
                  <div className="px-6 py-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* AMAZON CARD */}
                      <div className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                        isAmazonCheaper 
                          ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30'
                          : 'border-black/10 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]'
                      }`}>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-amber-600 dark:text-amber-400 tracking-wider">
                                AMAZON INDIA
                              </span>
                            </div>
                            {isAmazonCheaper && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                                Lowest Price
                              </span>
                            )}
                          </div>

                          {hasAmazon ? (
                            <div className="space-y-1">
                              <div className="text-xl font-black text-black dark:text-white">
                                ₹{item.amazonOffer!.currentPrice.toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>{item.amazonOffer!.inStock ? '🟢 In Stock' : '🔴 Out of Stock'}</span>
                                {item.amazonOffer!.rating && (
                                  <span>★ {item.amazonOffer!.rating} ({item.amazonOffer!.ratingCount?.toLocaleString()})</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic py-2">
                              Currently unavailable on Amazon
                            </div>
                          )}
                        </div>

                        {hasAmazon && (
                          <a
                            href={item.amazonOffer!.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <span>Buy on Amazon</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                      </div>

                      {/* FLIPKART CARD */}
                      <div className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                        isFlipkartCheaper 
                          ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30'
                          : 'border-black/10 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]'
                      }`}>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-blue-600 dark:text-blue-400 tracking-wider">
                                FLIPKART
                              </span>
                            </div>
                            {isFlipkartCheaper && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                                Lowest Price
                              </span>
                            )}
                          </div>

                          {hasFlipkart ? (
                            <div className="space-y-1">
                              <div className="text-xl font-black text-black dark:text-white">
                                ₹{item.flipkartOffer!.currentPrice.toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>{item.flipkartOffer!.inStock ? '🟢 In Stock' : '🔴 Out of Stock'}</span>
                                {item.flipkartOffer!.rating && (
                                  <span>★ {item.flipkartOffer!.rating} ({item.flipkartOffer!.ratingCount?.toLocaleString()})</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic py-2">
                              Currently unavailable on Flipkart
                            </div>
                          )}
                        </div>

                        {hasFlipkart && (
                          <a
                            href={item.flipkartOffer!.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#2874F0] hover:bg-[#1f5ec7] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <span>Buy on Flipkart</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                      </div>

                    </div>
                  </div>

                  {/* Card Bottom: Estimation Bridge & Source Badge */}
                  <div className="px-6 py-4 bg-slate-50/80 dark:bg-white/[0.03] border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-black dark:text-white font-mono text-[10px]">
                        {item.dataSourceLabel}
                      </span>
                      <span>Updated: {new Date(item.lastUpdated).toLocaleDateString('en-IN')}</span>
                    </div>

                    {/* Bridge to Price Estimator */}
                    <button
                      onClick={() => navigate(`/estimator?category=${encodeURIComponent(item.category)}&brand=${encodeURIComponent(item.brand)}&model=${encodeURIComponent(item.model)}&mrp=${item.lowestPrice}`)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                      <Calculator className="w-3.5 h-3.5 text-amber-500" />
                      <span>Estimate Used Resale Value</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};

