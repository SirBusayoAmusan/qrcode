import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { 
  Tv, 
  Save, 
  CheckCircle2
} from 'lucide-react';
import { Mascot } from '../components/Mascot';

export const ChannelBrandingPage: React.FC = () => {
  const { activeChannel, updateChannel, channels, setActiveChannel } = useApp();
  
  const [name, setName] = useState(activeChannel?.name || 'Ali Abdaal');
  const [handle, setHandle] = useState(activeChannel?.handle || '@AliAbdaal');
  const [platform, setPlatform] = useState(activeChannel?.platform || 'youtube');
  const [subscriberCount, setSubscriberCount] = useState(activeChannel?.subscriber_count || '5.2M subscribers');
  const [avatarUrl, setAvatarUrl] = useState(activeChannel?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [primaryColor, setPrimaryColor] = useState(activeChannel?.primary_color || '#8B5CF6');
  const [description, setDescription] = useState(activeChannel?.description || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const predefinedAvatars = [
    { label: 'Ali (Mock Creator)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { label: 'Maya (Media Creator)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { label: 'Tech Pro', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Podcast Host', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel) return;

    await updateChannel(activeChannel.id, {
      name,
      handle,
      platform,
      subscriber_count: subscriberCount,
      avatar_url: avatarUrl,
      primary_color: primaryColor,
      description,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-12">
      {/* Header with Mascot */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17142B] via-[#121422] to-[#121829] border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Mascot 
            mood="float" 
            size="sm" 
            badge="Brand Studio" 
            message="Your logo and colors automatically skin every QR code landing page!" 
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Channel Branding Settings</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Creator Profile & Visual Identity
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              This logo, handle, and brand accent appear automatically on all your generated QR pages.
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Channel Settings Updated!</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Channel Selection Bar */}
        <div className="p-4 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">Switch Editing Channel</div>
            <div className="text-[11px] text-slate-400">Select which channel brand you are modifying.</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {channels.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveChannel(c);
                  setName(c.name);
                  setHandle(c.handle);
                  setPlatform(c.platform);
                  setSubscriberCount(c.subscriber_count || '');
                  setAvatarUrl(c.avatar_url);
                  setPrimaryColor(c.primary_color);
                  setDescription(c.description || '');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeChannel?.id === c.id
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-[#0B0D15] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <img src={c.avatar_url} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand Details Card */}
        <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/50 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs shadow">
                <Tv className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Avatar / Logo Image URL</label>
              <input
                type="url"
                required
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
              />
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span>Quick samples:</span>
                {predefinedAvatars.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(av.url)}
                    className="text-violet-400 hover:text-violet-300 underline"
                  >
                    {av.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Handle / Username</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subscriber Count / Proof</label>
              <input
                type="text"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(e.target.value)}
                placeholder="e.g. 5.2M subscribers"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel Bio / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Channel Branding</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
