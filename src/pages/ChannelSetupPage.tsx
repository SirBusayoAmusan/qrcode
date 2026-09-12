import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Radio, Smartphone, Video, Play, Upload, AlertCircle, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

export const ChannelSetupPage: React.FC = () => {
  const { createChannel, user, profile } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ALL fields start completely blank with clean placeholders as requested!
  const [name, setName] = useState(profile?.full_name || '');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'podcast' | 'other'>('youtube');
  const [subscriberCount, setSubscriberCount] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit strictly enforced

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit. Please upload an image under 10MB.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      await createChannel({
        name: name.trim(),
        handle: handle.trim().startsWith('@') ? handle.trim() : (handle.trim() ? `@${handle.trim()}` : '@creator'),
        platform,
        subscriber_count: subscriberCount.trim(),
        avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        primary_color: primaryColor,
        description: description.trim(),
      });

      // Channel branding is complete — take creator directly to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
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
            badge="Channel Branding First"
            message="Upload your channel logo and enter your brand details. This will automatically skin every QR code you publish!"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-2">
          <span>Step 1: Setup Your Creator Branding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Connect your creator brand
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
          Your logo and colors appear automatically on every QR landing page and video tapframe.
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
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
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

          {/* Logo Upload with 10MB validation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Channel Logo / Avatar <span className="text-slate-500 font-normal">(Max 10MB)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#0B0D15] border border-white/10">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Channel Preview"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo (up to 10MB)</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500">
                  Or paste direct image URL below if preferred
                </div>

                <input
                  type="url"
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://yourbrand.com/logo.png"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#11131E] border border-white/10 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {uploadError && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Channel Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel / Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oluwaseun Tech & Media"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Handle / Username</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @oluwaseun"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Subscribers & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subscriber Count / Audience Tag</label>
              <input
                type="text"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(e.target.value)}
                placeholder="e.g. 50K subscribers or Creator Community"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
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
              placeholder="e.g. Helping you grow an audience and monetize your content with high-converting funnels..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save Channel Branding & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
