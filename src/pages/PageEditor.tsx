import React, { useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { 
  ArrowLeft, 
  ArrowRight,
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Tv, 
  Smartphone, 
  Layers, 
  Lock, 
  AlertCircle,
  Link2,
  CheckSquare,
  Square,
  RefreshCw,
  Globe,
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  Download,
  Palette,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Video,
  Monitor
} from 'lucide-react';
import type { TapframePage, ProductLink } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Mascot } from '../components/Mascot';
import { UpgradePaywallModal } from '../components/UpgradePaywallModal';
import { generateUniqueSlug } from '../lib/slug';
import confetti from 'canvas-confetti';

const countWords = (text: string): number => {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const normalizeUrl = (raw: string): string => {
  if (!raw || !raw.trim()) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return 'https://' + trimmed;
};

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

const PRESET_COLORS = [
  { name: 'Violet', value: '#8B5CF6', ring: 'ring-violet-500' },
  { name: 'Indigo', value: '#6366F1', ring: 'ring-indigo-500' },
  { name: 'Blue', value: '#3B82F6', ring: 'ring-blue-500' },
  { name: 'Pink', value: '#EC4899', ring: 'ring-pink-500' },
  { name: 'Emerald', value: '#10B981', ring: 'ring-emerald-500' },
  { name: 'Amber', value: '#F59E0B', ring: 'ring-amber-500' },
  { name: 'Obsidian', value: '#0F172A', ring: 'ring-slate-800' },
];

export const PageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { user, pages, activeChannel, updateChannel, createPage, updatePage, profile, trialActive } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingPage = isEditing ? pages.find(p => p.id === id) : null;
  const isPro = profile?.plan === 'pro' || trialActive;

  // Stepper: 1 = Creator Branding, 2 = Page Content, 3 = Dedicated 4K Download
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(isEditing ? 2 : 1);

  // STEP 1: Creator Branding (Strictly Required Fields)
  const [handle, setHandle] = useState(activeChannel?.handle || '');
  const [channelName, setChannelName] = useState(activeChannel?.name || '');
  const [channelBio, setChannelBio] = useState(activeChannel?.description || '');
  const [avatarUrl, setAvatarUrl] = useState(activeChannel?.avatar_url || '');
  const [subscriberCount, setSubscriberCount] = useState(activeChannel?.subscriber_count || '');
  const [primaryColor, setPrimaryColor] = useState(activeChannel?.primary_color || '#8B5CF6');

  // STEP 2: Mobile Page Content (Empty defaults with light placeholders, Campaign & Ribbon removed)
  const [slug, setSlug] = useState(() => {
    if (existingPage?.slug) return existingPage.slug;
    const allSlugs = pages.map(p => p.slug);
    return generateUniqueSlug(allSlugs);
  });
  const [headline, setHeadline] = useState(existingPage?.headline || existingPage?.title || '');
  const [subheadline, setSubheadline] = useState(existingPage?.subheadline || '');
  
  // Product Links (Supports adding as many links as desired)
  const [productLinks, setProductLinks] = useState<ProductLink[]>(() => {
    if (existingPage?.product_links && existingPage.product_links.length > 0) {
      return existingPage.product_links;
    }
    return [{ id: 'prod-1', title: '', url: '' }];
  });

  // Email Lead Capture setup
  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(
    existingPage?.lead_capture_enabled !== undefined ? existingPage.lead_capture_enabled : true
  );
  const [collectName, setCollectName] = useState(
    existingPage?.lead_capture_fields?.collect_name || false
  );
  const [collectPhone, setCollectPhone] = useState(
    existingPage?.lead_capture_fields?.collect_phone || false
  );
  const [leadMagnetTitle, setLeadMagnetTitle] = useState(
    existingPage?.lead_magnet_title || ''
  );
  const [leadCaptureButtonText, setLeadCaptureButtonText] = useState(
    existingPage?.lead_capture_button_text || ''
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editorGuideTab, setEditorGuideTab] = useState<'premiere' | 'finalcut' | 'obs' | 'canva'>('premiere');

  // Step 1 Validation Check
  const isStep1Valid = Boolean(
    handle.trim() &&
    channelName.trim() &&
    channelBio.trim() &&
    avatarUrl.trim() &&
    primaryColor.trim()
  );

  // Logo upload with canvas compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds 10MB limit. Please upload an image under 10MB.');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setAvatarUrl(compressed);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductLink = () => {
    setProductLinks([
      ...productLinks,
      { id: Date.now().toString(), title: '', url: '' }
    ]);
  };

  const handleRemoveProductLink = (index: number) => {
    if (productLinks.length <= 1) return;
    setProductLinks(productLinks.filter((_, i) => i !== index));
  };

  const handleUpdateProductLink = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...productLinks];
    updated[index][field] = value;
    setProductLinks(updated);
  };

  const handleRegenerateSlug = () => {
    const allSlugs = pages.map(p => p.slug);
    setSlug(generateUniqueSlug(allSlugs));
  };

  const MAX_WORDS = 100;
  const headlineWords = countWords(headline);
  const subheadlineWords = countWords(subheadline);

  const handleHeadlineChange = (val: string) => {
    const words = countWords(val);
    if (words <= MAX_WORDS || val.length < headline.length) {
      setHeadline(val);
    }
  };

  const handleSubheadlineChange = (val: string) => {
    const words = countWords(val);
    if (words <= MAX_WORDS || val.length < subheadline.length) {
      setSubheadline(val);
    }
  };

  const computedTitle = headline.trim() || 'My Video Resource Page';

  const previewPage: TapframePage = {
    id: existingPage?.id || 'temp-id',
    channel_id: activeChannel?.id || 'guest-ch-1',
    user_id: user?.id || 'guest',
    title: computedTitle,
    slug: slug || 'my-offer',
    campaign_name: existingPage?.campaign_name || `${channelName || 'Main'} Campaign`,
    destination_type: 'landing_page',
    external_url: '',
    status: 'active',
    headline: headline || 'The Six Figure Wealth Guide',
    subheadline: subheadline || 'Drop your email below to get the free downloadable guide and resources.',
    product_links: productLinks.map(p => ({ ...p, url: normalizeUrl(p.url) })),
    lead_capture_enabled: leadCaptureEnabled,
    lead_capture_fields: {
      collect_email: true,
      collect_name: collectName,
      collect_phone: collectPhone,
    },
    lead_magnet_title: leadMagnetTitle || 'Free Strategy Guide & Template',
    lead_capture_button_text: leadCaptureButtonText || 'Get Access',
    custom_theme: {
      background_color: '#0B0D17',
      accent_color: primaryColor || '#8B5CF6',
      text_color: '#FFFFFF',
      card_style: 'glass',
      qr_style: {
        fg_color: '#000000',
        bg_color: '#FFFFFF',
        frame_style: 'dark_pill',
        callout_text: headline ? `Scan to get: ${headline}` : 'Scan the QR code to get free access',
      }
    },
    total_scans: existingPage?.total_scans || 0,
    unique_visitors: existingPage?.unique_visitors || 0,
    total_clicks: existingPage?.total_clicks || 0,
    total_leads: existingPage?.total_leads || 0,
    created_at: existingPage?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // STEP 1 Validation & Proceed
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!avatarUrl.trim()) {
      setErrorMessage('Please upload a channel logo / avatar before proceeding.');
      return;
    }
    if (!handle.trim()) {
      setErrorMessage('Please enter your channel handle / username.');
      return;
    }
    if (!channelName.trim()) {
      setErrorMessage('Please enter your channel / brand name.');
      return;
    }
    if (!channelBio.trim()) {
      setErrorMessage('Please enter your channel bio / description.');
      return;
    }
    if (!primaryColor.trim()) {
      setErrorMessage('Please choose a primary theme color.');
      return;
    }

    if (activeChannel) {
      try {
        await updateChannel(activeChannel.id, {
          handle: handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`,
          description: channelBio.trim(),
          avatar_url: avatarUrl,
          subscriber_count: subscriberCount.trim(),
          primary_color: primaryColor,
          name: channelName.trim(),
        });
      } catch (err) {
        console.warn('Channel update notice:', err);
      }
    }

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // STEP 2 Submit -> Trigger Paywall (if needed) or Proceed to Step 3
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!headline.trim()) {
      setErrorMessage('Please enter a main headline for your mobile page.');
      return;
    }

    // If guest, show the 2-step paywall modal (Account creation with prefilled name -> 14-day free trial)
    if (!user || !isPro) {
      setShowPaywallModal(true);
      return;
    }

    await executeSaveAndProceedToDownload();
  };

  const executeSaveAndProceedToDownload = async () => {
    setSaving(true);
    setErrorMessage(null);

    const cleanedLinks = productLinks
      .filter(l => l.title.trim() || l.url.trim())
      .map(l => ({
        ...l,
        title: l.title.trim() || 'Product Resource',
        url: normalizeUrl(l.url)
      }));

    const payload: Partial<TapframePage> = {
      title: computedTitle,
      slug: slug.trim(),
      campaign_name: existingPage?.campaign_name || `${channelName || 'Main'} Campaign`,
      destination_type: 'landing_page',
      external_url: '',
      headline: headline.trim(),
      subheadline: subheadline.trim(),
      product_links: cleanedLinks,
      lead_capture_enabled: leadCaptureEnabled,
      lead_capture_fields: {
        collect_email: true,
        collect_name: collectName,
        collect_phone: collectPhone,
      },
      lead_magnet_title: leadMagnetTitle.trim() || 'Free Strategy Guide & Template',
      lead_capture_button_text: leadCaptureButtonText.trim() || 'Get Access',
      custom_theme: previewPage.custom_theme,
    };

    try {
      if (isEditing && id) {
        await updatePage(id, payload);
      } else {
        await createPage(payload);
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.4 }
        });
      } catch (e) {}

      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error saving page:', err);
      setCurrentStep(3);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://qr.clearpath.click/q/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 w-full max-w-6xl mx-auto px-2 sm:px-4">
      {/* Top Stepper Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to={user ? "/dashboard" : "/"}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
            title="Return"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block">
              Step {currentStep} of 3 • {currentStep === 1 ? 'Creator Profile & Visual Identity' : currentStep === 2 ? 'Page Content' : 'Export & Download'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentStep === 1 && 'Creator Profile & Visual Identity'}
              {currentStep === 2 && '2. Mobile Page Content & Offer'}
              {currentStep === 3 && '3. Download 4K Video Tapframe'}
            </h1>
          </div>
        </div>

        {/* Fluid Stepper Pills */}
        <div className="flex items-center gap-2">
          {[
            { step: 1, label: 'Creator Profile' },
            { step: 2, label: 'Page Content' },
            { step: 3, label: 'Download' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                if (s.step === 1) setCurrentStep(1);
                if (s.step === 2 && isStep1Valid) setCurrentStep(2);
                if (s.step === 3 && isStep1Valid && headline.trim()) setCurrentStep(3);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentStep === s.step
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : currentStep > s.step
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{s.step}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: CREATOR PROFILE & VISUAL IDENTITY (ALL REQUIRED EXCEPT OPTIONAL)*/}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
          <div className="lg:col-span-7">
            <form onSubmit={handleStep1Submit} className="p-6 sm:p-8 rounded-3xl apple-glass space-y-6">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Creator Profile & Visual Identity
                </h2>
                <p className="text-xs text-slate-500">
                  Your handle, bio, and brand colors skin all QR landing pages automatically. Fill in all required fields to continue.
                </p>
              </div>

              {/* 1. Upload Logo (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Upload Logo / Avatar <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl apple-glass-subtle">
                  <div className="relative shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Channel Avatar"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-500 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
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
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{avatarUrl ? 'Change Logo' : 'Upload Logo *'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Handle / Username (Required) & Channel Name (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Handle / Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. @creator"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Channel / Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="e.g. Oluwaseun Media"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>
              </div>

              {/* 3. Channel Bio / Description (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Channel Bio / Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={channelBio}
                  onChange={(e) => setChannelBio(e.target.value)}
                  placeholder="A short description of what you teach, produce, or offer to viewers..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* 4. Subscriber Count / Proof (OPTIONAL ONLY) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Subscriber Count / Proof
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">(Optional)</span>
                </div>
                <input
                  type="text"
                  value={subscriberCount}
                  onChange={(e) => setSubscriberCount(e.target.value)}
                  placeholder="e.g. 100K subscribers • 500K Views"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* 5. Primary Theme Color (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Primary Theme Color <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setPrimaryColor(c.value)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                        primaryColor === c.value ? `scale-125 ring-2 ring-offset-2 ${c.ring}` : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{primaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Save & Continue Button (Disabled if parameters are missing) */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={!isStep1Valid}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                >
                  <span>Save & Continue to Page Content</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {!isStep1Valid && (
                  <p className="text-[11px] text-amber-700 text-center mt-2 font-medium">
                    ⚠️ Please fill in all required parameters (Logo, Handle, Name, Bio, Color) to continue.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Side Preview Card */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="p-6 rounded-3xl apple-glass flex flex-col items-center justify-center text-center">
              <div className="mb-3">
                <Mascot 
                  mood="float" 
                  size="xs" 
                  badge="Step 1: Brand Skin" 
                  message="Your logo and colors automatically customize all your video QR Tapframes!" 
                />
              </div>

              {/* Live Card Mockup */}
              <div className="w-full max-w-[280px] rounded-[32px] bg-slate-950 text-white border-4 border-slate-800 p-4 text-center shadow-2xl">
                <div className="flex items-center justify-center gap-2 pb-2 border-b border-white/10">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Channel"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">
                      Logo
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{channelName || 'Your Brand Name'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {handle || '@handle'} {subscriberCount ? `• ${subscriberCount}` : ''}
                    </div>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <div className="h-4 w-3/4 bg-white/20 rounded-md mx-auto" />
                  <div className="h-3 w-5/6 bg-white/10 rounded-md mx-auto" />
                  <div className="h-9 w-full rounded-xl mt-3" style={{ backgroundColor: primaryColor || '#8B5CF6' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: MOBILE PAGE CONTENT & UNLIMITED PRODUCT LINKS                   */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
          <div className="lg:col-span-7">
            <form onSubmit={handleStep2Submit} className="p-6 sm:p-8 rounded-3xl apple-glass space-y-6">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  2. Mobile Page Content & Offer
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your headline, subheadline, and product links for viewers scanning your QR code.
                </p>
              </div>

              {/* Main Headline * (Clean Empty Input with Light Placeholder) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Main Headline <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{headlineWords}/{MAX_WORDS} words</span>
                </div>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => handleHeadlineChange(e.target.value)}
                  placeholder="e.g. The Six Figure Wealth Guide"
                  className="w-full px-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Subheadline / Description (Clean Empty Input with Light Placeholder) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Subheadline / Description</label>
                  <span className="text-[10px] text-slate-400 font-mono">{subheadlineWords}/{MAX_WORDS} words</span>
                </div>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => handleSubheadlineChange(e.target.value)}
                  placeholder="e.g. Drop your email below to get the free downloadable guide and resources."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Product Destination Links (Supports Multiple / Unlimited Links) */}
              <div className="p-5 rounded-2xl apple-glass-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-violet-600" />
                      <span>Product Destination Link</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Destination URL where viewers are redirected after entering their details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddProductLink}
                    className="px-3 py-1.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {productLinks.map((link, idx) => (
                    <div key={link.id || idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-xs relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-violet-700">
                          {idx === 0 ? 'Primary Destination Link #1' : `Product Link #${idx + 1}`}
                        </span>
                        {productLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProductLink(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => handleUpdateProductLink(idx, 'title', e.target.value)}
                          placeholder="Name of the product (e.g. Notion Business Template)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div>
                        <div className="relative">
                          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateProductLink(idx, 'url', e.target.value)}
                            placeholder="e.g. https://creator.gumroad.com or www.myproduct.com"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enable Email Lead Capture (optional) */}
              <div className="p-5 rounded-2xl apple-glass-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Enable Email Lead Capture (Optional)</div>
                    <div className="text-[11px] text-slate-500">Collect viewer email/phone before granting product access.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={leadCaptureEnabled}
                    onChange={(e) => setLeadCaptureEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                {leadCaptureEnabled && (
                  <div className="space-y-4 pt-3 border-t border-slate-200/80">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Select Visitor Details to Collect:
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-violet-200 text-slate-900 flex items-center gap-2 shadow-xs">
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-xs">Email</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCollectName(!collectName)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs cursor-pointer transition-all ${
                            collectName
                              ? 'bg-violet-100 border-violet-300 text-violet-900 font-semibold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {collectName ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                          <span>Full Name</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCollectPhone(!collectPhone)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs cursor-pointer transition-all ${
                            collectPhone
                              ? 'bg-violet-100 border-violet-300 text-violet-900 font-semibold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {collectPhone ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                          <span>Phone No.</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lead Magnet / Asset Title</label>
                      <input
                        type="text"
                        value={leadMagnetTitle}
                        onChange={(e) => setLeadMagnetTitle(e.target.value)}
                        placeholder="e.g. Free Strategy Guide & Template"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Submit Button CTA Text</label>
                      <input
                        type="text"
                        value={leadCaptureButtonText}
                        onChange={(e) => setLeadCaptureButtonText(e.target.value)}
                        placeholder="e.g. Get Access"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={saving || !headline.trim()}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Publishing...' : 'Save & Download 4K QR Tapframe'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Side Preview Mockup (Synchronized with collectName and collectPhone) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="p-6 rounded-3xl apple-glass flex flex-col items-center justify-center">
              <div className="w-full max-w-[300px] rounded-[34px] bg-slate-950 text-white border-4 border-slate-800 shadow-2xl overflow-hidden p-4 text-center pointer-events-none">
                <div className="flex items-center justify-center gap-2 pb-2 mb-3 border-b border-white/10">
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Channel"
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500"
                  />
                  <span className="text-xs font-bold text-white">{channelName || 'Your Channel'}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-tight mb-1.5">
                  {headline || 'The Six Figure Wealth Guide'}
                </h3>
                <p className="text-[11px] text-slate-400 mb-4 line-clamp-2">
                  {subheadline || 'Drop your email below to get the free downloadable guide and resources.'}
                </p>

                {leadCaptureEnabled ? (
                  <div className="p-3 rounded-2xl bg-white/5 border border-violet-500/30 space-y-2 text-left">
                    <span className="text-[10px] font-bold text-violet-300 block">
                      {leadMagnetTitle || 'Free Strategy Guide & Template'}
                    </span>

                    {/* LIVE FULL NAME INPUT IN MOCKUP IF CHECKED */}
                    {collectName && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 text-[10px] text-slate-300 border border-violet-400/40 animate-fade-in">
                        <User className="w-3 h-3 text-violet-400 shrink-0" />
                        <span>Full Name input</span>
                      </div>
                    )}

                    {/* ALWAYS EMAIL */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 text-[10px] text-slate-300 border border-white/10">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>your@email.com</span>
                    </div>

                    {/* LIVE PHONE NUMBER INPUT IN MOCKUP IF CHECKED */}
                    {collectPhone && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 text-[10px] text-slate-300 border border-violet-400/40 animate-fade-in">
                        <Phone className="w-3 h-3 text-violet-400 shrink-0" />
                        <span>Phone / WhatsApp input</span>
                      </div>
                    )}

                    <button 
                      type="button" 
                      disabled 
                      className="w-full py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md"
                      style={{ backgroundColor: primaryColor || '#8B5CF6' }}
                    >
                      <span>{leadCaptureButtonText || 'Get Access'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {productLinks.map((p, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/10 text-xs font-semibold flex items-center justify-between">
                        <span>{p.title || `Product Link #${i+1}`}</span>
                        <ExternalLink className="w-3 h-3 text-violet-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: DEDICATED 4K DOWNLOAD & EXPORT EXPERIENCE                       */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Top Success Banner */}
          <div className="p-6 sm:p-8 rounded-3xl apple-glass text-center max-w-3xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Your 4K QR Tapframe is Ready!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Download your ultra-sharp 4K frame overlay to drop directly into your video editor, or share the dynamic live link.
            </p>
          </div>

          {/* Main 2-Column Download Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 4K Frame Display & Direct Downloads */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-3xl apple-glass shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600">4K Video Overlay</span>
                    <h3 className="text-base font-bold text-slate-900">{headline || 'My Offer'}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 font-mono text-xs font-bold">
                    1080x1080 PNG
                  </span>
                </div>

                <div className="flex justify-center">
                  <QRCodeDisplay page={previewPage} size={220} showCardWrapper={false} />
                </div>

                {/* Direct 4K Download Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      const hiddenBtn = document.querySelector('button:has(.lucide-download)') as HTMLButtonElement;
                      if (hiddenBtn) hiddenBtn.click();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-violet-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download 4K Video PNG Frame</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="py-3 px-4 rounded-xl apple-glass-subtle hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied Link!' : 'Copy Dynamic Link'}</span>
                    </button>

                    <a
                      href={`/q/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl apple-glass-subtle hover:bg-slate-100 text-violet-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <span>Test Mobile View</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: How to Drop into Video Editor Guide */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-3xl apple-glass space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-violet-600" />
                  <h3 className="text-sm font-bold text-slate-900">How to Drop Into Your Video</h3>
                </div>

                {/* Editor Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                  {[
                    { id: 'premiere', label: 'Premiere Pro' },
                    { id: 'finalcut', label: 'Final Cut' },
                    { id: 'obs', label: 'OBS / Live' },
                    { id: 'canva', label: 'Canva / CapCut' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEditorGuideTab(tab.id as any)}
                      className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                        editorGuideTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Guide Text */}
                <div className="p-4 rounded-2xl apple-glass-subtle text-xs text-slate-700 space-y-2 leading-relaxed">
                  {editorGuideTab === 'premiere' && (
                    <>
                      <p>1. Drag the downloaded <strong>.PNG</strong> file directly into your Premiere Pro project timeline.</p>
                      <p>2. Place it on Video Track 2 or 3 over your main footage.</p>
                      <p>3. Position it in the corner of your video for <strong>5–10 seconds</strong> right as you mention your offer.</p>
                    </>
                  )}
                  {editorGuideTab === 'finalcut' && (
                    <>
                      <p>1. Import the <strong>.PNG</strong> overlay into your Final Cut Pro library.</p>
                      <p>2. Connect the clip above your primary storyline.</p>
                      <p>3. Use the Transform tool to scale and position in the corner of your video.</p>
                    </>
                  )}
                  {editorGuideTab === 'obs' && (
                    <>
                      <p>1. In OBS Studio, click <strong>+ (Add Source) ➔ Image</strong>.</p>
                      <p>2. Select your downloaded ClearpathQR PNG frame.</p>
                      <p>3. Resize and position in your live stream canvas.</p>
                    </>
                  )}
                  {editorGuideTab === 'canva' && (
                    <>
                      <p>1. Upload the PNG image to your Canva or CapCut project.</p>
                      <p>2. Overlay it in your video frame with a subtle fade-in animation.</p>
                    </>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    to="/dashboard"
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors"
                  >
                    Go to Creator Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setHeadline('');
                      setSubheadline('');
                    }}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 font-bold text-xs text-center transition-colors cursor-pointer"
                  >
                    Create Another Tapframe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade / 14-Day Free Trial Paywall Modal (2-Step Registration & Animated Pricing) */}
      <UpgradePaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        initialName={channelName}
        featureTitle="Download Your 4K Video QR Code"
        featureDescription="Start your 14-day free trial ($0 today) to download crisp 4K QR frames, dynamic redirect links, and lead capture tools."
        onSuccessDownload={async () => {
          await executeSaveAndProceedToDownload();
        }}
      />
    </div>
  );
};
