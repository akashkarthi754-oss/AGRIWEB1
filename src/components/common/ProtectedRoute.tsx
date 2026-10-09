import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('farmer' | 'buyer' | 'transporter' | 'admin' | 'logistics')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const { setActivePage, setCurrentRole } = useApp();

  const handleGoToMyDashboard = () => {
    if (role === 'farmer') {
      setCurrentRole('farmer');
      setActivePage('farmer_dashboard');
    } else if (role === 'buyer') {
      setCurrentRole('buyer');
      setActivePage('marketplace');
    } else if (role === 'transporter' || role === 'logistics') {
      setCurrentRole('transport');
      setActivePage('transport');
    } else if (role === 'admin') {
      setCurrentRole('procurement');
      setActivePage('admin_dashboard');
    } else {
      setActivePage('home');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-stone-600">Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-sm text-center">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          🔒
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-stone-600 mb-6">
          Please sign in to access this portal with role-verified features.
        </p>
        <button
          onClick={() => setActivePage('login')}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  // Normalize transporter <-> logistics
  const effectiveAllowedRoles = allowedRoles ? [...allowedRoles] : [];
  if (effectiveAllowedRoles.includes('transporter') && !effectiveAllowedRoles.includes('logistics')) {
    effectiveAllowedRoles.push('logistics');
  }
  if (effectiveAllowedRoles.includes('logistics') && !effectiveAllowedRoles.includes('transporter')) {
    effectiveAllowedRoles.push('transporter');
  }

  if (allowedRoles && role && !effectiveAllowedRoles.includes(role)) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-amber-200 shadow-sm text-center">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ⛔
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-stone-600 mb-6">
          Your account does not have permission to access this page.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleGoToMyDashboard}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
          >
            Go to My Dashboard
          </button>
          <button
            onClick={() => setActivePage('home')}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-sm transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
