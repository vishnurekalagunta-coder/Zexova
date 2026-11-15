import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Tag, 
  RotateCcw, 
  Grid, 
  List, 
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { UsedProductCard } from '../components/UsedProductCard';
import { CATEGORIES } from '../services/mockData';
import { apiService } from '../services/api';
import { UsedProductListing } from '../types';

export const UsedProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<UsedProductListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await apiService.getUsedProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter application
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedCondition !== 'All' && p.condition !== selectedCondition) {
      return false;
    }
    if (selectedCity !== 'All' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (p.sellingPrice > maxPrice) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || 
                    p.brand.toLowerCase().includes(q) || 
                    p.model.toLowerCase().includes(q) ||
                    p.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.sellingPrice - b.sellingPrice;
    if (sortOption === 'price-desc') return b.sellingPrice - a.sellingPrice;
    if (sortOption === 'rating') return b.sellerRating - a.sellerRating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedCity('All');
    setMaxPrice(200000);
    setSearchQuery('');
    setSortOption('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#f5f5f7] dark:bg-[#09090b] text-black dark:text-white min-h-screen transition-colors">
      
      {/* Header Banner - Dual Theme */}
      <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 text-black dark:text-white mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-300 text-xs font-bold mb-3">
            <Tag className="w-3.5 h-3.5 text-amber-500" /> Peer-to-Peer Authenticated Market
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white">Used Products Marketplace</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Buy certified pre-owned gadgets, motorcycles, and appliances. Direct chat and negotiation with sellers.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/estimator"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black border border-zinc-300 dark:bg-black dark:border-white/15 dark:hover:border-white/30 dark:text-white text-xs font-bold transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Price Estimator</span>
          </Link>
          <Link
            to="/sell"
            className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Product</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-zinc-50 dark:bg-black p-6 rounded-3xl border border-zinc-200 dark:border-white/10 h-fit sticky top-24 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-2 font-bold text-black dark:text-white text-sm">
              <Filter className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
              Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Model, brand, specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15 text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'All'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'text-zinc-600 hover:text-black hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-zinc-500">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Physical Condition Filter */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
              Product Condition
            </label>
            <div className="space-y-1">
              {['All', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCondition === cond
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'text-zinc-600 hover:text-black hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  {cond === 'All' ? 'All Conditions' : cond.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              <span>Max Price</span>
              <span className="text-black dark:text-white font-black">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black dark:accent-white"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>₹5k</span>
              <span>₹100k</span>
              <span>₹200k+</span>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-zinc-50 dark:bg-black p-4 rounded-2xl border border-zinc-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Showing <strong className="text-black dark:text-white">{sortedProducts.length}</strong> listings
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15 text-black dark:text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated Sellers</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-zinc-500'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    viewMode === 'list' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-zinc-500'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Product Grid / List */}
          {sortedProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedProducts.map((product) => (
                <UsedProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-zinc-50 dark:bg-black rounded-3xl border border-zinc-200 dark:border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-black dark:text-white text-lg">No listings found</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                No used items match your currently selected filters. Try widening your price range or clearing keyword search.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold transition shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};

export default UsedProductsPage;
