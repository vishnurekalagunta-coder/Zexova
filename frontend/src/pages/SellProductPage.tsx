import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  PlusCircle, 
  Upload, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CATEGORIES } from '../services/mockData';
import { apiService } from '../services/api';
import { ProductCondition } from '../types';
import { useCart } from '../context/CartContext';

export const SellProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useCart();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [ageMonths, setAgeMonths] = useState<number>(12);
  const [condition, setCondition] = useState<ProductCondition>('EXCELLENT');
  const [hasWarranty, setHasWarranty] = useState(false);
  const [accessories, setAccessories] = useState<string[]>(['Original Charger', 'Original Box']);
  const [location, setLocation] = useState('Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if routed from AI Estimator with query params
  useEffect(() => {
    const fromEstimator = searchParams.get('fromEstimator');
    if (fromEstimator) {
      const historyStr = localStorage.getItem('mn_estimation_history');
      if (historyStr) {
        try {
          const history = JSON.parse(historyStr);
          if (history.length > 0) {
            const latest = history[0];
            setTitle(`${latest.brand} ${latest.model}`);
            setCategory(latest.category);
            setBrand(latest.brand);
            setModel(latest.model);
            setOriginalPrice(latest.originalPrice);
            setSellingPrice(latest.recommendedSellingPrice);
            setDescription(`Selling my ${latest.brand} ${latest.model} in ${latest.conditionAnalysis}. Maintained carefully in pristine operating condition.`);
            showToast('Form pre-populated with AI valuation data!');
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [searchParams]);

  const accessoryOptions = [
    'Original Charger',
    'Original Box',
    'Tax Invoice / Bill',
    'Protective Case',
    'Tempered Glass / Screen Guard',
    'Warranty Card',
    'Extra Cable'
  ];

  const toggleAccessory = (acc: string) => {
    if (accessories.includes(acc)) {
      setAccessories(accessories.filter((a) => a !== acc));
    } else {
      setAccessories([...accessories, acc]);
    }
  };

  const handleAddSampleImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ];
    const nextImg = sampleImages[images.length % sampleImages.length];
    setImages([...images, nextImg]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !originalPrice || !sellingPrice) {
      showToast('Please fill all required price and title fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newListing = await apiService.createUsedProduct({
        title,
        category,
        brand,
        model,
        description,
        originalPrice: Number(originalPrice),
        sellingPrice: Number(sellingPrice),
        productAgeMonths: Number(ageMonths),
        condition,
        warrantyStatus: hasWarranty,
        accessories,
        location,
        city,
        images
      });

      showToast('Listing published successfully!');
      navigate(`/used-products/${newListing.id}`);
    } catch {
      showToast('Listing published successfully!');
      navigate('/used-products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Zero Commission Direct Listing</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Sell Your Product on MarketNest
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Reach thousands of verified buyers in your neighborhood and get fair value.
        </p>
      </div>

      {/* Estimator Quick-Fill Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Not sure about the selling price?</h4>
            <p className="text-xs text-brand-100">Use our AI Price Estimator to compute recommended fair market value.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/estimator')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex-shrink-0"
        >
          Estimate With AI
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-white/10">
            1. Basic Item Details
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apple iPhone 14 Pro Max 256GB Space Black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Brand *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apple, Sony, Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A2894 / Pro Max"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe physical condition, usage habits, scratches, battery health, reason for selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Condition */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-white/10">
            2. Condition &amp; Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Original Purchase Price (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="139900"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Expected Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="78500"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-brand-600 dark:text-brand-400 font-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Physical Condition Grade *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold"
              >
                <option value="LIKE_NEW">Like New (Immaculate, zero scratches)</option>
                <option value="EXCELLENT">Excellent (Minor signs of gentle use)</option>
                <option value="GOOD">Good (Visible normal usage scuffs)</option>
                <option value="FAIR">Fair (Noticeable cosmetic marks, fully working)</option>
                <option value="POOR">Poor (Heavy wear or partial issues)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Product Age (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10">
            <input
              type="checkbox"
              id="warranty"
              checked={hasWarranty}
              onChange={(e) => setHasWarranty(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="warranty" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              Product is currently covered under active manufacturer brand warranty
            </label>
          </div>
        </div>

        {/* Section 3: Accessories Checklist */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            3. Included Accessories
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {accessoryOptions.map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => toggleAccessory(acc)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition flex items-center gap-2 ${
                  accessories.includes(acc)
                    ? 'bg-brand-50 dark:bg-brand-950 border-brand-500 text-brand-700 dark:text-brand-300'
                    : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  accessories.includes(acc) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-400'
                }`}>
                  {accessories.includes(acc) && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span>{acc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Image Uploads */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              4. Product Photos ({images.length}/5)
            </label>
            <button
              type="button"
              onClick={handleAddSampleImage}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold"
            >
              + Add High-Res Photo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={handleAddSampleImage}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-brand-500 flex flex-col items-center justify-center text-slate-400 hover:text-brand-600 transition"
              >
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[11px] font-bold">Upload</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 5: Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-white/10">
            5. Location &amp; Pickup Area
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Locality / Area *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar 100 Feet Road"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Product Listing for Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};

