import React, { useState, useRef } from 'react';
import { useApp } from '../lib/context';
import { 
  Tv, 
  Save, 
  CheckCircle2,
  Upload,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Mascot } from '../components/Mascot';

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

export const ChannelBrandingPage: React.FC = () => {
  const { activeChannel, updateChannel, channels, setActiveChannel } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(activeChannel?.name || '');
  const [handle, setHandle] = useState(activeChannel?.handle || '');
  const [platform, setPlatform] = useState(activeChannel?.platform || 'youtube');
  const [subscriberCount, setSubscriberCount] = useState(activeChannel?.subscriber_count || '');
  const [avatarUrl, setAvatarUrl] = useState(activeChannel?.avatar_url || '');
  const [primaryColor, setPrimaryColor] = useState(activeChannel?.primary_color || '#8B5CF6');
  const [description, setDescription] = useState(activeChannel?.description || '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel) return;

    await updateChannel(activeChannel.id, {
      name: name.trim(),
      handle: handle.trim(),
      platform,
      subscriber_count: subscriberCount.trim(),
      avatar_url: avatarUrl,
      primary_color: primaryColor,
      description: description.trim(),
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
            message="Your channel logo and colors automatically skin all QR code landing pages for your viewers!" 
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
            <span>Channel Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Channel Selection Bar if multiple channels exist */}
        {channels.length > 1 && (
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
                  {c.avatar_url && <img src={c.avatar_url} alt={c.name} className="w-5 h-5 rounded-full object-cover" />}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brand Details Card */}
        <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-5">
          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Channel Logo / Avatar <span className="text-slate-500 font-normal">(Max 10MB)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#0B0D15] border border-white/10">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || 'Channel Logo'}
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
                    <span>Upload New Logo</span>
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
                  Or paste direct image URL
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My YouTube Channel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Handle / Username</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @creator"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
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
                placeholder="e.g. 100K subscribers"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
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
              placeholder="A short description of what you teach, produce, or offer..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
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
