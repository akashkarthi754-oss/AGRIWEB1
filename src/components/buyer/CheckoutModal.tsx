import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceProduct, OrderItem } from '../../types';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  Truck,
  MapPin,
  ArrowRight,
  Package,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directProduct?: MarketplaceProduct | null;
  directQuantity?: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directProduct,
  directQuantity = 25,
}) => {
  const {
    t,
    language,
    cart,
    cartTotal,
    clearCart,
    createBuyerOrder,
    setActivePage,
    setSelectedTrackingOrderId,
  } = useApp();

  // Delivery form state
  const [fullName, setFullName] = useState('Ananya Fresh Retail Mart');
  const [phone, setPhone] = useState('+91 98400 12345');
  const [address, setAddress] = useState('Plot 45, Koyambedu Wholesale Market Road');
  const [city, setCity] = useState('Chennai');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD' | 'NetBanking'>('UPI');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Determine items & totals: either single direct item (Buy Now) or full cart
  let orderItems: OrderItem[] = [];
  let vegCost = 0;
  let transCost = 0;
  let handCost = 0;
  let totalCost = 0;

  if (directProduct) {
    const itemSubtotal = directQuantity * directProduct.pricePerKg;
    orderItems = [
      {
        productId: directProduct.id,
        productName: directProduct.name,
        qualityGrade: directProduct.qualityGrade,
        quantity: directQuantity,
        pricePerKg: directProduct.pricePerKg,
        subtotal: itemSubtotal,
        imageUrl: directProduct.imageUrl,
      },
    ];
    vegCost = itemSubtotal;
    transCost = Math.round(directQuantity * 4);
    handCost = Math.round(directQuantity * 1.5);
    totalCost = vegCost + transCost + handCost;
  } else {
    orderItems = cart.map((ci) => ({
      productId: ci.product.id,
      productName: ci.product.name,
      qualityGrade: ci.product.qualityGrade,
      quantity: ci.quantity,
      pricePerKg: ci.product.pricePerKg,
      subtotal: ci.quantity * ci.product.pricePerKg,
      imageUrl: ci.product.imageUrl,
    }));
    vegCost = cartTotal.produceCost;
    transCost = cartTotal.transportCost;
    handCost = cartTotal.handlingCost;
    totalCost = cartTotal.totalAmount;
  }

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderItems.length) return;

    const newOrder = createBuyerOrder({
      buyerId: 'BUY-ME',
      buyerName: fullName,
      buyerContact: phone,
      deliveryAddress: address,
      deliveryCity: city,
      items: orderItems,
      vegetableCost: vegCost,
      transportCost: transCost,
      handlingCost: handCost,
      totalAmount: totalCost,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      pickupLocation: 'Tamil Nadu Regional Agrimarket Procurement Hub',
      destination: `${address}, ${city}`,
      distanceKm: city.toLowerCase().includes('chennai') ? 380 : 160,
      estimatedDeliveryDate: 'Tomorrow by 08:00 AM',
    });

    if (!directProduct) {
      clearCart();
    }

    setConfirmedOrderId(newOrder.id);
  };

  const handleGoToTracking = () => {
    if (confirmedOrderId) {
      setSelectedTrackingOrderId(confirmedOrderId);
      onClose();
      setActivePage('tracking');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.checkoutTitle}</h2>
              <p className="text-xs text-stone-400 mt-0.5">{t.checkoutSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrderId ? (
          /* Confirmation Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                {t.orderSuccessTitle}
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                {t.orderSuccessDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-bold uppercase tracking-wider">
                  Order ID
                </span>
                <span className="font-mono font-black text-base text-emerald-700">
                  {confirmedOrderId}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Amount Paid:</span>
                <span className="font-black text-stone-900">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Destination:</span>
                <span className="font-semibold text-stone-900">{city}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-stone-900">{paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleGoToTracking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>{t.btnTrackYourOrder}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleConfirmOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* 1. Itemized Vegetables Summary (Required by prompt 12) */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                <span>{language === 'en' ? 'Vegetables in Order' : 'ஆர்டரில் உள்ள காய்கறிகள்'}</span>
                <span>{orderItems.length} {language === 'en' ? 'Item(s)' : 'வகைகள்'}</span>
              </h3>

              <div className="divide-y divide-stone-200">
                {orderItems.map((item) => (
                  <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{item.productName}</p>
                        <p className="text-[11px] text-stone-500">
                          {item.quantity} kg @ ₹{item.pricePerKg}/kg ({item.qualityGrade})
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-stone-800">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exact format required by Prompt section 12 */}
              <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Product Cost:</span>
                  <span className="font-semibold text-stone-800">₹{vegCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-semibold text-stone-800">₹{transCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling:</span>
                  <span className="font-semibold text-stone-800">₹{handCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-black text-stone-900">
                  <span>Total Amount:</span>
                  <span className="text-xl text-emerald-700">₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* 2. Delivery & Address Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{t.deliveryDetailsTitle}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t.inputFullName} *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t.inputPhone} *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">{t.inputAddress} *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">{t.inputCity} *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Options (Prompt 12 requirement: UPI, Card, Cash on Delivery, Online Payment) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">{t.paymentMethodTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* UPI */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-800">{t.payUPI}</span>
                </label>

                {/* Card */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-stone-800">{t.payCard}</span>
                </label>

                {/* NetBanking */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'NetBanking'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="NetBanking"
                    checked={paymentMethod === 'NetBanking'}
                    onChange={() => setPaymentMethod('NetBanking')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-stone-800">{t.payNetBanking}</span>
                </label>

                {/* COD */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-800">{t.payCOD}</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                {t.formCancelBtn}
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm shadow-md shadow-emerald-600/30 transition-all"
              >
                {t.btnConfirmOrder} (₹{totalCost.toLocaleString('en-IN')})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
