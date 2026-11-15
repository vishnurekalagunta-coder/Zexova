import axios from 'axios';
import { 
  AuthResponse, 
  UsedProductListing, 
  NewProduct, 
  Shop, 
  PriceEstimationRequest, 
  PriceEstimationResult, 
  Order, 
  User, 
  Notification, 
  ProductReport,
  SellerInquiry,
  ProductComparisonItem,
  MarketReference,
  MarketplaceOffer 
} from '../types';
import { CATEGORIES, MOCK_USED_PRODUCTS, MOCK_NEW_PRODUCTS, MOCK_SHOPS, MOCK_REVIEWS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('marketnest_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let backendOfflineDetected = false;
let lastOfflineCheck = 0;

const isBackendPresumedOffline = (): boolean => {
  if (!backendOfflineDetected) return false;
  // If we checked within the last 30 seconds, reuse cached offline state
  if (Date.now() - lastOfflineCheck < 30000) {
    return true;
  }
  return false;
};

const markBackendOffline = () => {
  backendOfflineDetected = true;
  lastOfflineCheck = Date.now();
};

const markBackendOnline = () => {
  backendOfflineDetected = false;
};

apiClient.interceptors.response.use(
  (response) => {
    // If backend proxy returned offline placeholder, reject so service falls back seamlessly to mock data
    if (response.data && (response.data.offline === true || response.data.status === 500)) {
      markBackendOffline();
      return Promise.reject(new Error('Backend offline'));
    }
    markBackendOnline();
    return response;
  },
  (error) => {
    markBackendOffline();
    return Promise.reject(error);
  }
);

// Local persistence helpers for smooth full-featured UI experience
const getStoredUsedProducts = (): UsedProductListing[] => {
  const stored = localStorage.getItem('mn_used_products');
  return stored ? JSON.parse(stored) : MOCK_USED_PRODUCTS;
};

const saveStoredUsedProducts = (products: UsedProductListing[]) => {
  localStorage.setItem('mn_used_products', JSON.stringify(products));
};

const getStoredNewProducts = (): NewProduct[] => {
  const stored = localStorage.getItem('mn_new_products');
  return stored ? JSON.parse(stored) : MOCK_NEW_PRODUCTS;
};

const getStoredShops = (): Shop[] => {
  const stored = localStorage.getItem('mn_shops');
  return stored ? JSON.parse(stored) : MOCK_SHOPS;
};

// Pricing rule calculation (mirrors the Java Spring Boot Engine)
export const calculatePriceEstimate = (req: PriceEstimationRequest): PriceEstimationResult => {
  const { originalPurchasePrice, ageMonths, condition, hasWarranty, hasOriginalAccessories, category, brand, model } = req;
  
  // Category base annual depreciation rate
  let annualDepreciation = 0.20; // 20% default
  if (['Smartphones', 'Tablets', 'Smartwatches'].includes(category)) {
    annualDepreciation = 0.24;
  } else if (['Laptops', 'Gaming Devices', 'Headphones'].includes(category)) {
    annualDepreciation = 0.22;
  } else if (['Motorcycles', 'Bicycles'].includes(category)) {
    annualDepreciation = 0.12;
  } else if (['Furniture', 'Refrigerators', 'Washing Machines'].includes(category)) {
    annualDepreciation = 0.14;
  }

  // Monthly compounded factor
  const monthlyRate = annualDepreciation / 12;
  const rawDepreciationFactor = Math.pow(1 - monthlyRate, Math.min(ageMonths, 60));

  // Condition multipliers
  const conditionMultipliers: Record<string, number> = {
    LIKE_NEW: 1.08,
    EXCELLENT: 1.00,
    GOOD: 0.88,
    FAIR: 0.72,
    POOR: 0.52,
  };
  const condMult = conditionMultipliers[condition] || 0.85;

  // Brand multiplier
  const premiumBrands = ['Apple', 'Sony', 'Samsung', 'Herman Miller', 'Trek', 'Royal Enfield', 'De\'Longhi', 'Bose'];
  const brandMult = premiumBrands.some(b => brand.toLowerCase().includes(b.toLowerCase())) ? 1.08 : 0.98;

  // Bonus for warranty & accessories
  const warrantyBonus = hasWarranty ? 1.06 : 1.0;
  const accessoriesBonus = hasOriginalAccessories ? 1.04 : 1.0;

  // Base calculated value
  let baseValue = originalPurchasePrice * rawDepreciationFactor * condMult * brandMult * warrantyBonus * accessoriesBonus;
  baseValue = Math.max(baseValue, originalPurchasePrice * 0.15); // minimum residual salvage value
  baseValue = Math.min(baseValue, originalPurchasePrice * 0.92);

  const recommendedSellingPrice = Math.round(baseValue / 50) * 50;
  const estimatedMinPrice = Math.round((recommendedSellingPrice * 0.90) / 50) * 50;
  const estimatedMaxPrice = Math.round((recommendedSellingPrice * 1.10) / 50) * 50;
  const quickSalePrice = Math.round((recommendedSellingPrice * 0.86) / 50) * 50;
  const depreciationPercentage = Math.round(((originalPurchasePrice - recommendedSellingPrice) / originalPurchasePrice) * 100);

  // Market demand
  let marketDemand: 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
  if (['Smartphones', 'Laptops', 'Gaming Devices'].includes(category) && ['LIKE_NEW', 'EXCELLENT'].includes(condition)) {
    marketDemand = 'HIGH';
  } else if (condition === 'POOR' || ageMonths > 36) {
    marketDemand = 'LOW';
  }

  const conditionExplanations: Record<string, string> = {
    LIKE_NEW: 'Product has near zero physical blemishes, flawless battery/operating cycle and commands top tier value.',
    EXCELLENT: 'Minor cosmetic signs of gentle use. Functional hardware and ports operate at 100% capacity.',
    GOOD: 'Visible surface wear or small scuffs. Fully functional with solid remaining operational lifespan.',
    FAIR: 'Noticeable scratches or battery degradation, priced for value-focused buyers looking for affordability.',
    POOR: 'Heavy cosmetic or partial functional wear; recommended for refurbishing or quick salvage sale.',
  };

  return {
    category,
    brand,
    model,
    originalPrice: originalPurchasePrice,
    estimatedMinPrice,
    estimatedMaxPrice,
    recommendedSellingPrice,
    quickSalePrice,
    depreciationPercentage: Math.max(0, Math.min(depreciationPercentage, 85)),
    conditionAnalysis: conditionExplanations[condition] || 'Standard wear and tear assessed.',
    marketDemand,
    pricingExplanation: `Valuation computed using ${ageMonths}-month ${category} lifecycle depreciation, ${brand} resale liquidity factor, ${condition.replace('_', ' ')} physical grade, and current market demand in active circular commerce channels.`,
    estimatedAt: new Date().toISOString()
  };
};

export const apiService = {
  // Categories
  getCategories: async () => {
    if (isBackendPresumedOffline()) {
      return CATEGORIES;
    }
    try {
      const res = await apiClient.get('/categories');
      if (!Array.isArray(res.data)) throw new Error('Offline fallback');
      return res.data;
    } catch {
      return CATEGORIES;
    }
  },

  // Used Products
  getUsedProducts: async (params?: { category?: string; query?: string; condition?: string; sort?: string }) => {
    const filterLocally = () => {
      let list = getStoredUsedProducts();
      if (params?.category && params.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.condition && params.condition !== 'All') {
        list = list.filter(p => p.condition === params.condition);
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q));
      }
      if (params?.sort === 'price-asc') {
        list.sort((a, b) => a.sellingPrice - b.sellingPrice);
      } else if (params?.sort === 'price-desc') {
        list.sort((a, b) => b.sellingPrice - a.sellingPrice);
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return list;
    };

    if (isBackendPresumedOffline()) {
      return filterLocally();
    }
    try {
      const res = await apiClient.get('/used-products', { params });
      if (!Array.isArray(res.data)) throw new Error('Offline fallback');
      return res.data;
    } catch {
      return filterLocally();
    }
  },

  getUsedProductById: async (id: number) => {
    try {
      const res = await apiClient.get(`/used-products/${id}`);
      if (!res.data || res.data.offline) throw new Error('Offline fallback');
      return res.data;
    } catch {
      const list = getStoredUsedProducts();
      return list.find(p => p.id === Number(id)) || null;
    }
  },

  createUsedProduct: async (listingData: Partial<UsedProductListing>) => {
    try {
      const res = await apiClient.post('/used-products', listingData);
      return res.data;
    } catch {
      const list = getStoredUsedProducts();
      const newListing: UsedProductListing = {
        id: Date.now(),
        title: listingData.title || 'Untitled Product',
        description: listingData.description || '',
        category: listingData.category || 'Smartphones',
        brand: listingData.brand || '',
        model: listingData.model || '',
        sellingPrice: listingData.sellingPrice || 0,
        originalPrice: listingData.originalPrice || 0,
        condition: listingData.condition || 'GOOD',
        productAgeMonths: listingData.productAgeMonths || 12,
        warrantyStatus: !!listingData.warrantyStatus,
        accessories: listingData.accessories || [],
        images: listingData.images && listingData.images.length > 0 ? listingData.images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'],
        location: listingData.location || 'Bengaluru Central',
        city: listingData.city || 'Bengaluru',
        sellerId: 99,
        sellerName: 'Current User',
        sellerRating: 5.0,
        sellerReviewsCount: 1,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        featured: false,
        viewsCount: 1
      };
      list.unshift(newListing);
      saveStoredUsedProducts(list);
      return newListing;
    }
  },

  // New Products
  getNewProducts: async (params?: { category?: string; query?: string; sort?: string }) => {
    const filterLocally = () => {
      let list = getStoredNewProducts();
      if (params?.category && params.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }
      if (params?.sort === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (params?.sort === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
      }
      return list;
    };

    if (isBackendPresumedOffline()) {
      return filterLocally();
    }
    try {
      const res = await apiClient.get('/new-products', { params });
      if (!Array.isArray(res.data)) throw new Error('Offline fallback');
      return res.data;
    } catch {
      return filterLocally();
    }
  },

  getNewProductById: async (id: number) => {
    try {
      const res = await apiClient.get(`/new-products/${id}`);
      if (!res.data || res.data.offline) throw new Error('Offline fallback');
      return res.data;
    } catch {
      const list = getStoredNewProducts();
      return list.find(p => p.id === Number(id)) || null;
    }
  },

  // Price Estimator
  estimatePrice: async (request: PriceEstimationRequest): Promise<PriceEstimationResult> => {
    try {
      const res = await apiClient.post('/estimator/estimate', request);
      if (!res.data || res.data.offline) throw new Error('Offline fallback');
      return res.data;
    } catch {
      // Use local rule engine when API not reached
      const result = calculatePriceEstimate(request);
      // Persist in estimation history
      const historyStr = localStorage.getItem('mn_estimation_history');
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift({ ...result, id: Date.now() });
      localStorage.setItem('mn_estimation_history', JSON.stringify(history.slice(0, 20)));
      return result;
    }
  },

  getEstimationHistory: async () => {
    try {
      const res = await apiClient.get('/estimator/history');
      if (!Array.isArray(res.data)) throw new Error('Offline fallback');
      return res.data;
    } catch {
      const stored = localStorage.getItem('mn_estimation_history');
      return stored ? JSON.parse(stored) : [];
    }
  },

  // Nearby Stores
  getNearbyShops: async (params?: { latitude?: number; longitude?: number; radiusKm?: number; category?: string; query?: string }) => {
    const filterLocally = () => {
      let shops = getStoredShops();
      if (params?.category && params.category !== 'All') {
        shops = shops.filter(s => s.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        shops = shops.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
      }
      return shops;
    };

    if (isBackendPresumedOffline()) {
      return filterLocally();
    }
    try {
      const res = await apiClient.get('/shops/nearby', { params });
      if (!Array.isArray(res.data)) throw new Error('Offline fallback');
      return res.data;
    } catch {
      return filterLocally();
    }
  },

  // Inquiries & Offers
  sendInquiry: async (inquiry: { listingId: number; offeredPrice?: number; message: string; listingTitle: string; listingImage: string }) => {
    try {
      const res = await apiClient.post('/inquiries', inquiry);
      return res.data;
    } catch {
      const inquiries = JSON.parse(localStorage.getItem('mn_inquiries') || '[]');
      const newInquiry: SellerInquiry = {
        id: Date.now(),
        listingId: inquiry.listingId,
        listingTitle: inquiry.listingTitle,
        listingImage: inquiry.listingImage,
        buyerId: 99,
        buyerName: 'You (Current User)',
        sellerId: 1,
        offeredPrice: inquiry.offeredPrice,
        message: inquiry.message,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      inquiries.unshift(newInquiry);
      localStorage.setItem('mn_inquiries', JSON.stringify(inquiries));
      return newInquiry;
    }
  },

  getInquiries: async () => {
    try {
      const res = await apiClient.get('/inquiries');
      return res.data;
    } catch {
      return JSON.parse(localStorage.getItem('mn_inquiries') || '[]');
    }
  },

  // Product Reports
  reportProduct: async (report: Partial<ProductReport>) => {
    try {
      const res = await apiClient.post('/reports', report);
      return res.data;
    } catch {
      const reports = JSON.parse(localStorage.getItem('mn_reports') || '[]');
      const newReport: ProductReport = {
        id: Date.now(),
        productId: report.productId || 0,
        productType: report.productType || 'USED',
        productTitle: report.productTitle || '',
        reporterEmail: report.reporterEmail || 'user@marketnest.com',
        reason: report.reason || 'OTHER',
        details: report.details || '',
        status: 'OPEN',
        createdAt: new Date().toISOString()
      };
      reports.unshift(newReport);
      localStorage.setItem('mn_reports', JSON.stringify(reports));
      return newReport;
    }
  },

  getReports: async () => {
    try {
      const res = await apiClient.get('/reports');
      return res.data;
    } catch {
      return JSON.parse(localStorage.getItem('mn_reports') || '[]');
    }
  },

  // Orders
  createOrder: async (orderData: Partial<Order>) => {
    try {
      const res = await apiClient.post('/orders', orderData);
      return res.data;
    } catch {
      const orders = JSON.parse(localStorage.getItem('mn_orders') || '[]');
      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        orderNumber: `MN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: 99,
        items: orderData.items || [],
        totalAmount: orderData.totalAmount || 0,
        shippingFee: orderData.shippingFee || 0,
        discountAmount: orderData.discountAmount || 0,
        paymentMethod: orderData.paymentMethod || 'RAZORPAY',
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        shippingAddress: orderData.shippingAddress || {
          street: '100 Feet Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India'
        },
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      };
      orders.unshift(newOrder);
      localStorage.setItem('mn_orders', JSON.stringify(orders));
      return newOrder;
    }
  },

  getOrders: async () => {
    try {
      const res = await apiClient.get('/orders');
      return res.data;
    } catch {
      return JSON.parse(localStorage.getItem('mn_orders') || '[]');
    }
  },

  // LIVE MARKETPLACE PRICE COMPARISON & CATALOG
  compareProducts: async (params?: { query?: string; category?: string; brand?: string }): Promise<ProductComparisonItem[]> => {
    try {
      const res = await apiClient.get('/products/compare', { params });
      if (res.data && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('Backend /products/compare not reachable, using fallback catalog', err);
    }
    // Fallback comparison catalog
    return getFallbackComparisons(params?.query, params?.category, params?.brand);
  },

  getProductComparison: async (id: number): Promise<ProductComparisonItem | null> => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    } catch {
      const list = getFallbackComparisons();
      return list.find(p => p.productId === id) || null;
    }
  },

  getMarketReference: async (category: string, brand: string, model: string): Promise<MarketReference> => {
    try {
      const res = await apiClient.get('/prices/market-reference', {
        params: { category, brand, model }
      });
      if (res.data && res.data.lowestRetailPrice) return res.data;
    } catch {
      console.warn('Backend /prices/market-reference error, calculating fallback');
    }
    // Search fallback catalog directly by product model name
    const searchQuery = (brand && !model.toLowerCase().includes(brand.toLowerCase()) ? brand + ' ' : '') + model;
    const comps = getFallbackComparisons(searchQuery.trim() || model);
    if (comps.length > 0) {
      const item = comps[0];
      return {
        category: item.category,
        brand: item.brand,
        model: item.model,
        matchedTitle: item.title,
        imageUrl: item.imageUrl,
        amazonPrice: item.amazonOffer?.currentPrice,
        flipkartPrice: item.flipkartOffer?.currentPrice,
        mrp: item.originalMrp,
        lowestRetailPrice: item.lowestPrice,
        retailSource: item.lowestPriceSource,
        dataSource: item.dataSourceLabel,
        statusMessage: `Market benchmark for ${item.title}: Lowest ₹${item.lowestPrice.toLocaleString('en-IN')} on ${item.lowestPriceSource}`
      };
    }
    return {
      category: category || 'Electronics',
      brand: brand || 'Brand',
      model,
      lowestRetailPrice: undefined,
      amazonPrice: undefined,
      flipkartPrice: undefined,
      mrp: undefined,
      retailSource: 'Market Average',
      dataSource: 'DEMO DATA',
      statusMessage: `Enter original invoice price manually for ${model}`
    };
  },

  getBrands: async (category?: string) => {
    try {
      const res = await apiClient.get('/products/brands', { params: { category } });
      return res.data;
    } catch {
      return [
        { id: 1, name: 'Apple', categorySlug: 'smartphones', categoryName: 'Smartphones' },
        { id: 2, name: 'Samsung', categorySlug: 'smartphones', categoryName: 'Smartphones' },
        { id: 3, name: 'OnePlus', categorySlug: 'smartphones', categoryName: 'Smartphones' },
        { id: 4, name: 'Xiaomi', categorySlug: 'smartphones', categoryName: 'Smartphones' },
        { id: 5, name: 'Dell', categorySlug: 'laptops', categoryName: 'Laptops & Computers' },
        { id: 6, name: 'HP', categorySlug: 'laptops', categoryName: 'Laptops & Computers' },
        { id: 7, name: 'Lenovo', categorySlug: 'laptops', categoryName: 'Laptops & Computers' },
        { id: 8, name: 'Sony', categorySlug: 'audio', categoryName: 'Audio Products' },
        { id: 9, name: 'boAt', categorySlug: 'audio', categoryName: 'Audio Products' },
        { id: 10, name: 'LG', categorySlug: 'televisions', categoryName: 'Televisions & Entertainment' }
      ];
    }
  }
};

// Client-side fallback catalog generator
const getFallbackComparisons = (query?: string, category?: string, brand?: string): ProductComparisonItem[] => {
  const all: ProductComparisonItem[] = [
    {
      productId: 1,
      identifier: 'APL-IP15-128',
      title: 'Apple iPhone 15 (128GB Storage)',
      brand: 'Apple',
      model: 'iPhone 15',
      category: 'Smartphones',
      subcategory: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      variant: '128GB Storage, 6GB RAM',
      specifications: 'A16 Bionic, 48MP Main Camera, Dynamic Island, Super Retina XDR OLED, USB-C',
      originalMrp: 79900,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CHX1W1XY',
        productTitle: 'Apple iPhone 15 (128 GB) - Black',
        productUrl: 'https://www.amazon.in/dp/B0CHX1W1XY?tag=zexova-21',
        currentPrice: 65999,
        mrp: 79900,
        discountPercent: 17,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.6,
        ratingCount: 8420,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'MOBGTAGPA3HSF5H6',
        productTitle: 'Apple iPhone 15 (Black, 128 GB)',
        productUrl: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?affid=zexovaaff',
        currentPrice: 64999,
        mrp: 79900,
        discountPercent: 18,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.6,
        ratingCount: 12430,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 64999,
      lowestPriceSource: 'Flipkart',
      priceDifference: 1000,
      bestDiscountPercent: 18,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 2,
      identifier: 'SAM-GS24-128',
      title: 'Samsung Galaxy S24 5G (8GB RAM, 128GB Storage)',
      brand: 'Samsung',
      model: 'Galaxy S24',
      category: 'Smartphones',
      subcategory: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      variant: '8GB RAM, 128GB Storage',
      specifications: 'Galaxy AI Suite, Exynos 2400 / Snapdragon 8 Gen 3, 50MP Triple Camera, 4000mAh Battery',
      originalMrp: 79999,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CS5X6F8Q',
        productTitle: 'Samsung Galaxy S24 5G (Onyx Black, 8GB, 128GB Storage)',
        productUrl: 'https://www.amazon.in/dp/B0CS5X6F8Q?tag=zexova-21',
        currentPrice: 64999,
        mrp: 79999,
        discountPercent: 19,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.5,
        ratingCount: 4120,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'MOBGWU8F6GYFPHR7',
        productTitle: 'SAMSUNG Galaxy S24 5G (Onyx Black, 128 GB, 8 GB RAM)',
        productUrl: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-128-gb/p/itm3d79b28b7a4cf?affid=zexovaaff',
        currentPrice: 63999,
        mrp: 79999,
        discountPercent: 20,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.5,
        ratingCount: 6210,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 63999,
      lowestPriceSource: 'Flipkart',
      priceDifference: 1000,
      bestDiscountPercent: 20,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 3,
      identifier: 'SAM-GS24U-256',
      title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB Storage)',
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      category: 'Smartphones',
      subcategory: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      variant: '12GB RAM, 256GB Storage',
      specifications: 'Titanium frame, S Pen, 200MP Quad Camera, 100x Space Zoom, Snapdragon 8 Gen 3 for Galaxy',
      originalMrp: 134999,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CS5Y29Z1',
        productTitle: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)',
        productUrl: 'https://www.amazon.in/dp/B0CS5Y29Z1?tag=zexova-21',
        currentPrice: 121999,
        mrp: 134999,
        discountPercent: 10,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.7,
        ratingCount: 5840,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'MOBGWU8FKRHKN6FZ',
        productTitle: 'SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB, 12 GB RAM)',
        productUrl: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmd5bdfaa09b301?affid=zexovaaff',
        currentPrice: 121499,
        mrp: 134999,
        discountPercent: 10,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.7,
        ratingCount: 7810,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 121499,
      lowestPriceSource: 'Flipkart',
      priceDifference: 500,
      bestDiscountPercent: 10,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 4,
      identifier: 'OP-12-256',
      title: 'OnePlus 12 5G (12GB RAM, 256GB Storage)',
      brand: 'OnePlus',
      model: 'OnePlus 12',
      category: 'Smartphones',
      subcategory: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      variant: '12GB RAM, 256GB Storage',
      specifications: 'Snapdragon 8 Gen 3, Hasselblad Camera 50MP, 5400mAh, 100W SUPERVOOC Charging',
      originalMrp: 69999,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CSB4553N',
        productTitle: 'OnePlus 12 (Silky Black, 12GB RAM, 256GB Storage)',
        productUrl: 'https://www.amazon.in/dp/B0CSB4553N?tag=zexova-21',
        currentPrice: 64999,
        mrp: 69999,
        discountPercent: 7,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.4,
        ratingCount: 3890,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'MOBGZ4Z5CYSFZ5ZZ',
        productTitle: 'OnePlus 12 (Silky Black, 256 GB, 12 GB RAM)',
        productUrl: 'https://www.flipkart.com/oneplus-12-silky-black-256-gb/p/itm5bca0a3384232?affid=zexovaaff',
        currentPrice: 64499,
        mrp: 69999,
        discountPercent: 7,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.5,
        ratingCount: 4520,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 64499,
      lowestPriceSource: 'Flipkart',
      priceDifference: 500,
      bestDiscountPercent: 7,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 5,
      identifier: 'APL-MBA-M3-512',
      title: 'Apple MacBook Air 13″ Laptop (M3 chip, 16GB RAM, 512GB SSD)',
      brand: 'Apple',
      model: 'MacBook Air M3',
      category: 'Laptops & Computers',
      subcategory: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      variant: '16GB RAM, 512GB SSD',
      specifications: 'Apple M3 8-core CPU, 10-core GPU, 13.6″ Liquid Retina display, MagSafe, 18-hour battery',
      originalMrp: 134900,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CX23V2ZH',
        productTitle: 'Apple MacBook Air 13″ Laptop with M3 chip (16GB, 512GB SSD)',
        productUrl: 'https://www.amazon.in/dp/B0CX23V2ZH?tag=zexova-21',
        currentPrice: 124900,
        mrp: 134900,
        discountPercent: 7,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.8,
        ratingCount: 1450,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'COMGYZF3GZF77ZZ5',
        productTitle: 'Apple 2024 MacBook Air M3 (16 GB, 512 GB SSD, macOS)',
        productUrl: 'https://www.flipkart.com/apple-2024-macbook-air-m3-16-gb-512-gb-ssd/p/itmd2fc33db8db36?affid=zexovaaff',
        currentPrice: 123990,
        mrp: 134900,
        discountPercent: 8,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.8,
        ratingCount: 1890,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 123990,
      lowestPriceSource: 'Flipkart',
      priceDifference: 910,
      bestDiscountPercent: 8,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 6,
      identifier: 'LEN-LOQ-RTX4050',
      title: 'Lenovo LOQ AI Powered Gaming Laptop (Intel i5, RTX 4050)',
      brand: 'Lenovo',
      model: 'LOQ Gaming',
      category: 'Laptops & Computers',
      subcategory: 'Gaming laptops',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      variant: '16GB DDR5, 512GB SSD, RTX 4050 6GB',
      specifications: 'Intel Core i5 12450HX, 15.6″ FHD 144Hz, RTX 4050 6GB, Lenovo LA1 AI chip',
      originalMrp: 102990,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CR1W9M6Q',
        productTitle: 'Lenovo LOQ AI Powered Gaming Laptop (15.6″ FHD 144Hz, RTX 4050)',
        productUrl: 'https://www.amazon.in/dp/B0CR1W9M6Q?tag=zexova-21',
        currentPrice: 74990,
        mrp: 102990,
        discountPercent: 27,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.4,
        ratingCount: 1870,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'COMGZ7FH0X5O8WZZ',
        productTitle: 'Lenovo LOQ Intel Core i5 12th Gen 12450HX RTX 4050',
        productUrl: 'https://www.flipkart.com/lenovo-loq-intel-core-i5-12th-gen-12450hx/p/itm28bca0a338499?affid=zexovaaff',
        currentPrice: 73990,
        mrp: 102990,
        discountPercent: 28,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.4,
        ratingCount: 2190,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 73990,
      lowestPriceSource: 'Flipkart',
      priceDifference: 1000,
      bestDiscountPercent: 28,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 7,
      identifier: 'APL-AWS9-45',
      title: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
      brand: 'Apple',
      model: 'Watch Series 9',
      category: 'Smartwatches & Wearables',
      subcategory: 'Smartwatches',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      variant: '45mm Midnight Aluminium, Sport Band',
      specifications: 'S9 SiP, Double tap gesture, 2000 nits Always-On Retina display, ECG & Blood Oxygen',
      originalMrp: 44900,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CHX37H8Z',
        productTitle: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium Case',
        productUrl: 'https://www.amazon.in/dp/B0CHX37H8Z?tag=zexova-21',
        currentPrice: 41999,
        mrp: 44900,
        discountPercent: 6,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.7,
        ratingCount: 2390,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'SMWGTAGP8ZZZZZ11',
        productTitle: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium Case',
        productUrl: 'https://www.flipkart.com/apple-watch-series-9-gps-45mm/p/itm08bca0a338477?affid=zexovaaff',
        currentPrice: 41499,
        mrp: 44900,
        discountPercent: 7,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.7,
        ratingCount: 3120,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 41499,
      lowestPriceSource: 'Flipkart',
      priceDifference: 500,
      bestDiscountPercent: 7,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 8,
      identifier: 'SNY-XM5-BLK',
      title: 'Sony WH-1000XM5 Noise Cancelling Wireless Headphones',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Audio Products',
      subcategory: 'Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      variant: 'Over-Ear, Active Noise Cancelling',
      specifications: 'Industry Leading Noise Cancellation with 8 microphones, 30 hours battery, Multipoint',
      originalMrp: 34990,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B09XS7JWHH',
        productTitle: 'Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones',
        productUrl: 'https://www.amazon.in/dp/B09XS7JWHH?tag=zexova-21',
        currentPrice: 28990,
        mrp: 34990,
        discountPercent: 17,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.6,
        ratingCount: 6890,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'ACCGTAGP4VVVVV55',
        productTitle: 'SONY WH-1000XM5 Bluetooth Headset with Active Noise Cancellation',
        productUrl: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm68bca0a338433?affid=zexovaaff',
        currentPrice: 28490,
        mrp: 34990,
        discountPercent: 18,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.6,
        ratingCount: 8450,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 28490,
      lowestPriceSource: 'Flipkart',
      priceDifference: 500,
      bestDiscountPercent: 18,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    },
    {
      productId: 9,
      identifier: 'SNY-PS5-SLIM',
      title: 'Sony PlayStation 5 Console (Slim Disc Edition)',
      brand: 'Sony PlayStation',
      model: 'PlayStation 5',
      category: 'Gaming',
      subcategory: 'Gaming consoles',
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      variant: '1TB SSD, 4K Blu-ray Disc Drive',
      specifications: 'Custom AMD Zen 2 CPU, RDNA 2 GPU, Ultra-High Speed SSD, Tempest 3D AudioTech, Ray Tracing',
      originalMrp: 54990,
      amazonOffer: {
        source: 'AMAZON',
        externalId: 'B0CLV267K6',
        productTitle: 'Sony PlayStation 5 Console (slim disc edition)',
        productUrl: 'https://www.amazon.in/dp/B0CLV267K6?tag=zexova-21',
        currentPrice: 54990,
        mrp: 54990,
        discountPercent: 0,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.8,
        ratingCount: 4820,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      flipkartOffer: {
        source: 'FLIPKART',
        externalId: 'GAMGTAGP1IIIII88',
        productTitle: 'SONY PlayStation 5 (Slim) 1 TB (White)',
        productUrl: 'https://www.flipkart.com/sony-playstation-5-slim-1-tb/p/itm38bca0a338300?affid=zexovaaff',
        currentPrice: 54490,
        mrp: 54990,
        discountPercent: 1,
        inStock: true,
        availabilityText: 'In Stock',
        rating: 4.8,
        ratingCount: 6120,
        isLive: false,
        lastFetchedAt: new Date().toISOString()
      },
      lowestPrice: 54490,
      lowestPriceSource: 'Flipkart',
      priceDifference: 500,
      bestDiscountPercent: 1,
      lastUpdated: new Date().toISOString(),
      dataSourceLabel: 'DEMO DATA'
    }
  ];

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    const queryTokens = q.split(/\s+/).filter(t => t.length > 1);
    
    // First try exact or strong match across all items
    const queryMatches = all.filter(p => {
      const fullText = (p.title + ' ' + p.brand + ' ' + p.model + ' ' + p.category).toLowerCase();
      if (fullText.includes(q)) return true;
      return queryTokens.every(tok => fullText.includes(tok));
    });
    
    if (queryMatches.length > 0) {
      return queryMatches;
    }

    // Partial token match
    const partialMatches = all.filter(p => {
      const fullText = (p.title + ' ' + p.brand + ' ' + p.model).toLowerCase();
      return queryTokens.some(tok => tok.length > 2 && fullText.includes(tok));
    });

    if (partialMatches.length > 0) {
      return partialMatches;
    }
  }

  let filtered = all;
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (brand && brand !== 'All') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }
  return filtered;
};

