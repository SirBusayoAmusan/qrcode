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
  CheckCircle2
} from 'lucide-react';
import { Mascot } from '../components/Mascot';

export const PlanAndBillingPage: React.FC = () => {
  const { profile, updateProfilePlan } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [upgrading, setUpgrading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isPro = profile?.plan === 'pro';

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await updateProfilePlan('pro');
      setSuccessNotice('Congratulations! Your account has been upgraded to ClearpathQR Pro.');
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  const handleDowngrade = async () => {
    if (window.confirm('Are you sure you want to revert to the Free Starter Plan?')) {
      setUpgrading(true);
      try {
        await updateProfilePlan('free');
        setSuccessNotice('Your plan has been changed to Free Starter.');
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
          Simple, Transparent Creator Pricing
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Supercharge Your Video Conversions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Capture high-intent video viewers and turn passive watchers into paying customers and subscribers.
        </p>

        {/* Mascot */}
        <div className="pt-2 flex justify-center">
          <Mascot 
            mood="celebrate" 
            size="xs" 
            badge="Creator Guarantee" 
            message="No long-term contracts. 14-day money-back guarantee on all Pro plans!" 
          />
        </div>

        {/* Billing Toggle */}
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
            Monthly Billing
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
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

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

        {/* Clearpath Pro Tier */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between relative shadow-xl transition-all ${
          isPro 
            ? 'border-violet-400 ring-2 ring-violet-500/20' 
            : 'border-violet-500/80 shadow-violet-500/10'
        }`}>
          {/* Most popular badge */}
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
            Most Popular for YouTubers
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clearpath Pro</span>
              </span>
              {isPro && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 border border-violet-300">
                  Active Plan
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$19' : '$24'}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <div className="text-xs text-slate-500">
                {billingCycle === 'annual' ? 'Billed annually ($228/yr)' : 'Billed monthly, cancel anytime'}
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
                <span><strong>Unlimited Product Links</strong> per page</span>
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
                <span>Automated CRM Sync (ConvertKit, Beehiiv, Mailchimp)</span>
              </li>
            </ul>
          </div>

          <div>
            {isPro ? (
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 cursor-default"
              >
                <Check className="w-4 h-4" />
                <span>Your Pro Subscription is Active</span>
              </button>
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
                    <span>Upgrade to Clearpath Pro</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ & Trust Footer */}
      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Risk-Free 14-Day Money Back Guarantee</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          If you don't get at least 3x more email leads from your video QR codes in your first 14 days, we will refund 100% of your subscription instantly. No questions asked.
        </p>
      </div>
    </div>
  );
};
