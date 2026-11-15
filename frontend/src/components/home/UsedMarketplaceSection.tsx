import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  Smartphone,
  Laptop,
  Watch,
  Bike
} from 'lucide-react';
import { viewport, slideLeft, slideRight } from '../../hooks/useAnimations';

export const UsedMarketplaceSection: React.FC = () => {
  const highlights = [
    'Mobiles, laptops, audiophile headphones, cameras & bikes',
    'Standardized transparent condition grading (Like-New to Fair)',
    'Direct seller chats & instant price negotiation',
    'Turn pre-owned devices into real financial value'
  ];

  const categoryTags = [
    { name: 'Smartphones', icon: Smartphone },
    { name: 'Laptops', icon: Laptop },
    { name: 'Watches', icon: Watch },
    { name: 'Motorcycles', icon: Bike },
  ];

  return (
    <section className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Information & Call to Action */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 space-y-6"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>USED PRODUCTS MARKETPLACE</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white leading-tight">
              Give Pre-Owned Products a{' '}
              <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                New Beginning.
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Discover amazing deals on pre-owned products or turn your unused items into valuable opportunities. Buy and sell mobiles, laptops, watches, bikes, home appliances, and more.
            </p>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {categoryTags.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div
                    key={cat.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-800 dark:text-zinc-300"
                  >
                    <CatIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>{cat.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-black dark:text-white flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">{item}</span>
                </div>
              ))}
            </div>

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/used-products"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Browse Used Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/sell"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-zinc-100 text-black border border-zinc-300 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Sell Your Product</span>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Large Premium Image & Interactive Preview Cards */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 relative"
          >
            <div className="relative group rounded-3xl overflow-hidden bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 transition-all duration-500 shadow-xl">
              
              {/* Main Realistic Marketplace Visual */}
              <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-zinc-100 dark:bg-black">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85"
                  alt="Realistic collection of pre-owned tech, smartphones, laptops and accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                  loading="lazy"
                />
              </div>

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

              {/* Overlay Top Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-zinc-200 dark:border-white/15 text-xs text-black dark:text-white shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">Condition Inspected</span>
              </div>

              {/* Floating Live Card Overlay at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-white/15 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Trending Exchange</div>
                  <div className="text-sm font-black text-black dark:text-white mt-0.5">Apple MacBook Pro 14" M2 &amp; iPhone 14 Pro</div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Up to 40% Off</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default UsedMarketplaceSection;

