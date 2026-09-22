import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { ShieldCheck, ArrowLeft, Mail, CheckCircle2, Clock } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Risk-Free Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            14-Day Refund Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: September 22, 2026 • Transparent & Honest Returns
          </p>
        </div>

        <div className="p-6 rounded-3xl apple-glass shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Our 14-Day Money-Back Guarantee</h2>
            <p>
              We want creators to be 100% confident in using ClearpathQR. In addition to our <strong>14-day free trial</strong> (where you pay $0 upfront), we provide an unconditional <strong>14-day money-back guarantee</strong> on all paid subscription charges (monthly or annual).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. How to Request a Refund</h2>
            <p>
              We do not impose retention phone calls or complicated forms. To request a refund:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Send an email to <a href="mailto:info@clearpath.click" className="text-violet-600 underline font-semibold">info@clearpath.click</a> with the subject line <code>"Refund Request"</code>.</li>
              <li>Include your account email address.</li>
              <li>Our support team will process your refund within <strong>24 to 48 hours</strong>.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Refund Processing Timeline</h2>
            <p>
              Once initiated by our support team, credit card refunds typically appear on your statement within <strong>3 to 5 business days</strong>, depending on your financial institution.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Renewal Cancellation</h2>
            <p>
              You can cancel upcoming monthly ($11.11/mo) or annual ($99/year) renewals anytime in your dashboard under <strong>Plan & Billing</strong>. Upon cancellation, you retain full access through the end of your paid billing period with zero further charges.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
