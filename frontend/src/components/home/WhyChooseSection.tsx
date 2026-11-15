import React from 'react';
import { motion } from 'framer-motion';
import { Layers, TrendingUp, Compass, Sparkles } from 'lucide-react';
import {
  viewport, staggerContainer, headerContainer, headerBadge,
  headerTitle, headerSubtitle, cardItem,
} from '../../hooks/useAnimations';

export const WhyChooseSection: React.FC = () => {
  const benefits = [
    {
      title: 'Multiple Shopping Options',
      description: 'Discover both factory-fresh brand new models and authenticated pre-owned equipment seamlessly under one single platform.',
      icon: Layers,
      highlight: 'Unified Catalog'
    },
    {
      title: 'Smarter Selling',
      description: 'Calculate fair market values of your pre-owned devices with our transparent depreciation estimator before listing them for sale.',
      icon: TrendingUp,
      highlight: 'Realistic Valuations'
    },
    {
      title: 'Local Discovery',
      description: 'Locate nearby registered stores in your city on Google Maps for hands-on inspections, walk-in product demos, and quick pickup.',
      icon: Compass,
      highlight: 'GPS Convenience'
    },
    {
      title: 'Easy Experience',
      description: 'Intuitive navigation, clean wireframe aesthetics, zero visual clutter, and direct access to essential buyer and seller tools.',
      icon: Sparkles,
      highlight: 'Modern Interface'
    }
  ];

  return (
    <section className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.div variants={headerBadge} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PLATFORM ADVANTAGES</span>
          </motion.div>

          <motion.h2 variants={headerTitle} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white">
            Why Choose ZEXOVA?
          </motion.h2>

          <motion.p variants={headerSubtitle} className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
            Thoughtfully designed features built around clarity, convenience, and direct trade.
          </motion.p>
        </motion.div>

        {/* 4 Benefits Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={cardItem}
                className="group rounded-3xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 p-7 flex flex-col justify-between transition-all duration-300 shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-black dark:text-white flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block mb-2">
                    {b.highlight}
                  </span>

                  <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500">
                  <span className="text-[10px] font-mono">ZEXOVA Core</span>
                  <span className="text-xs text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">→</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseSection;

