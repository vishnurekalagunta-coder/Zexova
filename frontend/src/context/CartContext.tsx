import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('marketnest_cart');
    return saved ? JSON.parse(saved) : [
      {
        id: 'new-201',
        productId: 201,
        productType: 'NEW',
        title: 'Apple MacBook Air 15" M3 Chip (16GB RAM / 512GB SSD)',
        price: 134900,
        originalPrice: 154900,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        shopName: 'iWorld Authorized Apple Reseller',
        maxStock: 18
      }
    ];
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('marketnest_wishlist');
    return saved ? JSON.parse(saved) : [101, 102, 202];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('marketnest_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('marketnest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + qty, i.maxStock || 10) }
            : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    showToast(`Added "${item.title.slice(0, 28)}..." to cart`);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Item removed from cart');
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(newQty, i.maxStock || 10) } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'MARKETNEST10' || normalized === 'SAVE10' || normalized === 'ZEXOVA') {
      setAppliedCoupon(normalized);
      showToast(`Coupon ${normalized} applied! 10% discount added.`);
      return true;
    }
    showToast('Invalid promo coupon code. Try "ZEXOVA" or "MARKETNEST10"');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = subtotal > 50000 || items.length === 0 ? 0 : 499;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode: appliedCoupon || '',
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

