import React from 'react';
import { useApp } from '../lib/context';
import { 
  TrendingUp, 
  Tv, 
  Users, 
  QrCode,
  ArrowUpRight,
  BarChart2,
  Globe
} from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { Link } from 'react-router-dom';

export const AnalyticsDashboard: React.FC = () => {
  const { pages, leads } = useApp();

  const totalScans = pages.reduce((acc, p) => acc + (p.total_scans || 0), 0);
  const totalLeads = leads.length;
  const totalClicks = pages.reduce((acc, p) => acc + (p.total_clicks || 0), 0);
  const overallConversion = totalScans > 0 ? ((totalLeads / totalScans) * 100).toFixed(1) : '0.0';

  // Compute actual country breakdown from real leads
  const countryCounts: Record<string, number> = {};
  leads.forEach(l => {
    const country = l.country || 'Global';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const topLocations = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
      flag: country.toLowerCase().includes('united states') ? '🇺🇸' :
            country.toLowerCase().includes('united kingdom') ? '🇬🇧' :
            country.toLowerCase().includes('nigeria') ? '🇳🇬' :
            country.toLowerCase().includes('germany') ? '🇩🇪' :
            country.toLowerCase().includes('canada') ? '🇨🇦' : '🌍'
    }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header with Glowing Analytics Mascot */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17142B] via-[#121422] to-[#121829] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Mascot 
            mood="glow" 
            size="sm" 
            badge="Real-Time Analytics" 
            message={
              totalScans > 0 
                ? `Real-time scan tracking active! Conversion rate is currently at ${overallConversion}%.`
                : "Real-time tracking is live. Scans, devices, and opt-ins will reflect here the moment viewers scan your video screen."
            } 
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Real-Time Performance Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Video & Cohort Analytics
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Monitor exactly when and where your viewers scan from TV screens, podcast video feeds, and webinars.
            </p>
          </div>
        </div>
      </div>

      {/* High-level performance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Total On-Screen Scans</span>
            <QrCode className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalScans.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Real-time scan count
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Overall Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-3xl font-black text-white">{overallConversion}%</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Scans to completed lead opt-ins
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Lead Captures</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalLeads.toLocaleString()}</div>
          <div className="text-[11px] text-violet-400 font-medium mt-1">
            Stored in your CRM & exportable
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Outbound Clicks</span>
            <Tv className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalClicks.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Clicks to products & resources
          </div>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#11131E] border border-white/5 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No scan data yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Create your first QR page and display it on your video or presentation to start seeing real-time conversion graphs.
          </p>
          <Link
            to="/dashboard/new"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/25 flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Create First QR Page</span>
          </Link>
        </div>
      ) : (
        /* Detailed real-time charts and breakdowns */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Tapframes */}
          <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Tapframes Performance</h3>
              <span className="text-xs text-violet-400 font-semibold">Real-time stats</span>
            </div>

            <div className="space-y-4">
              {pages.map((p) => {
                const rate = p.total_scans > 0 ? ((p.total_leads / p.total_scans) * 100).toFixed(1) : '0.0';
                return (
                  <div key={p.id} className="p-4 rounded-xl bg-[#0B0D15] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[240px]">{p.title}</span>
                      <span className="text-xs font-mono font-bold text-violet-400">{p.total_leads} leads</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, parseFloat(rate)))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{(p.total_scans || 0).toLocaleString()} scans</span>
                      <span className="text-emerald-400 font-semibold">{rate}% conversion</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographic Breakdown from real leads */}
          <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Viewer Locations</h3>
              <span className="text-xs text-slate-400 font-semibold">{leads.length} Leads</span>
            </div>

            {topLocations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Viewer locations will populate dynamically as people scan your QR codes around the world.
              </div>
            ) : (
              <div className="space-y-3">
                {topLocations.map((loc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0B0D15] border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{loc.flag}</span>
                      <span className="text-slate-200 font-medium">{loc.country}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400">{loc.count} leads</span>
                      <span className="font-bold text-violet-400">{loc.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
