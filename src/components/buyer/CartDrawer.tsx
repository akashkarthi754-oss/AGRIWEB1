import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
}) => {
  const {
    t,
    language,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">{t.navCart}</h2>
              <p className="text-[11px] text-stone-500">
                {cart.length} {language === 'en' ? 'Vegetables Selected' : 'காய்கறிகள் கூடையில் உள்ளன'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800">
                {language === 'en' ? 'Your cart is empty' : 'கூடையில் காய்கறிகள் எதுவும் இல்லை'}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {language === 'en'
                  ? 'Explore our marketplace and add fresh produce directly procured from verified farmers.'
                  : 'புதிய காய்கறிகளை தேர்வு செய்து கூடையில் சேர்க்கவும்.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex items-center justify-between gap-3"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>₹{product.pricePerKg}/kg ({product.qualityGrade})</span>
                      <span className="font-bold text-stone-800">
                        ₹{(quantity * product.pricePerKg).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 5)}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-stone-800">
                          {quantity} kg
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 5)}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t.vegetableCost} ({cartTotal.totalKg} kg):</span>
                <span className="font-semibold text-stone-800">
                  ₹{cartTotal.produceCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-stone-400" />
                  {t.transportCost}:
                </span>
                <span className="font-semibold text-stone-800">
                  ₹{cartTotal.transportCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.handlingCost}:</span>
                <span className="font-semibold text-stone-800">
                  ₹{cartTotal.handlingCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-black text-stone-900">
                <span>{t.totalAmount}:</span>
                <span className="text-xl text-emerald-700">
                  ₹{cartTotal.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span>{t.btnProceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
