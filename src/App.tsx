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

          {/* Channel Setup Wizard (Step 1) */}
          <Route path="/channel-setup" element={<ChannelSetupPage />} />

          {/* Dashboard Hub Layout Routes */}
          <Route path="/dashboard" element={<DashboardLayout><VideoPagesDashboard /></DashboardLayout>} />
          <Route path="/dashboard/new" element={<DashboardLayout><PageEditor /></DashboardLayout>} />
          <Route path="/dashboard/edit/:id" element={<DashboardLayout><PageEditor /></DashboardLayout>} />
          <Route path="/dashboard/leads" element={<DashboardLayout><LeadsDashboard /></DashboardLayout>} />
          <Route path="/dashboard/analytics" element={<DashboardLayout><AnalyticsDashboard /></DashboardLayout>} />
          <Route path="/dashboard/channel" element={<DashboardLayout><ChannelBrandingPage /></DashboardLayout>} />
          <Route path="/dashboard/plan" element={<DashboardLayout><PlanAndBillingPage /></DashboardLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
