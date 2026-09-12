import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Radio, Smartphone, Video, Play, Upload, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

export const ChannelSetupPage: React.FC = () => {
  const { createChannel, updateChannel, channels, activeChannel, profile } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If user already has a channel configured, load its data or redirect to dashboard
  const existingChan = activeChannel || channels[0];

  const [name, setName] = useState(existingChan?.name || profile?.full_name || '');
  const [handle, setHandle] = useState(existingChan?.handle || '');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'podcast' | 'other'>(
    existingChan?.platform || 'youtube'
  );
  const [subscriberCount, setSubscriberCount] = useState(existingChan?.subscriber_count || '');
  const [avatarUrl, setAvatarUrl] = useState(existingChan?.avatar_url || '');
  const [primaryColor, setPrimaryColor] = useState(existingChan?.primary_color || '#8B5CF6');
  const [description, setDescription] = useState(existingChan?.description || '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If user already has channels set up and didn't come here to edit, redirect straight to dashboard
  useEffect(() => {
    if (channels && channels.length > 0 && !window.location.search.includes('edit=true')) {
      navigate('/dashboard', { replace: true });
    }
  }, [channels, navigate]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit strictly enforced

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size exceeds 10MB limit. Please upload an image under 10MB.`);
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
      if (existingChan) {
        await updateChannel(existingChan.id, {
          name: name.trim(),
          handle: handle.trim().startsWith('@') ? handle.trim() : (handle.trim() ? `@${handle.trim()}` : '@creator'),
          platform,
          subscriber_count: subscriberCount.trim(),
          avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          primary_color: primaryColor,
          description: description.trim(),
        });
      } else {
        await createChannel({
          name: name.trim(),
          handle: handle.trim().startsWith('@') ? handle.trim() : (handle.trim() ? `@${handle.trim()}` : '@creator'),
          platform,
          subscriber_count: subscriberCount.trim(),
          avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          primary_color: primaryColor,
          description: description.trim(),
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-6 text-center relative z-10 flex flex-col items-center w-full max-w-lg">
        <Logo to="/" size="lg" className="justify-center mb-3" />
        
        <div className="my-1">
          <Mascot 
            mood="float" 
            size="xs"
            badge="Channel Branding"
            message="Your logo and channel skin will automatically brand all your QR Tapframe links!"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Connect your creator brand
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Your logo and colors appear automatically on every QR landing page and video Tapframe.
        </p>
      </div>

      {/* Main Card (Apple-style minimalist) */}
      <div className="w-full max-w-lg bg-[#10121E] border border-white/[0.08] rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/60 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Platform selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Primary Content Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-400' },
                { id: 'podcast', label: 'Podcast', icon: Radio, color: 'text-purple-400' },
                { id: 'tiktok', label: 'TikTok/IG', icon: Smartphone, color: 'text-pink-400' },
                { id: 'other', label: 'Brand/Site', icon: Video, color: 'text-blue-400' },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id as any)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-600/20'
                        : 'bg-[#090A12] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Upload with 10MB validation */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Channel Logo / Avatar <span className="text-slate-500 font-normal">(Max 10MB)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3.5 rounded-2xl bg-[#090A12] border border-white/[0.08]">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Channel Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500 shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <ImageIcon className="w-6 h-6" />
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
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600/25 hover:bg-violet-600/35 border border-violet-500/40 text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo (up to 10MB)</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Or paste image URL (e.g. https://...)"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#10121E] border border-white/[0.08] text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Channel / Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oluwaseun Tech & Media"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Handle / Username</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @oluwaseun"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs sm:text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Subscribers & Accent Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subscriber Count / Tag</label>
              <input
                type="text"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(e.target.value)}
                placeholder="e.g. 50K subscribers"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Brand Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090A12] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Channel Tagline / Bio</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Video marketing strategies and free resources..."
              className="w-full px-3.5 py-2 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Save Channel Branding & Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
