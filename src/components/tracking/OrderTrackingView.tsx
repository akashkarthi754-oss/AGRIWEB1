import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, BuyerOrder } from '../../types';
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Package,
  Calendar,
  Phone,
  ShieldCheck,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Navigation,
  Sparkles,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    t,
    language,
    buyerOrders,
    selectedTrackingOrderId,
    setSelectedTrackingOrderId,
    updateOrderStatus,
  } = useApp();

  const [searchInput, setSearchInput] = useState(selectedTrackingOrderId || 'ORD-8492');

  const currentOrder: BuyerOrder | undefined =
    buyerOrders.find(
      (o) => o.id.toUpperCase() === (selectedTrackingOrderId || searchInput).trim().toUpperCase()
    ) || buyerOrders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedTrackingOrderId(searchInput.trim().toUpperCase());
    }
  };

  // Exact 7 Stages Required by User Prompt 11:
  // 1. Order Confirmed
  // 2. Procurement Completed
  // 3. Pickup Scheduled
  // 4. Vegetables Collected
  // 5. In Transit
  // 6. Out for Delivery
  // 7. Delivered
  interface TimelineStageItem {
    key: OrderStatus;
    label: string;
    desc: string;
    icon: string;
  }

  const timelineStages: TimelineStageItem[] = [
    {
      key: 'confirmed',
      label: t.timelineOrderConfirmed,
      desc: language === 'en' ? 'Buyer placed order; procurement locked produce at farm.' : 'ஆர்டர் உறுதிசெய்யப்பட்டு பயிர்கள் ஒதுக்கீடு செய்யப்பட்டன.',
      icon: '✓',
    },
    {
      key: 'procurement_completed',
      label: t.timelineProcurementCompleted,
      desc: language === 'en' ? 'Quality inspection passed (Grade A/B), moisture & weight verified.' : 'தரப் பரிசோதனை முடிந்து எடை சரிபார்க்கப்பட்டது.',
      icon: '✓',
    },
    {
      key: 'pickup_scheduled',
      label: t.timelinePickupScheduled,
      desc: language === 'en' ? 'Logistics fleet assigned for farm-gate crate loading.' : 'வாகனம் ஒதுக்கப்பட்டு பிக்கப் திட்டமிடப்பட்டது.',
      icon: '✓',
    },
    {
      key: 'vegetables_collected',
      label: t.timelineVegetablesCollected,
      desc: language === 'en' ? 'Loaded onto vehicle with aerated crates & cold protection.' : 'காய்கறிகள் வாகனத்தில் பாதுகாப்பாக ஏற்றப்பட்டன.',
      icon: '✓',
    },
    {
      key: 'in_transit',
      label: t.timelineInTransit,
      desc: language === 'en' ? 'Vehicle en route via national highway with live GPS telemetry.' : 'வாகனம் தேசிய நெடுஞ்சாலை வழியாக பயணத்தில் உள்ளது.',
      icon: '●',
    },
    {
      key: 'out_for_delivery',
      label: t.timelineOutForDelivery,
      desc: language === 'en' ? 'Arrived at city terminal; local distribution truck dispatched.' : 'நகர முனையம் வந்தடைந்து டெலிவரிக்கு புறப்பட்டது.',
      icon: '○',
    },
    {
      key: 'delivered',
      label: t.timelineDelivered,
      desc: language === 'en' ? 'Delivered to buyer destination. Weight receipt signed.' : 'வாங்குபவரிடம் ஒப்படைக்கப்பட்டது. ரசீது கையொப்பமிடப்பட்டது.',
      icon: '○',
    },
  ];

  const orderStatusList: OrderStatus[] = [
    'confirmed',
    'procurement_completed',
    'pickup_scheduled',
    'vegetables_collected',
    'in_transit',
    'out_for_delivery',
    'delivered',
  ];

  const currentStageIndex = currentOrder
    ? orderStatusList.indexOf(currentOrder.orderStatus)
    : 4;

  const handleSimulateNextStage = () => {
    if (!currentOrder) return;
    if (currentStageIndex < orderStatusList.length - 1) {
      const nextStatus = orderStatusList[currentStageIndex + 1];
      updateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600/40">
            <Navigation className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'en' ? 'Live GPS Supply Chain Tracking' : 'நேரடி ஜிபிஎஸ் கண்காணிப்பு'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t.trackingTitle}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t.trackingSubtitle}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.enterOrderIdPlaceholder}
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-emerald-200/60 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-400 font-mono font-bold"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              {t.btnSearchOrder}
            </button>
          </form>

          {/* Quick Click Order IDs */}
          <div className="flex items-center gap-2 text-xs text-emerald-300 pt-1">
            <span>{language === 'en' ? 'Recent Orders:' : 'சமீபத்திய ஆர்டர்கள்:'}</span>
            {buyerOrders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setSearchInput(ord.id);
                  setSelectedTrackingOrderId(ord.id);
                }}
                className={`font-mono px-2 py-0.5 rounded-lg border text-[11px] transition-colors ${
                  currentOrder?.id === ord.id
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-200 hover:text-white'
                }`}
              >
                {ord.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual 7-Stage Order Tracking Timeline (Prompt 11 requirement) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Current Shipment Status
                </span>
                <h3 className="text-xl font-black text-stone-900 capitalize">
                  {currentOrder.orderStatus.replace('_', ' ')}
                </h3>
              </div>

              {/* Simulation button so user can advance stage in real time */}
              <button
                onClick={handleSimulateNextStage}
                disabled={currentStageIndex >= orderStatusList.length - 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 disabled:opacity-40 font-bold text-xs border border-emerald-200 transition-colors"
                title="Advance the live order stage forward for interactive testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {currentStageIndex < orderStatusList.length - 1
                    ? (language === 'en' ? 'Simulate Next Stage →' : 'அடுத்த படிநிலைக்கு நகர்த்து →')
                    : (language === 'en' ? '✓ Fully Delivered' : '✓ டெலிவரி முடிந்தது')}
                </span>
              </button>
            </div>

            {/* 7-Step Timeline Nodes */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {timelineStages.map((stage: any, index: number) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isUpcoming = index > currentStageIndex;

                return (
                  <div key={stage.key} className="relative group">
                    {/* Status Circle Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      }`}
                    >
                      {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                    </div>

                    {/* Stage Content */}
                    <div
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : isCompleted
                          ? 'bg-stone-50/70 border-stone-200'
                          : 'bg-white border-dashed border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-emerald-950 font-black'
                              : isCompleted
                              ? 'text-stone-900'
                              : 'text-stone-500'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {isCurrent
                            ? 'In Progress'
                            : isCompleted
                            ? 'Completed'
                            : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary Details (Prompt 11: Order ID, Vegetable, Quantity, Farmer/Source, Pickup location, Destination, Transport agency, Estimated delivery, Total price) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{t.orderSummaryDetails}</span>
                </h3>
                <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  {currentOrder.id}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {currentOrder.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{item.productName}</p>
                        <p className="text-[11px] text-stone-500">
                          {item.quantity} kg • {item.qualityGrade} @ ₹{item.pricePerKg}/kg
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-stone-800">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Meta Attributes (Prompt 11 specific fields) */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    {t.trackingFarmerSource}:
                  </span>
                  <span className="font-bold text-stone-900 text-right">
                    {currentOrder.pickupLocation}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    Destination:
                  </span>
                  <span className="font-bold text-stone-900 text-right">
                    {currentOrder.destination}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    Distance:
                  </span>
                  <span className="font-bold text-stone-900">
                    {currentOrder.distanceKm} km
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    Transport Agency:
                  </span>
                  <span className="font-bold text-emerald-800">
                    {currentOrder.assignedAgencyName || 'GreenLine Agri Logistics'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    {t.trackingDriver}:
                  </span>
                  <span className="font-bold text-stone-900">
                    {currentOrder.driverName || 'Murugesan K.'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    {t.trackingVehicleNo}:
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    {currentOrder.vehicleNumber || 'TN 57 AW 8490'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">
                    Estimated Delivery:
                  </span>
                  <span className="font-bold text-stone-900">
                    {currentOrder.estimatedDeliveryDate}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Vegetable Cost:</span>
                  <span className="font-bold text-stone-800">
                    ₹{currentOrder.vegetableCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Cost:</span>
                  <span className="font-bold text-stone-800">
                    ₹{currentOrder.transportCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Handling & Storage:</span>
                  <span className="font-bold text-stone-800">
                    ₹{currentOrder.handlingCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center font-black text-sm text-stone-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-lg text-emerald-700">
                    ₹{currentOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Call Driver Action */}
              <div className="pt-1 flex items-center gap-3">
                <a
                  href={`tel:${currentOrder.driverContact || '+919841044211'}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>
                    {t.trackingCallDriver} ({currentOrder.driverContact || '+91 98410 44211'})
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <p className="text-sm text-stone-600">
            No order found with ID "{searchInput}". Please enter a valid Order ID (e.g. ORD-8492).
          </p>
        </div>
      )}
    </div>
  );
};
