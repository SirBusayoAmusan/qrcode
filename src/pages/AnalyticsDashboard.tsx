import React from 'react';
import { useApp } from '../lib/context';
import { 
  TrendingUp, 
  Tv, 
  Users, 
  QrCode,
  ArrowUpRight
} from 'lucide-react';
import { Mascot } from '../components/Mascot';

export const AnalyticsDashboard: React.FC = () => {
  const { pages } = useApp();

  const totalScans = pages.reduce((acc, p) => acc + (p.total_scans || 0), 0);
  const totalLeads = pages.reduce((acc, p) => acc + (p.total_leads || 0), 0);
  const overallConversion = totalScans > 0 ? ((totalLeads / totalScans) * 100).toFixed(1) : '0.0';

  // Device breakdown mockup based on real TV & Mobile dynamics
  const deviceBreakdown = [
    { name: 'Smart TV Scanned via iPhone', percentage: 58, count: Math.round(totalScans * 0.58) },
    { name: 'Smart TV Scanned via Android', percentage: 26, count: Math.round(totalScans * 0.26) },
    { name: 'Desktop/Web Video Screen', percentage: 11, count: Math.round(totalScans * 0.11) },
    { name: 'Tablet / iPad', percentage: 5, count: Math.round(totalScans * 0.05) },
  ];

  const topLocations = [
    { country: 'United States', scans: '44%', flag: '🇺🇸' },
    { country: 'United Kingdom', scans: '18%', flag: '🇬🇧' },
    { country: 'Germany', scans: '12%', flag: '🇩🇪' },
    { country: 'Canada', scans: '9%', flag: '🇨🇦' },
    { country: 'Australia', scans: '7%', flag: '🇦🇺' },
    { country: 'Other (Global)', scans: '10%', flag: '🌍' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Glowing Analytics Mascot */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17142B] via-[#121422] to-[#121829] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Mascot 
            mood="glow" 
            size="sm" 
            badge="TV Cohort Analyst" 
            message="84% of your total scans originate from living room TV viewers! This cohort has a 2.4x higher opt-in completion rate." 
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
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+31.2% this week</span>
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
            <span>Living Room Share</span>
            <Tv className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">84%</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Smart TV viewer dominance
          </div>
        </div>
      </div>

      {/* Detailed charts and breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Tapframes */}
        <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Top Performing Tapframes</h3>
            <span className="text-xs text-violet-400 font-semibold">Ranked by Leads</span>
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
                      style={{ width: `${Math.min(100, Math.max(15, parseFloat(rate)))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{p.total_scans.toLocaleString()} scans</span>
                    <span className="text-emerald-400 font-semibold">{rate}% conversion</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device & Screen Type Breakdown */}
        <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Screen & Device Breakdown</h3>
            <span className="text-xs text-slate-400 font-semibold">Living Room Scan Data</span>
          </div>

          <div className="space-y-4">
            {deviceBreakdown.map((dev, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{dev.name}</span>
                  <span className="font-mono text-white font-bold">{dev.percentage}% ({dev.count.toLocaleString()})</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-pink-500 h-full rounded-full"
                    style={{ width: `${dev.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Location breakdown */}
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold text-slate-300 mb-3">Top Viewer Geographic Locations</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {topLocations.map((loc, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#0B0D15] border border-white/5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{loc.flag}</span>
                    <span className="text-slate-300 truncate">{loc.country}</span>
                  </span>
                  <span className="font-mono font-bold text-violet-400">{loc.scans}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
