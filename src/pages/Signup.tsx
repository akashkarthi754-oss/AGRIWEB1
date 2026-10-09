import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  Phone,
  Mail,
  Building,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ShoppingBag,
  Truck,
  Shield,
  Key,
} from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const { setActivePage, setCurrentRole } = useApp();

  // Role Selection: farmer | buyer | transporter | admin
  const [role, setRole] = useState<'farmer' | 'buyer' | 'transporter' | 'admin'>('farmer');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Location fields
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Dindigul');
  const [village, setVillage] = useState('Ottanchathiram');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('624619');

  // Farmer specific fields
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('5 Acres');
  const [primaryCrops, setPrimaryCrops] = useState('Tomatoes, Chillies, Onions');

  // Buyer specific fields
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('Wholesaler');
  const [city, setCity] = useState('');

  // Transporter specific fields
  const [transportAgencyName, setTransportAgencyName] = useState('');
  const [vehicleType, setVehicleType] = useState('Tata Ace');
  const [vehicleRegNumber, setVehicleRegNumber] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('1.5 Ton');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [operatingState, setOperatingState] = useState('Tamil Nadu');
  const [operatingDistrict, setOperatingDistrict] = useState('Dindigul');

  // Admin specific invite code
  const [adminInviteCode, setAdminInviteCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!name.trim()) {
      setErrorMsg('Full Name is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (role === 'admin' && !adminInviteCode.trim()) {
      setErrorMsg('Admin Invitation Code is required to create an Administrator account.');
      return;
    }

    // Build payload according to role
    const payload: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      password,
      role,
      location: {
        state: state.trim(),
        district: district.trim(),
        village: village.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
      },
    };

    if (role === 'farmer') {
      payload.organization = farmName.trim() || undefined;
      payload.farmerDetails = {
        farmName: farmName.trim(),
        farmSize: farmSize.trim(),
        primaryCrops: primaryCrops.trim(),
      };
    } else if (role === 'buyer') {
      payload.organization = companyName.trim() || undefined;
      payload.buyerDetails = {
        businessType,
        city: city.trim() || district.trim(),
      };
    } else if (role === 'transporter') {
      payload.organization = transportAgencyName.trim() || undefined;
      payload.transporterDetails = {
        transportAgencyName: transportAgencyName.trim(),
        vehicleType,
        vehicleRegNumber: vehicleRegNumber.trim(),
        vehicleCapacity: vehicleCapacity.trim(),
        driverName: driverName.trim() || name.trim(),
        driverPhone: driverPhone.trim() || cleanPhone,
        operatingState: operatingState.trim(),
        operatingDistrict: operatingDistrict.trim(),
      };
    } else if (role === 'admin') {
      payload.adminInviteCode = adminInviteCode.trim();
    }

    const result = await signup(payload);

    if (result.success && result.user) {
      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
      const userRole = result.user.role;

      setTimeout(() => {
        if (userRole === 'farmer') {
          setCurrentRole('farmer');
          setActivePage('farmer_dashboard');
        } else if (userRole === 'buyer') {
          setCurrentRole('buyer');
          setActivePage('marketplace');
        } else if (userRole === 'transporter' || userRole === 'logistics') {
          setCurrentRole('transport');
          setActivePage('transport');
        } else if (userRole === 'admin') {
          setCurrentRole('procurement');
          setActivePage('admin_dashboard');
        } else {
          setActivePage('home');
        }
      }, 700);
    } else {
      setErrorMsg(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs mb-2">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Create Your AgriConnect Account
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Connect with farmers, buyers and transport partners.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
            Select Your Account Role <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Farmer Card */}
            <button
              type="button"
              onClick={() => {
                setRole('farmer');
                setErrorMsg('');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                role === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌾</span>
                {role === 'farmer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Farmer</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">Sell produce</p>
              </div>
            </button>

            {/* Buyer Card */}
            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                setErrorMsg('');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                role === 'buyer'
                  ? 'border-amber-600 bg-amber-50/80 shadow-sm ring-2 ring-amber-500/20'
                  : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛒</span>
                {role === 'buyer' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Buyer</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">Procure crops</p>
              </div>
            </button>

            {/* Transporter Card */}
            <button
              type="button"
              onClick={() => {
                setRole('transporter');
                setErrorMsg('');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                role === 'transporter'
                  ? 'border-purple-600 bg-purple-50/80 shadow-sm ring-2 ring-purple-500/20'
                  : 'border-stone-200 hover:border-purple-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚚</span>
                {role === 'transporter' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Transporter</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">Fleet transit</p>
              </div>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setErrorMsg('');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                role === 'admin'
                  ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-stone-200 hover:border-blue-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛡️</span>
                {role === 'admin' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Admin</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">Operations</p>
              </div>
            </button>
          </div>
          {role === 'admin' && (
            <p className="text-xs text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-200 flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin registration requires a valid authorization invite code (Default: <code>AGRICONNECT_ADMIN_2026</code>).</span>
            </p>
          )}
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (10 digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {role === 'admin' ? (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Admin Invitation Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={adminInviteCode}
                      onChange={(e) => setAdminInviteCode(e.target.value)}
                      placeholder="AGRICONNECT_ADMIN_2026"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-blue-300 bg-blue-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {role === 'farmer' && 'Farm / Organization Name (Optional)'}
                    {role === 'buyer' && 'Company / Organization Name *'}
                    {role === 'transporter' && 'Transport Agency Name *'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      required={role === 'buyer' || role === 'transporter'}
                      value={
                        role === 'farmer'
                          ? farmName
                          : role === 'buyer'
                          ? companyName
                          : transportAgencyName
                      }
                      onChange={(e) => {
                        if (role === 'farmer') setFarmName(e.target.value);
                        else if (role === 'buyer') setCompanyName(e.target.value);
                        else setTransportAgencyName(e.target.value);
                      }}
                      placeholder={
                        role === 'farmer'
                          ? 'e.g. Patel Organic Farms'
                          : role === 'buyer'
                          ? 'e.g. FreshField Foods India Pvt Ltd'
                          : 'e.g. Kisan Gati Fleet Services'
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Role Specific Details */}
          {role === 'farmer' && (
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                🌾 Farmer Farm Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Farm Land Size (Optional)
                  </label>
                  <input
                    type="text"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    placeholder="e.g. 5 Acres"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Harvest Crops (Optional)
                  </label>
                  <input
                    type="text"
                    value={primaryCrops}
                    onChange={(e) => setPrimaryCrops(e.target.value)}
                    placeholder="e.g. Tomatoes, Onions, Potatoes"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'buyer' && (
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                🛒 Buyer Business Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                  >
                    <option value="Retailer">Retailer</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Operational City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chennai / Pune"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'transporter' && (
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                🚚 Transporter Fleet Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
                  >
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Tata Ace">Tata Ace</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="3 Ton Truck">3 Ton Truck</option>
                    <option value="6 Ton Truck">6 Ton Truck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Vehicle Reg. Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleRegNumber}
                    onChange={(e) => setVehicleRegNumber(e.target.value)}
                    placeholder="TN-57-AB-1234"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Payload Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    placeholder="e.g. 2500 kg"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Driver Name
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Driver full name"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Driver Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="10-digit phone"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Location */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Location & Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Tamil Nadu"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Dindigul"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Village / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Ottanchathiram"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, Landmark"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="624619"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Security & Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password (min 8 characters) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/20 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create AgriConnect Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs sm:text-sm text-stone-600">
            Already have an account?{' '}
            <button
              onClick={() => setActivePage('login')}
              className="font-bold text-emerald-700 hover:underline"
            >
              Sign In to Your Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
