import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Lock, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role, phone);
      navigate('/');
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Your MarketNest Account
        </h1>
        <p className="text-xs text-slate-500">
          Join India's fastest-growing multi-tier tech commerce community.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-6">
        
        {/* Account Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Select Your Account Purpose
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'CUSTOMER', label: 'Buyer', desc: 'Shop items' },
              { id: 'SELLER', label: 'Used Seller', desc: 'Pre-owned peer' },
              { id: 'SHOP_OWNER', label: 'Retail Shop', desc: 'Merchant store' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id as Role)}
                className={`p-3 rounded-2xl border text-center transition ${
                  role === r.id
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">{r.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="rohan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+91 98450 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Registering Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};

