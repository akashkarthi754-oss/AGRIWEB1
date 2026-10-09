import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingStatus } from '../../types';
import {
  Sprout,
  PlusCircle,
  Clock,
  CheckCircle2,
  Package,
  IndianRupee,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SellVegetableModal } from './SellVegetableModal';

export const FarmerDashboard: React.FC = () => {
  const {
    t,
    language,
    farmerListings,
    isSellModalOpen,
    setIsSellModalOpen,
    setActivePage,
    setSelectedTrackingOrderId,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  const totalListings = farmerListings.length;
  const pendingRequests = farmerListings.filter((l) => l.status === 'pending').length;
  const acceptedRequests = farmerListings.filter(
    (l) => l.status === 'approved' || l.status === 'purchased' || l.status === 'collected' || l.status === 'completed'
  ).length;

  const soldQuantityKg = farmerListings
    .filter((l) => l.status === 'purchased' || l.status === 'collected' || l.status === 'completed')
    .reduce((sum, l) => sum + (l.unit === 'ton' ? l.quantity * 1000 : l.quantity), 0);

  const totalEarnings = farmerListings
    .filter((l) => l.paymentStatus === 'paid')
    .reduce((sum, l) => sum + (l.paymentAmount || l.expectedPrice * l.quantity), 0);

  const filteredListings = farmerListings.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            {t.statusPending}
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            {t.statusApproved}
          </span>
        );
      case 'purchased':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t.statusPurchased}
          </span>
        );
      case 'collected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Package className="w-3 h-3 text-purple-600" />
            {t.statusCollected}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            {t.statusCompleted}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            {t.statusRejected}
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            ✓ {t.paymentPaid}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            ⏳ {t.paymentProcessing}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
            ● {t.paymentPending}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/30">
            <Sprout className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Verified Farmer Portal' : 'அங்கீகரிக்கப்பட்ட விவசாயி போர்டல்'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.farmerDashboardTitle}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            {t.farmerDashboardSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsSellModalOpen(true)}
          className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span>{t.btnSellVegetables}</span>
        </button>
      </div>

      {/* 5 Prominent Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Listings */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold">{t.statTotalListings}</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900">{totalListings}</p>
          <p className="text-[11px] text-stone-400">
            {language === 'en' ? 'Crops submitted' : 'பதிவிட்ட பயிர்கள்'}
          </p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold">{t.statPendingRequests}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingRequests}</p>
          <p className="text-[11px] text-stone-400">
            {language === 'en' ? 'In team review' : 'பரிசீலனையில் உள்ளவை'}
          </p>
        </div>

        {/* Accepted Requests */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold">{t.statAcceptedRequests}</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-700">{acceptedRequests}</p>
          <p className="text-[11px] text-stone-400">
            {language === 'en' ? 'Procurement confirmed' : 'கொள்முதல் உறுதி'}
          </p>
        </div>

        {/* Sold Quantity */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold">{t.statSoldQuantity}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-stone-900">
            {soldQuantityKg.toLocaleString('en-IN')} <span className="text-xs font-semibold">kg</span>
          </p>
          <p className="text-[11px] text-stone-400">
            {language === 'en' ? 'Collected & delivered' : 'ஏற்றப்பட்ட அளவு'}
          </p>
        </div>

        {/* Total Earnings */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold">{t.statTotalEarnings}</span>
            <IndianRupee className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-emerald-900">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            {language === 'en' ? '100% Direct bank transfer' : 'நேரடி வங்கி செலுத்துதல்'}
          </p>
        </div>
      </div>

      {/* Selling Pipeline Explanation Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {language === 'en' ? 'Your Produce Life Cycle with Us:' : 'எங்கள் கொள்முதல் படிநிலைகள்:'}
        </h4>
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700 overflow-x-auto gap-2 py-1">
          <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            <span>1.</span>
            <span>{t.statusPending}</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
            <span>2.</span>
            <span>{t.statusApproved}</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
            <span>3.</span>
            <span>{t.statusPurchased}</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
            <span>4.</span>
            <span>{t.statusCollected}</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-green-50 text-green-900 border border-green-200">
            <span>5.</span>
            <span>{t.statusCompleted}</span>
          </div>
        </div>
      </div>

      {/* Listings Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{t.myListingsHeading}</h2>
            <p className="text-xs text-stone-500">
              {language === 'en'
                ? 'Review crop status, verified weights, locked purchase prices, and bank transfer updates.'
                : 'பயிர் நிலை, உறுதி செய்யப்பட்ட எடை, கொள்முதல் விலை மற்றும் வங்கி பரிமாற்ற விவரங்கள்.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {['all', 'pending', 'approved', 'purchased', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all capitalize shrink-0 ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st === 'all'
                  ? language === 'en'
                    ? 'All'
                    : 'அனைத்தும்'
                  : st}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">{t.colVegetable}</th>
                <th className="py-3.5 px-4">{t.colQuantity}</th>
                <th className="py-3.5 px-4">{t.colExpectedPrice}</th>
                <th className="py-3.5 px-4">{t.colQuality}</th>
                <th className="py-3.5 px-4">{t.colLocation}</th>
                <th className="py-3.5 px-4">{t.colStatus}</th>
                <th className="py-3.5 px-4">{t.colPayment}</th>
                <th className="py-3.5 px-4">{t.colDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.imageUrl}
                        alt={listing.vegetableName}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block">
                          {listing.vegetableName}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: {listing.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">
                    {listing.quantity} {listing.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-stone-900">
                      ₹{listing.procurementPrice || listing.expectedPrice}
                    </span>
                    <span className="text-stone-500 text-[10px]">/{listing.unit}</span>
                    {listing.procurementPrice && listing.procurementPrice !== listing.expectedPrice && (
                      <span className="block text-[10px] text-emerald-600 font-semibold">
                        Agreed Price
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[11px] border border-stone-200">
                      {listing.qualityGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[130px]">{listing.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(listing.status)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getPaymentBadge(listing.paymentStatus)}
                    {listing.paymentAmount && (
                      <span className="block text-[10px] text-stone-500 font-bold mt-0.5">
                        ₹{listing.paymentAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{listing.harvestDate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden divide-y divide-stone-100">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.imageUrl}
                    alt={listing.vegetableName}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{listing.vegetableName}</h3>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {listing.location}
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(listing.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">
                    {t.colQuantity}
                  </span>
                  <span className="font-bold text-stone-800">
                    {listing.quantity} {listing.unit}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">
                    {t.colExpectedPrice}
                  </span>
                  <span className="font-black text-emerald-700">
                    ₹{listing.procurementPrice || listing.expectedPrice}/{listing.unit}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">
                    {t.colQuality}
                  </span>
                  <span className="font-semibold text-stone-700">{listing.qualityGrade}</span>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">
                    {t.colPayment}
                  </span>
                  {getPaymentBadge(listing.paymentStatus)}
                </div>
              </div>

              {listing.notes && (
                <p className="text-xs text-stone-500 italic bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                  "{listing.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <SellVegetableModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
    </div>
  );
};
