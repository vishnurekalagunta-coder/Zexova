import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  Layers, 
  UserCheck, 
  Tag, 
  Calculator, 
  MapPin, 
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Tv,
  Tablet,
  Gamepad2,
  Camera,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Role } from '../types';

// Minimum 10+ Curated Category & Collection Names for the Wide Mega-Menu
const PRODUCT_COLLECTIONS = [
  {
    id: 'new-drops',
    title: 'New Drops',
    subtitle: 'Latest 2024 Flagships',
    icon: Sparkles,
    badge: 'NEW',
    badgeColor: 'bg-emerald-500 text-white',
    link: '/new-products?sort=newest',
  },
  {
    id: 'best-sellers',
    title: 'Best Sellers',
    subtitle: 'Top Rated by Customers',
    icon: Flame,
    badge: 'HOT',
    badgeColor: 'bg-rose-500 text-white',
    link: '/new-products?sort=best-sellers',
  },
  {
    id: 'mobiles',
    title: 'Mobiles & Smartphones',
    subtitle: 'iPhone, Galaxy, Pixel, OnePlus',
    icon: Smartphone,
    badge: '5G',
    badgeColor: 'bg-sky-500 text-white',
    link: '/new-products?category=Smartphones',
  },
  {
    id: 'laptops',
    title: 'Laptops & Computers',
    subtitle: 'MacBook, Dell, HP, ThinkPad',
    icon: Laptop,
    badge: 'M3 / i9',
    badgeColor: 'bg-indigo-500 text-white',
    link: '/new-products?category=Laptops',
  },
  {
    id: 'watches',
    title: 'Watches & Wearables',
    subtitle: 'Apple Watch, Galaxy, Garmin',
    icon: Watch,
    link: '/new-products?category=Smartwatches',
  },
  {
    id: 'buds',
    title: 'Buds & Audio',
    subtitle: 'AirPods, Sony ANC, Soundbars',
    icon: Headphones,
    badge: 'ANC',
    badgeColor: 'bg-amber-500 text-black',
    link: '/new-products?category=Audio',
  },
  {
    id: 'tvs',
    title: 'Smart TVs & Displays',
    subtitle: 'OLED, QLED, 4K Home Cinema',
    icon: Tv,
    badge: '4K HDR',
    badgeColor: 'bg-purple-500 text-white',
    link: '/new-products?category=Televisions',
  },
  {
    id: 'tablets',
    title: 'Tablets & iPads',
    subtitle: 'iPad Pro, Galaxy Tab, Stylus',
    icon: Tablet,
    link: '/new-products?category=Tablets',
  },
  {
    id: 'gaming',
    title: 'Gaming & Consoles',
    subtitle: 'PlayStation 5, Xbox, GPUs',
    icon: Gamepad2,
    badge: '120FPS',
    badgeColor: 'bg-rose-600 text-white',
    link: '/new-products?category=Gaming',
  },
  {
    id: 'used-market',
    title: 'Pre-Owned Market',
    subtitle: 'Inspected 2nd-Hand Tech Deals',
    icon: Tag,
    badge: 'UP TO 50% OFF',
    badgeColor: 'bg-emerald-600 text-white',
    link: '/used-products',
  },
  {
    id: 'cameras',
    title: 'Cameras & Photography',
    subtitle: 'DSLR, Mirrorless, Action Cams',
    icon: Camera,
    link: '/new-products?category=Cameras',
  },
  {
    id: 'compare-prices',
    title: 'Compare Prices',
    subtitle: 'Live Amazon vs Flipkart Check',
    icon: TrendingUp,
    badge: 'LIVE API',
    badgeColor: 'bg-rose-500 text-white',
    link: '/compare',
  },
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { itemCount, wishlist, toastMessage } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth hover handlers with debounce buffer
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setProductsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setProductsMenuOpen(false);
    }, 180);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/new-products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const getDashboardPath = (role?: Role) => {
    switch (role) {
      case 'ADMIN': return '/dashboard/admin';
      case 'SHOP_OWNER': return '/dashboard/shop';
      case 'SELLER': return '/dashboard/seller';
      default: return '/dashboard/user';
    }
  };

  const isHomeActive = location.pathname === '/';
  const isProductsActive = [
    '/new-products', 
    '/used-products', 
    '/compare', 
    '/estimator', 
    '/nearby-stores'
  ].some(path => location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f7]/95 dark:bg-[#09090b]/95 backdrop-blur-2xl text-zinc-950 dark:text-zinc-50 border-b border-zinc-200/90 dark:border-white/[0.08] transition-colors shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      
      {/* Toast Notification Banner (Optional Notification) */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-400 text-white text-xs font-bold py-1 px-4 text-center tracking-wide animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SINGLE UNIFIED LUXURY NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* ========================================================
              LEFT: ZEXOVA BRAND LOGO
          ======================================================== */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-widest text-zinc-950 dark:text-zinc-50 transition-colors">
                  ZEXOVA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 -mt-1 hidden sm:block font-bold">
                Luxury • Technology
              </p>
            </div>
          </Link>

          {/* ========================================================
              CENTER: CLEAN NAV WITH ONLY "HOME" & "PRODUCTS" (HOVER MEGA-MENU)
          ======================================================== */}
          <nav className="hidden md:flex items-center gap-2">
            
            {/* 1. HOME BUTTON */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
                isHomeActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08]'
              }`}
            >
              Home
            </Link>

            {/* 2. PRODUCTS WITH WIDE DROP-DOWN MEGA MENU (HOVER TO FLOW DOWN) */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/new-products"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 select-none ${
                  isProductsActive || productsMenuOpen
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08]'
                }`}
              >
                <span>Products</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${productsMenuOpen ? 'rotate-180' : ''}`} />
              </Link>
            </div>

          </nav>

          {/* ========================================================
              RIGHT: SEARCH, WISHLIST, PREMIUM MATTE CART, THEME TOGGLE, PROFILE LOGO
          ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center relative animate-in fade-in">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 sm:w-60 pl-8 pr-7 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/80 dark:border-white/[0.08] transition-all duration-200 active:scale-95 shadow-sm"
                  title="Search products"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist Link with counter */}
            <Link
              to="/dashboard/user?tab=wishlist"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 text-zinc-700 hover:text-rose-500 dark:text-zinc-300 dark:hover:text-rose-400 border border-zinc-200/80 dark:border-white/[0.08] transition-all duration-200 relative active:scale-95 shadow-sm"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm ring-2 ring-[#f5f5f7] dark:ring-[#09090b]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Premium Matte Cart Button with Floating Badge */}
            <Link
              to="/cart"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 text-zinc-800 hover:text-black dark:text-zinc-200 dark:hover:text-white border border-zinc-200/80 dark:border-white/[0.08] transition-all duration-200 relative active:scale-95 shadow-sm group"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black flex items-center justify-center shadow-md ring-2 ring-[#f5f5f7] dark:ring-[#09090b]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200/80 dark:border-white/[0.08] transition-all duration-200 group active:scale-95 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Luxury Profile Logo & Emblem Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.06] dark:hover:bg-white/10 border border-zinc-200/80 dark:border-white/[0.08] transition-all duration-200 active:scale-95 shadow-sm group"
                title="Account Menu"
              >
                {/* Luxury Profile Logo Emblem (Clean Monogram / Silhouette, not stock photo) */}
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform duration-200 relative">
                  <User className="w-4 h-4 stroke-[2.2]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#f5f5f7] dark:ring-[#09090b]" />
                </div>

                <div className="hidden lg:flex flex-col text-left pr-1">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight max-w-[85px] truncate">
                    {user?.name?.split(' ')[0] || 'Member'}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {user?.role || 'CUSTOMER'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Luxury Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111114] border border-zinc-200/90 dark:border-white/10 py-2 z-50 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-1 text-zinc-950 dark:text-zinc-50">
                  <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-white/[0.08]">
                    <p className="text-xs font-black text-zinc-950 dark:text-zinc-50 truncate">{user?.name || 'ZEXOVA Member'}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{user?.email || 'customer@zexova.com'}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/10">
                        Active Role: {user?.role || 'CUSTOMER'}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pt-2.5 pb-1 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Switch Demo Persona
                  </div>
                  <div className="px-2 py-1 space-y-0.5">
                    {(['CUSTOMER', 'SELLER', 'SHOP_OWNER', 'ADMIN'] as Role[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchDemoRole(r);
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                          user?.role === r 
                            ? 'font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950' 
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{r}</span>
                        </div>
                        {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-white/[0.08] my-1.5" />

                  <div className="px-2 space-y-0.5">
                    <Link
                      to={getDashboardPath(user?.role)}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                      <span className="font-semibold">Dashboard Control</span>
                    </Link>

                    <Link
                      to="/dashboard/user?tab=orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-zinc-500" />
                      <span className="font-semibold">My Orders</span>
                    </Link>

                    <Link
                      to="/sell"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">Sell a Product</span>
                    </Link>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-white/[0.08] my-1.5" />

                  <div className="px-2">
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* ========================================================
          WIDE HORIZONTAL MEGA-MENU BOX ("WIDTH BOX NOT HEIGHT")
          Flows down smoothly when hovering "Products" with CSS animation
          Displays 12 Curated Collections / Category Names
      ======================================================== */}
      <div
        className={`absolute top-full left-0 w-full pt-1.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          productsMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 -translate-y-2 pointer-events-none invisible'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Invisible mouse bridge preventing accidental close */}
        <div className="absolute -top-3 left-0 w-full h-4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white/95 dark:bg-[#111114]/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-white/10 p-5 sm:p-6 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9)] space-y-4">
            
            {/* Mega Menu Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.08]">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                Products &amp; Categories
              </span>

              <Link
                to="/new-products"
                onClick={() => setProductsMenuOpen(false)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 group transition"
              >
                <span>View All ({PRODUCT_COLLECTIONS.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* WIDE HORIZONTAL NAMES-ONLY PILL GRID (NO ICONS, NO COLORS, 3 OR 4 PER ROW - ROUNDED-FULL AS SHOWN IN DESIGN) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {PRODUCT_COLLECTIONS.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={() => setProductsMenuOpen(false)}
                  className="group px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white dark:bg-white/[0.04] hover:bg-zinc-950 dark:hover:bg-white text-zinc-800 hover:text-white dark:text-zinc-200 dark:hover:text-zinc-950 border border-zinc-200/80 hover:border-zinc-950 dark:border-white/[0.08] dark:hover:border-white transition-all duration-200 flex items-center justify-between shadow-none hover:shadow-md active:scale-98 select-none"
                >
                  <span className="font-semibold text-xs sm:text-sm tracking-tight transition-transform duration-200 group-hover:translate-x-0.5 truncate">
                    {item.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#09090b] px-4 py-4 space-y-1.5 animate-in fade-in max-h-[80vh] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              isHomeActive
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
            }`}
          >
            Home
          </Link>

          <div className="pt-2 pb-1 px-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Departments &amp; Categories
          </div>

          {PRODUCT_COLLECTIONS.map((c) => (
            <Link
              key={c.id}
              to={c.link}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2.5">
                <c.icon className="w-4 h-4 text-zinc-500" />
                <span>{c.title}</span>
              </div>
              {c.badge && (
                <span className={`px-1.5 py-0.2 text-[8px] font-black rounded text-white ${c.badgeColor}`}>
                  {c.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

    </header>
  );
};

export default Navbar;
