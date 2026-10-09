import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sprout,
  HelpCircle,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { setActivePage, setCurrentRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [devDemoOpen, setDevDemoOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address or phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const result = await login(email.trim(), password);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}! Redirecting...`);
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
      }, 500);
    } else {
      setErrorMsg(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xl">
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md shadow-emerald-600/20 mb-2">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-stone-900">
              Agri<span className="text-emerald-600">Connect</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-stone-600">
            Sign in to continue to your AgriConnect account.
          </p>
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com or 9876543210"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Remember Me</span>
            </label>
          </div>

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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Create Account Link */}
        <div className="text-center pt-3 border-t border-stone-100">
          <p className="text-xs sm:text-sm text-stone-600">
            Don't have an AgriConnect account?{' '}
            <button
              onClick={() => setActivePage('signup')}
              className="font-bold text-emerald-700 hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Optional Collapsed Development Demo Credentials (Disabled by default) */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setDevDemoOpen(!devDemoOpen)}
            className="text-[11px] text-stone-400 hover:text-stone-600 font-medium inline-flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Development Demo Accounts (Testing Only)</span>
          </button>
          {devDemoOpen && (
            <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 animate-in fade-in">
              <p className="font-semibold text-stone-700 text-[11px] mb-1">
                Demo Accounts (Password: <code>Demo@1234</code> / Admin: <code>Admin@1234</code>):
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleDemoFill('farmer@agriconnect.com', 'Demo@1234')}
                  className="p-1.5 bg-white border rounded-lg text-emerald-800 hover:bg-emerald-50 text-left font-medium"
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('buyer1@agriconnect.com', 'Demo@1234')}
                  className="p-1.5 bg-white border rounded-lg text-amber-800 hover:bg-amber-50 text-left font-medium"
                >
                  🛒 Buyer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('transporter@agriconnect.com', 'Demo@1234')}
                  className="p-1.5 bg-white border rounded-lg text-purple-800 hover:bg-purple-50 text-left font-medium"
                >
                  🚚 Transporter
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@agriconnect.com', 'Admin@1234')}
                  className="p-1.5 bg-white border rounded-lg text-blue-800 hover:bg-blue-50 text-left font-medium"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-stone-200 shadow-2xl text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">Reset Your Password</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              For security, password reset verification links are dispatched via SMS to your registered mobile number or email. You can also contact support at <strong>1800-425-AGRI</strong>.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
