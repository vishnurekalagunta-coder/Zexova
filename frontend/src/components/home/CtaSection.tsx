import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tag, Sparkles } from 'lucide-react';
import {
  viewport, slideLeft, slideRight, scaleUp, staggerContainer,
} from '../../hooks/useAnimations';

export const CtaSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 overflow-hidden transition-colors">
      
      {/* Background Subtle Gradient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] via-zinc-100/50 to-[#f5f5f7] dark:from-[#09090b] dark:via-zinc-950/80 dark:to-[#09090b] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/[0.04] rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main CTA Container Box with Matte Finish */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200/80 dark:border-white/[0.08] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.7)]"
        >
          {/* Subtle Corner Glow Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-200/50 dark:bg-white/[0.03] rounded-full blur-[90px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>START YOUR JOURNEY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white leading-[1.1]">
                Your Next Great Find{' '}
                <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  Starts Here.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                Buy smarter, sell better, and discover more with ZEXOVA. Whether you are looking for brand-new technology, pre-owned gems, or local store walk-ins.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/new-products"
                  className="px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <span>Start Exploring</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/sell"
                  className="px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-zinc-100 text-black border border-zinc-300 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Sell Your Product</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Product Collage Visual */}
            <motion.div
              variants={slideRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                
                {/* Collage Item 1: MacBook Pro */}
                <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 aspect-square group shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
                    alt="MacBook Pro"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-95"
                    loading="lazy"
                  />
                </div>

                {/* Collage Item 2: Headphones */}
                <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 aspect-square group shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                    alt="Audiophile Headphones"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-95"
                    loading="lazy"
                  />
                </div>

                {/* Collage Item 3: Smartwatch */}
                <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 aspect-square group shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                    alt="Premium Smartwatch"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-95"
                    loading="lazy"
                  />
                </div>

                {/* Collage Item 4: Camera / Lens */}
                <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 aspect-square group shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
                    alt="Camera Gear"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-95"
                    loading="lazy"
                  />
                </div>

              </div>
            </motion.div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default CtaSection;

