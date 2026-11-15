import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Clock, 
  Star, 
  ShieldCheck, 
  SlidersHorizontal, 
  Compass, 
  Map as MapIcon, 
  List, 
  ExternalLink,
  Store,
  CheckCircle2
} from 'lucide-react';
import { StoreCard } from '../components/StoreCard';
import { apiService } from '../services/api';
import { Shop } from '../types';
import { useCart } from '../context/CartContext';

export const NearbyStoresPage: React.FC = () => {
  const { showToast } = useCart();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // User Location State
  const [userLat, setUserLat] = useState<number>(12.9716);
  const [userLng, setUserLng] = useState<number>(77.5946);
  const [locationName, setLocationName] = useState<string>('Bengaluru Central (Auto-detected)');
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState<number>(4.0);
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(15);
  const [activeShop, setActiveShop] = useState<Shop | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      const data = await apiService.getNearbyShops();
      setShops(data);
      if (data.length > 0) setActiveShop(data[0]);
      setLoading(false);
    };
    fetchStores();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser. Please enter manually.');
      return;
    }

    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocationName(`Current GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setLocationDetecting(false);
        showToast('Location updated from device GPS!');
      },
      (err) => {
        setLocationDetecting(false);
        showToast('Location permission denied. You can manually enter city/area.');
      },
      { timeout: 8000 }
    );
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocationName(searchQuery.trim());
      showToast(`Showing stores near "${searchQuery}"`);
    }
  };

  // Filtered Shops
  const filteredShops = shops.filter((shop) => {
    if (selectedCategory !== 'All' && !shop.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (shop.rating < minRating) {
      return false;
    }
    if (shop.distanceKm && shop.distanceKm > maxRadiusKm) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = shop.name.toLowerCase().includes(q) ||
                    shop.address.toLowerCase().includes(q) ||
                    shop.category.toLowerCase().includes(q) ||
                    shop.zipCode.includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f5f5f7] dark:bg-[#09090b] text-black dark:text-white min-h-screen transition-colors">
      
      {/* Header Banner - Dual Theme & Box Lines Only */}
      <div className="bg-zinc-50 dark:bg-black rounded-3xl p-6 sm:p-10 text-black dark:text-white border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-500" /> Google Maps Platform Location Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black dark:text-white">Discover Trusted Stores Around You.</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl">
            Locate accredited Apple partners, Samsung lounges, and appliance superstores for hands-on demos and immediate walk-in shopping.
          </p>
        </div>

        {/* Geolocation Detector Pill */}
        <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 space-y-2 max-w-xs w-full shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Your Location:</span>
            <button
              onClick={detectLocation}
              disabled={locationDetecting}
              className="text-[11px] font-bold text-amber-500 hover:underline flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              <span>{locationDetecting ? 'Detecting...' : 'Detect GPS'}</span>
            </button>
          </div>
          <div className="text-xs font-black text-black dark:text-white truncate">
            {locationName}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-black p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search by store name, product, PIN code (e.g. 560038) or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3">
          
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics &amp; Computers</option>
            <option value="Smartphones">Smartphones &amp; Gadgets</option>
            <option value="Appliances">Home Appliances &amp; TVs</option>
            <option value="Kitchen">Kitchen Appliances</option>
            <option value="Bicycles">Bicycles &amp; Mobility</option>
            <option value="Cameras">Cameras &amp; Optics</option>
          </select>

          {/* Distance Radius */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span>Radius:</span>
            <select
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-xs font-bold"
            >
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={20}>Within 20 km</option>
              <option value={50}>Within 50 km</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-white dark:bg-black text-brand-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white dark:bg-black text-brand-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Interactive Map & Store List */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* Left Column: Store Cards List */}
        <div className={viewMode === 'split' ? 'lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-2' : 'space-y-4'}>
          <div className="text-xs text-slate-500 font-semibold mb-2">
            Found {filteredShops.length} registered merchant stores in this radius
          </div>

          {filteredShops.map((shop) => (
            <div 
              key={shop.id}
              onClick={() => setActiveShop(shop)}
              className={`cursor-pointer rounded-2xl transition-all ${
                activeShop?.id === shop.id ? 'ring-2 ring-brand-500' : ''
              }`}
            >
              <StoreCard shop={shop} onSelectOnMap={(s) => setActiveShop(s)} />
            </div>
          ))}

          {filteredShops.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
              <Store className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm">No stores found in this radius</h4>
              <p className="text-xs text-slate-500">Try expanding the search distance to 20 km or 50 km.</p>
            </div>
          )}
        </div>

        {/* Right Column: Google Maps Interactive Simulator Canvas */}
        {viewMode !== 'list' && (
          <div className={viewMode === 'split' ? 'lg:col-span-7' : 'w-full'}>
            <div className="relative h-[500px] lg:h-[750px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xl bg-slate-900">
              
              {/* Stylized Vector Map Surface */}
              <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
                {/* SVG Roads & Grid Graphic */}
                <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Curving major arterial roads */}
                  <path d="M 0 150 Q 250 80 500 200 T 1000 250" fill="none" stroke="#475569" strokeWidth="6" />
                  <path d="M 200 0 Q 300 350 400 750" fill="none" stroke="#475569" strokeWidth="5" />
                  <path d="M 0 450 Q 450 400 900 650" fill="none" stroke="#64748b" strokeWidth="4" />
                </svg>

                {/* Pulse circle around user location */}
                <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 animate-ping"></div>
                  <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-glow"></div>
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-300 whitespace-nowrap bg-slate-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                    Your Location
                  </span>
                </div>

                {/* Map Markers for Shops */}
                {filteredShops.map((shop, index) => {
                  // Coordinate offset calculation for visual distribution
                  const xPositions = [35, 62, 50, 28, 70, 42];
                  const yPositions = [28, 35, 65, 70, 75, 42];
                  const left = `${xPositions[index % xPositions.length]}%`;
                  const top = `${yPositions[index % yPositions.length]}%`;
                  const isSelected = activeShop?.id === shop.id;

                  return (
                    <button
                      key={shop.id}
                      onClick={() => setActiveShop(shop)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all transform hover:scale-125 z-20 group ${
                        isSelected ? 'scale-125 z-30' : ''
                      }`}
                      style={{ left, top }}
                    >
                      <div className={`p-2 rounded-2xl shadow-xl flex items-center justify-center border-2 transition ${
                        isSelected 
                          ? 'bg-amber-500 border-white text-slate-950 shadow-glow' 
                          : 'bg-brand-600 border-slate-800 text-white hover:bg-brand-500'
                      }`}>
                        <Store className="w-4 h-4" />
                      </div>

                      {/* Floating Marker Label */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-lg backdrop-blur-md pointer-events-none transition ${
                        isSelected 
                          ? 'bg-white text-slate-950 opacity-100' 
                          : 'bg-slate-900/90 text-slate-200 opacity-0 group-hover:opacity-100'
                      }`}>
                        {shop.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 text-xs text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Google Maps Live Explorer</span>
              </div>

              {/* Bottom Active Store Flyout Card */}
              {activeShop && (
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={activeShop.imageUrl} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{activeShop.name}</h4>
                        {activeShop.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activeShop.address}, {activeShop.city}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" /> {activeShop.rating}
                        </span>
                        <span>•</span>
                        <span>{activeShop.openingHours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${activeShop.latitude},${activeShop.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>

                    <a
                      href={`tel:${activeShop.phone}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

