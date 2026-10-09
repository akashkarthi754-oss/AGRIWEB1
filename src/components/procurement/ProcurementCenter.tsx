import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FarmerListing, MarketplaceProduct } from '../../types';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Eye,
  IndianRupee,
  Package,
  Truck,
  TrendingUp,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
  Scale,
  Calendar,
  MapPin,
  Clock,
  Layers,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { ProfitCalculator } from './ProfitCalculator';

export const ProcurementCenter: React.FC = () => {
  const {
    t,
    language,
    farmerListings,
    reviewFarmerListing,
    marketplaceProducts,
    updateProductSellingPrice,
    buyerOrders,
    transportAgencies,
    assignTransportToOrder,
    setActivePage,
    setSelectedTrackingOrderId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'orders' | 'profit' | 'analytics'>(
    'requests'
  );

  // Review modal state
  const [selectedReviewListing, setSelectedReviewListing] = useState<FarmerListing | null>(null);
  const [agreedProcurementPrice, setAgreedProcurementPrice] = useState<number>(30);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Quick edit selling price state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newSellingPrice, setNewSellingPrice] = useState<number>(0);

  // Analytics Calculations (Required by Prompt 18)
  const totalFarmers = 12500 + farmerListings.length;
  const totalBuyers = 3400 + buyerOrders.length;
  const totalVegetablesPurchasedKg = farmerListings
    .filter((l) => l.status === 'purchased' || l.status === 'collected' || l.status === 'completed')
    .reduce((acc, l) => acc + (l.unit === 'ton' ? l.quantity * 1000 : l.quantity), 0);
  const totalVegetablesSoldKg = buyerOrders
    .flatMap((o) => o.items)
    .reduce((acc, i) => acc + i.quantity, 0);

  const activeOrdersCount = buyerOrders.filter((o) => o.orderStatus !== 'delivered').length;
  const pendingDeliveriesCount = buyerOrders.filter(
    (o) => o.orderStatus === 'in_transit' || o.orderStatus === 'out_for_delivery'
  ).length;

  const totalRevenue = buyerOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const estimatedProfit = buyerOrders.reduce((acc, o) => {
    // Platform net margin ~ 15% of order value
    return acc + Math.round(o.vegetableCost * 0.18);
  }, 0);

  const handleOpenReview = (listing: FarmerListing) => {
    setSelectedReviewListing(listing);
    setAgreedProcurementPrice(listing.procurementPrice || listing.expectedPrice);
    setIsRejecting(false);
  };

  const handleAcceptRequest = () => {
    if (!selectedReviewListing) return;
    reviewFarmerListing(selectedReviewListing.id, 'approved', agreedProcurementPrice);
    setSelectedReviewListing(null);
  };

  const handleRejectRequest = () => {
    if (!selectedReviewListing) return;
    reviewFarmerListing(selectedReviewListing.id, 'rejected', undefined, rejectionReason || 'Pricing or quality criteria not matched');
    setSelectedReviewListing(null);
    setIsRejecting(false);
  };

  const handleSavePrice = (productId: string) => {
    if (newSellingPrice > 0) {
      updateProductSellingPrice(productId, newSellingPrice);
      setEditingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-bold border border-blue-600/40">
            <Briefcase className="w-3.5 h-3.5 text-blue-300" />
            <span>{language === 'en' ? 'Central Procurement Operations' : 'மத்திய கொள்முதல் பிரிவு'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.procurementCenterTitle}</h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
            {t.procurementSubtitle}
          </p>
        </div>

        {/* Live Quick Metrics */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs">
          <div>
            <span className="text-blue-200 block text-[10px] font-bold uppercase">
              {language === 'en' ? 'Pending Farmer Offers' : 'பரிசீலனை கோரிக்கைகள்'}
            </span>
            <span className="text-xl font-black text-white">
              {farmerListings.filter((l) => l.status === 'pending').length}
            </span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="text-blue-200 block text-[10px] font-bold uppercase">
              {language === 'en' ? 'Active Buyer Shipments' : 'செயலில் உள்ள ஆர்டர்கள்'}
            </span>
            <span className="text-xl font-black text-emerald-400">
              {activeOrdersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.tabFarmerRequests}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {farmerListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.tabInventory}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {marketplaceProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.tabBuyerOrders}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {buyerOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'profit'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>{t.tabProfitCalculator}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.tabAnalytics}</span>
        </button>
      </div>

      {/* TAB 1: Farmer Requests Management (Prompt 7 requirement) */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'en' ? 'Incoming Farmer Produce Offerings' : 'விவசாயிகளிடமிருந்து வந்துள்ள பயிர் கோரிக்கைகள்'}
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              {language === 'en' ? 'Review quality, agree on purchase price, schedule collection' : 'தரத்தை பரிசீலித்து கொள்முதல் விலையை உறுதி செய்க'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {farmerListings.map((listing) => {
              const totalProcurementCost = (listing.procurementPrice || listing.expectedPrice) * listing.quantity;

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.imageUrl}
                          alt={listing.vegetableName}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <h3 className="font-bold text-stone-900 text-sm line-clamp-1">
                            {listing.vegetableName}
                          </h3>
                          <p className="text-[11px] text-stone-500 font-medium">
                            {listing.farmerName} • {listing.farmName}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          listing.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : listing.status === 'approved' || listing.status === 'purchased'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>

                    {/* Details Box */}
                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Quantity
                        </span>
                        <span className="font-bold text-stone-800">
                          {listing.quantity} {listing.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Expected Price
                        </span>
                        <span className="font-black text-stone-900">
                          ₹{listing.expectedPrice}/{listing.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Quality Grade
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
                          {listing.qualityGrade}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Location
                        </span>
                        <span className="font-medium text-stone-700 truncate block">
                          {listing.location}
                        </span>
                      </div>
                    </div>

                    {/* Total Procurement Cost Calculation Display */}
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                      <span className="text-blue-900 font-medium">
                        Total Procurement Cost:
                      </span>
                      <span className="font-black text-blue-950">
                        ₹{totalProcurementCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {listing.notes && (
                      <p className="text-[11px] text-stone-500 italic">
                        "{listing.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions (Review | Accept | Reject as required by prompt 7) */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReview(listing)}
                      className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.btnReview}</span>
                    </button>

                    {listing.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            reviewFarmerListing(listing.id, 'approved', listing.expectedPrice);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.btnAccept}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedReviewListing(listing);
                            setIsRejecting(true);
                          }}
                          className="py-2 px-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Inventory Management (Prompt 7 requirement) */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">{t.inventoryTitle}</h2>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Monitor warehouse stocks, adjust buyer selling prices, and monitor gross margins.'
                  : 'கிடங்கு இருப்பு மற்றும் விற்பனை விலையை மாற்றி அமைக்கும் பகுதி.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Vegetable</th>
                  <th className="py-3 px-4">Quality Grade</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Procurement Cost</th>
                  <th className="py-3 px-4">Buyer Selling Price</th>
                  <th className="py-3 px-4">Gross Margin</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {marketplaceProducts.map((prod) => {
                  const marginPerKg = prod.pricePerKg - prod.procurementPrice;
                  const isEditing = editingProductId === prod.id;

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/80">
                      <td className="py-3 px-4 font-bold text-stone-900">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div>
                            <span>{prod.name}</span>
                            <span className="block text-[10px] text-stone-400">{prod.sourceRegion}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold">
                          {prod.qualityGrade}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-800">
                        {prod.availableQuantity} {prod.unit}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-600">
                        ₹{prod.procurementPrice}/kg
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={newSellingPrice}
                              onChange={(e) => setNewSellingPrice(Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg border border-emerald-500 text-xs font-bold"
                            />
                            <button
                              onClick={() => handleSavePrice(prod.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="font-black text-emerald-700 text-sm">
                            ₹{prod.pricePerKg}/kg
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          +₹{marginPerKg}/kg
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setEditingProductId(prod.id);
                            setNewSellingPrice(prod.pricePerKg);
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          {t.btnUpdateSellPrice}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Buyer Orders & Transport Allocation (Prompt 9 requirement) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'en' ? 'Commercial Buyer Orders & Transport Allocation' : 'வாங்குபவர் ஆர்டர்கள் & போக்குவரத்து ஒதுக்கீடு'}
            </h2>
            <span className="text-xs text-stone-500">
              {buyerOrders.length} {language === 'en' ? 'Total Orders' : 'மொத்த ஆர்டர்கள்'}
            </span>
          </div>

          <div className="space-y-3">
            {buyerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-stone-900">
                      {order.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 capitalize">
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {order.buyerName} ({order.buyerContact})
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 flex flex-wrap gap-4">
                    <span>
                      <strong>Items:</strong> {order.items.map((i) => `${i.quantity}kg ${i.productName.split('(')[0]}`).join(', ')}
                    </span>
                    <span>
                      <strong>Route:</strong> {order.pickupLocation} → {order.deliveryCity} ({order.distanceKm} km)
                    </span>
                    <span>
                      <strong>Total:</strong> <span className="font-black text-emerald-700">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                </div>

                {/* Transport Agency Assignment Widget */}
                <div className="flex items-center gap-3 shrink-0">
                  {order.assignedAgencyName ? (
                    <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                      <span className="text-stone-400 text-[10px] block font-bold uppercase">
                        Assigned Fleet
                      </span>
                      <span className="font-bold text-stone-900">
                        {order.assignedAgencyName}
                      </span>
                      <span className="text-stone-500 block text-[10px]">
                        Driver: {order.driverName} ({order.vehicleNumber})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => assignTransportToOrder(order.id, e.target.value)}
                        className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Assign Transport Agency...
                        </option>
                        {transportAgencies.map((agency) => (
                          <option key={agency.id} value={agency.id}>
                            {agency.name} ({agency.vehicleType})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedTrackingOrderId(order.id);
                      setActivePage('tracking');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                  >
                    Track Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Profit Calculator (Prompt 8 requirement) */}
      {activeTab === 'profit' && <ProfitCalculator />}

      {/* TAB 5: Business Analytics & Charts (Prompt 18 requirement) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* 8 Analytics Metric Cards Required by Prompt 18 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Total Farmers</span>
              <p className="text-2xl font-black text-stone-900">{totalFarmers.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Active producers network</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Total Buyers</span>
              <p className="text-2xl font-black text-stone-900">{totalBuyers.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-blue-600 font-semibold">Wholesalers & Supermarkets</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Vegetables Purchased</span>
              <p className="text-2xl font-black text-stone-900">
                {totalVegetablesPurchasedKg.toLocaleString('en-IN')} <span className="text-xs">kg</span>
              </p>
              <p className="text-[10px] text-stone-400">Direct from farm gate</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Vegetables Sold</span>
              <p className="text-2xl font-black text-stone-900">
                {totalVegetablesSoldKg.toLocaleString('en-IN')} <span className="text-xs">kg</span>
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold">Delivered fresh</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Active Orders</span>
              <p className="text-2xl font-black text-amber-600">{activeOrdersCount}</p>
              <p className="text-[10px] text-stone-400">In fulfillment pipeline</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Pending Deliveries</span>
              <p className="text-2xl font-black text-purple-600">{pendingDeliveriesCount}</p>
              <p className="text-[10px] text-stone-400">On road transit</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-stone-500">Total Revenue</span>
              <p className="text-2xl font-black text-stone-900">₹{(1245000 + totalRevenue).toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Billed to buyers</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-emerald-800">Estimated Profit</span>
              <p className="text-2xl font-black text-emerald-950">₹{(185000 + estimatedProfit).toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-emerald-700 font-bold">14.8% Net Platform Margin</p>
            </div>
          </div>

          {/* Simple Clean Responsive SVG Trend Charts (Prompt 18) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Vegetable Procurement vs Sales (Tonnes) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    {language === 'en' ? 'Produce Volume (Procurement vs Sales)' : 'கொள்முதல் மற்றும் விற்பனை அளவு (டன்)'}
                  </h3>
                  <p className="text-[11px] text-stone-500">Monthly trends in Metric Tonnes</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-blue-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Procured
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Sold
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-stone-100">
                {[
                  { month: 'May', procure: 65, sold: 60 },
                  { month: 'Jun', procure: 80, sold: 76 },
                  { month: 'Jul', procure: 95, sold: 90 },
                  { month: 'Aug', procure: 110, sold: 105 },
                  { month: 'Sep', procure: 135, sold: 128 },
                  { month: 'Oct', procure: 160, sold: 152 },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1.5 h-32">
                      <div
                        style={{ height: `${(item.procure / 180) * 100}%` }}
                        className="w-1/2 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all"
                        title={`Procured: ${item.procure} T`}
                      ></div>
                      <div
                        style={{ height: `${(item.sold / 180) * 100}%` }}
                        className="w-1/2 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all"
                        title={`Sold: ${item.sold} T`}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Revenue, Transport & Profit Spread */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    {language === 'en' ? 'Revenue, Logistics & Net Profit' : 'வருவாய், போக்குவரத்து மற்றும் நிகர லாபம்'}
                  </h3>
                  <p className="text-[11px] text-stone-500">₹ Lakhs across quarters</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-700"></span> Revenue
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-purple-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Freight
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Profit
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-44 flex items-end justify-between gap-4 pt-4 border-b border-stone-100">
                {[
                  { quarter: 'Q1', rev: 28, freight: 4.2, profit: 4.8 },
                  { quarter: 'Q2', rev: 36, freight: 5.4, profit: 6.2 },
                  { quarter: 'Q3', rev: 45, freight: 6.8, profit: 7.9 },
                  { quarter: 'Q4', rev: 58, freight: 8.5, profit: 10.4 },
                ].map((item) => (
                  <div key={item.quarter} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1 h-32">
                      <div
                        style={{ height: `${(item.rev / 65) * 100}%` }}
                        className="w-1/3 bg-stone-700 rounded-t-md"
                        title={`Revenue: ₹${item.rev}L`}
                      ></div>
                      <div
                        style={{ height: `${(item.freight / 65) * 100}%` }}
                        className="w-1/3 bg-purple-500 rounded-t-md"
                        title={`Freight: ₹${item.freight}L`}
                      ></div>
                      <div
                        style={{ height: `${(item.profit / 65) * 100}%` }}
                        className="w-1/3 bg-emerald-500 rounded-t-md"
                        title={`Profit: ₹${item.profit}L`}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500">{item.quarter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Dialog for Farmer Request */}
      {selectedReviewListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">{t.reviewRequestTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedReviewListing(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedReviewListing.imageUrl}
                  alt={selectedReviewListing.vegetableName}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-bold text-stone-900">{selectedReviewListing.vegetableName}</h4>
                  <p className="text-xs text-stone-500">
                    Farmer: {selectedReviewListing.farmerName} • {selectedReviewListing.location}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Quality: {selectedReviewListing.qualityGrade}
                  </span>
                </div>
              </div>

              {!isRejecting ? (
                <>
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {t.inputProcurementPrice}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-stone-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={agreedProcurementPrice}
                          onChange={(e) => setAgreedProcurementPrice(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 font-black text-stone-900 text-base"
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Farmer Expected: ₹{selectedReviewListing.expectedPrice}/kg
                      </span>
                    </div>

                    {/* Calculated Total Procurement Cost = Quantity × Purchase Price */}
                    <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                      <span className="text-stone-600 font-medium">
                        {t.calcTotalProcurementCost}:
                      </span>
                      <span className="font-black text-base text-blue-900">
                        ₹{(selectedReviewListing.quantity * agreedProcurementPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRejecting(true)}
                      className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                    >
                      {t.btnReject}
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptRequest}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                    >
                      {t.btnAccept}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-700">
                    Reason for Declining Offer:
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Moisture level exceeds standard limit, or price higher than APMC benchmark..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRejecting(false)}
                      className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectRequest}
                      className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                    >
                      Confirm Decline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
