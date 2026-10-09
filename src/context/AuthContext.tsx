import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, getStoredUser, setStoredUser } from '../services/api';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  role: 'farmer' | 'buyer' | 'transporter' | 'admin' | 'logistics';
  language?: string;
  organization?: string;
  location?: {
    state?: string;
    district?: string;
    village?: string;
    address?: string;
    pincode?: string;
  };
  farmerDetails?: {
    farmName?: string;
    farmSize?: string;
    primaryCrops?: string;
  };
  buyerDetails?: {
    businessType?: string;
    city?: string;
  };
  transporterDetails?: {
    transportAgencyName?: string;
    vehicleType?: string;
    vehicleRegNumber?: string;
    vehicleCapacity?: string;
    driverName?: string;
    driverPhone?: string;
    operatingState?: string;
    operatingDistrict?: string;
  };
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  role: 'farmer' | 'buyer' | 'transporter' | 'admin' | 'logistics' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  signup: (data: any) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = user?.role || null;
  const isAuthenticated = !!user && !!getAuthToken();

  const refreshUser = async () => {
    try {
      const res = await api.auth.me();
      if (res?.success && res?.user) {
        setUser(res.user);
        setStoredUser(res.user);
      } else {
        setAuthToken(null);
        setStoredUser(null);
        setUser(null);
      }
    } catch {
      // Keep cached user if offline or fallback
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    refreshUser().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (identifier: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(identifier, password);
      if (res?.success && res?.user) {
        setUser(res.user);
        setStoredUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message || 'Network error during login',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.auth.signup(data);
      if (res?.success && res?.user) {
        setUser(res.user);
        setStoredUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Signup failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message || 'Network error during signup',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Continue cleanup
    }
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('agri_jwt_token');
      window.localStorage.removeItem('agri_user');
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      setStoredUser(newUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        updateUser,
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
