import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  Truck, 
  FileText,
  Sparkles
} from 'lucide-react';
import { viewport, slideLeft, slideRight } from '../../hooks/useAnimations';

export const NewProductsSection: React.FC = () => {
  const highlights = [
    'Factory-sealed brand-new devices directly from registered partner shops',
    'Official brand warranty & verified GST tax invoice with every order',
    'Insured express doorstep delivery with end-to-end package tracking',
    'Curated collection of flagship smartphones, OLED monitors & gaming rigs'
  ];

  return (
    <section className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Premium Image (Alternating Layout) */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 order-2 lg:order-1 relative"
          >
            <div className="relative group rounded-3xl overflow-hidden bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 transition-all duration-500 shadow-xl">
              
              {/* Electronics Store Image */}
              <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-zinc-100 dark:bg-black">
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern electronics retail store with laptops, smartphones, smartwatches, and accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                  loading="lazy"
                />
              </div>

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

              {/* Overlay Top Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-zinc-200 dark:border-white/15 text-xs text-black dark:text-white shadow-sm">
                <Store className="w-4 h-4 text-sky-500" />
                <span className="font-bold">Registered Retail Network</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-white/15 grid grid-cols-2 gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-black dark:text-white">
                    <FileText className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-black dark:text-white">Official Warranty</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">100% Genuine Box Packs</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-black dark:text-white">
                    <Truck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-black dark:text-white">Safe Express Shipping</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Doorstep Insured Transit</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT: Information & Call to Action (Alternating Layout) */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 order-1 lg:order-2 space-y-6"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase">
              <ShoppingBag className="w-3.5 h-3.5 text-sky-500" />
              <span>NEW PRODUCTS SHOPPING</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white leading-tight">
              Discover What's New.{' '}
              <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                Shop What You Love.
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Explore the latest technology, electronics, gadgets, and lifestyle products from registered shops. Discover quality products and enjoy a convenient shopping experience.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-black dark:text-white flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">{item}</span>
                </div>
              ))}
            </div>

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/new-products"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Explore New Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/new-products"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-zinc-100 text-black border border-zinc-300 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Browse Categories</span>
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default NewProductsSection;

