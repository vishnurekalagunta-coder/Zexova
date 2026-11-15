import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Filter, ShieldCheck, Flame } from 'lucide-react';
import { ProductCard, BestProductItem } from './ProductCard';
import {
  viewport,
  staggerContainerFast,
  cardItem,
  headerContainer,
  headerBadge,
  headerTitle,
  headerSubtitle,
  fadeUp,
} from '../hooks/useAnimations';

export const BEST_PRODUCTS_DATA: BestProductItem[] = [
  {
    id: 301,
    type: 'NEW',
    title: 'Apple MacBook Pro 16" M3 Max',
    tagline: '16-core CPU, 40-core GPU, 36GB Unified RAM, 1TB SSD',
    category: 'Laptops',
    price: 249900,
    originalPrice: 289900,
    discountPct: 14,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    badge: '3D Flagship',
    shopName: 'iWorld Authorized Store',
    detailUrl: '/new-products/201'
  },
  {
    id: 302,
    type: 'NEW',
    title: 'Apple iPhone 15 Pro Max (256GB Natural Titanium)',
    tagline: 'A17 Pro 3nm Chip, 48MP Periscope Zoom, Action Button',
    category: 'Smartphones',
    price: 148900,
    originalPrice: 159900,
    discountPct: 7,
    rating: 4.9,
    reviewsCount: 284,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending Now',
    shopName: 'iWorld Authorized Store',
    detailUrl: '/used-products/101'
  },
  {
    id: 303,
    type: 'NEW',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray)',
    tagline: 'Galaxy AI, Built-in S-Pen, 200MP Quad Camera, 5000mAh',
    category: 'Smartphones',
    price: 119999,
    originalPrice: 134999,
    discountPct: 11,
    rating: 4.8,
    reviewsCount: 196,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    badge: 'Galaxy AI',
    shopName: 'Galaxy Hub Exclusive Store',
    detailUrl: '/new-products/202'
  },
  {
    id: 304,
    type: 'NEW',
    title: 'Apple Watch Ultra 2 (49mm Titanium GPS + Cellular)',
    tagline: '3000 nits display, S9 SiP, Precision Dual-Frequency GPS',
    category: 'Smartwatches',
    price: 79900,
    originalPrice: 89900,
    discountPct: 11,
    rating: 4.9,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    videoLight: '/video-watch-light.mp4',
    videoDark: '/video-watch-dark.mp4',
    badge: 'Rugged Titanium',
    shopName: 'iWorld Authorized Store',
    detailUrl: '/used-products'
  },
  {
    id: 305,
    type: 'NEW',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    tagline: 'Auto NC Optimizer, 8 microphones, 30-hour battery life',
    category: 'Headphones',
    price: 26990,
    originalPrice: 34990,
    discountPct: 23,
    rating: 4.8,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Audio',
    shopName: 'Metro Electronics Flagship',
    detailUrl: '/used-products/104'
  },
  {
    id: 306,
    type: 'NEW',
    title: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
    tagline: 'Intel Core Ultra 9, NVIDIA RTX 4080 (12GB), 2.5K 240Hz OLED',
    category: 'Laptops',
    price: 219990,
    originalPrice: 249990,
    discountPct: 12,
    rating: 4.8,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    badge: 'Gaming Beast',
    shopName: 'Metro Electronics Flagship',
    detailUrl: '/new-products'
  }
];

export const BestProducts: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filtered = filterCategory === 'All'
    ? BEST_PRODUCTS_DATA
    : BEST_PRODUCTS_DATA.filter(p => p.category === filterCategory);

  return (
    <section className="relative py-16 sm:py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors">
      
      {/* Background Subtle Silver Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-zinc-100/50 dark:bg-white/[0.02] rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-100/50 dark:bg-white/[0.02] rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2 max-w-xl">
            <motion.div variants={headerBadge} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-300 text-xs font-bold uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Technology Selection</span>
            </motion.div>
            
            <motion.h2 variants={headerTitle} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white">
              Explore Our <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">Best Products</span>
            </motion.h2>

            <motion.p variants={headerSubtitle} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              The highest-rated flagship devices, authenticated pre-owned units, and authorized merchant offerings.
            </motion.p>
          </div>

          {/* Filter Pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            {['All', 'Laptops', 'Smartphones', 'Smartwatches', 'Headphones'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-300 transform hover:-translate-y-0.5 active:scale-95 ${
                  filterCategory === cat
                    ? 'bg-black text-white shadow-md shadow-black/10 dark:bg-white dark:text-black dark:shadow-white/15'
                    : 'bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 border border-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 dark:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* 6 Products Grid */}
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={cardItem} layout>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Banner to Explore All */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14 text-center"
        >
          <Link
            to="/new-products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white text-xs sm:text-sm font-bold transition transform hover:-translate-y-0.5 active:scale-95 shadow-sm"
          >
            <span>View Complete Product Catalog ({BEST_PRODUCTS_DATA.length}+ items)</span>
            <ArrowRight className="w-4 h-4 text-black dark:text-white" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default BestProducts;
