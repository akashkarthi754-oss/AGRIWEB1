import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceProduct, QualityGrade } from '../../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Zap,
  Tag,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ProductDetailsModal } from './ProductDetailsModal';
import { CheckoutModal } from './CheckoutModal';

export const Marketplace: React.FC = () => {
  const {
    t,
    language,
    marketplaceProducts,
    addToCart,
    selectedProductForDetails,
    setSelectedProductForDetails,
  } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'availability'>('availability');

  // Checkout modal state for "Buy Now"
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<{
    product: MarketplaceProduct;
    quantity: number;
  } | null>(null);

  // Extract unique categories and locations
  const categories = useMemo(() => {
    const set = new Set(marketplaceProducts.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [marketplaceProducts]);

  const locations = useMemo(() => {
    const set = new Set(marketplaceProducts.map((p) => p.sourceRegion.split(',')[0].trim()));
    return ['all', ...Array.from(set)];
  }, [marketplaceProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return marketplaceProducts
      .filter((item) => {
        // Search term matches English name or Tamil name or region
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          item.name.toLowerCase().includes(term) ||
          (item.tamilName && item.tamilName.toLowerCase().includes(term)) ||
          item.sourceRegion.toLowerCase().includes(term);

        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;

        const matchesQuality =
          selectedQuality === 'all' || item.qualityGrade === selectedQuality;

        const matchesLocation =
          selectedLocation === 'all' || item.sourceRegion.includes(selectedLocation);

        const matchesPrice = item.pricePerKg <= maxPrice;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesQuality &&
          matchesLocation &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.pricePerKg - b.pricePerKg;
        if (sortBy === 'price_desc') return b.pricePerKg - a.pricePerKg;
        return b.availableQuantity - a.availableQuantity;
      });
  }, [
    marketplaceProducts,
    searchTerm,
    selectedCategory,
    selectedQuality,
    selectedLocation,
    maxPrice,
    sortBy,
  ]);

  const handleBuyNow = (product: MarketplaceProduct, quantity: number) => {
    setDirectCheckoutItem({ product, quantity });
    setIsDirectCheckoutOpen(true);
    setSelectedProductForDetails(null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedQuality('all');
    setSelectedLocation('all');
    setMaxPrice(100);
    setSortBy('availability');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'en' ? 'Direct Farm Procurement' : 'நேரடி தோட்ட கொள்முதல்'}</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t.marketplaceTitle}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t.marketplaceSubtitle}
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        {/* Search Input & Sort By */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-700 focus:border-emerald-500 bg-white"
            >
              <option value="availability">{t.sortAvailability}</option>
              <option value="price_asc">{t.sortPriceLowHigh}</option>
              <option value="price_desc">{t.sortPriceHighLow}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? t.filterAllCategories : cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar: Quality Grade, Location, Max Price */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-center text-xs">
          {/* Quality Grade Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              {t.filterQuality}
            </label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-medium"
            >
              <option value="all">All Grades (A, B, C)</option>
              <option value="Grade A">Grade A (Premium)</option>
              <option value="Grade B">Grade B (Commercial)</option>
              <option value="Grade C">Grade C (Bulk / Process)</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              {t.filterLocation}
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-medium"
            >
              <option value="all">All Supply Districts</option>
              {locations.filter((l) => l !== 'all').map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-stone-500 mb-1">
              <span>{t.filterPriceRange}</span>
              <span className="text-emerald-700 font-black">₹{maxPrice}/kg</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="2"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Reset Filters' : 'வடிகட்டிகளை அழிக்க'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">{t.noVegetablesFound}</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {language === 'en'
              ? 'Try adjusting your search keywords, price slider, or select all categories.'
              : 'தேடல் சொற்கள் அல்லது விலை வரம்பை மாற்றி மீண்டும் முயற்சிக்கவும்.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
          >
            {language === 'en' ? 'Show All Produce' : 'அனைத்தையும் காட்டுக'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Quality badge */}
              <div
                className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
                onClick={() => setSelectedProductForDetails(prod)}
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md">
                    {prod.qualityGrade}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-semibold">
                    {t.badgeFresh}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs text-xs font-bold text-stone-800">
                  {prod.availableQuantity} {prod.unit} {t.availableStock}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {prod.sourceRegion}
                    </span>
                    <span>MOQ: {prod.minOrderQuantity} {prod.unit}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedProductForDetails(prod)}
                    className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {prod.name}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-stone-900">
                        ₹{prod.pricePerKg}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">/{prod.unit}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      {language === 'en' ? 'Farm Inspected' : 'பரிசோதிக்கப்பட்டது'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(prod, prod.minOrderQuantity)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-xs transition-colors"
                      title={t.btnAddToCart}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{t.btnAddToCart}</span>
                    </button>

                    <button
                      onClick={() => handleBuyNow(prod, prod.minOrderQuantity)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs shadow-xs transition-colors"
                      title={t.btnBuyNow}
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>{t.btnBuyNow}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
        onProceedToCheckout={handleBuyNow}
      />

      {/* Direct Buy Checkout Modal */}
      <CheckoutModal
        isOpen={isDirectCheckoutOpen}
        onClose={() => {
          setIsDirectCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        directProduct={directCheckoutItem?.product}
        directQuantity={directCheckoutItem?.quantity}
      />
    </div>
  );
};
