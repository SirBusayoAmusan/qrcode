import React, { useState } from 'react';
import { Sparkles, X, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export type MascotMood = 'wave' | 'float' | 'celebrate' | 'curious' | 'glow' | 'idle';

interface MascotProps {
  mood?: MascotMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  badge?: string;
  interactive?: boolean;
  className?: string;
  customTips?: string[];
  onClick?: () => void;
}

// Vector Robot Mascot Component with 100% Transparent Background (No background box artifacts!)
export const MascotSvg: React.FC<{ mood?: MascotMood; sizeClass: string }> = ({ sizeClass }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClass} drop-shadow-2xl overflow-visible transition-transform`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.7" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="25" y1="25" x2="75" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B0F19" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="earGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4ADE80" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Head Sprout Leaves */}
      <g className="animate-pulse">
        <path d="M50 22 C50 10 36 8 36 8 C36 8 35 18 44 21 Z" fill="url(#leafGrad)" />
        <path d="M50 22 C50 11 63 9 63 9 C63 9 64 19 55 21 Z" fill="url(#leafGrad)" />
        <rect x="48" y="19" width="4" height="6" rx="2" fill="#15803D" />
      </g>

      {/* Floating Orange Headphone Ears */}
      <rect x="12" y="34" width="10" height="24" rx="5" fill="url(#earGrad)" stroke="#C2410C" strokeWidth="1" />
      <circle cx="17" cy="46" r="3" fill="#38BDF8" filter="url(#glowEffect)" />
      
      <rect x="78" y="34" width="10" height="24" rx="5" fill="url(#earGrad)" stroke="#C2410C" strokeWidth="1" />
      <circle cx="83" cy="46" r="3" fill="#38BDF8" filter="url(#glowEffect)" />

      {/* Headband Arch */}
      <path d="M22 36 C22 18 78 18 78 36" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Robot Head Body */}
      <rect x="18" y="24" width="64" height="46" rx="16" fill="url(#bodyGrad)" stroke="#94A3B8" strokeWidth="1.5" />

      {/* Dark Screen Face */}
      <rect x="25" y="30" width="50" height="34" rx="10" fill="url(#screenGrad)" stroke="#334155" strokeWidth="1" />

      {/* Glowing Smiling Cyan Eyes */}
      <path d="M33 42 C33 37 40 37 40 42" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowEffect)" />
      <path d="M60 42 C60 37 67 37 67 42" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowEffect)" />

      {/* Cheerful Smiling Mouth */}
      <path d="M43 50 C43 56 57 56 57 50 Z" fill="#38BDF8" filter="url(#glowEffect)" />

      {/* Robot Lower Body */}
      <path d="M30 70 C30 70 34 84 50 84 C66 84 70 70 70 70" fill="url(#bodyGrad)" stroke="#94A3B8" strokeWidth="1.5" />
      
      {/* Green Chevron Badge on Chest */}
      <path d="M46 73 L50 77 L46 81" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Floating Feet/Pill */}
      <rect x="36" y="86" width="10" height="6" rx="3" fill="#334155" />
      <rect x="54" y="86" width="10" height="6" rx="3" fill="#334155" />

      {/* Waving Right Hand */}
      <g className="origin-[80px_70px] animate-bounce">
        <circle cx="82" cy="62" r="6" fill="url(#bodyGrad)" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="84" cy="56" r="2.5" fill="#38BDF8" />
      </g>
    </svg>
  );
};

export const Mascot: React.FC<MascotProps> = ({
  mood = 'wave',
  size = 'md',
  message,
  badge,
  interactive = true,
  className = '',
  customTips,
  onClick
}) => {
  const defaultTips = [
    "Tip: 70%+ of YouTube watch time happens on TV screens! Keep your QR on screen for 5+ seconds.",
    "Timestamp QR codes convert 3.4x higher when matched with your key takeaway!",
    "Dynamic QR links let you update your offer anytime without touching the YouTube video! ⚡",
    "Offering a free Notion or PDF download gives you 40%+ lead opt-in rates!",
    "Export in 4K PNG to keep your video QR code razor sharp on 4K TVs!"
  ];

  const tips = customTips && customTips.length > 0 ? customTips : defaultTips;
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);

  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const getMoodAnimation = () => {
    if (isWiggling) return 'animate-mascot-celebrate';
    switch (mood) {
      case 'wave':
        return 'animate-mascot-wave';
      case 'celebrate':
        return 'animate-mascot-celebrate';
      case 'curious':
        return 'animate-mascot-curious';
      case 'glow':
        return 'animate-mascot-glow animate-mascot-float';
      case 'float':
      default:
        return 'animate-mascot-float';
    }
  };

  // Fixed text cycling on every mascot click!
  const handleClick = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 900);

    // Cycle to next tip
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    setBubbleOpen(true);

    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch (e) {}

    if (onClick) onClick();
  };

  const currentMessage = message && !interactive ? message : tips[currentTipIndex];

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {currentMessage && bubbleOpen && (
        <div 
          onClick={handleClick}
          className="mb-2 max-w-xs sm:max-w-sm px-3.5 py-2 rounded-2xl bg-[#141824]/95 backdrop-blur-md border border-violet-500/30 text-xs text-white shadow-xl shadow-purple-950/40 relative animate-in fade-in zoom-in-95 cursor-pointer hover:border-violet-400 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-violet-300">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{badge || 'TapBot AI'}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBubbleOpen(false);
              }}
              className="text-slate-400 hover:text-white text-[10px]"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="mt-1 text-slate-200 text-[11px] leading-relaxed">
            {currentMessage}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
            <span className="text-violet-300 font-medium">Click robot for next tip →</span>
            <span className="text-violet-400 font-mono font-bold">
              {currentTipIndex + 1}/{tips.length}
            </span>
          </div>

          {/* Speech Bubble Pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#141824] border-r border-b border-violet-500/30 rotate-45" />
        </div>
      )}

      {/* 100% Transparent Mascot SVG */}
      <div 
        onClick={handleClick}
        className={`relative cursor-pointer group transition-transform active:scale-95 ${getMoodAnimation()}`}
        title="Click me for creator tips!"
      >
        <MascotSvg mood={mood} sizeClass={sizeClasses[size]} />
      </div>
    </div>
  );
};
