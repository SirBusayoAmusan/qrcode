import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './lib/context';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ChannelSetupPage } from './pages/ChannelSetupPage';
import { DashboardLayout } from './components/DashboardLayout';
import { VideoPagesDashboard } from './pages/VideoPagesDashboard';
import { PageEditor } from './pages/PageEditor';
import { LeadsDashboard } from './pages/LeadsDashboard';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { ChannelBrandingPage } from './pages/ChannelBrandingPage';
import { PlanAndBillingPage } from './pages/PlanAndBillingPage';
import { PublicTapframePage } from './pages/PublicTapframePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { DataDeletionPage } from './pages/DataDeletionPage';
import { CookieBanner } from './components/CookieBanner';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Tapframe Viewer Route (Scan destination) */}
          <Route path="/q/:slug" element={<PublicTapframePage />} />

          {/* Authentication (Sign in / Sign up) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Channel Setup Wizard */}
          <Route path="/channel-setup" element={<ChannelSetupPage />} />

          {/* Direct Tapframe Creator Studio (Works for both Guests & Signed-In Users) */}
          <Route path="/create" element={<DashboardLayout><PageEditor /></DashboardLayout>} />

          {/* Dashboard Hub Layout Routes */}
          <Route path="/dashboard" element={<DashboardLayout><VideoPagesDashboard /></DashboardLayout>} />
          <Route path="/dashboard/new" element={<DashboardLayout><PageEditor /></DashboardLayout>} />
          <Route path="/dashboard/edit/:id" element={<DashboardLayout><PageEditor /></DashboardLayout>} />
          <Route path="/dashboard/leads" element={<DashboardLayout><LeadsDashboard /></DashboardLayout>} />
          <Route path="/dashboard/analytics" element={<DashboardLayout><AnalyticsDashboard /></DashboardLayout>} />
          <Route path="/dashboard/channel" element={<DashboardLayout><ChannelBrandingPage /></DashboardLayout>} />
          <Route path="/dashboard/plan" element={<DashboardLayout><PlanAndBillingPage /></DashboardLayout>} />

          {/* Legal & Compliance Routes */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Cookie Banner */}
        <CookieBanner />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
