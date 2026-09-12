import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Radio, Smartphone, Video, Play } from 'lucide-react';

export const ChannelSetupPage: React.FC = () => {
  const { createChannel } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('Ali Abdaal');
  const [handle, setHandle] = useState('@AliAbdaal');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'podcast' | 'other'>('youtube');
  const [subscriberCount, setSubscriberCount] = useState('5.2M subscribers');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [description, setDescription] = useState('Helping you build a high-leverage creator business and master productivity.');
  const [loading, setLoading] = useState(false);

  const predefinedAvatars = [
    { label: 'Ali (Mock Creator)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { label: 'Maya (Media Creator)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { label: 'Tech Pro', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Podcast Host', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createChannel({
        name,
        handle,
        platform,
        subscriber_count: subscriberCount,
        avatar_url: avatarUrl,
        primary_color: primaryColor,
        description,
      });

      // Navigate to creating the first QR page
      navigate('/dashboard/new');
    } catch (err) {
      console.error(err);
      navigate('/dashboard/new');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-6 text-center relative z-10 flex flex-col items-center">
        <Logo to="/" size="lg" className="justify-center mb-3" />
        
        <div className="my-2">
          <Mascot 
            mood="float" 
            size="sm"
            badge="Brand Setup Guide"
            message="Let's add your channel logo and colors! This shows on all QR pages."
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-2">
          <span>Step 1 of 2: Setup Your Channel Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Connect your creator brand
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
          Your channel logo & name will automatically display on every QR landing page and video tapframe.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl bg-[#121422] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Platform selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Content Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-400' },
                { id: 'podcast', label: 'Podcast', icon: Radio, color: 'text-purple-400' },
                { id: 'tiktok', label: 'TikTok/IG', icon: Smartphone, color: 'text-pink-400' },
                { id: 'other', label: 'Keynote/Brand', icon: Video, color: 'text-blue-400' },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id as any)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-600/20'
                        : 'bg-[#0B0D15] border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${p.color}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Channel Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel / Brand Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Abdaal"
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
                placeholder="@aliabdaal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Avatar & Branding Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Channel Avatar / Logo</label>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={avatarUrl}
                alt="Channel Preview"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500 shadow-md"
              />
              <div className="flex-1">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Paste direct image URL"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                />
                <div className="flex gap-2 mt-2">
                  {predefinedAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(av.url)}
                      className="text-[11px] text-violet-400 hover:text-violet-300 underline"
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subscribers & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subscriber / Audience Tag</label>
              <input
                type="text"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(e.target.value)}
                placeholder="e.g. 5.2M subscribers or 100k Club"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Accent Color</label>
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

          {/* Bio / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel Tagline / Bio</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short summary of what you teach or offer..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Save Channel & Create First QR Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
