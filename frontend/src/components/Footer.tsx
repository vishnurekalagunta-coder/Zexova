import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, Truck, HeartHandshake, Send, CheckCircle2, Layers } from 'lucide-react';
import { viewport, fadeUp, staggerContainer, cardItem } from '../hooks/useAnimations';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-600 dark:text-zinc-400 pt-16 pb-12 border-t border-zinc-200/80 dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-200 dark:border-white/10"
        >
          <motion.div variants={cardItem} className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-transparent text-black dark:text-white border border-zinc-200 dark:border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-black dark:text-white font-black text-sm">Verified Merchants</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Every retail shop undergoes strict KYC and physical location verification.</p>
            </div>
          </motion.div>

          <motion.div variants={cardItem} className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-transparent text-black dark:text-white border border-zinc-200 dark:border-white/10">
              <RefreshCw className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-black dark:text-white font-black text-sm">AI Valuation Engine</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Accurate data-backed price estimation for confident used buying and selling.</p>
            </div>
          </motion.div>

          <motion.div variants={cardItem} className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-transparent text-black dark:text-white border border-zinc-200 dark:border-white/10">
              <Truck className="w-6 h-6 text-sky-500 dark:text-white" />
            </div>
            <div>
              <h4 className="text-black dark:text-white font-black text-sm">Express Safe Delivery</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Doorstep insured shipping on new items with live GPS tracking.</p>
            </div>
          </motion.div>

          <motion.div variants={cardItem} className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-transparent text-black dark:text-white border border-zinc-200 dark:border-white/10">
              <HeartHandshake className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-black dark:text-white font-black text-sm">Zero Scams Guarantee</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Escrow payment security and local pickup inspections for zero fraud.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-zinc-200 dark:border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/10 p-[1px] border border-zinc-200 dark:border-white/20 flex items-center justify-center text-black dark:text-white">
                <Layers className="w-5 h-5 text-black dark:text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-black dark:text-white tracking-widest uppercase">
                  ZEXOVA
                </span>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  E-Commerce Platform
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              The premium unified commerce ecosystem. Buy authenticated pre-owned tech, shop brand-new products directly from registered retail stores, and discover fair market valuation with AI.
            </p>
            <div className="pt-1 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="text-black dark:text-white font-bold uppercase tracking-wider text-[11px]">Tagline:</span> Buy Smart. Sell Easy. Discover More.
            </div>
          </div>

          {/* Quick Pillars */}
          <div>
            <h4 className="text-black dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Core Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li><Link to="/used-products" className="hover:text-black dark:hover:text-white transition">Used Marketplace</Link></li>
              <li><Link to="/new-products" className="hover:text-black dark:hover:text-white transition">New Retail Store</Link></li>
              <li><Link to="/compare" className="hover:text-black dark:hover:text-white transition font-bold text-amber-500">Compare Prices (Amazon &amp; Flipkart)</Link></li>
              <li><Link to="/estimator" className="hover:text-black dark:hover:text-white transition">AI Price Estimator</Link></li>
              <li><Link to="/nearby-stores" className="hover:text-black dark:hover:text-white transition">Nearby Store Finder</Link></li>
              <li><Link to="/sell" className="hover:text-black dark:hover:text-white transition">Sell Your Product</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-black dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Top Categories</h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li><Link to="/used-products?category=Smartphones" className="hover:text-black dark:hover:text-white transition">Smartphones &amp; iPhones</Link></li>
              <li><Link to="/used-products?category=Laptops" className="hover:text-black dark:hover:text-white transition">Laptops &amp; MacBooks</Link></li>
              <li><Link to="/used-products?category=Gaming+Devices" className="hover:text-black dark:hover:text-white transition">Gaming Consoles (PS5/Xbox)</Link></li>
              <li><Link to="/used-products?category=Headphones" className="hover:text-black dark:hover:text-white transition">Audiophile Headphones</Link></li>
              <li><Link to="/used-products?category=Motorcycles" className="hover:text-black dark:hover:text-white transition">Bikes &amp; Motorcycles</Link></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-black dark:text-white font-bold text-sm uppercase tracking-wider mb-4">Market Alerts</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
              Get notified of instant price drops and newly verified local stores.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you! You are on the early bird list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-300 dark:border-white/15 text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">Zero spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Zexova Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-black dark:hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-black dark:hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-black dark:hover:text-zinc-300 cursor-pointer">Seller Guidelines</span>
            <span className="hover:text-black dark:hover:text-zinc-300 cursor-pointer">Security Audits</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
