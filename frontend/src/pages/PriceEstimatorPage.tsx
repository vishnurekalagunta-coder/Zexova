import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  RotateCcw, 
  History, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle,
  PlusCircle,
  Tag,
  ExternalLink,
  ShoppingBag,
  Zap,
  RefreshCw
} from 'lucide-react';
import { CATEGORIES } from '../services/mockData';
import { apiService } from '../services/api';
import { PriceEstimationRequest, PriceEstimationResult, ProductCondition, MarketReference } from '../types';
import { useCart } from '../context/CartContext';

export const PriceEstimatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useCart();

  // Wizard Step State (1 to 8, then 9 = Results)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Inputs - no hardcoded default brand or model
  const [category, setCategory] = useState(searchParams.get('category') || 'Smartphones');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [model, setModel] = useState(searchParams.get('model') || '');
  const [originalPrice, setOriginalPrice] = useState<number>(
    searchParams.get('mrp') ? Number(searchParams.get('mrp')) : 0
  );
  const [purchaseYear, setPurchaseYear] = useState<number>(2024);
  const [ageMonths, setAgeMonths] = useState<number>(12);
  const [condition, setCondition] = useState<ProductCondition>('EXCELLENT');
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [hasOriginalAccessories, setHasOriginalAccessories] = useState<boolean>(true);
  const [hasOriginalBox, setHasOriginalBox] = useState<boolean>(true);

  // Live Market Reference
  const [marketRef, setMarketRef] = useState<MarketReference | null>(null);
  const [marketRefLoading, setMarketRefLoading] = useState(false);

  // Results State
  const [result, setResult] = useState<PriceEstimationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PriceEstimationResult[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Dynamically fetch live retail market reference whenever the user enters the product name
  useEffect(() => {
    let active = true;
    const query = model.trim();
    if (query.length >= 2) {
      setMarketRefLoading(true);
      const timer = setTimeout(() => {
        apiService.getMarketReference(category, brand, query)
          .then((ref) => {
            if (active && ref && ref.lowestRetailPrice) {
              setMarketRef(ref);
              // Automatically apply the official original MRP to originalPrice
              if (ref.mrp && ref.mrp > 0) {
                setOriginalPrice(ref.mrp);
              } else if (ref.lowestRetailPrice && (!originalPrice || originalPrice === 0)) {
                setOriginalPrice(ref.lowestRetailPrice);
              }
              // Auto-fill brand if detected from the product
              if (ref.brand && (!brand || brand.trim() === '')) {
                setBrand(ref.brand);
              }
              // Auto-fill category if detected
              if (ref.category && (!category || category === 'Smartphones')) {
                setCategory(ref.category);
              }
            }
          })
          .catch((err) => console.warn('Could not fetch market reference', err))
          .finally(() => {
            if (active) setMarketRefLoading(false);
          });
      }, 250);
      return () => { active = false; clearTimeout(timer); };
    } else {
      setMarketRef(null);
    }
    return () => { active = false; };
  }, [model, brand, category]);

  const handleEstimate = async () => {
    if (!model.trim()) {
      showToast('Please enter the product name');
      setCurrentStep(2);
      return;
    }
    setLoading(true);
    const request: PriceEstimationRequest = {
      category: category || 'Electronics',
      brand: brand || 'Brand',
      model,
      originalPurchasePrice: originalPrice > 0 ? originalPrice : (marketRef?.mrp || marketRef?.lowestRetailPrice || 50000),
      purchaseYear,
      ageMonths,
      condition,
      hasWarranty,
      hasOriginalAccessories,
      hasOriginalBox,
      currentMarketPrice: marketRef?.lowestRetailPrice
    };

    const res = await apiService.estimatePrice(request);
    setResult(res);
    setLoading(false);
    setCurrentStep(9); // Show Results Screen
    showToast('AI Valuation Computed Successfully!');
  };

  const handleListProduct = () => {
    navigate('/sell?fromEstimator=true');
  };

  const openHistory = async () => {
    const list = await apiService.getEstimationHistory();
    setHistory(list);
    setShowHistoryModal(true);
  };

  const conditionOptions: { grade: ProductCondition; label: string; desc: string; iconBg: string }[] = [
    { grade: 'LIKE_NEW', label: 'Like New', desc: 'Flawless cosmetic state, zero scratches, pristine battery.', iconBg: 'bg-emerald-500/10 text-emerald-600' },
    { grade: 'EXCELLENT', label: 'Excellent', desc: 'Minimal hairline marks, 100% operational hardware & display.', iconBg: 'bg-blue-500/10 text-blue-600' },
    { grade: 'GOOD', label: 'Good', desc: 'Normal moderate cosmetic wear, fully functional ports & buttons.', iconBg: 'bg-amber-500/10 text-amber-600' },
    { grade: 'FAIR', label: 'Fair', desc: 'Visible scratches or body scuffs, working battery and electronics.', iconBg: 'bg-orange-500/10 text-orange-600' },
    { grade: 'POOR', label: 'Poor', desc: 'Heavy aesthetic blemishes or degraded battery requiring servicing.', iconBg: 'bg-rose-500/10 text-rose-600' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Intelligent Resale Valuation Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Know What Your Product Is Really Worth.
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Get an estimated market value for your product using its age, condition, brand, model and market demand.
        </p>

        <div className="pt-2">
          <button
            onClick={openHistory}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <History className="w-3.5 h-3.5" />
            <span>View Recent Valuations</span>
          </button>
        </div>
      </div>

      {/* RESULT SCREEN */}
      {currentStep === 9 && result ? (
        <div className="bg-white dark:bg-black rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 gap-4">
            <div>
              <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {result.category} • {result.brand}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {result.model} Valuation Summary
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Demand:</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                result.marketDemand === 'HIGH' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                result.marketDemand === 'MODERATE' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                'bg-slate-100 text-slate-600'
              }`}>
                {result.marketDemand} LIQUIDITY
              </span>
            </div>
          </div>

          {/* DUAL MARKET INTELLIGENCE: RETAIL NEW BENCHMARK VS PRE-OWNED VALUATION */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Live Retail Market Reference (Brand New)
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Verified current brand-new retail prices on Amazon India &amp; Flipkart
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-[10px] font-mono text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                {result.retailDataSource || marketRef?.dataSource || 'LIVE FEED'}
              </span>
            </div>

            {/* 3 Benchmarks: Amazon, Flipkart, Lowest Retail */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="p-4 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">Amazon India (New)</span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  ₹{(result.currentAmazonPrice || marketRef?.amazonPrice || (result.originalPrice * 0.92)).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400">Current online retail offer</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">Flipkart (New)</span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  ₹{(result.currentFlipkartPrice || marketRef?.flipkartPrice || (result.originalPrice * 0.90)).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400">Current online retail offer</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 block uppercase">
                  Lowest New Retail Price
                </span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{(result.lowestRetailPrice || marketRef?.lowestRetailPrice || (result.originalPrice * 0.90)).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                  Reference benchmark for depreciation
                </span>
              </div>

            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 flex items-start gap-1.5">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Distinction:</strong> Brand new products sell at retail benchmark prices shown above. The valuation below calculates your device's circular pre-owned resale price based on {result.depreciationPercentage}% computed depreciation from usage.
              </span>
            </div>

          </div>

          {/* Pricing Highlight Metrics: PRE-OWNED RESALE */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Estimated Pre-Owned Resale Valuation (Your Device)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-center space-y-1">
              <span className="text-xs text-brand-700 dark:text-brand-300 font-bold uppercase tracking-wider">Recommended Price</span>
              <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400">
                ₹{result.recommendedSellingPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500">Optimal balance of speed &amp; profit</span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-1">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">Quick-Sale Price</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                ₹{result.quickSalePrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500">Sell within 24-48 hours</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-center space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Range</span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200">
                ₹{result.estimatedMinPrice.toLocaleString('en-IN')} – ₹{result.estimatedMaxPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Market spread boundaries</span>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-1">
              <span className="text-xs text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wider">Estimated Depreciation</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                {result.depreciationPercentage}%
              </div>
              <span className="text-[10px] text-slate-500">From ₹{result.originalPrice.toLocaleString('en-IN')} MRP</span>
            </div>

          </div>
          </div>

          {/* Condition Analysis & Explanation */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">Physical Condition Assessment:</strong>
              <p>{result.conditionAnalysis}</p>
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">Pricing Breakdown Logic:</strong>
              <p>{result.pricingExplanation}</p>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-start gap-2.5 text-[11px] text-slate-500">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              Disclaimer: The estimates presented here are generated using configurable depreciation curves, brand liquidity multipliers, and circular economy historical data. They serve as guidance and are not guaranteed selling commitments.
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Estimate Another Product</span>
            </button>

            <button
              onClick={handleListProduct}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List My Product for Sale (Autofill)</span>
            </button>
          </div>

        </div>
      ) : (
        /* WIZARD FORM */
        <div className="bg-white dark:bg-black rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-8">
          
          {/* Stepper Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Step {currentStep} of 8</span>
              <span className="text-brand-600 dark:text-brand-400">{Math.round((currentStep / 8) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-black overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-600 to-amber-500 transition-all duration-300"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: CATEGORY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 1: Select Product Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                      category === cat.name
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold shadow-md'
                        : 'border-slate-200 dark:border-white/10 hover:border-brand-400 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-black">
                      <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PRODUCT NAME & BRAND */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Step 2: Enter Product Name
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Type the exact name or model of your product. We will automatically retrieve its original launch MRP and live pricing from Amazon India &amp; Flipkart.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Product Name / Model *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Type product name (e.g., iPhone 15, Samsung Galaxy S24, Sony WH-1000XM5, MacBook Air M3)..."
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black dark:focus:border-white shadow-sm"
                    />
                    {marketRefLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline text-[11px]">Searching Amazon &amp; Flipkart...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Brand Name (Auto-detected or enter manually)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apple, Samsung, Sony, OnePlus, Dell, HP..."
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Live Marketplace Retail Reference Card with Original MRP, Amazon & Flipkart */}
                {marketRef && marketRef.lowestRetailPrice && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Live Marketplace Pricing Retrieved</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-mono text-amber-800 dark:text-amber-300">
                        {marketRef.dataSource}
                      </span>
                    </div>

                    {marketRef.matchedTitle && (
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2.5 py-1 border-b border-amber-500/20">
                        {marketRef.imageUrl && (
                          <img src={marketRef.imageUrl} alt="" className="w-9 h-9 rounded-lg object-contain bg-white dark:bg-black p-0.5 border border-amber-500/20 flex-shrink-0" />
                        )}
                        <span className="line-clamp-1">{marketRef.matchedTitle}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {/* Original MRP Card */}
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-emerald-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Original MRP</span>
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          ₹{marketRef.mrp ? marketRef.mrp.toLocaleString('en-IN') : 'N/A'}
                        </div>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">
                          Auto-filled in Step 3 ✓
                        </span>
                      </div>

                      {/* Amazon Price */}
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-amber-500/20 space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">Amazon IN</span>
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          ₹{marketRef.amazonPrice ? marketRef.amazonPrice.toLocaleString('en-IN') : 'N/A'}
                        </div>
                        <span className="text-[9px] text-slate-400 block">Current new price</span>
                      </div>

                      {/* Flipkart Price */}
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-amber-500/20 space-y-0.5">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">Flipkart</span>
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          ₹{marketRef.flipkartPrice ? marketRef.flipkartPrice.toLocaleString('en-IN') : 'N/A'}
                        </div>
                        <span className="text-[9px] text-slate-400 block">Current new price</span>
                      </div>

                      {/* Lowest Retail Price */}
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">Lowest Retail</span>
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          ₹{marketRef.lowestRetailPrice ? marketRef.lowestRetailPrice.toLocaleString('en-IN') : 'N/A'}
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold block">on {marketRef.retailSource}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      {marketRef.statusMessage}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* STEP 3: ORIGINAL PURCHASE PRICE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 3: Original Purchase Price
              </h3>
              <p className="text-xs text-slate-500">
                We have automatically retrieved the official original MRP for <strong className="text-slate-900 dark:text-white">{model || 'your product'}</strong> from marketplace records. You can adjust this if your purchase invoice had a different amount.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Original Invoice Price / MRP (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  max="1000000"
                  step="100"
                  value={originalPrice > 0 ? originalPrice : ''}
                  placeholder="Enter original price..."
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 text-lg font-black rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-brand-600 dark:text-brand-400 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {marketRef?.mrp && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Official Catalog MRP: <strong>₹{marketRef.mrp.toLocaleString('en-IN')}</strong> (Auto-populated)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOriginalPrice(marketRef.mrp || 0)}
                    className="font-bold underline text-[11px] hover:text-emerald-900 dark:hover:text-white"
                  >
                    Reset to MRP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: AGE & YEAR */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 4: Purchase Year &amp; Product Age
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Purchase Year
                  </label>
                  <select
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Approximate Age: {ageMonths} Months
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(Number(e.target.value))}
                    className="w-full accent-brand-600 mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PHYSICAL CONDITION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 5: Select Physical Condition
              </h3>
              <div className="space-y-3">
                {conditionOptions.map((opt) => (
                  <button
                    key={opt.grade}
                    type="button"
                    onClick={() => setCondition(opt.grade)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      condition === opt.grade
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 shadow-md'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                    {condition === opt.grade && (
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: WARRANTY STATUS */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 6: Warranty Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setHasWarranty(true)}
                  className={`p-6 rounded-2xl border text-center transition ${
                    hasWarranty
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <div className="text-sm">Under Active Warranty</div>
                </button>

                <button
                  type="button"
                  onClick={() => setHasWarranty(false)}
                  className={`p-6 rounded-2xl border text-center transition ${
                    !hasWarranty
                      ? 'border-slate-600 bg-slate-100 dark:bg-black text-slate-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Info className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <div className="text-sm">Warranty Expired</div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: ACCESSORIES AVAILABILITY */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 7: Original Accessories &amp; Box
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOriginalBox}
                    onChange={(e) => setHasOriginalBox(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Original Retail Packaging Box Available</span>
                    <span className="text-[11px] text-slate-500">Includes matching serial/IMEI box label.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOriginalAccessories}
                    onChange={(e) => setHasOriginalAccessories(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Original Charger &amp; Cable Included</span>
                    <span className="text-[11px] text-slate-500">Genuine branded power brick and charging cable.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 8: FINAL CONFIRMATION */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Step 8: Review &amp; Estimate
              </h3>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                  <span className="text-slate-400">Item:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{brand} {model} ({category})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                  <span className="text-slate-400">Original MRP:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                  <span className="text-slate-400">Condition Grade:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{condition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                  <span className="text-slate-400">Product Age:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{ageMonths} Months ({purchaseYear})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Warranty:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{hasWarranty ? 'Active' : 'Expired'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEstimate}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-brand-600 to-indigo-600 text-white font-black text-sm shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{loading ? 'Evaluating Market Depreciation...' : 'Estimate My Product Price'}</span>
              </button>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          {currentStep < 8 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 disabled:opacity-40"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2 && !model.trim()) {
                    showToast('Please enter your product name or model');
                    return;
                  }
                  setCurrentStep(Math.min(8, currentStep + 1));
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* RECENT ESTIMATIONS MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-black rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Valuation History</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-xs text-slate-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {history.length > 0 ? (
                history.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900 dark:text-white">{h.brand} {h.model}</span>
                      <span className="text-brand-600 dark:text-brand-400">₹{h.recommendedSellingPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{h.category}</span>
                      <span>{new Date(h.estimatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">No valuations recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

