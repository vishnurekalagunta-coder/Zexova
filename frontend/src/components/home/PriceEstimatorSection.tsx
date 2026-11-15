import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  TrendingDown, 
  BarChart3, 
  HelpCircle,
  Sliders
} from 'lucide-react';
import { viewport, slideLeft, slideRight } from '../../hooks/useAnimations';

export const PriceEstimatorSection: React.FC = () => {
  const steps = [
    'Select device category, brand, and exact model specifications',
    'Specify purchase year and original retail purchase invoice value',
    'Report physical condition accurately (screen, battery, functional state)',
    'Receive real-time market benchmark range backed by live depreciation rules'
  ];

  return (
    <section className="relative py-20 bg-[#f5f5f7] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Information & Guidance */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 space-y-6"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase">
              <Calculator className="w-3.5 h-3.5 text-amber-500" />
              <span>SMART PRICE ESTIMATOR</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white leading-tight">
              Know Your Product's Worth{' '}
              <span className="bg-gradient-to-r from-black via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                Before You Sell.
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Not sure how much your used product is worth? Enter its brand, model, purchase year, original price, and condition to get an estimated market value.
            </p>

            {/* Steps & Guidance */}
            <div className="space-y-3 pt-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-black dark:text-white flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">{step}</span>
                </div>
              ))}
            </div>

            {/* Transparent Disclaimer Notice */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <strong className="text-zinc-950 dark:text-zinc-200 font-bold">Market Valuation Notice: </strong>
                The calculated figures are data-backed guidance estimates based on depreciation models, not a guaranteed cash-out or mandatory transaction price. Final selling price depends on mutual agreement between buyer and seller.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/estimator"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Estimate Product Price</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-zinc-100 text-black border border-zinc-300 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Learn How It Works</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT: Modern Price Analytics Dashboard Illustration */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-6 relative"
          >
            <div className="relative group rounded-3xl overflow-hidden bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 transition-all duration-500 p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Top Dashboard Mockup Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono ml-2">market-estimator-engine.v2</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-300">
                  Live Preview
                </span>
              </div>

              {/* Sample Product Under Estimation */}
              <div className="p-4 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/15 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80"
                      alt="MacBook Pro"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black dark:text-white">Apple MacBook Pro 16" M3 Max</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Purchased 2024 • Condition: Like-New (Original ₹2,89,900)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-zinc-500">Depreciation</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                    <TrendingDown className="w-3 h-3" />
                    <span>-14.8%</span>
                  </div>
                </div>
              </div>

              {/* Valuation Result Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 space-y-1 shadow-sm">
                  <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Estimated Market Value</div>
                  <div className="text-2xl sm:text-3xl font-black text-black dark:text-white">₹2,47,000</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">High liquidity category</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-white/10 space-y-1 shadow-sm">
                  <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Suggested Price Range</div>
                  <div className="text-lg sm:text-xl font-black text-black dark:text-zinc-200 mt-1">₹2.38L – ₹2.52L</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Fair value window</div>
                </div>
              </div>

              {/* Simulated Price Curve Bar Visual */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span className="font-semibold">Resale Curve Trajectory</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Age: 1.2 Years</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-white/10 overflow-hidden flex">
                  <div className="h-full bg-black dark:bg-white w-[85%] rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 pt-1 font-mono">
                  <span>Year 0 (100%)</span>
                  <span>Year 1 (85%)</span>
                  <span>Year 2 (70%)</span>
                  <span>Year 3 (55%)</span>
                </div>
              </div>

              {/* Bottom Quick Action inside mockup */}
              <div className="pt-2">
                <Link
                  to="/estimator"
                  className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-white dark:text-black" />
                  <span>Run Custom Valuation on Your Device</span>
                </Link>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default PriceEstimatorSection;

