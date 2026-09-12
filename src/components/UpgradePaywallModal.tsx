import React from 'react';
import { useApp } from '../lib/context';
import { 
  X, 
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  Infinity, 
  Layers, 
  BarChart3, 
  ArrowRight,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UpgradePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export const UpgradePaywallModal: React.FC<UpgradePaywallModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'Unlock Unlimited Product Links & Dynamic Tapframes',
  featureDescription = 'You have reached the Free Tier limit. Upgrade to Pro to unlock unlimited QR campaigns, multiple product links, and advanced lead analytics.',
}) => {
  const { upgradeToPro } = useApp();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    upgradeToPro();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#0F111E] border border-violet-500/30 p-6 sm:p-8 shadow-2xl shadow-violet-950/60 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
            <Crown className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] font-extrabold tracking-wider text-violet-300 uppercase">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Clearpath Pro Creator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Upgrade to Clearpath Pro
            </h2>
          </div>
        </div>

        {/* Notice description */}
        <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/20 text-xs text-slate-300 mb-6">
          <div className="font-bold text-violet-200 mb-0.5">{featureTitle}</div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{featureDescription}</p>
        </div>

        {/* Pro Benefits List */}
        <div className="space-y-2.5 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Everything included in Pro:
          </div>

          {[
            { title: 'Unlimited Product & Resource Links', desc: 'Attach multiple digital products, Notion hubs, courses, and tools' },
            { title: 'Unlimited Active QR Tapframes', desc: 'Create and run dedicated QR campaigns for every video & sponsor' },
            { title: 'Multi-Field Lead Opt-In CRM', desc: 'Capture visitor emails, names, phone numbers, and export to CSV' },
            { title: 'Advanced Device & Cohort Analytics', desc: 'Track TV screen scans vs mobile clicks with high-res attribution' },
            { title: '4K Ultra-Crisp Print & Video Export', desc: 'Ready-to-use PNG and SVG overlays for OBS, Premiere, and Final Cut' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <span className="font-bold text-white">{item.title}</span>
                <span className="text-slate-400 ml-1.5 text-[11px] block sm:inline">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-black text-white">
              $19<span className="text-xs font-normal text-slate-400">/month</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Cancel anytime • Instant access</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Upgrade Now to Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
