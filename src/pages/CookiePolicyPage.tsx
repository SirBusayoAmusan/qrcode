import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { Cookie, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo to="/" size="md" theme="light" />
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Cookie className="w-3.5 h-3.5 text-amber-700" />
            <span>Privacy First Cookie Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: September 21, 2026 • Compliant with EU ePrivacy Directive & GDPR
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files stored in your web browser that allow websites to remember user authentication sessions, theme preferences, and security state.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Categories of Cookies We Use</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Strictly Essential Cookies (Always Active)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Required for core authentication, session validation with Supabase, and security tokens. These do not track browsing history across other websites.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
                  <span>Functional & Preference Storage</span>
                </div>
                <p className="text-xs text-slate-600">
                  Used to remember your active creator channel selection, Tapframe builder drafts, and cookie consent choices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Aggregated Scan Analytics</span>
                </div>
                <p className="text-xs text-slate-600">
                  Measures total scan counts and country/city distribution for creator dashboards. We do not use third-party advertising or cross-device profiling cookies.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. How to Manage or Reset Cookies</h2>
            <p>
              You can adjust cookie preferences at any time in your browser settings (Chrome, Safari, Firefox, Edge) or by clearing your browser cache.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
