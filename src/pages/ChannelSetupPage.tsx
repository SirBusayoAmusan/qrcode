import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Radio, Smartphone, Video, Play, Upload, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const ChannelSetupPage: React.FC = () => {
  const { createChannel, updateChannel, channels, activeChannel, profile } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (channels && channels.length > 0 && !window.location.search.includes('edit=true')) {
      navigate('/dashboard', { replace: true });
    }
  }, [channels, navigate]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const compressed = await compressImageFile(file);
      setAvatarUrl(compressed);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    try {
      if (existingChan) {
        await updateChannel(existingChan.id, {
          name: name.trim(),
          handle: handle.trim().startsWith('@') ? handle.trim() : (handle.trim() ? `@${handle.trim()}` : '@creator'),
          platform,
          subscriber_count: subscriberCount.trim(),
          avatar_url: avatarUrl || defaultAvatar,
          primary_color: primaryColor,
          description: description.trim(),
        });
      } else {
        await createChannel({
          name: name.trim(),
          handle: handle.trim().startsWith('@') ? handle.trim() : (handle.trim() ? `@${handle.trim()}` : '@creator'),
          platform,
          subscriber_count: subscriberCount.trim(),
          avatar_url: avatarUrl || defaultAvatar,
          primary_color: primaryColor,
          description: description.trim(),
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving channel:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-violet-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-6 text-center relative z-10 flex flex-col items-center w-full max-w-lg">
        <Logo to="/" size="lg" theme="light" className="justify-center mb-3" />
        
        <div className="my-1">
          <Mascot 
            mood="float" 
            size="xs"
            badge="Channel Branding"
            message="Your logo and channel skin will automatically brand all your QR Tapframe links!"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Connect your creator brand
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
          Your logo and colors appear automatically on every QR landing page and video Tapframe.
        </p>
      </div>

      {/* Main Card (Apple-style minimalist) */}
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Platform selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Primary Content Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-500' },
                { id: 'podcast', label: 'Podcast', icon: Radio, color: 'text-purple-600' },
                { id: 'tiktok', label: 'TikTok/IG', icon: Smartphone, color: 'text-pink-600' },
                { id: 'other', label: 'Brand/Site', icon: Video, color: 'text-blue-600' },
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
                        ? 'bg-violet-50 border-violet-400 text-violet-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Upload with compression */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Channel Logo / Avatar <span className="text-slate-400 font-normal">(Max 10MB)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Channel Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600">
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
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
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
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {uploadError && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Channel Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Channel / Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oluwaseun Tech & Media"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Handle / Username</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @oluwaseun"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-mono placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
          </div>

          {/* Subscribers & Accent Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subscriber Count / Tag</label>
              <input
                type="text"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(e.target.value)}
                placeholder="e.g. 50K subscribers"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Accent Color</label>
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
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Channel Tagline / Bio</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Video marketing strategies and free resources..."
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
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
