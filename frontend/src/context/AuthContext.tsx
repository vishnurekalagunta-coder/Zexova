import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuthResponse } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role, phone?: string) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: Role) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  isCustomer: boolean;
  isSeller: boolean;
  isShopOwner: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo predefined accounts for immediate testing
const DEMO_ACCOUNTS: Record<Role, User> = {
  ADMIN: {
    id: 1,
    name: 'Vikram Singhania (Admin)',
    email: 'admin@marketnest.com',
    role: 'ADMIN',
    phone: '+91 98000 00001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-01'
  },
  SELLER: {
    id: 2,
    name: 'Arjun Mehta (Individual Seller)',
    email: 'seller@marketnest.com',
    role: 'SELLER',
    phone: '+91 98450 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-02-15'
  },
  SHOP_OWNER: {
    id: 3,
    name: 'Rajesh Kulkarni (Shop Partner)',
    email: 'shop@marketnest.com',
    role: 'SHOP_OWNER',
    phone: '+91 99002 99881',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-03-10'
  },
  CUSTOMER: {
    id: 4,
    name: 'Pooja Sharma (Shopper)',
    email: 'customer@marketnest.com',
    role: 'CUSTOMER',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-05-20',
    address: {
      street: '12th Cross, 4th Main, HAL 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038',
      country: 'India'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('marketnest_token');
    const savedUser = localStorage.getItem('marketnest_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('marketnest_token');
        localStorage.removeItem('marketnest_user');
      }
    } else {
      // Default initial login as Customer for quick seamless browsing
      const defaultUser = DEMO_ACCOUNTS.CUSTOMER;
      setUser(defaultUser);
      setToken('demo-jwt-customer-token');
      localStorage.setItem('marketnest_user', JSON.stringify(defaultUser));
      localStorage.setItem('marketnest_token', 'demo-jwt-customer-token');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Attempt backend API call
      const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      const { token: jwtToken, user: authUser } = res.data;
      setToken(jwtToken);
      setUser(authUser);
      localStorage.setItem('marketnest_token', jwtToken);
      localStorage.setItem('marketnest_user', JSON.stringify(authUser));
      setIsLoading(false);
      return true;
    } catch {
      // Graceful local fallback for instant demo testing
      const matchingRole = (Object.keys(DEMO_ACCOUNTS) as Role[]).find(
        r => DEMO_ACCOUNTS[r].email.toLowerCase() === email.toLowerCase()
      ) || 'CUSTOMER';
      
      const loggedUser = {
        ...DEMO_ACCOUNTS[matchingRole],
        email
      };
      const demoToken = `mock-jwt-${Date.now()}`;
      setToken(demoToken);
      setUser(loggedUser);
      localStorage.setItem('marketnest_token', demoToken);
      localStorage.setItem('marketnest_user', JSON.stringify(loggedUser));
      setIsLoading(false);
      return true;
    }
  };

  const register = async (name: string, email: string, password: string, role: Role, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<AuthResponse>('/auth/register', { name, email, password, role, phone });
      const { token: jwtToken, user: authUser } = res.data;
      setToken(jwtToken);
      setUser(authUser);
      localStorage.setItem('marketnest_token', jwtToken);
      localStorage.setItem('marketnest_user', JSON.stringify(authUser));
      setIsLoading(false);
      return true;
    } catch {
      const newUser: User = {
        id: Date.now(),
        name,
        email,
        role,
        phone,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
        createdAt: new Date().toISOString()
      };
      const demoToken = `mock-jwt-reg-${Date.now()}`;
      setToken(demoToken);
      setUser(newUser);
      localStorage.setItem('marketnest_token', demoToken);
      localStorage.setItem('marketnest_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('marketnest_token');
    localStorage.removeItem('marketnest_user');
  };

  const switchDemoRole = (role: Role) => {
    const targetUser = DEMO_ACCOUNTS[role];
    setUser(targetUser);
    const demoToken = `mock-jwt-${role.toLowerCase()}-token`;
    setToken(demoToken);
    localStorage.setItem('marketnest_token', demoToken);
    localStorage.setItem('marketnest_user', JSON.stringify(targetUser));
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('marketnest_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
        isCustomer: user?.role === 'CUSTOMER',
        isSeller: user?.role === 'SELLER',
        isShopOwner: user?.role === 'SHOP_OWNER',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

