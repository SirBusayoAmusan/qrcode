import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Plus, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  Sparkles,
  ArrowUpRight,
  Tv
} from 'lucide-react';
import type { TapframePage } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Mascot } from '../components/Mascot';

export const VideoPagesDashboard: React.FC = () => {
  const { pages, activeChannel, deletePage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'archived'>('all');
  const [selectedPreviewPage, setSelectedPreviewPage] = useState<TapframePage | null>(null);

  // Filter pages for active channel or all
  const channelPages = pages.filter(p => {
    const matchesChannel = activeChannel ? p.channel_id === activeChannel.id : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.campaign_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTab === 'all' ? true : p.status === filterTab;
    return matchesChannel && matchesSearch && matchesFilter;
  });

  const totalScans = channelPages.reduce((acc, p) => acc + (p.total_scans || 0), 0);
  const totalLeads = channelPages.reduce((acc, p) => acc + (p.total_leads || 0), 0);
  const totalClicks = channelPages.reduce((acc, p) => acc + (p.total_clicks || 0), 0);
  const avgConversion = totalScans > 0 ? ((totalLeads / totalScans) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner with Mascot Guide */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17142B] via-[#121422] to-[#121829] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          <Mascot 
            mood="wave" 
            size="sm" 
            badge="TapBot AI" 
            message="Your TV scan conversions are performing 31% above average this week!" 
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Channel Workspace: {activeChannel?.name || 'Active Creator'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Video Pages & QR Tapframes
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Each page is dynamic — your viewers scan directly from their TV couch without leaving the video.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 self-stretch md:self-auto justify-end">
          <Link
            to="/dashboard/new"
            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New QR Page</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Total On-Screen Scans</span>
            <QrCode className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalScans.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.8% from YouTube TV</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Leads Captured</span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalLeads.toLocaleString()}
          </div>
          <div className="text-[11px] text-violet-400 font-medium mt-1">
            Avg {avgConversion}% conversion rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Outbound Clicks</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            To checkout & resources
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Active Tapframes</span>
            <Tv className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {channelPages.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            100% dynamic & editable
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search pages, videos, or campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#11131E] border border-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-[#11131E] p-1 rounded-xl border border-white/5 text-xs">
          {(['all', 'active', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                filterTab === tab ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Pages List / Table / Empty State with Mascot */}
      {channelPages.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#11131E] border border-white/5 text-center flex flex-col items-center justify-center">
          <Mascot mood="curious" size="md" message="No pages yet! Let's make your first high-converting QR page." />
          <h3 className="text-lg font-bold text-white mb-1 mt-4">No video pages yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Create a page for your next video upload, add the QR to your video, and watch traffic come in.
          </p>
          <Link
            to="/dashboard/new"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Page</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            {channelPages.map((page) => (
              <div
                key={page.id}
                className="p-5 rounded-2xl bg-[#11131E] border border-white/5 hover:border-violet-500/30 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Small QR Thumbnail */}
                  <div 
                    onClick={() => setSelectedPreviewPage(page)}
                    className="w-14 h-14 bg-white p-1 rounded-xl shadow cursor-pointer shrink-0 flex items-center justify-center hover:scale-105 transition-transform"
                    title="Click to view full QR details"
                  >
                    <QRCodeDisplay page={page} size={48} showCardWrapper={false} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                        {page.title || 'Exclusive Viewer Resource Kit'}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {page.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-300">Campaign: {page.campaign_name}</span>
                      <span>•</span>
                      {page.associated_content?.timestamp && (
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-[11px] font-mono text-violet-300">
                          ⏱ {page.associated_content.timestamp}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      Target: /q/{page.slug} {page.destination_type === 'external_url' && `→ ${page.external_url}`}
                    </div>
                  </div>
                </div>

                {/* Scans & Actions */}
                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  <div className="text-right">
                    <div className="text-sm font-black text-white">
                      {(page.total_scans || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Scans</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-violet-400">
                      {(page.total_leads || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Leads</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPreviewPage(page)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="View QR Code & Download"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/dashboard/edit/${page.id}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Edit Page"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <a
                      href={`/q/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Open Live Public Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                          deletePage(page.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side Preview Box for Selected or First Page */}
          <div className="space-y-4">
            {selectedPreviewPage || channelPages[0] ? (
              <div className="p-6 rounded-2xl bg-[#11131E] border border-white/10 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">Active QR Overlay</span>
                    <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                      {(selectedPreviewPage || channelPages[0]).title}
                    </h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono">
                    4K Ready
                  </span>
                </div>

                <QRCodeDisplay 
                  page={selectedPreviewPage || channelPages[0]} 
                  size={200} 
                  showCardWrapper={true} 
                />

                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Campaign Group:</span>
                    <strong className="text-slate-200">{(selectedPreviewPage || channelPages[0]).campaign_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <strong className="text-slate-200">
                      {(selectedPreviewPage || channelPages[0]).destination_type === 'landing_page' ? 'Mobile Landing Page' : 'External Website'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Magnet:</span>
                    <strong className="text-emerald-400">
                      {(selectedPreviewPage || channelPages[0]).lead_capture_enabled ? 'Active Capture' : 'Disabled'}
                    </strong>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
