export type Role = 'CUSTOMER' | 'SELLER' | 'SHOP_OWNER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt?: string;
  address?: UserAddress;
}

export interface UserAddress {
  id?: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export type ProductCondition = 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export type ListingStatus = 'ACTIVE' | 'PENDING' | 'SOLD' | 'REJECTED';

export interface Category {
  id: number;
  name: string;
  slug: string;
  iconName: string;
  itemCount?: number;
  description?: string;
  imageUrl?: string;
}

export interface UsedProductListing {
  id: number;
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  sellingPrice: number;
  originalPrice: number;
  condition: ProductCondition;
  productAgeMonths: number;
  warrantyStatus: boolean;
  accessories: string[];
  images: string[];
  location: string;
  city: string;
  sellerId: number;
  sellerName: string;
  sellerRating: number;
  sellerReviewsCount: number;
  sellerPhone?: string;
  status: ListingStatus;
  createdAt: string;
  featured?: boolean;
  viewsCount?: number;
}

export interface NewProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  shopId: number;
  shopName: string;
  shopRating: number;
  shopVerified: boolean;
  images: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  warrantyPeriod: string;
  createdAt: string;
}

export interface Shop {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  isVerified: boolean;
  imageUrl: string;
  ownerId?: number;
  distanceKm?: number;
  productsCount?: number;
}

export interface PriceEstimationRequest {
  category: string;
  brand: string;
  model: string;
  originalPurchasePrice: number;
  purchaseYear: number;
  ageMonths: number;
  condition: ProductCondition;
  hasWarranty: boolean;
  hasOriginalAccessories: boolean;
  hasOriginalBox: boolean;
  currentMarketPrice?: number;
  storageVariant?: string;
}

export interface PriceEstimationResult {
  id?: number;
  category: string;
  brand: string;
  model: string;
  originalPrice: number;
  estimatedMinPrice: number;
  estimatedMaxPrice: number;
  recommendedSellingPrice: number;
  quickSalePrice: number;
  depreciationPercentage: number;
  conditionAnalysis: string;
  marketDemand: 'HIGH' | 'MODERATE' | 'LOW';
  pricingExplanation: string;
  estimatedAt: string;
  currentAmazonPrice?: number;
  currentFlipkartPrice?: number;
  lowestRetailPrice?: number;
  retailDataSource?: 'LIVE FEED' | 'DEMO DATA' | string;
}

export interface MarketplaceOffer {
  id?: number;
  source: 'AMAZON' | 'FLIPKART';
  externalId?: string;
  productTitle: string;
  productUrl: string;
  currentPrice: number;
  mrp?: number;
  discountPercent?: number;
  inStock?: boolean;
  availabilityText?: string;
  rating?: number;
  ratingCount?: number;
  isLive?: boolean;
  lastFetchedAt?: string;
}

export interface ProductComparisonItem {
  productId: number;
  identifier: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  variant?: string;
  specifications?: string;
  originalMrp?: number;
  amazonOffer?: MarketplaceOffer;
  flipkartOffer?: MarketplaceOffer;
  lowestPrice: number;
  lowestPriceSource: 'Amazon' | 'Flipkart' | 'Equal' | 'None';
  priceDifference: number;
  bestDiscountPercent: number;
  lastUpdated: string;
  dataSourceLabel: 'LIVE FEED' | 'DEMO DATA';
}

export interface MarketReference {
  category: string;
  brand: string;
  model: string;
  matchedTitle?: string;
  imageUrl?: string;
  amazonPrice?: number;
  flipkartPrice?: number;
  mrp?: number;
  lowestRetailPrice?: number;
  retailSource?: string;
  dataSource?: 'LIVE FEED' | 'DEMO DATA';
  statusMessage?: string;
}

export interface CartItem {
  id: string; // product id + type
  productId: number;
  productType: 'USED' | 'NEW';
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  shopName?: string;
  condition?: ProductCondition;
  maxStock: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productType: 'USED' | 'NEW';
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: 'RAZORPAY' | 'COD' | 'CARD' | 'UPI';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: UserAddress;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  productId?: number;
  shopId?: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SellerInquiry {
  id: number;
  listingId: number;
  listingTitle: string;
  listingImage: string;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  offeredPrice?: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'ORDER' | 'INQUIRY' | 'PRICE_ALERT' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export interface ProductReport {
  id: number;
  productId: number;
  productType: 'USED' | 'NEW';
  productTitle: string;
  reporterEmail: string;
  reason: 'INCORRECT_INFO' | 'COUNTERFEIT' | 'SCAM' | 'OFFENSIVE' | 'OTHER';
  details: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

