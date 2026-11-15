import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { UsedProductsPage } from './pages/UsedProductsPage';
import { UsedProductDetailPage } from './pages/UsedProductDetailPage';
import { SellProductPage } from './pages/SellProductPage';
import { NewProductsPage } from './pages/NewProductsPage';
import { NewProductDetailPage } from './pages/NewProductDetailPage';
import { PriceEstimatorPage } from './pages/PriceEstimatorPage';
import { PriceComparisonPage } from './pages/PriceComparisonPage';
import { NearbyStoresPage } from './pages/NearbyStoresPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Dashboards
import { UserDashboard } from './pages/dashboards/UserDashboard';
import { SellerDashboard } from './pages/dashboards/SellerDashboard';
import { ShopOwnerDashboard } from './pages/dashboards/ShopOwnerDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex flex-col min-h-screen bg-[#f5f5f7] dark:bg-[#09090b] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/used-products" element={<UsedProductsPage />} />
                  <Route path="/used-products/:id" element={<UsedProductDetailPage />} />
                  <Route path="/sell" element={<SellProductPage />} />
                  <Route path="/new-products" element={<NewProductsPage />} />
                  <Route path="/new-products/:id" element={<NewProductDetailPage />} />
                  <Route path="/estimator" element={<PriceEstimatorPage />} />
                  <Route path="/compare" element={<PriceComparisonPage />} />
                  <Route path="/nearby-stores" element={<NearbyStoresPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Dashboards */}
                  <Route path="/dashboard/user" element={<UserDashboard />} />
                  <Route path="/dashboard/seller" element={<SellerDashboard />} />
                  <Route path="/dashboard/shop" element={<ShopOwnerDashboard />} />
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

