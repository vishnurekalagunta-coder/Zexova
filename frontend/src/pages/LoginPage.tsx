import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: Role) => {
    switchDemoRole(role);
    if (role === 'ADMIN') navigate('/dashboard/admin');
    else if (role === 'SHOP_OWNER') navigate('/dashboard/shop');
    else if (role === 'SELLER') navigate('/dashboard/seller');
    else navigate('/dashboard/user');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back to MarketNest
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to access your listings, orders, and saved valuations.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-6">
        
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to MarketNest'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles for Rapid Testing */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider">
            Quick 1-Click Demo Profiles
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('CUSTOMER')}
              className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 text-center"
            >
              Shopper / Customer
            </button>
            <button
              onClick={() => handleDemoLogin('SELLER')}
              className="py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-center"
            >
              Used Item Seller
            </button>
            <button
              onClick={() => handleDemoLogin('SHOP_OWNER')}
              className="py-1.5 px-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-center"
            >
              Verified Shop Partner
            </button>
            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="py-1.5 px-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-center"
            >
              Platform Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
};

