import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { 
  Download, 
  Search, 
  Globe, 
  Smartphone, 
  Layers
} from 'lucide-react';
import { Mascot } from '../components/Mascot';
import confetti from 'canvas-confetti';

export const LeadsDashboard: React.FC = () => {
  const { leads } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  // Unique campaign names for filtering
  const campaignOptions = Array.from(new Set(leads.map(l => l.campaign_name || 'General'))).filter(Boolean);

  // Filtered leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCampaign = selectedCampaign === 'all' ? true : lead.campaign_name === selectedCampaign;
    return matchesSearch && matchesCampaign;
  });

  // Group leads by campaign for the campaign grouping view requirement
  const campaignGroupStats = campaignOptions.map(camp => {
    const groupLeads = leads.filter(l => (l.campaign_name || 'General') === camp);
    return {
      campaign_name: camp,
      count: groupLeads.length,
      latest: groupLeads[0]?.created_at || new Date().toISOString()
    };
  });

  const exportCSV = () => {
    if (filteredLeads.length === 0) return;
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    const headers = ['ID', 'Email', 'Name', 'Page Title', 'Campaign Name', 'Source', 'Referrer', 'Country', 'Device', 'Date'];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.email}"`,
      `"${l.name || ''}"`,
      `"${l.page_title}"`,
      `"${l.campaign_name || ''}"`,
      `"${l.source}"`,
      `"${l.referrer || ''}"`,
      `"${l.country}"`,
      l.device,
      `"${new Date(l.created_at).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ClearpathQR_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Mascot Celebration */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17142B] via-[#121422] to-[#121829] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Mascot 
            mood="celebrate" 
            size="sm" 
            badge="Audience CRM" 
            message={`You have ${leads.length} captured leads from your video scans! Ready to sync to your email list.`} 
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Lead Capture CRM</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Captured Leads & Audiences
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Every viewer who entered their email across all your video tapframes.
            </p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 self-stretch md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV ({filteredLeads.length})</span>
        </button>
      </div>

      {/* Campaign Grouping Visible in Leads View */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Layers className="w-4 h-4 text-violet-400" />
          <span>Campaign Cohorts & Source Performance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedCampaign('all')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedCampaign === 'all'
                ? 'bg-violet-600/15 border-violet-500 text-white'
                : 'bg-[#11131E] border-white/5 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="text-xs font-semibold text-slate-400">All Campaigns Combined</div>
            <div className="text-2xl font-black text-white mt-1">{leads.length}</div>
            <div className="text-[11px] text-violet-400 mt-1">100% Total captured leads</div>
          </div>

          {campaignGroupStats.map((group, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCampaign(group.campaign_name)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCampaign === group.campaign_name
                  ? 'bg-violet-600/15 border-violet-500 text-white'
                  : 'bg-[#11131E] border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-semibold text-slate-300 truncate">{group.campaign_name}</div>
              <div className="text-2xl font-black text-white mt-1">{group.count}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Latest: {new Date(group.latest).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by email, name, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#11131E] border border-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong>{filteredLeads.length}</strong> of {leads.length} leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#11131E] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Contact / Email</th>
                <th className="py-3.5 px-4">Campaign Group</th>
                <th className="py-3.5 px-4">Page Title</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Source Device</th>
                <th className="py-3.5 px-4">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                        {lead.name ? lead.name[0].toUpperCase() : lead.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{lead.name || 'Anonymous Viewer'}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{lead.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-violet-950/60 border border-violet-500/20 text-violet-300 text-[11px] font-medium inline-block">
                      {lead.campaign_name || 'General'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-300 font-medium">
                    {lead.page_title}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lead.city ? `${lead.city}, ` : ''}{lead.country}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="capitalize">{lead.referrer || lead.source}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
