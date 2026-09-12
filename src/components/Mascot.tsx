import React, { useState } from 'react';
import { Sparkles, MessageCircle, Lightbulb, Zap, X, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);

  const defaultTips = [
    "Tip: 70%+ of YouTube watch time is now on TV screens! Put your QR in the corner.",
    "Timestamp QR codes convert 3.4x higher when shown during key moments!",
    "Dynamic QR links let you swap offers anytime without re-uploading videos! ⚡",
    "Add your free Notion or PDF download to get 40%+ lead opt-in rates!",
    "Export in 4K PNG to make your QR code super crisp for 4K video editing!"
  ];

  const tips = customTips && customTips.length > 0 ? customTips : defaultTips;

  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
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

  const handleClick = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 1200);

    if (interactive) {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      setBubbleOpen(true);
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 }
        });
      } catch (e) {}
    }

    if (onClick) onClick();
  };

  const displayMessage = message || (interactive ? tips[currentTipIndex] : null);

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Interactive Speech Bubble */}
      {displayMessage && bubbleOpen && (
        <div className="mb-2 max-w-xs sm:max-w-sm px-3.5 py-2 rounded-2xl bg-[#141824]/95 backdrop-blur-md border border-violet-500/30 text-xs text-white shadow-xl shadow-purple-950/40 relative animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-violet-300">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{badge || 'Clearpath Bot'}</span>
            </div>
            {interactive && (
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
            )}
          </div>
          <p className="mt-1 text-slate-200 text-[11px] leading-relaxed">
            {displayMessage}
          </p>
          {interactive && (
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
              <span>Click robot for next tip</span>
              <span className="text-violet-400 font-mono font-bold">
                {currentTipIndex + 1}/{tips.length}
              </span>
            </div>
          )}

          {/* Speech Bubble Pointer Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#141824] border-r border-b border-violet-500/30 rotate-45" />
        </div>
      )}

      {/* Mascot Image with Animation */}
      <div 
        onClick={handleClick}
        className={`relative cursor-pointer group transition-transform active:scale-95 ${getMoodAnimation()}`}
        title={interactive ? "Click me for creator tips!" : "ClearpathQR Mascot"}
      >
        <img
          src="/assets/mascot.png"
          alt="ClearpathQR Robot Mascot"
          className={`${sizeClasses[size]} object-contain drop-shadow-xl group-hover:scale-105 transition-transform`}
        />

        {/* Small floating status beacon near head sprout */}
        <div className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse shadow-md shadow-emerald-500/50" />
      </div>
    </div>
  );
};
