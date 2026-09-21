import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('clearpath_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('clearpath_cookie_consent', 'all');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('clearpath_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      role="region" 
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl shadow-slate-900/15 text-slate-900 space-y-3 relative">
        <button
          onClick={handleEssentialOnly}
          className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Dismiss cookie notice with essential cookies only"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Privacy & Cookie Preferences</h4>
            <span className="text-[10px] text-slate-500">No cross-site tracking or third-party ad pixels.</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          We use essential cookies to keep your session secure and optional privacy-friendly analytics to count QR scans. Read our{' '}
          <Link to="/cookies" className="text-violet-600 underline font-semibold hover:text-violet-700">
            Cookie Policy
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-violet-600 underline font-semibold hover:text-violet-700">
            Privacy Policy
          </Link>.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer text-center"
          >
            Accept All
          </button>
          <button
            onClick={handleEssentialOnly}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
