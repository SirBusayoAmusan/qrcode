import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  to = '/',
  theme = 'light'
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-black tracking-tight',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none transition-transform hover:opacity-95 ${className}`}>
      {/* Brand Icon */}
      <div className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-0.5 shadow-md shadow-violet-500/25 flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 24 24" className="w-full h-full p-1 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="18" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="14" y="18" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="18" y="18" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
        </svg>
      </div>

      {showText && (
        <span className={`${textSizes[size]} ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight flex items-center`}>
          Clearpath<span className="text-violet-600">QR</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-block">{content}</Link>;
  }

  return content;
};
