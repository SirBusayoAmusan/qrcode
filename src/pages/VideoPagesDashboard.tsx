import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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
  Tv,
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Copy,
  Check,
  Database,
  MousePointerClick,
  Users,
  Download
} from 'lucide-react';
import type { TapframePage } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Mascot } from '../components/Mascot';

export const VideoPagesDashboard: React.FC = () => {
  const { pages, leads, activeChannel, deletePage, profile, canCreatePage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'archived'>('all');
  const [selectedPreviewPage, setSelectedPreviewPage] = useState<TapframePage | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  // Filter pages for active channel or all
  const channelPages = pages.filter(p => {
    const matchesChannel = activeChannel ? p.channel_id === activeChannel.id : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.campaign_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTab === 'all' ? true : p.status === filterTab;
    return matchesChannel && matchesSearch && matchesFilter;
  });

  // Calculate live single-source-of-truth stats across this channel
  const channelPageIds = new Set(channelPages.map(p => p.id));
  const channelLeads = leads.filter(l => channelPageIds.has(l.page_id) || l.channel_id === activeChannel?.id);
  const totalLeadsCount = channelLeads.length;

  const totalScans = channelPages.reduce((acc, p) => acc + (p.total_scans || 0), 0);
  const totalClicks = channelPages.reduce((acc, p) => acc + (p.total_clicks || 0), 0);
  const avgConversion = totalScans > 0 ? ((totalLeadsCount / totalScans) * 100).toFixed(1) : '0.0';

  const isFreeLimitReached = profile?.plan === 'free' && channelPages.length >= 1;
  const isAllowedToCreate = canCreatePage && !isFreeLimitReached;

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isAllowedToCreate) {
      e.preventDefault();
      setShowUpgradeModal(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 w-full max-w-7xl mx-auto">
      {/* Top Banner (Apple-Style Glassmorphism Hero Card) */}
      <div className="p-6 sm:p-8 rounded-3xl apple-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-xs">
        <div className="space-y-2 z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-600">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            <span className="truncate">Channel: {activeChannel?.name || 'Creator Hub'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Video Pages & QR Tapframes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            One dynamic page per video or campaign. Viewers scan directly from the TV or mobile screen without leaving the stream.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <Link
            to="/dashboard/new"
            onClick={handleCreateClick}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New QR Page</span>
          </Link>
        </div>
      </div>

      {/* Mascot AI Tip Strip */}
      <div className="p-4 rounded-2xl apple-glass flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-violet-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 block">TapBot Growth Tip</span>
            <p className="text-xs text-slate-700 truncate font-medium">
              {channelPages.length > 0 
                ? `You have ${channelPages.length} dynamic QR page${channelPages.length > 1 ? 's' : ''} live. Export in 4K PNG for razor-sharp TV display!`
                : "70%+ of YouTube watch time happens on TV screens! Keep your QR on screen for 5+ seconds to maximize scans."}
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/new"
          onClick={handleCreateClick}
          className="hidden sm:inline-flex text-xs text-violet-600 hover:text-violet-700 font-semibold whitespace-nowrap"
        >
          {channelPages.length === 0 ? 'Create First Page →' : 'New QR Page →'}
        </Link>
      </div>

      {/* KPI Stats Overview (Crisp Glass Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl apple-glass shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Total Scans</span>
            <QrCode className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalScans.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Real-time screen scans
          </div>
        </div>

        <div className="p-5 rounded-2xl apple-glass shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Leads Captured</span>
            <Users className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-pink-600">
            {totalLeadsCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-violet-600 font-medium mt-1">
            {avgConversion}% opt-in conversion
          </div>
        </div>

        <div className="p-5 rounded-2xl apple-glass shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Outbound Clicks</span>
            <MousePointerClick className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Product & link visits
          </div>
        </div>

        <div className="p-5 rounded-2xl apple-glass shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Active Tapframes</span>
            <Tv className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {channelPages.length} {profile?.plan === 'free' ? '/ 1 (Free)' : '/ ∞ (Pro)'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Dynamic & editable anytime
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search pages, videos, or campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 shadow-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          {(['all', 'active', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                filterTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Pages List or Apple-Grade Empty State */}
      {channelPages.length === 0 ? (
        <div className="p-8 sm:p-14 rounded-3xl apple-glass text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
          <Mascot mood="curious" size="sm" interactive={false} />
          
          <div className="max-w-md space-y-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">No video pages yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Create a dynamic page for your next video upload, embed the high-res QR code into your video frame, and start capturing qualified leads on autopilot.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard/new"
              onClick={handleCreateClick}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create First QR Page</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main List Column */}
          <div className="lg:col-span-7 space-y-4">
            {channelPages.map((page) => {
              const pageLeadsCount = leads.filter(l => l.page_id === page.id).length;
              const liveLeads = Math.max(page.total_leads || 0, pageLeadsCount);
              const liveScans = page.total_scans || 0;
              const liveClicks = page.total_clicks || 0;

              return (
                <div
                  key={page.id}
                  className="p-4 sm:p-5 rounded-2xl apple-glass hover:border-violet-400/80 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:shadow-md"
                >
                  {/* Left Side: Contained Thumbnail + Clean Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div 
                      onClick={() => setSelectedPreviewPage(page)}
                      className="w-16 h-16 bg-white p-1.5 rounded-xl shadow-xs cursor-pointer shrink-0 flex items-center justify-center hover:scale-105 transition-transform overflow-hidden border border-slate-200"
                      title="Click to view 4K QR code"
                    >
                      <QRCodeDisplay page={page} size={54} isThumbnail={true} showCardWrapper={false} />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                          {page.title || 'Untitled QR Page'}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {page.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-700">{page.headline || page.title}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        /q/{page.slug} {page.destination_type === 'external_url' ? `→ ${page.external_url}` : '(Landing Page)'}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Stats & Action Buttons */}
                  <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">
                        {liveScans.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">Scans</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-pink-600">
                        {liveLeads.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">Leads</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-indigo-600">
                        {liveClicks.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">Clicks</div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-1">
                      <button
                        onClick={() => setSelectedPreviewPage(page)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="View QR Code Details"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <Link
                        to={`/dashboard/edit/${page.id}`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit Tapframe"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      <a
                        href={`/q/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Open Live Public Destination"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                            deletePage(page.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Side Preview Column */}
          <div className="lg:col-span-5 space-y-4">
            {selectedPreviewPage || channelPages[0] ? (
              <div className="p-6 rounded-3xl apple-glass sticky top-20 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600">Active QR Overlay</span>
                    <h3 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                      {(selectedPreviewPage || channelPages[0]).title}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 font-mono font-bold">
                    4K Export
                  </span>
                </div>

                <QRCodeDisplay 
                  page={selectedPreviewPage || channelPages[0]} 
                  size={200} 
                  showCardWrapper={true} 
                />

                <div className="mt-4 p-3.5 rounded-2xl apple-glass-subtle text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <strong className="text-slate-800">
                      {(selectedPreviewPage || channelPages[0]).destination_type === 'landing_page' ? 'Mobile Landing Page' : 'External Website'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Capture:</span>
                    <strong className="text-emerald-700">
                      {(selectedPreviewPage || channelPages[0]).lead_capture_enabled ? 'Active Capture' : 'Disabled'}
                    </strong>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Upgrade Modal if limit reached */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl apple-glass text-center space-y-4 animate-in zoom-in-95 shadow-2xl">
            <Mascot mood="celebrate" size="sm" badge="Pro Feature" message="Unlock unlimited dynamic Tapframes for all your YouTube videos!" />
            <h3 className="text-xl font-bold text-slate-900">Free Plan Limit Reached</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The free tier allows <strong>1 active Tapframe</strong>. Upgrade to Pro ($11.11/mo or $99/yr) to unlock unlimited dynamic QR codes, timestamp routing, and multi-channel workspaces.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <Link
                to="/dashboard/plan"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/20"
              >
                View Pro Plans
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
