import React from 'react';
import { 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../lib/context';
import { Mascot } from '../components/Mascot';
import confetti from 'canvas-confetti';

export const PlanAndBillingPage: React.FC = () => {
  const { pages } = useApp();

  const triggerProConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    alert('🎉 You have activated the 14-day Pro Creator trial with unlimited dynamic Tapframes!');
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
            message="Upgrade anytime to create unlimited dynamic Tapframes for all your YouTube uploads!" 
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
            <span>Free Tier Plan</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Active
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Includes 1 free permanent dynamic Tapframe.
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">Tapframes Used</div>
          <div className="text-2xl font-black text-violet-300">
            {pages.length} / Unlimited (Pro Trial)
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-violet-500 h-full rounded-full" style={{ width: '45%' }} />
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
        <div className="p-8 rounded-3xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Free Creator</h3>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300">
                Current
              </span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-sm text-slate-400"> / month</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              For creators testing their first video QR lead funnel.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1 Dynamic QR link</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lead capture email form</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>4K PNG & SVG export</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Basic scan count</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="mt-8 w-full py-3 rounded-xl bg-white/5 text-slate-400 text-xs font-bold text-center cursor-not-allowed"
          >
            Current Active Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1C1530] to-[#121422] border-2 border-violet-500 shadow-2xl shadow-violet-950/40 flex flex-col justify-between relative">
          <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow">
            Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Pro Creator & Agency</h3>
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-xs font-semibold text-violet-300 border border-violet-500/30">
                14-Day Free Trial
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
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span><strong>Unlimited Dynamic Tapframes & QR codes</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span><strong>Multiple channel workspaces & brands</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Timestamped video moment routing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>City & device level cohort analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>No Clearpath branding badge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Priority 24/7 creator support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={triggerProConfetti}
            className="mt-8 w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm text-center shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade to Pro ($19/mo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
