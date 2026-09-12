import React, { useState } from 'react';
import { Mascot, MascotMood } from './Mascot';
import { Sparkles, QrCode, Users, Tv, ChevronDown, ChevronUp, CheckCircle, ExternalLink, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const MascotAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getPageContext = () => {
    const path = location.pathname;
    if (path === '/dashboard') {
      return {
        mood: 'wave' as MascotMood,
        badge: 'Tapframe Assistant',
        msg: 'You have active video pages running! Click a QR code to download in 4K.',
        actionLabel: 'Create New Page',
        actionUrl: '/dashboard/new',
      };
    }
    if (path.includes('/dashboard/new') || path.includes('/dashboard/edit')) {
      return {
        mood: 'curious' as MascotMood,
        badge: 'Page Builder Co-Pilot',
        msg: 'Tip: Add a high-converting lead magnet like a free Notion template or cheatsheet PDF!',
        actionLabel: 'Preview Mobile View',
        actionUrl: '#',
      };
    }
    if (path.includes('/dashboard/leads')) {
      return {
        mood: 'celebrate' as MascotMood,
        badge: 'Lead Capture Bot',
        msg: 'Woohoo! Look at all those captured viewers! Export to CSV anytime.',
        actionLabel: 'Export All Leads',
        actionUrl: '#',
      };
    }
    if (path.includes('/dashboard/analytics')) {
      return {
        mood: 'glow' as MascotMood,
        badge: 'Growth Analyst',
        msg: 'Smart TV viewers have higher conversion rates when your QR code stays on screen for 5+ seconds.',
        actionLabel: 'View Video Pages',
        actionUrl: '/dashboard',
      };
    }
    if (path.includes('/dashboard/channel')) {
      return {
        mood: 'float' as MascotMood,
        badge: 'Brand Stylist',
        msg: 'Customizing your channel avatar and color ensures viewers immediately trust your brand!',
        actionLabel: 'Save Branding',
        actionUrl: '#',
      };
    }
    if (path.includes('/dashboard/plan')) {
      return {
        mood: 'celebrate' as MascotMood,
        badge: 'Pro Tier Perks',
        msg: 'Pro plan unlocks unlimited dynamic Tapframes and removes Clearpath badges!',
        actionLabel: 'Upgrade Trial',
        actionUrl: '#',
      };
    }
    return {
      mood: 'wave' as MascotMood,
      badge: 'Clearpath Bot',
      msg: 'Ready to convert your audience into qualified leads?',
      actionLabel: 'Go to Dashboard',
      actionUrl: '/dashboard',
    };
  };

  const context = getPageContext();

  const handleCheer = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.9, x: 0.9 }
      });
    } catch (e) {}
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {isOpen && (
          <div className="mb-3 w-72 sm:w-80 p-4 rounded-2xl bg-[#141724]/95 backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-purple-950/50 text-slate-100 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 font-bold text-xs text-violet-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{context.badge}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {context.msg}
            </p>

            <div className="space-y-2">
              <button
                onClick={handleCheer}
                className="w-full py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Tapbot Cheerful Boost 🎉</span>
              </button>

              <Link
                to="/dashboard/new"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-violet-600/25"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Create New Video QR</span>
              </Link>
            </div>
          </div>
        )}

        {/* Mascot Trigger Button */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer group flex items-end gap-2"
        >
          {!isOpen && (
            <div className="hidden sm:block px-3 py-1.5 rounded-xl bg-[#141724]/90 backdrop-blur-md border border-violet-500/30 text-[11px] text-white shadow-lg group-hover:border-violet-400 transition-colors animate-in fade-in">
              <span>Need creator tips? 🤖</span>
            </div>
          )}
          <Mascot 
            size="sm" 
            mood={context.mood}
            interactive={false}
            className="hover:scale-110 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};
