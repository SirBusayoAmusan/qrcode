import React from 'react';
import { 
  CheckCircle2, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../lib/context';
import { Mascot } from '../components/Mascot';
import confetti from 'canvas-confetti';

export const PlanAndBillingPage: React.FC = () => {
  const { pages, profile, upgradeToPro } = useApp();
  const isPro = profile?.plan === 'pro';

  const handleUpgrade = () => {
    upgradeToPro();
    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    alert('🎉 Upgraded to Pro Creator! You now have unlimited dynamic Tapframes.');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl pb-12">
      {/* Header with Mascot */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17142B] via-[#121422] to-[#121829] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Mascot 
            mood="celebrate" 
            size="sm" 
            badge="Plan Advisor" 
            message={
              isPro 
                ? "You're on the Pro Creator Plan with unlimited dynamic Tapframes!" 
                : "Free plan allows 1 dynamic Tapframe. Upgrade to Pro for unlimited links and multi-channel workspaces!"
            } 
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Subscription & Limits</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Plan & Tapframe Limits
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Manage your subscription tier, billing preferences, and Tapframe capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Current Usage Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#121422] to-indigo-950/40 border border-violet-500/20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">Current Active Plan</div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span>{isPro ? 'Pro Creator' : 'Free Tier'}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Active
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {isPro ? 'Unlimited dynamic Tapframes enabled.' : 'Includes 1 free permanent dynamic Tapframe.'}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">Tapframes Used</div>
          <div className="text-2xl font-black text-violet-300">
            {pages.length} / {isPro ? 'Unlimited' : '1'}
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-violet-500 h-full rounded-full transition-all" 
              style={{ width: isPro ? '35%' : `${Math.min(100, pages.length * 100)}%` }} 
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-semibold mb-1">Lead Storage</div>
          <div className="text-2xl font-black text-emerald-400">Unlimited</div>
          <div className="text-xs text-slate-400 mt-2">All opt-ins saved securely</div>
        </div>
      </div>

      {/* Comparison Pricing Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className={`p-8 rounded-3xl bg-[#11131E] border flex flex-col justify-between ${!isPro ? 'border-violet-500/40' : 'border-white/5'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Free Creator</h3>
              {!isPro && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300">
                  Current Plan
                </span>
              )}
            </div>
            <div className="mb-4">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-sm text-slate-400"> / forever</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              For creators testing their first video QR lead funnel.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>1 Dynamic QR link</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lead capture email form</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4K PNG & SVG export</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time scan count</span>
              </li>
            </ul>
          </div>

          <button
            disabled={!isPro}
            className={`mt-8 w-full py-3 rounded-xl text-xs font-bold text-center ${
              !isPro 
                ? 'bg-white/5 text-slate-400 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
            }`}
          >
            {!isPro ? 'Current Active Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`p-8 rounded-3xl bg-gradient-to-b from-[#1C1530] to-[#121422] border-2 flex flex-col justify-between relative shadow-2xl ${
          isPro ? 'border-emerald-500 shadow-emerald-950/40' : 'border-violet-500 shadow-violet-950/40'
        }`}>
          <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow">
            {isPro ? 'Active Pro' : 'Recommended'}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Pro Creator & Agency</h3>
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-xs font-semibold text-violet-300 border border-violet-500/30">
                Pro
              </span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-black text-white">$19</span>
              <span className="text-sm text-slate-400"> / month</span>
            </div>
            <p className="text-xs text-slate-300 mb-6">
              For active YouTubers, video podcasters, agencies, and businesses.
            </p>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span><strong>Unlimited Dynamic Tapframes & QR codes</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span><strong>Multiple channel workspaces & brands</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Timestamped video moment routing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Geographic & device cohort analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Remove Clearpath branding badge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Priority 24/7 creator support</span>
              </li>
            </ul>
          </div>

          {isPro ? (
            <button
              disabled
              className="mt-8 w-full py-3.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-sm text-center cursor-default"
            >
              ✓ Active Pro Plan
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              className="mt-8 w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm text-center shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Pro ($19/mo)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
