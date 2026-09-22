import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { 
  Users, 
  Download, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Tv, 
  ChevronDown,
  Sparkles,
  Tag
} from 'lucide-react';
import { Mascot } from '../components/Mascot';

export const LeadsDashboard: React.FC = () => {
  const { leads, pages, activeChannel } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPageId, setFilterPageId] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  // Scoped leads filtering strictly to the active channel
  const activeChannelPageIds = new Set(
    pages.filter(p => !activeChannel || p.channel_id === activeChannel.id).map(p => p.id)
  );

  // Extract all unique campaign names
  const allCampaigns = Array.from(
    new Set(
      leads
        .filter(l => !activeChannel || activeChannelPageIds.has(l.page_id))
        .map(l => l.campaign_name || 'General Campaign')
        .filter(Boolean)
    )
  );

  const filteredLeads = leads.filter((lead) => {
    // 1. Channel isolation
    if (lead.page_id && !activeChannelPageIds.has(lead.page_id) && activeChannel) {
      return false;
    }

    // 2. Page filter
    if (filterPageId !== 'all' && lead.page_id !== filterPageId) {
      return false;
    }

    // 3. Campaign filter
    if (selectedCampaign !== 'all' && (lead.campaign_name || 'General Campaign') !== selectedCampaign) {
      return false;
    }

    // 4. Search query
    const matchSearch =
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.campaign_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.source_video || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchSearch;
  });

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = ['ID', 'Email', 'Name', 'Phone', 'Campaign Name', 'Video Tapframe', 'Status', 'Date Captured'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.email}"`,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.campaign_name || 'General'}"`,
      `"${l.source_video || l.page_title || 'Direct'}"`,
      l.status || 'verified',
      new Date(l.created_at).toLocaleString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const channelPages = pages.filter(p => !activeChannel || p.channel_id === activeChannel.id);

  return (
    <div className="space-y-6 animate-fade-in pb-12 w-full max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block">
              Audience CRM & Campaign Management
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
              {filteredLeads.length} Total Leads
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Viewer Leads & Campaign CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Group, filter, and export viewers captured across your on-screen QR codes and campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-violet-600/20 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Mascot Insight Banner */}
      <div className="p-4 sm:p-5 rounded-3xl apple-glass shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Mascot mood="celebrate" size="xs" />
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>On-Screen Leads convert directly to your owned audience!</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">CAN-SPAM Compliant</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Export your collected contacts to CSV anytime to import into your favorite newsletter or CRM platform.
            </p>
          </div>
        </div>

        {/* Replaced 'Automate CRM Sync' with 'Export CSV' */}
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={filteredLeads.length === 0}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Campaign Grouping & Filter Bar */}
      <div className="p-4 rounded-3xl apple-glass flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search email, name, or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Campaign Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs appearance-none pr-8 cursor-pointer focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Campaigns ({allCampaigns.length})</option>
              {allCampaigns.map((c) => (
                <option key={c} value={c}>
                  📁 Campaign: {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Tapframe Page Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterPageId}
              onChange={(e) => setFilterPageId(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs appearance-none pr-8 cursor-pointer focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Video Tapframes ({channelPages.length})</option>
              {channelPages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.total_leads} leads)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-3xl apple-glass overflow-hidden shadow-xs">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No leads captured yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || filterPageId !== 'all' || selectedCampaign !== 'all'
                ? 'Try adjusting your search query or campaign filter selection.'
                : 'When viewers scan your on-screen QR codes and enter their details, they will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Campaign Group</th>
                  <th className="py-3 px-4">Tapframe Source</th>
                  <th className="py-3 px-4">Captured At</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-violet-600" />
                        <span>{lead.email}</span>
                      </div>
                      {(lead.name || lead.phone) && (
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                          {lead.name && <span>{lead.name}</span>}
                          {lead.phone && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{lead.campaign_name || 'General Campaign'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 max-w-xs truncate">
                        {lead.source_video || lead.page_title || 'Video Tapframe'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Tv className="w-3 h-3" />
                        <span>Connected Tapframe</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {lead.status || 'verified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
