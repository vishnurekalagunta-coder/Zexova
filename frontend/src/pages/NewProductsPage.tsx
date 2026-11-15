import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { NewProductCard } from '../components/NewProductCard';
import { CATEGORIES } from '../services/mockData';
import { apiService } from '../services/api';
import { NewProduct } from '../types';

export const NewProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<NewProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await apiService.getNewProducts();
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
    if (verifiedOnly && !p.shopVerified) {
      return false;
    }
    if (p.price > maxPrice) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || 
                    p.brand.toLowerCase().includes(q) || 
                    p.shopName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount;
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(250000);
    setSearchQuery('');
    setVerifiedOnly(false);
    setSortOption('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f5f5f7] dark:bg-[#09090b] text-black dark:text-white min-h-screen transition-colors">
      
      {/* Header Banner - Dual Theme */}
      <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 text-black dark:text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Genuine Retail Store Partners
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white">New Products Shopping</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Factory-sealed electronics, appliances, and mobility gear directly from accredited retail merchant shops.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-black p-4 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-bold text-black dark:text-white">Free Insured Shipping</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">On orders above ₹50,000</div>
            </div>
          </div>
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
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product, brand, store..."
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
                All Departments
              </button>
              {CATEGORIES.slice(0, 10).map((cat) => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Verified Shops Filter */}
          <div className="pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15 cursor-pointer hover:border-zinc-400 dark:hover:border-white/30 transition shadow-sm">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-black dark:text-white accent-black dark:accent-white"
              />
              <span className="text-xs font-bold text-black dark:text-white">
                Verified Shops Only
              </span>
            </label>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              <span>Budget</span>
              <span className="text-black dark:text-white font-black">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="250000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black dark:accent-white"
            />
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-zinc-50 dark:bg-black p-4 rounded-2xl border border-zinc-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Showing <strong className="text-black dark:text-white">{sortedProducts.length}</strong> new items
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15 text-black dark:text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="featured">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-white/15 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <NewProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-zinc-50 dark:bg-black rounded-3xl border border-zinc-200 dark:border-white/10 space-y-4">
              <h3 className="font-extrabold text-black dark:text-white text-lg">No products found</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                No new products match your selected criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold transition shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};

export default NewProductsPage;
