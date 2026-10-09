import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  TrendingUp,
  Percent,
  IndianRupee,
  Truck,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProfitCalculator: React.FC = () => {
  const { t, language } = useApp();

  // Dynamic calculator state with default realistic values from user prompt
  const [purchasePrice, setPurchasePrice] = useState<number>(30); // ₹30/kg
  const [sellingPrice, setSellingPrice] = useState<number>(42); // ₹42/kg
  const [transportCost, setTransportCost] = useState<number>(4); // ₹4/kg
  const [handlingCost, setHandlingCost] = useState<number>(2); // ₹2/kg
  const [batchVolumeKg, setBatchVolumeKg] = useState<number>(1000); // 1 Ton batch

  // Formulas
  // Expected Profit per kg = Selling Price - Purchase Price - Transport Cost - Handling Cost
  const netProfitPerKg = sellingPrice - purchasePrice - transportCost - handlingCost;
  const profitPercentage = sellingPrice > 0 ? ((netProfitPerKg / sellingPrice) * 100).toFixed(1) : '0';

  // Batch totals
  const totalPurchaseCost = purchasePrice * batchVolumeKg;
  const totalSellingRevenue = sellingPrice * batchVolumeKg;
  const totalTransportCost = transportCost * batchVolumeKg;
  const totalHandlingCost = handlingCost * batchVolumeKg;
  const totalNetProfit = netProfitPerKg * batchVolumeKg;
  const grossMarginSpread = sellingPrice - purchasePrice;

  // Percentage shares of selling price for visual breakdown bar
  const purchaseShare = Math.min(100, Math.max(0, (purchasePrice / sellingPrice) * 100));
  const transportShare = Math.min(100, Math.max(0, (transportCost / sellingPrice) * 100));
  const handlingShare = Math.min(100, Math.max(0, (handlingCost / sellingPrice) * 100));
  const profitShare = Math.max(0, 100 - purchaseShare - transportShare - handlingShare);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Live Margin Modeling' : 'நிகர லாப மாதிரி'}</span>
          </div>
          <h3 className="text-xl font-black text-stone-900">{t.profitCalcTitle}</h3>
          <p className="text-xs text-stone-500 max-w-xl">{t.profitCalcSubtitle}</p>
        </div>

        {/* Batch Volume Toggle */}
        <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-2xl border border-stone-200 text-xs">
          <span className="font-bold text-stone-500 pl-2">Batch:</span>
          {[500, 1000, 5000].map((vol) => (
            <button
              key={vol}
              onClick={() => setBatchVolumeKg(vol)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                batchVolumeKg === vol
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              {vol >= 1000 ? `${vol / 1000} Ton` : `${vol} kg`}
            </button>
          ))}
        </div>
      </div>

      {/* Input Sliders & Number Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Farmer Purchase Price */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <label className="text-[11px] font-bold text-stone-600 block">
            {t.fieldFarmerPurchasePrice}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-black text-sm">₹</span>
            <input
              type="number"
              min="1"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-black text-stone-900 text-base focus:border-emerald-500 bg-white"
            />
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* 2. Buyer Selling Price */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <label className="text-[11px] font-bold text-stone-600 block">
            {t.fieldSellingPrice}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-black text-sm">₹</span>
            <input
              type="number"
              min="1"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-black text-stone-900 text-base focus:border-emerald-500 bg-white"
            />
          </div>
          <input
            type="range"
            min="15"
            max="120"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* 3. Transport Cost */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <label className="text-[11px] font-bold text-stone-600 block">
            {t.fieldTransportCostPerKg}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-black text-sm">₹</span>
            <input
              type="number"
              min="0"
              value={transportCost}
              onChange={(e) => setTransportCost(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-black text-stone-900 text-base focus:border-emerald-500 bg-white"
            />
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={transportCost}
            onChange={(e) => setTransportCost(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        {/* 4. Handling & Storage Cost */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <label className="text-[11px] font-bold text-stone-600 block">
            {t.fieldHandlingCostPerKg}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-black text-sm">₹</span>
            <input
              type="number"
              min="0"
              value={handlingCost}
              onChange={(e) => setHandlingCost(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-black text-stone-900 text-base focus:border-emerald-500 bg-white"
            />
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={handlingCost}
            onChange={(e) => setHandlingCost(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Visual Dynamic Breakdown Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-stone-700">
            {language === 'en' ? 'Cost & Margin Breakdown per Kilogram' : 'ஒரு கிலோவிற்கான செலவு மற்றும் லாபப் பகிர்வு'}
          </span>
          <span className="font-mono text-stone-500 text-[11px]">
            {t.calcFormulaExplanation}
          </span>
        </div>

        <div className="h-6 w-full rounded-xl overflow-hidden flex bg-stone-200">
          <div
            style={{ width: `${purchaseShare}%` }}
            className="bg-blue-500 transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`Farmer Cost: ₹${purchasePrice}`}
          >
            {purchaseShare > 15 && `Farmer ₹${purchasePrice}`}
          </div>
          <div
            style={{ width: `${transportShare}%` }}
            className="bg-purple-500 transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`Transport: ₹${transportCost}`}
          >
            {transportShare > 10 && `Transport ₹${transportCost}`}
          </div>
          <div
            style={{ width: `${handlingShare}%` }}
            className="bg-amber-500 transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`Handling: ₹${handlingCost}`}
          >
            {handlingShare > 10 && `Handling ₹${handlingCost}`}
          </div>
          <div
            style={{ width: `${Math.max(0, profitShare)}%` }}
            className="bg-emerald-500 transition-all flex items-center justify-center text-[10px] text-white font-black"
            title={`Net Profit: ₹${netProfitPerKg}`}
          >
            {profitShare > 10 && `Profit ₹${netProfitPerKg}`}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Farmer: ₹{purchasePrice}/kg ({purchaseShare.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Transport: ₹{transportCost}/kg ({transportShare.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Handling: ₹{handlingCost}/kg ({handlingShare.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Net Profit: ₹{netProfitPerKg}/kg ({profitShare.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Outcome Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Net Profit per kg */}
        <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
          netProfitPerKg >= 0
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-red-50 border-red-200 text-red-950'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span>{t.calcExpectedProfit}</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black">
            ₹{netProfitPerKg} <span className="text-xs font-semibold">/ kg</span>
          </p>
          <p className="text-[11px] font-medium opacity-80">
            ₹{sellingPrice} - ₹{purchasePrice} - ₹{transportCost} - ₹{handlingCost}
          </p>
        </div>

        {/* Profit Margin % */}
        <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-300">
            <span>{t.calcProfitPercentage}</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {profitPercentage}%
          </p>
          <p className="text-[11px] text-stone-400">
            {language === 'en' ? 'Net Return on Revenue' : 'வருவாயில் நிகர லாபம்'}
          </p>
        </div>

        {/* Total Batch Profit */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>{batchVolumeKg} kg Net Earnings</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-stone-900">
            ₹{totalNetProfit.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-500">
            {language === 'en' ? 'Revenue:' : 'வருமானம்:'} ₹{totalSellingRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Total Cost Outflow */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Total Logistics & Cost</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-stone-900">
            ₹{(totalPurchaseCost + totalTransportCost + totalHandlingCost).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-500">
            {language === 'en' ? 'Procure:' : 'கொள்முதல்:'} ₹{totalPurchaseCost.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};
