import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sprout,
  ShoppingBag,
  Truck,
  ArrowLeft,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { setActivePage } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editable fields
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [state, setState] = useState(user?.location?.state || '');
  const [district, setDistrict] = useState(user?.location?.district || '');
  const [village, setVillage] = useState(user?.location?.village || '');
  const [address, setAddress] = useState(user?.location?.address || '');
  const [pincode, setPincode] = useState(user?.location?.pincode || '');

  // Role details
  const [farmName, setFarmName] = useState(user?.farmerDetails?.farmName || '');
  const [farmSize, setFarmSize] = useState(user?.farmerDetails?.farmSize || '');
  const [primaryCrops, setPrimaryCrops] = useState(user?.farmerDetails?.primaryCrops || '');
  const [businessType, setBusinessType] = useState(user?.buyerDetails?.businessType || '');
  const [vehicleType, setVehicleType] = useState(user?.transporterDetails?.vehicleType || '');
  const [vehicleRegNumber, setVehicleRegNumber] = useState(
    user?.transporterDetails?.vehicleRegNumber || ''
  );

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setOrganization(user.organization || '');
      setState(user.location?.state || '');
      setDistrict(user.location?.district || '');
      setVillage(user.location?.village || '');
      setAddress(user.location?.address || '');
      setPincode(user.location?.pincode || '');
      setFarmName(user.farmerDetails?.farmName || '');
      setFarmSize(user.farmerDetails?.farmSize || '');
      setPrimaryCrops(user.farmerDetails?.primaryCrops || '');
      setBusinessType(user.buyerDetails?.businessType || '');
      setVehicleType(user.transporterDetails?.vehicleType || '');
      setVehicleRegNumber(user.transporterDetails?.vehicleRegNumber || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: any = {
        name,
        organization,
        location: {
          state,
          district,
          village,
          address,
          pincode,
        },
      };

      if (user?.role === 'farmer') {
        payload.farmerDetails = { farmName, farmSize, primaryCrops };
      } else if (user?.role === 'buyer') {
        payload.buyerDetails = { businessType };
      } else if (user?.role === 'transporter' || user?.role === 'logistics') {
        payload.transporterDetails = { vehicleType, vehicleRegNumber };
      }

      const res = await api.auth.updateProfile(payload);
      if (res?.success && res?.user) {
        updateUser(res.user);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMsg(res?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const roleBadge = () => {
    switch (user?.role) {
      case 'farmer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Farmer Account</span>
          </span>
        );
      case 'buyer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buyer Account</span>
          </span>
        );
      case 'transporter':
      case 'logistics':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Transporter Fleet Account</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>System Administrator</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => {
            logout();
            setActivePage('home');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-950 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black">{user?.name}</h1>
                <p className="text-emerald-200 text-xs sm:text-sm font-medium">{user?.email}</p>
                <div className="pt-1">{roleBadge()}</div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 self-start sm:self-auto transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="p-6 sm:p-8 space-y-6">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Identity & Contact Details */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Account & Identity
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50 disabled:text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Registered Email (Cannot be altered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-100 text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Registered Mobile Phone
                  </label>
                  <input
                    type="tel"
                    disabled
                    value={user?.phone || ''}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-100 text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Organization / Entity Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50 disabled:text-stone-600"
                  />
                </div>
              </div>
            </div>

            {/* Role Details */}
            {user?.role === 'farmer' && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  🌾 Farm Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Farm Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Land Area
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Harvest Crops
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={primaryCrops}
                      onChange={(e) => setPrimaryCrops(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'buyer' && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  🛒 Buyer Business Details
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Category
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                  />
                </div>
              </div>
            )}

            {(user?.role === 'transporter' || user?.role === 'logistics') && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  🚚 Fleet Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Vehicle Type
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={vehicleRegNumber}
                      onChange={(e) => setVehicleRegNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50 uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                2. Location & Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Village / City</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm disabled:bg-stone-50"
                  />
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                </span>
              </div>
              <span className="font-semibold text-emerald-700">Verified AgriConnect Account</span>
            </div>

            {/* Action Buttons when editing */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
