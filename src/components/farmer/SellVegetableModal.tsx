import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualityGrade, UnitType } from '../../types';
import { X, Upload, Sprout, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SellVegetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_VEGETABLE_IMAGES: Record<string, string> = {
  Tomatoes: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  Onions: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
  Potatoes: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  Carrots: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
  Capsicum: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
  Cabbage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  Chillies: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
  Cauliflower: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80',
};

export const SellVegetableModal: React.FC<SellVegetableModalProps> = ({ isOpen, onClose }) => {
  const { t, language, addFarmerListing } = useApp();

  const [vegetableName, setVegetableName] = useState('');
  const [vegetableCategory, setVegetableCategory] = useState('Solanaceous');
  const [quantity, setQuantity] = useState<number | ''>(500);
  const [unit, setUnit] = useState<UnitType>('kg');
  const [expectedPrice, setExpectedPrice] = useState<number | ''>(32);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Ottanchathiram, Dindigul');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_VEGETABLE_IMAGES['Tomatoes']);
  const [selectedPreset, setSelectedPreset] = useState('Tomatoes');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handlePresetSelect = (key: string) => {
    setSelectedPreset(key);
    setImageUrl(PRESET_VEGETABLE_IMAGES[key]);
    if (!vegetableName || Object.keys(PRESET_VEGETABLE_IMAGES).includes(vegetableName)) {
      setVegetableName(key);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vegetableName || !quantity || !expectedPrice || !location) return;

    addFarmerListing({
      farmerId: 'FARM-MY',
      farmerName: 'Rajesh Kumar (You)',
      farmName: 'Green Crest Organic Farm',
      contact: '+91 98401 23456',
      vegetableName,
      vegetableCategory,
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      qualityGrade,
      harvestDate,
      location,
      state: 'Tamil Nadu',
      imageUrl: imageUrl || PRESET_VEGETABLE_IMAGES['Tomatoes'],
      notes,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 border border-emerald-500/40 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.sellModalTitle}</h2>
              <p className="text-xs text-emerald-200 mt-0.5">{t.sellModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-stone-900">{t.sellSuccessMsg}</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">{t.sellSuccessSubtext}</p>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-medium max-w-sm mx-auto border border-emerald-200">
              {language === 'en'
                ? 'Status: Pending Procurement Review. Check the Farmer Dashboard or Procurement Center to see it listed!'
                : 'கொள்முதல் பரிசீலனையில் சேர்க்கப்பட்டுள்ளது. விவசாயி மற்றும் கொள்முதல் மையத்தில் உடனடியாக காணலாம்!'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Quick Preset Selector for Photos */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                {language === 'en' ? 'Quick Photo & Crop Template' : 'பயிர் மாதிரி புகைப்படம்'}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Object.keys(PRESET_VEGETABLE_IMAGES).map((crop) => (
                  <button
                    type="button"
                    key={crop}
                    onClick={() => handlePresetSelect(crop)}
                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                      selectedPreset === crop
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={PRESET_VEGETABLE_IMAGES[crop]}
                      alt={crop}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <span className="text-[10px] font-semibold text-stone-700 mt-1 truncate w-full text-center">
                      {crop}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 1: Name and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formVegetableName} *
                </label>
                <input
                  type="text"
                  required
                  value={vegetableName}
                  onChange={(e) => setVegetableName(e.target.value)}
                  placeholder="e.g. Tomatoes (நாட்டுத் தக்காளி)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formCategory}
                </label>
                <select
                  value={vegetableCategory}
                  onChange={(e) => setVegetableCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white"
                >
                  <option value="Solanaceous">Solanaceous (Tomato, Brinjal, Capsicum)</option>
                  <option value="Alliums">Alliums (Onion, Shallots, Garlic)</option>
                  <option value="Root Crops">Root Crops (Carrot, Potato, Radish, Beetroot)</option>
                  <option value="Brassicas">Brassicas (Cabbage, Cauliflower, Broccoli)</option>
                  <option value="Spices">Spices (Green Chillies, Ginger)</option>
                  <option value="Leafy Greens">Leafy Greens (Spinach, Coriander)</option>
                </select>
              </div>
            </div>

            {/* Grid 2: Quantity, Unit, Expected Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formQuantity} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formUnit}
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ton">Tonnes (ton)</option>
                  <option value="quintal">Quintals (100 kg)</option>
                  <option value="box">Crates / Boxes (box)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formExpectedPrice} *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Grid 3: Quality Grade, Harvest Date, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formQualityGrade}
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white font-medium"
                >
                  <option value="Grade A">Grade A (Premium Export Quality, Uniform)</option>
                  <option value="Grade B">Grade B (Standard Commercial Fresh)</option>
                  <option value="Grade C">Grade C (Processing / Bulk Grade)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formHarvestDate}
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.formLocation} *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ottanchathiram, Dindigul"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                />
              </div>
            </div>

            {/* Custom Image URL (optional) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'en' ? 'Vegetable Image URL' : 'புகைப்பட இணைய முகவரி'}
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.formAdditionalNotes}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Mention seed variety, natural manure usage, packing crate details...'
                    : 'விதை ரகம், இயற்கை உரம், பேக்கிங் பெட்டிகள் பற்றிய விவரங்களை குறிப்பிடவும்...'
                }
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Total Estimated Value preview */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 font-medium">
                  {language === 'en' ? 'Estimated Total Payout:' : 'எதிர்பார்க்கப்படும் மொத்தத் தொகை:'}
                </span>
                <span className="text-stone-400 block text-[10px]">
                  {quantity || 0} {unit} × ₹{expectedPrice || 0}
                </span>
              </div>
              <span className="text-base font-black text-emerald-700">
                ₹{((Number(quantity) || 0) * (Number(expectedPrice) || 0)).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
              >
                {t.formCancelBtn}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                {t.formSubmitBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
