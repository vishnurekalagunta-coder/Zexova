import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { InteractiveShowcaseSection } from '../components/InteractiveShowcaseSection';
import { WhyZexovaSection } from '../components/home/WhyZexovaSection';
import { UsedMarketplaceSection } from '../components/home/UsedMarketplaceSection';
import { NewProductsSection } from '../components/home/NewProductsSection';
import { PriceEstimatorSection } from '../components/home/PriceEstimatorSection';
import { NearbyStoreSection } from '../components/home/NearbyStoreSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { WhyChooseSection } from '../components/home/WhyChooseSection';
import { CtaSection } from '../components/home/CtaSection';
import { BestProducts } from '../components/BestProducts';
import { UsedProductCard } from '../components/UsedProductCard';
import { NewProductCard } from '../components/NewProductCard';
import { StoreCard } from '../components/StoreCard';
import { apiService } from '../services/api';
import { UsedProductListing, NewProduct, Shop } from '../types';
import {
  viewport, staggerContainer, fadeUp, cardItem,
  headerContainer, headerTitle, headerSubtitle,
} from '../hooks/useAnimations';

export const Home: React.FC = () => {
  const [usedProducts, setUsedProducts] = useState<UsedProductListing[]>([]);
  const [newProducts, setNewProducts] = useState<NewProduct[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [used, newly, storeList] = await Promise.all([
        apiService.getUsedProducts(),
        apiService.getNewProducts(),
        apiService.getNearbyShops()
      ]);
      setUsedProducts(used);
      setNewProducts(newly);
      setShops(storeList.slice(0, 3));
    };
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 min-h-screen transition-colors">
      
      {/* 0. CINEMATIC MACBOOK HERO SECTION (Preserved Intact) */}
      <HeroSection />

      {/* 0.5 INTERACTIVE SHOWCASE SECTION (Editorial 01-03 with Particle Network Canvas) */}
      <InteractiveShowcaseSection />

      {/* 1. WHY ZEXOVA SECTION - "Everything You Need. All in One Place." */}
      <WhyZexovaSection />

      {/* 2. CURATED PRODUCT GALLERY (BEST PRODUCTS) */}
      <BestProducts />

      {/* 3. USED PRODUCTS MARKETPLACE - "Give Pre-Owned Products a New Beginning." */}
      <UsedMarketplaceSection />

      {/* 3B. LIVE PRE-OWNED FEATURED GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-white/10"
        >
          <div>
            <motion.div variants={fadeUp} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
                Trending Pre-Owned Tech
              </h3>
            </motion.div>
            <motion.p variants={fadeUp} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Inspected second-hand devices backed by transparent condition grading
            </motion.p>
          </div>
          <Link
            to="/used-products"
            className="text-xs sm:text-sm font-semibold text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 group"
          >
            <span>View All ({usedProducts.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {usedProducts.slice(0, 4).map((product) => (
            <motion.div key={product.id} variants={cardItem}>
              <UsedProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. NEW PRODUCTS SHOPPING - "Discover What's New. Shop What You Love." */}
      <NewProductsSection />

      {/* 4B. LIVE NEW STORE DIRECT PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-white/10"
        >
          <div>
            <motion.div variants={fadeUp} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
                Direct from Registered Shops
              </h3>
            </motion.div>
            <motion.p variants={fadeUp} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Factory-sealed items with official brand warranty &amp; GST tax invoice
            </motion.p>
          </div>
          <Link
            to="/new-products"
            className="text-xs sm:text-sm font-semibold text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 group"
          >
            <span>View All ({newProducts.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newProducts.slice(0, 3).map((product) => (
            <motion.div key={product.id} variants={cardItem}>
              <NewProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. SMART PRICE ESTIMATOR - "Know Your Product's Worth Before You Sell." */}
      <PriceEstimatorSection />

      {/* 6. NEARBY STORE FINDER - "Your Favourite Stores, Closer Than Ever." */}
      <NearbyStoreSection />

      {/* 6B. LIVE REGISTERED PARTNER STORE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-white/10"
        >
          <div>
            <motion.div variants={fadeUp} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
                Accredited Storefronts
              </h3>
            </motion.div>
            <motion.p variants={fadeUp} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Visit local retail partners in your city for walk-in demos &amp; instant pickups
            </motion.p>
          </div>
          <Link
            to="/nearby-stores"
            className="text-xs sm:text-sm font-semibold text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 group"
          >
            <span>Open Maps Directory</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {shops.map((shop) => (
            <motion.div key={shop.id} variants={cardItem}>
              <StoreCard shop={shop} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7. HOW ZEXOVA WORKS - 4 Clean Steps (Discover, Compare, Choose, Connect) */}
      <HowItWorksSection />

      {/* 8. WHY CHOOSE ZEXOVA - 4 Benefits */}
      <WhyChooseSection />

      {/* 9. FINAL CALL-TO-ACTION SECTION - "Your Next Great Find Starts Here." */}
      <CtaSection />

    </div>
  );
};

export default Home;
