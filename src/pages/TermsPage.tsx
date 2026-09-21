import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { FileText, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-violet-600" />
            <span>Clear, Honest Creator Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: September 21, 2026 • Effective Date: September 21, 2026
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1: 14-Day Free Trial & Transparent Billing */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. 14-Day Free Trial & Subscription Billing</h2>
            <p>
              ClearpathQR offers a full 14-day free trial on all Pro subscriptions. During your 14-day trial period:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Zero Initial Charge:</strong> You will not be charged during the 14-day trial period.</li>
              <li><strong>Pricing Plans:</strong> Following the 14-day free trial, your subscription will automatically renew at your selected interval:
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li><strong>Monthly Plan:</strong> $11.11 per month.</li>
                  <li><strong>Annual Plan:</strong> $99.00 per year (saving 26% — $34.32 discount compared to monthly billing).</li>
                </ul>
              </li>
              <li><strong>No Hidden Fees:</strong> There are no setup fees, bandwidth surcharges, or hidden penalties. All taxes and features are clearly itemized.</li>
            </ul>
          </section>

          {/* Section 2: 1-Click Cancellation (No Dark Patterns) */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Simple 1-Click Cancellation Policy</h2>
            <p>
              We firmly prohibit dark patterns or complex cancellation hurdles. You may cancel or downgrade your subscription at any time with a single click in your <strong>Plan & Billing Dashboard</strong>. If you cancel prior to the conclusion of your 14-day free trial, your card will not be charged.
            </p>
          </section>

          {/* Section 3: 14-Day Money Back Guarantee */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. 14-Day Money-Back Guarantee</h2>
            <p>
              If you are charged and are not completely satisfied with ClearpathQR, you may request a 100% refund within 14 days of your initial charge date under our{' '}
              <Link to="/refund" className="text-violet-600 underline font-semibold">
                Refund Policy
              </Link>.
            </p>
          </section>

          {/* Section 4: Acceptable Use & Creator Content */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Acceptable Use & Intellectual Property</h2>
            <p>
              Creators retain 100% ownership of all brand logos, course materials, lead magnets, and content connected to their Tapframes. You agree not to use ClearpathQR to distribute malware, phishing campaigns, deceptive pyramid schemes, or illegal materials.
            </p>
          </section>

          {/* Section 5: Age Requirement */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Age Eligibility (13+)</h2>
            <p>
              By creating an account on ClearpathQR, you confirm that you are at least 13 years of age (or 16 years of age where required by local data protection regulations).
            </p>
          </section>

          {/* Section 6: Business Details & Governing Law */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Business Details & Contact</h2>
            <p>
              These Terms are governed by the laws of the State of California, United States.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div><strong>Company:</strong> Clearpath Media Technologies, Inc.</div>
              <div><strong>Support Contact:</strong> <a href="mailto:support@clearpathqr.com" className="text-violet-600 underline">support@clearpathqr.com</a></div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
