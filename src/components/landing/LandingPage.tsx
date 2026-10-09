import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  ShoppingBag,
  Truck,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Coins,
  MapPin,
  Clock,
  Search,
  Scale,
  Sparkles,
  Users,
  Building2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    t,
    language,
    setActivePage,
    setIsSellModalOpen,
    marketplaceProducts,
    setSelectedProductForDetails,
    setSelectedTrackingOrderId,
  } = useApp();

  const { user, isAuthenticated } = useAuth();

  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      setSelectedTrackingOrderId(quickTrackInput.trim().toUpperCase());
      setActivePage('tracking');
    }
  };

  const featuredProduce = marketplaceProducts.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Personalized Welcome Header Banner */}
      {isAuthenticated && user ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 -mb-8 sm:-mb-12 relative z-20">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-stone-900">
                    Welcome back, {user.name}!
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold capitalize">
                    {user.role === 'logistics' ? 'Transporter' : user.role} Account
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">{user.email}</p>
              </div>
            </div>

            {/* Role-Specific Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {user.role === 'farmer' && (
                <>
                  <button
                    onClick={() => setIsSellModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Sell Vegetables
                  </button>
                  <button
                    onClick={() => setActivePage('farmer_dashboard')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    My Listings
                  </button>
                  <button
                    onClick={() => setActivePage('procurement')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Procurement Status
                  </button>
                </>
              )}

              {user.role === 'buyer' && (
                <>
                  <button
                    onClick={() => setActivePage('marketplace')}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Marketplace
                  </button>
                  <button
                    onClick={() => setActivePage('marketplace')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => setActivePage('procurement')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Requirements
                  </button>
                </>
              )}

              {(user.role === 'transporter' || user.role === 'logistics') && (
                <>
                  <button
                    onClick={() => setActivePage('transport')}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Transport Requests
                  </button>
                  <button
                    onClick={() => setActivePage('transport')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Active Trips
                  </button>
                  <button
                    onClick={() => setActivePage('tracking')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Tracking
                  </button>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActivePage('admin_dashboard')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => setActivePage('procurement')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Procurement
                  </button>
                  <button
                    onClick={() => setActivePage('marketplace')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => setActivePage('admin_dashboard')}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    Analytics
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 -mb-8 sm:-mb-12 relative z-20">
          <div className="bg-emerald-900/60 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <Sprout className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Welcome to AgriConnect:</strong> Connect farmers directly with buyers and transport partners.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('login')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs transition-colors shadow-xs"
              >
                Login
              </button>
              <button
                onClick={() => setActivePage('signup')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 rounded-b-3xl sm:rounded-b-[48px] shadow-2xl">
        {/* Subtle decorative background glow and pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                {t.heroTitle} <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300">
                  {t.heroHighlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                {t.heroSubtitle}
              </p>

              {/* 3 Prominent CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Sprout className="w-5 h-5 text-emerald-100" />
                  <span>{t.heroBtnSell}</span>
                </button>

                <button
                  onClick={() => setActivePage('marketplace')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-5 h-5 text-emerald-700" />
                  <span>{t.heroBtnBuy}</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('marketplace-preview');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else setActivePage('marketplace');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60 font-semibold text-sm hover:scale-[1.02] transition-all"
                >
                  <span>{t.heroBtnExplore}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Order Tracking Widget */}
              <div className="pt-4 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleTrackSubmit}
                  className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 focus-within:border-emerald-400 transition-colors"
                >
                  <Search className="w-4 h-4 text-emerald-300 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={quickTrackInput}
                    onChange={(e) => setQuickTrackInput(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Quick Track Order (e.g. ORD-8492)'
                        : 'ஆர்டரை கண்காணிக்க (எ.கா: ORD-8492)'
                    }
                    className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-emerald-200/60 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-colors shrink-0"
                  >
                    {language === 'en' ? 'Track' : 'தேடு'}
                  </button>
                </form>
                <div className="flex items-center gap-2 text-[11px] text-emerald-300/80 mt-1.5 pl-1">
                  <span>💡 {language === 'en' ? 'Try tracking:' : 'முயற்சிக்க:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrackingOrderId('ORD-8492');
                      setActivePage('tracking');
                    }}
                    className="underline hover:text-white font-mono"
                  >
                    ORD-8492
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrackingOrderId('ORD-5120');
                      setActivePage('tracking');
                    }}
                    className="underline hover:text-white font-mono"
                  >
                    ORD-5120
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Composite Card with Live Workflow */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="bg-stone-900/90 border border-emerald-700/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        🌾
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                          {language === 'en' ? 'Supply Chain Live Snapshot' : 'நேரடி விநியோக நிலை'}
                        </h4>
                        <p className="text-[10px] text-emerald-400 font-medium">
                          {language === 'en' ? 'Active Farm-to-Buyer Pipeline' : 'நேரடி கொள்முதல் பயணம்'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 animate-pulse">
                      ● LIVE
                    </span>
                  </div>

                  {/* Visual Journey Steps */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Ottanchathiram Farm Gate</p>
                          <p className="text-[10px] text-stone-400">1,200 kg Tomatoes • Grade A</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400">₹30/kg</span>
                        <p className="text-[9px] text-stone-400">Farmer Paid</p>
                      </div>
                    </div>

                    <div className="flex justify-center -my-1 text-emerald-400">
                      <span className="text-xs font-bold bg-stone-800 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                        ↓ {language === 'en' ? 'We Procure & Quality Test' : 'கொள்முதல் & தரம் அறிதல்'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">GreenLine Logistics (Canter)</p>
                          <p className="text-[10px] text-stone-400">380 km Transit • GPS Active</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-blue-400">₹4/kg</span>
                        <p className="text-[9px] text-stone-400">Freight Cost</p>
                      </div>
                    </div>

                    <div className="flex justify-center -my-1 text-emerald-400">
                      <span className="text-xs font-bold bg-stone-800 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                        ↓ {language === 'en' ? 'Buyer Delivery' : 'வாங்குபவர் டெலிவரி'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Ananya Supermarkets</p>
                          <p className="text-[10px] text-stone-400">Koyambedu, Chennai</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-400">₹42/kg</span>
                        <p className="text-[9px] text-stone-400">Wholesale Price</p>
                      </div>
                    </div>
                  </div>

                  {/* Profit summary callout */}
                  <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium">
                      {language === 'en' ? 'Platform Margin / Handling:' : 'தளத்தின் நிகர லாபம் / செலவு:'}
                    </span>
                    <span className="font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md">
                      ₹6.00 / kg (14.2%)
                    </span>
                  </div>
                </div>

                {/* Floating trust badge */}
                <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-6 bg-white text-stone-900 px-4 py-2.5 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black">Zero Middleman Fraud</p>
                    <p className="text-[10px] text-stone-500">Fixed procurement guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Performance Stats Bar */}
          <div className="mt-14 sm:mt-20 pt-8 border-t border-emerald-800/60 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-300">12,500+</p>
              <p className="text-xs text-emerald-200/80 font-medium">{t.heroStatsFarmers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-300">85,000+ T</p>
              <p className="text-xs text-emerald-200/80 font-medium">{t.heroStatsVegetablesSold}</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-300">32</p>
              <p className="text-xs text-emerald-200/80 font-medium">{t.heroStatsDistricts}</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-amber-300">&lt; 24 Hrs</p>
              <p className="text-xs text-emerald-200/80 font-medium">{t.heroStatsFastPayout}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section: 5 Step Visual Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Our End-to-End Operation' : 'முழுமையான செயல்முறை'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
            {t.howItWorksTitle}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* 5-Step Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600">
                  Step 01
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{t.step1Title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{t.step1Desc}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span>{language === 'en' ? 'Free Farm Gate Listing' : 'இலவச பயிர் பதிவு'}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                  Step 02
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{t.step2Title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{t.step2Desc}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-blue-700 flex items-center gap-1">
              <span>{language === 'en' ? 'Quality & Price Locked' : 'தர பரிசோதனை'}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">
                  Step 03
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{t.step3Title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{t.step3Desc}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-purple-700 flex items-center gap-1">
              <span>{language === 'en' ? 'Cold/Dry Transit Assigned' : 'வாகனம் ஒதுக்கீடு'}</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                  Step 04
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{t.step4Title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{t.step4Desc}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
              <span>{language === 'en' ? 'Clear Itemized Billing' : 'வெளிப்படையான விலை'}</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-300 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group bg-gradient-to-b from-white to-emerald-50/50">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                  Step 05
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{t.step5Title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{t.step5Desc}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <span>{language === 'en' ? 'Live GPS Order Tracking' : 'நேரடி கண்காணிப்பு'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Model Clarification: The Procurement Partner Advantage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                {language === 'en' ? 'Core Business Model' : 'வணிக மாதிரி'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {t.businessModelTitle}
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {t.businessModelSubtitle}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'en' ? 'Direct Farm Purchases' : 'தோட்டத்திலேயே கொள்முதல்'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'en' ? 'Fixed Fair Price' : 'நிலையான நியாய விலை'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'en' ? 'Full Transit Responsibility' : 'முழு போக்குவரத்து பொறுப்பு'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sprout className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{t.farmerBenefitTitle}</h4>
                <p className="text-xs text-stone-300">{t.farmerBenefitDesc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{t.procurementBenefitTitle}</h4>
                <p className="text-xs text-stone-300">{t.procurementBenefitDesc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{t.buyerBenefitTitle}</h4>
                <p className="text-xs text-stone-300">{t.buyerBenefitDesc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{t.transportBenefitTitle}</h4>
                <p className="text-xs text-stone-300">{t.transportBenefitDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Marketplace Produce Preview */}
      <section id="marketplace-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'en' ? 'Freshly Procured & Ready' : 'கொள்முதல் செய்யப்பட்ட காய்கறிகள்'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t.marketplaceTitle}
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              {t.marketplaceSubtitle}
            </p>
          </div>
          <button
            onClick={() => setActivePage('marketplace')}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>{language === 'en' ? 'View all available produce' : 'அனைத்து காய்கறிகளையும் காண்க'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProduce.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
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

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {prod.sourceRegion}
                    </span>
                    <span>MOQ: {prod.minOrderQuantity} {prod.unit}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-stone-900">
                      ₹{prod.pricePerKg}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/{prod.unit}</span>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      {language === 'en' ? 'Procured @ ' : 'கொள்முதல் @ '}₹{prod.procurementPrice}/kg
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProductForDetails(prod)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition-colors shadow-2xs"
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Role Switcher Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">
                {language === 'en' ? 'Experience the Entire Agriculture Ecosystem' : 'அனைத்து பயனர் அனுபவங்களையும் முயற்சிக்கவும்'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 max-w-xl">
                {language === 'en'
                  ? 'Switch roles seamlessly using the top bar selector: List vegetables as a Farmer, accept crops and calculate profits as Procurement, or manage deliveries as Transport!'
                  : 'விவசாயியாக பயிர் விற்க, கொள்முதல் அதிகாரியாக லாபம் கணக்கிட, போக்குவரத்து மேலாளராக வாகனங்களை இயக்க ஒரே கிளிக்கில் மாற்றிப் பாருங்கள்!'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActivePage('farmer_dashboard')}
              className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              🌱 {language === 'en' ? 'Farmer Hub' : 'விவசாயி பிரிவு'}
            </button>
            <button
              onClick={() => setActivePage('procurement')}
              className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              💼 {language === 'en' ? 'Procurement Center' : 'கொள்முதல் மையம்'}
            </button>
            <button
              onClick={() => setActivePage('transport')}
              className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              🚚 {language === 'en' ? 'Transport Fleet' : 'போக்குவரத்து பிரிவு'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
