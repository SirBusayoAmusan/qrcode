import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { Shield, ArrowLeft, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-violet-600" />
            <span>GDPR, CCPA & COPPA Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: September 22, 2026 • Effective Date: September 22, 2026
          </p>
        </div>

        <div className="p-6 rounded-3xl apple-glass shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Data Controller Information</h2>
            <p>
              Clearpath Media Technologies, Inc. (“ClearpathQR”, “we”, “our”, or “us”) provides on-screen QR code generation and mobile landing page software for digital creators. If you have questions regarding data privacy or wish to exercise your rights, you can contact our designated Data Protection Officer at:
            </p>
            <div className="p-3.5 rounded-2xl apple-glass-subtle text-xs space-y-1">
              <div><strong>Entity:</strong> Clearpath Media Technologies, Inc.</div>
              <div><strong>Address:</strong> 100 Montgomery St, Suite 1400, San Francisco, CA 94104, USA</div>
              <div><strong>Privacy Email:</strong> <a href="mailto:info@clearpath.click" className="text-violet-600 underline font-semibold">info@clearpath.click</a></div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Principle of Data Minimization (No Unnecessary Data)</h2>
            <p>
              We strictly collect only the minimum information necessary to provide and operate our service:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Creator Account Data:</strong> Email address, encrypted password hash, full name/brand handle, and creator channel visual assets (logos, colors).</li>
              <li><strong>Viewer Lead Data:</strong> Information explicitly provided by viewers (email address, optional name, optional phone number) when opting into a creator’s lead magnet.</li>
              <li><strong>Privacy-Respecting Analytics:</strong> Approximate country and city-level geolocation derived from anonymous IP headers. We do NOT track precise GPS coordinates or invasive device fingerprints.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Age Restriction & Children’s Privacy (COPPA & GDPR-K)</h2>
            <p>
              ClearpathQR does not knowingly solicit or collect personal data from children under 13 years of age (or under 16 years of age in the European Economic Area). Our service is intended exclusively for creators and viewers aged 13 and older. If we discover that personal data from a child under 13 has been collected without verifiable parental consent, we immediately delete that data from our database.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Third-Party Services & SDK Auditing</h2>
            <p>
              We have audited all third-party dependencies to eliminate tracking bloat and dark patterns:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Authentication & Storage:</strong> Supabase (PostgreSQL with end-to-end TLS 1.3 encryption, hosted in SOC 2 Type II compliant data centers).</li>
              <li><strong>No Ad Trackers:</strong> We do not embed Facebook Pixels, Google AdSense, or data broker behavioral tracking scripts.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Email Unsubscribe & CAN-SPAM Compliance</h2>
            <p>
              All email marketing or CRM integrations powered through ClearpathQR require creators to provide a valid 1-click unsubscribe mechanism and physical mailing address in compliance with the U.S. CAN-SPAM Act, Canada’s CASL, and EU GDPR Article 7.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. User Rights & Data Deletion (GDPR Article 17 / CCPA)</h2>
            <p>
              You possess the legal right to access, rectify, export, or permanently delete your personal information at any time:
            </p>
            <div className="pt-2">
              <Link
                to="/data-deletion"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Submit Data Deletion Request</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
