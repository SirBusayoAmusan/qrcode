import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Tv, 
  Users, 
  BarChart3, 
  Palette, 
  ArrowRight,
  HelpCircle,
  CreditCard,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import confetti from 'canvas-confetti';

export const PlanAndBillingPage: React.FC = () => {
  const { profile, updateProfilePlan, trialActive, trialEndDate, userPlan } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [upgrading, setUpgrading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isPro = userPlan === 'pro' || profile?.plan === 'pro';

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await updateProfilePlan('pro', billingCycle);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
      setSuccessNotice('Congratulations! Your account has been upgraded to ClearpathQR Pro.');
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  const handleDowngrade = async () => {
    if (window.confirm('Are you sure you want to cancel your Pro plan and revert to Free Starter? You will not be billed.')) {
      setUpgrading(true);
      try {
        await updateProfilePlan('free');
        setSuccessNotice('Your plan has been cancelled. Your account is on the Free Starter plan.');
      } catch (err) {
        console.error(err);
      } finally {
        setUpgrading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 w-full max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block">
          Transparent Creator Pricing
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Supercharge Your Video Conversions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Capture high-intent video viewers and turn passive watchers into subscribers and customers.
        </p>

        {/* Mascot */}
        <div className="pt-2 flex justify-center">
          <Mascot 
            mood="celebrate" 
            size="xs" 
            badge="14-Day Guarantee" 
            message="14 days 100% free trial. Cancel anytime with 1 click before billing starts!" 
          />
        </div>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mt-4">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing ($11.11/mo)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing ($99/yr)</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Save 26%
            </span>
          </button>
        </div>
      </div>

      {/* Active Trial Notice Banner */}
      {trialActive && (
        <div className="p-4 sm:p-5 rounded-3xl bg-violet-50 border border-violet-200 text-violet-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-600/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                14-Day Free Trial is Active
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Your free access lasts until <strong>{trialEndDate ? new Date(trialEndDate).toLocaleDateString() : 'in 14 days'}</strong>. No charges will occur during your trial.
              </p>
            </div>
          </div>

          <button
            onClick={handleDowngrade}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs whitespace-nowrap cursor-pointer shadow-xs"
          >
            Cancel Trial (No Charge)
          </button>
        </div>
      )}

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 max-w-xl mx-auto shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
        {/* Free Starter Tier */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between relative shadow-xs transition-all ${
          !isPro ? 'border-slate-300 ring-2 ring-slate-200' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Starter Creator</span>
              {!isPro && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">$0</div>
              <div className="text-xs text-slate-500">Free forever. No credit card required.</div>
            </div>

            <p className="text-xs text-slate-600 mb-6">
              Ideal for creators testing QR lead funnels on their latest YouTube or TikTok video.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>1 Active QR Tapframe</strong> link</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>1 Product Destination Link</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lead capture (Email, Name, Phone)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4K on-screen video frames (PNG)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CSV Lead export</span>
              </li>
            </ul>
          </div>

          <div>
            {isPro ? (
              <button
                type="button"
                onClick={handleDowngrade}
                disabled={upgrading}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Switch to Free Plan
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs cursor-default"
              >
                Active on Your Account
              </button>
            )}
          </div>
        </div>

        {/* Clearpath Pro Tier ($11.11/mo or $99/yr) */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between relative shadow-xl transition-all ${
          isPro 
            ? 'border-violet-400 ring-2 ring-violet-500/20' 
            : 'border-violet-500/80 shadow-violet-500/10'
        }`}>
          {/* Most popular badge with savings percentage */}
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
            {billingCycle === 'annual' ? 'Save 26% • Most Popular' : '14-Day Free Trial'}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clearpath Pro</span>
              </span>
              {isPro && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 border border-violet-300">
                  {trialActive ? '14-Day Trial Active' : 'Active Plan'}
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$99' : '$11.11'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {billingCycle === 'annual' ? '/ year' : '/ month'}
                </span>
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                {billingCycle === 'annual' 
                  ? 'Save $34.32 compared to monthly billing ($8.25/mo)' 
                  : 'Billed monthly ($11.11/mo). Cancel anytime with 1 click.'}
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6">
              For active video creators, course sellers, and agencies running weekly campaigns.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-600 shrink-0" />
                <span><strong>Unlimited Active QR Tapframes</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-600 shrink-0" />
                <span><strong>Unlimited Product & Resource Links</strong> per page</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Dynamic destination routing (edit links without re-editing video)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Full custom branding & logo badge removal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Country & city-level audience analytics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-600 shrink-0" />
                <span>14-day money back guarantee</span>
              </li>
            </ul>
          </div>

          <div>
            {isPro && !trialActive ? (
              <div className="space-y-2">
                <div className="w-full py-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 cursor-default">
                  <Check className="w-4 h-4" />
                  <span>Your Pro Subscription is Active</span>
                </div>
                <button
                  type="button"
                  onClick={handleDowngrade}
                  className="w-full text-center text-xs text-slate-400 hover:text-rose-600 transition-colors py-1 cursor-pointer"
                >
                  Cancel upcoming renewal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                {upgrading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trust & Refund Guarantee */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>14-Day Risk-Free Money Back Guarantee</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            If you are not completely satisfied with Clearpath Pro, email <a href="mailto:support@clearpathqr.com" className="text-violet-600 underline">support@clearpathqr.com</a> within 14 days of your initial charge for a 100% refund. Read our full{' '}
            <Link to="/refund" className="text-violet-600 underline font-semibold">Refund Policy</Link>.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <span>Privacy & GDPR Data Rights</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            We never sell your data or embed third-party ad trackers. You can request permanent data deletion anytime via our{' '}
            <Link to="/data-deletion" className="text-violet-600 underline font-semibold">Data Deletion Request Page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
