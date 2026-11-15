import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ArrowRight, 
  Navigation, 
  Clock, 
  Star, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  Store
} from 'lucide-react';
import { viewport, slideLeft, slideRight } from '../../hooks/useAnimations';

export const NearbyStoreSection: React.FC = () => {
  const nearbySampleStores = [
    {
      name: 'iWorld Authorized Store',
      category: 'Electronics & Computers',
      distance: '1.2 km away',
      address: '100 Feet Road, Indiranagar',
      rating: 4.9,
      hours: '10:00 AM - 9:00 PM',
      mapsQuery: 'https://maps.google.com/?q=Apple+Store+Indiranagar+Bangalore'
    },
    {
      name: 'Galaxy Hub Exclusive Flagship',
      category: 'Smartphones & Gadgets',
      distance: '2.8 km away',
      address: '27th Main, Sector 1, HSR Layout',
      rating: 4.8,
      hours: '10:30 AM - 9:30 PM',
      mapsQuery: 'https://maps.google.com/?q=Samsung+Store+HSR+Layout+Bangalore'
    },
    {
      name: 'Metro Tech Retail Storefront',
      category: 'Home Appliances & Displays',
      distance: '3.5 km away',
      address: 'Near Forum South Mall, Konanakunte',
      rating: 4.7,
      hours: '10:00 AM - 10:00 PM',
      mapsQuery: 'https://maps.google.com/?q=Electronics+Store+Bangalore'
    }
  ];

  return (
    <section className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Information & Direction */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 space-y-6"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>NEARBY STORE FINDER</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white leading-tight">
              Your Favourite Stores,{' '}
              <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                Closer Than Ever.
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Find nearby registered shops and explore local shopping opportunities. Discover store locations, view available shop information, and get directions using Google Maps.
            </p>

            {/* Highlights List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-black dark:text-white flex-shrink-0 mt-0.5">
                  <Compass className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black dark:text-white">In-Person Product Demos</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Walk into partner storefronts to test cameras, touch laptop keyboards, and demo display panels before purchasing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-black dark:text-white flex-shrink-0 mt-0.5">
                  <Navigation className="w-4 h-4 text-sky-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black dark:text-white">Google Maps GPS Navigation</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Accurate latitude and longitude coordinates with turn-by-turn routing directly from your current location.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-black dark:text-white flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black dark:text-white">Real-Time Operating Hours</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Check opening hours, direct store telephone contact, and store manager details at a glance.</p>
                </div>
              </div>
            </div>

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/nearby-stores"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Find Nearby Stores</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/nearby-stores"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-zinc-100 text-black border border-zinc-300 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Explore Locations</span>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Digital Map Interface & Store Cards Overlay */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
              
              {/* Map Header with Search Input Mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-black text-black dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active GPS: Bengaluru Vicinity</span>
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">3 Registered Stores Nearby</span>
              </div>

              {/* Simulated Map Visual Canvas */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-black">
                {/* Background Map Graphic */}
                <img
                  src="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=1200&q=80"
                  alt="Digital Map Interface with Location Pins"
                  className="w-full h-full object-cover brightness-75 dark:brightness-40"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Radar Pulse Pin Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/40"></span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/20 text-[10px] font-bold text-white">
                    Your Location
                  </span>
                </div>

                {/* Satellite Pin 1 */}
                <div className="absolute top-1/4 left-1/4 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/90 border border-white/20 text-[10px] text-white">
                  <Store className="w-3 h-3 text-sky-400" />
                  <span className="font-semibold">iWorld (1.2 km)</span>
                </div>

                {/* Satellite Pin 2 */}
                <div className="absolute bottom-1/4 right-1/4 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/90 border border-white/20 text-[10px] text-white">
                  <Store className="w-3 h-3 text-amber-400" />
                  <span className="font-semibold">Galaxy Hub (2.8 km)</span>
                </div>
              </div>

              {/* Sample Nearby Store Cards List */}
              <div className="space-y-2.5 pt-1">
                {nearbySampleStores.map((store, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 transition flex items-center justify-between gap-3 group shadow-sm"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-black dark:text-white truncate">{store.name}</h4>
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{store.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate">{store.address}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-emerald-600 dark:text-emerald-400">
                        {store.distance}
                      </span>
                      <a
                        href={store.mapsQuery}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition shadow-sm"
                        title="Open in Google Maps"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default NearbyStoreSection;
