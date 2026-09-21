import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Mail, MapPin, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
        {/* Company Identity */}
        <div className="space-y-3 md:col-span-1">
          <Logo to="/" size="md" theme="light" />
          <p className="text-slate-500 text-xs leading-relaxed">
            The on-screen dynamic QR conversion engine built for YouTube creators, podcasters, and video educators.
          </p>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>100 Montgomery St, Suite 1400, San Francisco, CA 94104</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href="mailto:support@clearpathqr.com" className="hover:text-violet-600 transition-colors">
                support@clearpathqr.com
              </a>
            </div>
          </div>
        </div>

        {/* Product & Solutions */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Product</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/dashboard/new" className="hover:text-violet-600 transition-colors">
                Create Free QR Tapframe
              </Link>
            </li>
            <li>
              <Link to="/dashboard/leads" className="hover:text-violet-600 transition-colors">
                Audience CRM & Leads
              </Link>
            </li>
            <li>
              <Link to="/dashboard/analytics" className="hover:text-violet-600 transition-colors">
                Scan Geolocation Analytics
              </Link>
            </li>
            <li>
              <Link to="/dashboard/plan" className="hover:text-violet-600 transition-colors">
                Pricing ($11.11/mo or $99/yr)
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance Policies */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Legal & Trust</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/privacy" className="hover:text-violet-600 transition-colors">
                Privacy Policy (GDPR / CCPA)
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-violet-600 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-violet-600 transition-colors">
                14-Day Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-violet-600 transition-colors">
                Cookie Policy & Preferences
              </Link>
            </li>
            <li>
              <Link to="/data-deletion" className="hover:text-violet-600 transition-colors">
                Data Deletion Request (GDPR Art. 17)
              </Link>
            </li>
          </ul>
        </div>

        {/* Compliance Guarantees */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Trust & Safety</h4>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>14-Day Free Trial Guarantee</span>
            </div>
            <p>
              Test Clearpath Pro free for 14 days. Cancel with 1 click anytime before billing starts.
            </p>
            <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>CAN-SPAM & COPPA (13+) Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Clearpath Media Technologies, Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-slate-800">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-slate-800">Terms</Link>
          <span>•</span>
          <Link to="/refund" className="hover:text-slate-800">Refunds</Link>
          <span>•</span>
          <Link to="/cookies" className="hover:text-slate-800">Cookies</Link>
          <span>•</span>
          <Link to="/data-deletion" className="hover:text-slate-800">Data Deletion</Link>
        </div>
      </div>
    </footer>
  );
};
