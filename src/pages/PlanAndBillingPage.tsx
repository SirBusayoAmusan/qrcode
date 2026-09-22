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
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import confetti from 'canvas-confetti';

export const PlanAndBillingPage: React.FC = () => {
  const { profile, updateProfilePlan, trialActive, trialEndDate, userPlan } = useApp();
  const [upgradingPlan, setUpgradingPlan] = useState<'monthly' | 'annual' | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isPro = userPlan === 'pro' || profile?.plan === 'pro';

  const handleSelectPlan = async (cycle: 'monthly' | 'annual') => {
    setUpgradingPlan(cycle);
    try {
      await updateProfilePlan('pro', cycle);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
      setSuccessNotice(`Congratulations! Your 14-day free trial on the ${cycle === 'annual' ? 'Annual ($99/yr)' : 'Monthly ($11.11/mo)'} plan is now active.`);
    } catch (err) {
      console.error(err);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const handleCancelTrial = async () => {
    if (window.confirm('Are you sure you want to cancel your trial? You will not be charged.')) {
      setUpgradingPlan('monthly');
      try {
        await updateProfilePlan('free');
        setSuccessNotice('Your subscription has been cancelled. No charges have been made.');
      } catch (err) {
        console.error(err);
      } finally {
        setUpgradingPlan(null);
      }
    }
  };

  const trialExpiryDate = new Date();
  trialExpiryDate.setDate(trialExpiryDate.getDate() + 14);
  const formattedTrialDate = trialExpiryDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16 w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block">
          Simple, Transparent Creator Pricing
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Supercharge Your Video Conversions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Capture high-intent video viewers and turn passive watchers into subscribers, leads, and paying customers.
        </p>

        {/* Mascot */}
        <div className="pt-2 flex justify-center">
          <Mascot 
            mood="celebrate" 
            size="xs" 
            badge="14-Day Free Trial" 
            message="14 days 100% free trial with $0 charged today. Cancel anytime with 1 click before billing starts!" 
          />
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
                Your free trial access lasts until <strong>{trialEndDate ? new Date(trialEndDate).toLocaleDateString() : formattedTrialDate}</strong>. No charges will occur during your trial.
              </p>
            </div>
          </div>

          <button
            onClick={handleCancelTrial}
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

      {/* Pricing Cards (Vibrant Monthly vs Annual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
        
        {/* CARD 1: Monthly Plan ($11.11 / month) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 flex flex-col justify-between relative shadow-xl hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Monthly Creator Pro
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10">
                Month-to-Month
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white">$11.11</span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Flexible billing. Cancel anytime with 1-click in account settings.
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6">
              Ideal for creators who prefer maximum billing flexibility with full Pro access.
            </p>

            <ul className="space-y-3 text-xs text-slate-200 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                <span><strong>Unlimited Active QR Tapframes</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                <span><strong>Unlimited Product & Resource Links</strong> per page</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Dynamic destination routing (edit anytime)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Lead capture with CSV export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Crisp 4K video overlay downloads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                <span>14-day money back guarantee</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectPlan('monthly')}
              disabled={upgradingPlan !== null}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              {upgradingPlan === 'monthly' ? (
                <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Start 14-Day Free Trial ($11.11/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              $0 due today. First charge of $11.11 occurs after 14 days.
            </p>
          </div>
        </div>

        {/* CARD 2: Annual Plan ($99 / year - Save 26%) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-violet-950 via-slate-950 to-slate-950 text-white border-2 border-violet-500/80 flex flex-col justify-between relative shadow-2xl shadow-violet-950/50 transition-all">
          {/* Most popular badge */}
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Save 26% • Most Popular</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Annual Creator Pro</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Best Value ($8.25/mo)
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white">$99</span>
                <span className="text-xs text-violet-300 font-medium">/ year</span>
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                Save $34.32 compared to monthly billing! (Only $8.25/month)
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6">
              For active video creators, course sellers, and agencies running ongoing campaigns.
            </p>

            <ul className="space-y-3 text-xs text-slate-200 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Unlimited Active QR Tapframes</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Unlimited Product & Resource Links</strong> per page</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic destination routing (edit anytime)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lead capture with CSV export & analytics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Crisp 4K video overlay downloads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>14-day money back guarantee</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectPlan('annual')}
              disabled={upgradingPlan !== null}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              {upgradingPlan === 'annual' ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start 14-Day Free Trial ($99/yr)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-violet-300 text-center font-medium">
              $0 due today. First charge of $99 occurs on {formattedTrialDate}.
            </p>
          </div>
        </div>

      </div>

      {/* Transparent Trial Timeline */}
      <div className="p-6 rounded-3xl apple-glass max-w-4xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-slate-900">Transparent 14-Day Free Trial Timeline</h3>
          <p className="text-xs text-slate-500">Know exactly what happens before and after your trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl apple-glass-subtle space-y-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mx-auto">1</div>
            <div className="text-xs font-bold text-slate-900">Today: Immediate Free Access</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Unlock instant 4K frame downloads, dynamic routing, and lead capture. You are billed <strong>$0.00 today</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl apple-glass-subtle space-y-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mx-auto">2</div>
            <div className="text-xs font-bold text-slate-900">Day 12: Renewal Reminder</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Receive a friendly email reminder before your trial ends. Cancel anytime with 1 click in your settings.
            </p>
          </div>

          <div className="p-4 rounded-2xl apple-glass-subtle space-y-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center mx-auto">3</div>
            <div className="text-xs font-bold text-slate-900">{formattedTrialDate}: First Charge</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Unless cancelled, your chosen plan ($99/year or $11.11/month) renews automatically. Backed by our 14-day refund guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Refund Guarantee */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl apple-glass space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>14-Day Risk-Free Money Back Guarantee</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            If you are not completely satisfied with Clearpath Pro, email <a href="mailto:info@clearpath.click" className="text-violet-600 underline font-semibold">info@clearpath.click</a> within 14 days of your initial charge for a prompt 100% refund. Read our full{' '}
            <Link to="/refund" className="text-violet-600 underline font-semibold">Refund Policy</Link>.
          </p>
        </div>

        <div className="p-6 rounded-3xl apple-glass space-y-2 shadow-xs">
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
