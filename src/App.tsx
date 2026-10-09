import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { Marketplace } from './components/buyer/Marketplace';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { ProcurementCenter } from './components/procurement/ProcurementCenter';
import { TransportDashboard } from './components/transport/TransportDashboard';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { CartDrawer } from './components/buyer/CartDrawer';
import { CheckoutModal } from './components/buyer/CheckoutModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { SellVegetableModal } from './components/farmer/SellVegetableModal';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

const AppContent: React.FC = () => {
  const {
    activePage,
    isCartOpen,
    setIsCartOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isSellModalOpen,
    setIsSellModalOpen,
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans antialiased text-stone-900">
      <Navbar />

      <main className="flex-1">
        {activePage === 'home' && <LandingPage />}
        {activePage === 'login' && <Login />}
        {activePage === 'signup' && <Signup />}
        {activePage === 'marketplace' && <Marketplace />}
        {activePage === 'farmer_dashboard' && (
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        )}
        {activePage === 'procurement' && <ProcurementCenter />}
        {activePage === 'transport' && (
          <ProtectedRoute allowedRoles={['transporter', 'logistics']}>
            <TransportDashboard />
          </ProtectedRoute>
        )}
        {activePage === 'tracking' && <OrderTrackingView />}
        {activePage === 'admin_dashboard' && (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
        {activePage === 'profile' && (
          <ProtectedRoute allowedRoles={['farmer', 'buyer', 'transporter', 'admin', 'logistics']}>
            <ProfilePage />
          </ProtectedRoute>
        )}
      </main>

      <Footer />

      {/* Slide-over Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <SellVegetableModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}
