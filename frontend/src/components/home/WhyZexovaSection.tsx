import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, ShoppingBag, Calculator, MapPin, ArrowRight } from 'lucide-react';
import {
  viewport, staggerContainer, headerContainer, headerBadge,
  headerTitle, headerSubtitle, cardItem,
} from '../../hooks/useAnimations';

interface FeatureCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  link: string;
  ctaText: string;
  icon: React.ElementType;
}

const FEATURES: FeatureCard[] = [
  {
    id: 'used-market',
    badge: 'Pre-Owned Deals',
    title: 'Used Products Marketplace',
    description: 'Discover inspected second-hand gadgets, smartphones, and gear with transparent condition disclosures.',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80',
    link: '/used-products',
    ctaText: 'Explore Pre-Owned',
    icon: Tag
  },
  {
    id: 'new-retail',
    badge: 'Authorized Stores',
    title: 'New Products Shopping',
    description: 'Factory-sealed electronics, flagship laptops, and accessories sourced directly from accredited retail shops.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    link: '/new-products',
    ctaText: 'Browse Brand New',
    icon: ShoppingBag
  },
  {
    id: 'price-engine',
    badge: 'Instant Valuation',
    title: 'Smart Price Estimator',
    description: 'Input brand, model, purchase year, and wear level to calculate fair market resale values before buying or selling.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    link: '/estimator',
    ctaText: 'Estimate Value',
    icon: Calculator
  },
  {
    id: 'store-finder',
    badge: 'Local Discovery',
    title: 'Nearby Store Finder',
    description: 'Locate local retail storefronts in your area on Google Maps with real-time distance and in-person walk-ins.',
    image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=800&q=80',
    link: '/nearby-stores',
    ctaText: 'Find Stores Nearby',
    icon: MapPin
  }
];

export const WhyZexovaSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={headerBadge} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-[#18181b] border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>WHY ZEXOVA</span>
          </motion.div>

          <motion.h2 variants={headerTitle} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Everything You Need.{' '}
            <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              All in One Place.
            </span>
          </motion.h2>

          <motion.p variants={headerSubtitle} className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
            ZEXOVA is more than an online shopping platform. Discover new products, give used products a second life, estimate product values, and explore nearby stores — all in one destination.
          </motion.p>
        </motion.div>

        {/* Four Feature Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                variants={cardItem}
                className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-300 overflow-hidden shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]"
              >
                <div>
                  {/* Card Visual Header with Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100/60 dark:bg-[#18181b] border-b border-zinc-200/80 dark:border-white/[0.08]">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white tracking-wider uppercase">
                      <Icon className="w-3 h-3 text-sky-400" />
                      <span>{feat.badge}</span>
                    </div>
                  </div>

                  {/* Card Text Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-lg group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0">
                  <Link
                    to={feat.link}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-[#18181b] dark:hover:bg-[#202024] border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition group/btn"
                  >
                    <span>{feat.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:translate-x-1 group-hover/btn:text-black dark:group-hover/btn:text-white transition-all" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyZexovaSection;

