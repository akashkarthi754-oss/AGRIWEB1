import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceProduct } from '../../types';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Tag,
  CheckCircle,
} from 'lucide-react';

interface ProductDetailsModalProps {
  product: MarketplaceProduct | null;
  onClose: () => void;
  onProceedToCheckout: (product: MarketplaceProduct, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onProceedToCheckout,
}) => {
  const { t, language, addToCart } = useApp();

  const [quantity, setQuantity] = useState<number>(product?.minOrderQuantity || 25);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  // Real-time dynamic cost calculation breakdown
  const vegetableCost = quantity * product.pricePerKg;
  // Dynamic logistics calculation: ₹4/kg for transport
  const transportCost = Math.round(quantity * 4);
  // Service / sorting / cold storage handling: ₹1.5/kg
  const handlingCost = Math.round(quantity * 1.5);
  const totalAmount = vegetableCost + transportCost + handlingCost;

  const handleDecrement = () => {
    if (quantity > product.minOrderQuantity) {
      setQuantity((prev) => Math.max(product.minOrderQuantity, prev - 5));
    }
  };

  const handleIncrement = () => {
    if (quantity < product.availableQuantity) {
      setQuantity((prev) => Math.min(product.availableQuantity, prev + 5));
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    onProceedToCheckout(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Image & Badges */}
          <div className="md:col-span-5 relative bg-stone-100 flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-square bg-white">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quality & Freshness Guarantee */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.modalQualityGuarantee}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  {product.freshnessGuarantee}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/80 text-[11px] text-stone-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>{language === 'en' ? 'Procured at:' : 'கொள்முதல் விலை:'}</span>
                <span className="font-bold text-stone-700">₹{product.procurementPrice}/kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'en' ? 'Wholesale Price:' : 'விற்பனை விலை:'}</span>
                <span className="font-bold text-emerald-700">₹{product.pricePerKg}/kg</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Quantity Selector, Cost Breakdown */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
                    {product.qualityGrade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200">
                    {product.category}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">
                    {t.modalOrigin}
                  </span>
                  <span className="font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{product.sourceRegion}</span>
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">
                    {t.availableStock}
                  </span>
                  <span className="font-bold text-stone-800 block mt-0.5">
                    {product.availableQuantity} {product.unit}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">
                    {t.modalHarvestedOn}
                  </span>
                  <span className="font-bold text-stone-800 block mt-0.5">
                    {product.harvestDate}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">
                    {t.modalMinOrder}
                  </span>
                  <span className="font-bold text-stone-800 block mt-0.5">
                    {product.minOrderQuantity} {product.unit}
                  </span>
                </div>
              </div>

              {/* Interactive Quantity Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700">
                    {t.modalQuantitySelect} ({product.unit}):
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Min {product.minOrderQuantity} {product.unit}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-2xl bg-white p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= product.minOrderQuantity}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 disabled:opacity-40 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center font-black text-stone-900 text-base">
                      {quantity} <span className="text-xs font-normal text-stone-500">{product.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={quantity >= product.availableQuantity}
                      className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 disabled:opacity-40 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[50, 100, 250, 500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(Math.min(product.availableQuantity, preset))}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          quantity === preset
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {preset}kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transparent Cost Breakdown */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-600 border-b border-stone-200 pb-2">
                  <span>{t.costBreakdownTitle}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                    {language === 'en' ? 'Itemized Pricing' : 'வெளிப்படையான விலை'}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>{t.vegetableCost} ({quantity} kg × ₹{product.pricePerKg}):</span>
                  <span className="font-semibold text-stone-800">₹{vegetableCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-stone-500" />
                    {t.transportCost} ({quantity} kg × ₹4.00):
                  </span>
                  <span className="font-semibold text-stone-800">₹{transportCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>{t.handlingCost} ({quantity} kg × ₹1.50):</span>
                  <span className="font-semibold text-stone-800">₹{handlingCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-black text-stone-900">
                  <span>{t.totalAmount}:</span>
                  <span className="text-xl text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {addedNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>
                    {language === 'en'
                      ? 'Added to Cart! Open cart to review or continue shopping.'
                      : 'கூடையில் சேர்க்கப்பட்டது!'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t.btnAddToCart}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{t.btnBuyNow}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
