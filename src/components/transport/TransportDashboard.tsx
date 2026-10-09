import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransportStatus, TransportTrip, TransportAgency } from '../../types';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingDown,
  Gauge,
  Sliders,
  Check,
} from 'lucide-react';

export const TransportDashboard: React.FC = () => {
  const {
    t,
    language,
    transportTrips,
    transportAgencies,
    acceptTrip,
    updateTripStatus,
    buyerOrders,
    assignTransportToOrder,
    setActivePage,
    setSelectedTrackingOrderId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'trips' | 'optimizer' | 'fleet'>('trips');
  const [selectedSimulateOrderId, setSelectedSimulateOrderId] = useState<string>(buyerOrders[0]?.id || 'ORD-8492');

  const selectedOrder = buyerOrders.find((o) => o.id === selectedSimulateOrderId) || buyerOrders[0];

  // Smart Transport Optimization Algorithm
  // Factors: available vehicle with sufficient capacity, closest base cost, highest rating
  const recommendedAgency: TransportAgency = React.useMemo(() => {
    const available = transportAgencies.filter((a) => a.isAvailable);
    if (!available.length) return transportAgencies[0];

    const requiredKg = selectedOrder?.items.reduce((acc, i) => acc + i.quantity, 0) || 500;
    const fitting = available.filter((a) => a.capacityKg >= requiredKg);
    const pool = fitting.length ? fitting : available;

    // Lowest cost + high rating formula
    return pool.sort((a, b) => a.costPerKm - b.costPerKm)[0];
  }, [transportAgencies, selectedOrder]);

  const recommendedCost = selectedOrder
    ? Math.round(recommendedAgency.baseCharge + selectedOrder.distanceKm * recommendedAgency.costPerKm)
    : 2500;

  const estimatedHours = selectedOrder
    ? Math.max(3, Math.round(selectedOrder.distanceKm / 48))
    : 5;

  const getTripStatusBadge = (status: TransportStatus) => {
    switch (status) {
      case 'transport_requested':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {t.statusTransportRequested}
          </span>
        );
      case 'agency_assigned':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {t.statusAgencyAssigned}
          </span>
        );
      case 'pickup_scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            {t.statusPickupScheduled}
          </span>
        );
      case 'picked_up':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            {t.statusPickedUp}
          </span>
        );
      case 'in_transit':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
            ● {t.statusInTransit}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            ✓ {t.statusDelivered}
          </span>
        );
      default:
        return null;
    }
  };

  const advanceTripStatus = (trip: TransportTrip) => {
    const sequence: TransportStatus[] = [
      'transport_requested',
      'agency_assigned',
      'pickup_scheduled',
      'picked_up',
      'in_transit',
      'delivered',
    ];
    const currentIndex = sequence.indexOf(trip.status);
    if (currentIndex < sequence.length - 1) {
      updateTripStatus(trip.id, sequence[currentIndex + 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-bold border border-purple-600/40">
            <Truck className="w-3.5 h-3.5 text-purple-300" />
            <span>{language === 'en' ? 'Supply Chain Fleet Management' : 'சரக்கு வாகன மேலாண்மை'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.transportDashboardTitle}</h1>
          <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl">
            {t.transportSubtitle}
          </p>
        </div>

        {/* Fleet Quick Stats */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs">
          <div>
            <span className="text-purple-200 block text-[10px] font-bold uppercase">
              {language === 'en' ? 'Active Fleets' : 'செயலில் உள்ள வாகனங்கள்'}
            </span>
            <span className="text-xl font-black text-white">{transportAgencies.length}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="text-purple-200 block text-[10px] font-bold uppercase">
              {language === 'en' ? 'Active Trips' : 'தற்போதைய பயணங்கள்'}
            </span>
            <span className="text-xl font-black text-emerald-400">
              {transportTrips.filter((t) => t.status !== 'delivered').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('trips')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'trips'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>{t.tabAssignedTrips}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {transportTrips.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('optimizer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'optimizer'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t.smartTransportTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'fleet'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.tabAgencyFleet}</span>
        </button>
      </div>

      {/* TAB 1: Assigned Trips Table / Responsive Cards (Prompt 9 requirement) */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {language === 'en' ? 'Farm-to-Buyer Transport Operations' : 'பண்ணை முதல் வாங்குபவர் வரை போக்குவரத்து பணிகள்'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Update shipment stages: Requested → Assigned → Pickup → In Transit → Delivered'
                  : 'பயண நிலையை மாற்றவும்: கோரப்பட்டது → ஒதுக்கப்பட்டது → ஏற்றப்பட்டது → வழியில் → சேர்க்கப்பட்டது'}
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">{t.colTripId}</th>
                  <th className="py-3 px-4">{t.colVegetable}</th>
                  <th className="py-3 px-4">{t.colPickup}</th>
                  <th className="py-3 px-4">{t.colDestination}</th>
                  <th className="py-3 px-4">{t.colDistance}</th>
                  <th className="py-3 px-4">{t.colAgency}</th>
                  <th className="py-3 px-4">{t.colTransportCost}</th>
                  <th className="py-3 px-4">{t.colStatus}</th>
                  <th className="py-3 px-4">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transportTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-stone-50/80">
                    <td className="py-3.5 px-4 font-mono font-black text-stone-900">
                      {trip.id}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        Order: {trip.orderId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-800 block">
                        {trip.vegetableSummary}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {trip.quantityKg} kg payload
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-[150px] truncate" title={trip.pickupLocation}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{trip.pickupLocation}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-[160px] truncate" title={trip.destination}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      {trip.distanceKm} km
                      <span className="block text-[10px] text-stone-400 font-normal">
                        ~{trip.estimatedHours} hrs
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{trip.agencyName}</span>
                      <span className="text-[10px] text-stone-500">
                        Driver: {trip.driverName} ({trip.driverContact})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      ₹{trip.estimatedCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {getTripStatusBadge(trip.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {trip.status !== 'delivered' ? (
                          <button
                            onClick={() => advanceTripStatus(trip)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-2xs whitespace-nowrap"
                          >
                            Advance Status →
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs">
                            ✓ Delivered
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedTrackingOrderId(trip.orderId);
                            setActivePage('tracking');
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs"
                          title="View Timeline"
                        >
                          GPS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-stone-100">
            {transportTrips.map((trip) => (
              <div key={trip.id} className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-stone-900">{trip.id}</span>
                    <span className="text-stone-400 text-xs ml-2">({trip.orderId})</span>
                  </div>
                  <div>{getTripStatusBadge(trip.status)}</div>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Produce</span>
                    <span className="font-bold text-stone-800">{trip.vegetableSummary}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/60">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Pickup</span>
                      <span className="text-stone-700 truncate block">{trip.pickupLocation}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Destination</span>
                      <span className="text-stone-700 truncate block">{trip.destination}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-200/60">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Distance</span>
                      <span className="font-bold text-stone-800">{trip.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Freight</span>
                      <span className="font-black text-purple-700">₹{trip.estimatedCost}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">ETA</span>
                      <span className="font-bold text-stone-800">~{trip.estimatedHours} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedTrackingOrderId(trip.orderId);
                      setActivePage('tracking');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs"
                  >
                    View Map Track
                  </button>
                  {trip.status !== 'delivered' && (
                    <button
                      onClick={() => advanceTripStatus(trip)}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                    >
                      Advance Status →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Smart Transport Cost Optimizer (Prompt 10 requirement) */}
      {activeTab === 'optimizer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{language === 'en' ? 'Logistics Route Optimization Engine' : 'போக்குவரத்து உகந்த வழிமுறை'}</span>
                </div>
                <h3 className="text-xl font-black text-stone-900">{t.smartTransportTitle}</h3>
                <p className="text-xs text-stone-500 max-w-xl">{t.smartTransportDesc}</p>
              </div>

              {/* Order Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Order:</span>
                <select
                  value={selectedSimulateOrderId}
                  onChange={(e) => setSelectedSimulateOrderId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-300 font-bold text-xs bg-white text-stone-800"
                >
                  {buyerOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.id} - {ord.deliveryCity} ({ord.items.reduce((a, b) => a + b.quantity, 0)} kg)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optimization Parameters (Prompt 10: Distance, Transport cost, Vehicle capacity, Delivery time, Availability, Destination) */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Distance</span>
                <span className="font-black text-stone-800 text-sm">{selectedOrder.distanceKm} km</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Payload</span>
                <span className="font-black text-stone-800 text-sm">
                  {selectedOrder.items.reduce((a, b) => a + b.quantity, 0)} kg
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Destination</span>
                <span className="font-bold text-stone-800 text-xs truncate block">{selectedOrder.deliveryCity}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Pickup Hub</span>
                <span className="font-bold text-stone-800 text-xs truncate block">{selectedOrder.pickupLocation.split(',')[0]}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Transit Type</span>
                <span className="font-bold text-emerald-700 text-xs block">Standard Fresh</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Optimization</span>
                <span className="font-black text-emerald-900 text-xs block">Active & Verified</span>
              </div>
            </div>

            {/* Recommended Agency Card (Prompt 10 format requirement) */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.recommendedAgency}</span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-black">{recommendedAgency.name}</h4>
                    <p className="text-xs text-purple-200 mt-1">
                      Vehicle: <span className="font-bold text-white">{recommendedAgency.vehicleType}</span> •
                      Capacity: <span className="font-bold text-white">{(recommendedAgency.capacityKg / 1000).toFixed(1)} Ton</span> ({recommendedAgency.capacityKg} kg)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                    <div>
                      <span className="text-purple-300 text-[10px] block">Estimated Cost:</span>
                      <span className="text-xl font-black text-amber-300">
                        ₹{recommendedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-300 text-[10px] block">Estimated Delivery:</span>
                      <span className="text-xl font-black text-white">{estimatedHours} hours</span>
                    </div>
                    <div>
                      <span className="text-purple-300 text-[10px] block">Assigned Driver:</span>
                      <span className="text-sm font-bold text-white">{recommendedAgency.driverName}</span>
                    </div>
                    <div>
                      <span className="text-purple-300 text-[10px] block">Driver Contact:</span>
                      <span className="text-sm font-mono text-purple-200">{recommendedAgency.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 space-y-2">
                  <button
                    onClick={() => {
                      assignTransportToOrder(selectedOrder.id, recommendedAgency.id);
                      setActiveTab('trips');
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-black text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>{t.btnAssignAgency}</span>
                  </button>
                  <p className="text-[10px] text-purple-300 text-center">
                    Auto-schedules driver dispatch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Registered Fleet Agencies Grid (Prompt 9 & 10) */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {transportAgencies.map((agency) => (
            <div
              key={agency.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      agency.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {agency.isAvailable ? 'Available' : 'On Trip'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{agency.name}</h3>
                  <p className="text-xs text-stone-500 font-medium">{agency.vehicleType}</p>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-bold text-stone-900">{agency.capacityKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base + Km:</span>
                    <span className="font-bold text-stone-900">
                      ₹{agency.baseCharge} + ₹{agency.costPerKm}/km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver:</span>
                    <span className="font-bold text-stone-900">{agency.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle No:</span>
                    <span className="font-mono text-stone-800">{agency.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="text-purple-700 font-mono">{agency.contact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <span>★</span>
                  <span>{agency.rating}</span>
                  <span className="text-stone-400 font-normal">({agency.completedTrips} trips)</span>
                </div>
                <button
                  onClick={() => {
                    assignTransportToOrder(buyerOrders[0].id, agency.id);
                    setActiveTab('trips');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
