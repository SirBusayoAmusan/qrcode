import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

interface UpgradePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  featureTitle?: string;
  featureDescription?: string;
  onSuccessDownload?: () => void;
}

export const UpgradePaywallModal: React.FC<UpgradePaywallModalProps> = ({
  isOpen,
  onClose,
  initialName = '',
  featureTitle = 'Download Your 4K Video QR Code',
  featureDescription = 'Start your 14-day free trial to download 4K PNG video frames, dynamic redirect links, and lead capture tools.',
  onSuccessDownload
}) => {
  const { user, startFreeTrial, refreshData, activeChannel } = useApp();

  // Step 1 = Account Registration (if guest), Step 2 = Paywall & Plan Selection
  const [step, setStep] = useState<1 | 2>(user ? 2 : 1);

  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(initialName || activeChannel?.name || '');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAge, setAgreeAge] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync initial name whenever modal opens
  useEffect(() => {
    if (initialName) {
      setFullName(initialName);
    } else if (activeChannel?.name) {
      setFullName(activeChannel.name);
    }
    if (user) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [isOpen, initialName, activeChannel, user]);

  if (!isOpen) return null;

  // Calculate 14-day trial end date (e.g. Oct 6, 2026)
  const trialEndObj = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const trialEndDateStr = trialEndObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Step 1: Submit Account Creation
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!agreeTerms) {
      setAuthError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (!agreeAge) {
      setAuthError('You must confirm you are at least 13 years of age (COPPA & GDPR compliant).');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter your email and choose a password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      try {
        await signUp(email.trim(), password, fullName.trim());
      } catch (err: any) {
        const msg = (err.message || '').toLowerCase();
        if (msg.includes('already exists') || msg.includes('user already registered')) {
          await signIn(email.trim(), password);
        } else {
          console.warn('Sign up notice:', err);
        }
      }

      // Smooth motion step transition to Step 2 Paywall
      setStep(2);
    } catch (err: any) {
      console.error('Account creation error:', err);
      setAuthError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Activate 14-Day Free Trial and Trigger Download
  const handleActivateTrial = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      await startFreeTrial(billingCycle);
      try {
        await refreshData();
      } catch (e) {}

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (e) {}

      if (onSuccessDownload) {
        onSuccessDownload();
      }

      onClose();
    } catch (err: any) {
      console.error('Error starting free trial:', err);
      setAuthError(err.message || 'Unable to activate trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
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
              <span>{step === 1 ? 'Step 1: Create Account' : 'Step 2: 14-Day Free Trial'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {step === 1 ? 'Save & Download Your QR Code' : 'Start Your 14-Day Free Trial'}
            </h2>
          </div>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: CREATE ACCOUNT (AUTO-FILLS NAME FROM BEGINNING)                   */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleAccountSubmit} className="space-y-4 animate-scale-in">
            <p className="text-xs text-slate-600 leading-relaxed">
              Create your creator account to save your dynamic QR Tapframe and download the high-res 4K files.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name or Brand Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Media"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="you@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="•••••••• (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Consents (User Requirement 4) */}
            <div className="space-y-2 pt-1 text-[11px] text-slate-600">
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
                  </Link>.
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
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ANIMATED PAYWALL (ANNUAL BIGGER & BOLDER THAN MONTHLY)            */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-5 animate-scale-in">
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your plan. Your card will <strong>not</strong> be charged today. You have a full 14 days free to test your video Tapframe.
            </p>

            {/* Plan Selector: Annual is BIGGER and BOLDER */}
            <div className="space-y-3">
              {/* ANNUAL PLAN (BIGGER & BOLDER) */}
              <div
                onClick={() => setBillingCycle('annual')}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden transform ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-br from-violet-50 via-white to-emerald-50/40 border-violet-600 ring-4 ring-violet-500/15 shadow-xl scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300 opacity-90'
                }`}
              >
                {/* Save 26% Badge */}
                <div className="absolute top-0 right-0 px-3.5 py-1 bg-gradient-to-r from-violet-600 to-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-sm">
                  Save 26% • Best Value
                </div>

                <div className="flex items-center justify-between pr-24">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      billingCycle === 'annual' ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300'
                    }`}>
                      {billingCycle === 'annual' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Annual Plan</h4>
                      <span className="text-[11px] text-emerald-700 font-bold">$8.25 / month equivalent</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900">$99</span>
                  <span className="text-xs text-slate-500 font-semibold">/ year (billed annually after 14 days)</span>
                </div>

                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  ✨ Saves $34.32 compared to monthly billing!
                </p>
              </div>

              {/* MONTHLY PLAN */}
              <div
                onClick={() => setBillingCycle('monthly')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-violet-50/80 border-violet-500 ring-2 ring-violet-500/20 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      billingCycle === 'monthly' ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300'
                    }`}>
                      {billingCycle === 'monthly' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-slate-900">Monthly Plan</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900">$11.11</span>
                    <span className="text-[10px] text-slate-500">/ month</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 pl-6">
                  Billed monthly after 14-day free trial. Cancel anytime with 1 click.
                </div>
              </div>
            </div>

            {/* Transparent Trial Timeline (User Requirement 5) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-600" />
                <span>Transparent Trial Timeline</span>
              </div>
              <div className="text-[11px] space-y-1.5 text-slate-600">
                <div className="flex justify-between items-center">
                  <span>• Today:</span>
                  <strong className="text-emerald-700 font-bold">$0.00 (14-day free access)</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>• First billing date ({trialEndDateStr}):</span>
                  <strong className="text-slate-900 font-bold">
                    {billingCycle === 'annual' ? '$99/year' : '$11.11/month'}
                  </strong>
                </div>
                <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-200">
                  Cancel anytime with 1 click in dashboard settings before {trialEndDateStr} and pay nothing.
                </div>
              </div>
            </div>

            {/* Final CTA Button */}
            <button
              type="button"
              onClick={handleActivateTrial}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Start 14-Day Free Trial & Download 4K QR</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>14-day money-back guarantee • 1-click cancellation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
