import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, GitCompare, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';
import {
  viewport, staggerContainer, headerContainer, headerBadge,
  headerTitle, headerSubtitle, cardItem,
} from '../../hooks/useAnimations';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      description: 'Explore new and pre-owned products across verified departments.',
      icon: Search,
      badge: 'Step 1',
      link: '/used-products'
    },
    {
      num: '02',
      title: 'Compare',
      description: 'Compare products, prices, and conditions with Amazon & Flipkart live feeds.',
      icon: GitCompare,
      badge: 'Step 2',
      link: '/compare'
    },
    {
      num: '03',
      title: 'Choose',
      description: 'Buy brand-new or used products, or sell your unused items easily.',
      icon: ShoppingBag,
      badge: 'Step 3',
      link: '/sell'
    },
    {
      num: '04',
      title: 'Connect',
      description: 'Find nearby shops and get useful product information and directions.',
      icon: MapPin,
      badge: 'Step 4',
      link: '/nearby-stores'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors">
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
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>SEAMLESS WORKFLOW</span>
          </motion.div>

          <motion.h2 variants={headerTitle} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white">
            How ZEXOVA Works
          </motion.h2>

          <motion.p variants={headerSubtitle} className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
            From discovering rare deals to evaluating your pre-owned devices and connecting with local retail storefronts.
          </motion.p>
        </motion.div>

        {/* 4-Step Grid with Connecting Line */}
        <div className="relative">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-[1px] bg-zinc-200 dark:bg-white/10 -translate-y-6 z-0"></div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  variants={cardItem}
                  className="group rounded-3xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 p-7 flex flex-col justify-between transition-all duration-300 relative shadow-sm"
                >
                  <div>
                    {/* Top Step Number & Icon */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-3xl font-black font-mono text-zinc-400 group-hover:text-black dark:text-zinc-600 dark:group-hover:text-white transition-colors">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-black dark:text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Footer Badge */}
                  <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500">
                    <span className="text-[11px] font-mono uppercase tracking-wider">{step.badge}</span>
                    <Link
                      to={step.link}
                      className="inline-flex items-center gap-1 font-bold text-black dark:text-white hover:text-amber-500 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;

