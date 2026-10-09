import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sprout, Phone, ShieldCheck, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, setActivePage, setIsSellModalOpen } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Agri<span className="text-emerald-500">Market</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              {t.transparentCommitment}
            </p>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>{t.contactSupport}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Email: operations@agrimarketplatform.org | Support Hours: 05:00 AM - 10:00 PM IST
              </p>
            </div>
          </div>

          {/* Col 3: For Farmers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'en' ? 'For Farmers' : 'விவசாயிகளுக்கு'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.btnSellVegetables}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('farmer_dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.farmerDashboardTitle}
                </button>
              </li>
              <li>
                <span className="text-stone-500">
                  {language === 'en' ? 'Quality Grading Standards' : 'தர நிர்ணய நெறிமுறைகள்'}
                </span>
              </li>
              <li>
                <span className="text-stone-500">
                  {language === 'en' ? '24h Bank Transfer Guarantee' : '24 மணிநேர நேரடி வங்கி செலுத்துதல்'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: For Commercial Buyers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'en' ? 'For Buyers' : 'வாங்குபவர்களுக்கு'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('marketplace')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navMarketplace}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('tracking')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navTrackOrder}
                </button>
              </li>
              <li>
                <span className="text-stone-500">
                  {language === 'en' ? 'Wholesale Pricing Model' : 'மொத்த விலை முறை'}
                </span>
              </li>
              <li>
                <span className="text-stone-500">
                  {language === 'en' ? 'Cold-Chain Integrity' : 'குளிர்சாதனப் பாதுகாப்பு'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Logistics & Procurement */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'en' ? 'Platform Command' : 'தள மேலாண்மை'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('procurement')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navProcurement}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('transport')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navTransport}
                </button>
              </li>
              <li>
                <a
                  href="/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
                >
                  Swagger REST API Docs ↗
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('tracking')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'en' ? 'Live GPS Dispatch' : 'நேரடி ஜிபிஎஸ் மேலாண்மை'}
                </button>
              </li>
              <li>
                <span className="text-stone-500">
                  {language === 'en' ? 'District Hub Coverage' : '32 மாவட்ட நெட்வொர்க்'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{t.allRightsReserved}</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Procurement</span>
            <span>•</span>
            <span>Farmer Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
