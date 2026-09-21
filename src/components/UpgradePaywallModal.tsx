import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { signUp, signIn } from '../lib/auth';
import { 
  X, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Crown,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

interface UpgradePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
  onSuccessDownload?: () => void;
}

export const UpgradePaywallModal: React.FC<UpgradePaywallModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'Download Your 4K Video QR Code',
  featureDescription = 'Start your 14-day free trial to download 4K PNG video frames, dynamic redirect links, and lead capture tools.',
  onSuccessDownload
}) => {
  const { user, startFreeTrial, refreshData } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAge, setAgreeAge] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate 14-day trial end date
  const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleStartTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!agreeTerms) {
      setAuthError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    if (!agreeAge) {
      setAuthError('You must confirm you are at least 13 years of age.');
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        if (!email.trim() || !password.trim()) {
          setAuthError('Please enter your email and choose a password.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        try {
          await signUp(email.trim(), password, fullName.trim());
        } catch (err: any) {
          // If already exists, try signing in
          const msg = (err.message || '').toLowerCase();
          if (msg.includes('already exists') || msg.includes('user already registered')) {
            await signIn(email.trim(), password);
          } else {
            console.warn('Sign up notice:', err);
          }
        }
      }

      // Activate 14-day free trial on Pro plan
      await startFreeTrial(billingCycle);
      try {
        await refreshData();
      } catch (e) {}

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (e) {}

      // Trigger automatic QR download if requested
      if (onSuccessDownload) {
        onSuccessDownload();
      }

      onClose();
    } catch (err: any) {
      console.error('Error starting free trial:', err);
      setAuthError(err.message || 'Unable to start trial. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl shadow-slate-900/20 text-slate-900 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/20">
            <Crown className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 border border-violet-200 text-[10px] font-extrabold tracking-wider text-violet-800 uppercase">
              <Sparkles className="w-3 h-3 text-violet-600" />
              <span>14-Day Free Trial • Cancel Anytime</span>
            </div>
            <h2 id="paywall-title" className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Start Free Trial & Download QR
            </h2>
          </div>
        </div>

        {/* Feature Notice */}
        <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-xs text-violet-900 mb-5">
          <div className="font-bold mb-0.5 text-violet-950">{featureTitle}</div>
          <p className="text-[11px] text-violet-800 leading-relaxed">{featureDescription}</p>
        </div>

        {/* Billing Cycle Selector */}
        <div className="mb-5 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Choose Plan (Free for 14 Days)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Annual billing option */}
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                billingCycle === 'annual'
                  ? 'bg-violet-50/70 border-violet-500 ring-2 ring-violet-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                Save 26%
              </div>
              <div className="text-xs font-bold text-slate-900">Annual Plan</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-slate-900">$99</span>
                <span className="text-[10px] text-slate-500 font-medium">/ year</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                Save $34.32 vs monthly ($8.25/mo)
              </div>
            </button>

            {/* Monthly billing option */}
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-violet-50/70 border-violet-500 ring-2 ring-violet-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">Monthly Plan</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-slate-900">$11.11</span>
                <span className="text-[10px] text-slate-500 font-medium">/ month</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Billed monthly • Cancel anytime
              </div>
            </button>
          </div>
        </div>

        {/* Clear Trial Schedule (Zero Dark Patterns) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-5 space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-violet-600" />
            <span>Transparent Trial Timeline</span>
          </div>
          <div className="text-[11px] space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>• Today:</span>
              <strong className="text-emerald-700">$0.00 (14-day free access)</strong>
            </div>
            <div className="flex justify-between">
              <span>• First billing date ({trialEndDate}):</span>
              <strong className="text-slate-900">{billingCycle === 'annual' ? '$99/year' : '$11.11/month'}</strong>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Cancel anytime with 1 click in dashboard settings before {trialEndDate} and pay nothing.
            </div>
          </div>
        </div>

        {/* Account Creation Form for Guests */}
        <form onSubmit={handleStartTrial} className="space-y-3.5">
          {!user && (
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-800">
                Create Creator Account to Save & Download QR:
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Name or Brand</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oluwaseun Media"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="•••••••• (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Consents (Compliance Checklist Points 6, 17) */}
          <div className="space-y-2 pt-2 text-[11px] text-slate-600">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-0 mt-0.5 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-violet-600 underline font-semibold">
                  Terms of Service
                </Link>
                ,{' '}
                <Link to="/privacy" target="_blank" className="text-violet-600 underline font-semibold">
                  Privacy Policy
                </Link>
                , and{' '}
                <Link to="/refund" target="_blank" className="text-violet-600 underline font-semibold">
                  Refund Policy
                </Link>
                .
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeAge}
                onChange={(e) => setAgreeAge(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-0 mt-0.5 cursor-pointer"
              />
              <span>
                I confirm I am at least 13 years of age (COPPA & GDPR compliant).
              </span>
            </label>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Start 14-Day Free Trial & Download QR</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL encryption • No surprise fees • 1-click cancellation</span>
          </div>
        </form>
      </div>
    </div>
  );
};
