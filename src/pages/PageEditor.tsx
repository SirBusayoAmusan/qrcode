import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Tv, 
  Smartphone, 
  Layers, 
  Palette,
  Lock,
  AlertCircle
} from 'lucide-react';
import type { TapframePage } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { Mascot } from '../components/Mascot';

export const PageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { pages, activeChannel, createPage, updatePage, canCreatePage } = useApp();
  const navigate = useNavigate();

  const existingPage = isEditing ? pages.find(p => p.id === id) : null;

  // Blank inputs with clean placeholders when creating new!
  const [title, setTitle] = useState(existingPage?.title || '');
  const [slug, setSlug] = useState(existingPage?.slug || `offer-${Math.random().toString(36).substring(2, 6)}`);
  const [campaignName, setCampaignName] = useState(existingPage?.campaign_name || '');
  const [destinationType, setDestinationType] = useState<'landing_page' | 'external_url'>(
    existingPage?.destination_type || 'landing_page'
  );
  const [externalUrl, setExternalUrl] = useState(existingPage?.external_url || '');
  
  // Video Association
  const [contentType, setContentType] = useState<'youtube' | 'podcast' | 'livestream' | 'tiktok' | 'presentation'>(
    existingPage?.associated_content?.type || 'youtube'
  );
  const [contentTitle, setContentTitle] = useState(
    existingPage?.associated_content?.title || ''
  );
  const [timestamp, setTimestamp] = useState(existingPage?.associated_content?.timestamp || '');

  // Landing Page Content
  const [headline, setHeadline] = useState(
    existingPage?.headline || ''
  );
  const [subheadline, setSubheadline] = useState(
    existingPage?.subheadline || ''
  );
  const [badgeText, setBadgeText] = useState(existingPage?.badge_text || '');
  const [heroImageUrl] = useState(
    existingPage?.hero_image_url || ''
  );
  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(
    existingPage?.lead_capture_enabled !== undefined ? existingPage.lead_capture_enabled : true
  );
  const [leadCaptureButtonText, setLeadCaptureButtonText] = useState(
    existingPage?.lead_capture_button_text || ''
  );
  const [leadMagnetTitle, setLeadMagnetTitle] = useState(
    existingPage?.lead_magnet_title || ''
  );

  // CTA buttons
  const [ctaButtons, setCtaButtons] = useState(
    existingPage?.cta_buttons || []
  );

  // Styling
  const [frameStyle, setFrameStyle] = useState<'dark_pill' | 'gradient_border' | 'standard'>(
    (existingPage?.custom_theme?.qr_style?.frame_style as any) || 'dark_pill'
  );
  const [calloutText, setCalloutText] = useState(
    existingPage?.custom_theme?.qr_style?.callout_text || ''
  );
  const [accentColor] = useState(
    existingPage?.custom_theme?.accent_color || activeChannel?.primary_color || '#8B5CF6'
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'mobile' | 'qr'>('mobile');

  // Check if free limit blocks creation of a 2nd page
  const isBlockedByFreeLimit = !isEditing && !canCreatePage;

  // Live page object for real-time preview
  const previewPage: TapframePage = {
    id: existingPage?.id || 'temp-id',
    channel_id: activeChannel?.id || 'ch-1',
    user_id: 'user-1',
    title: title || 'My Video Resource Page',
    slug: slug || 'my-offer',
    campaign_name: campaignName || `${activeChannel?.name || 'Main'} Campaign`,
    destination_type: destinationType,
    external_url: externalUrl,
    status: 'active',
    headline: headline || 'Exclusive Video Resources & Free Download',
    subheadline: subheadline || 'Enter your email below to get immediate access to all tools and templates.',
    badge_text: badgeText || '✨ Viewer Exclusive',
    hero_image_url: heroImageUrl,
    lead_capture_enabled: leadCaptureEnabled,
    lead_capture_button_text: leadCaptureButtonText || 'Get Instant Access',
    lead_magnet_title: leadMagnetTitle || 'Free Download for Viewers',
    cta_buttons: ctaButtons,
    social_links: [],
    custom_theme: {
      background_color: '#0B0D17',
      accent_color: accentColor,
      text_color: '#FFFFFF',
      card_style: 'glass',
      qr_style: {
        fg_color: '#000000',
        bg_color: '#FFFFFF',
        frame_style: frameStyle,
        callout_text: calloutText || (title ? `Scan to get: ${title}` : 'Scan the QR code to get free access'),
      }
    },
    associated_content: {
      type: contentType,
      title: contentTitle || 'Latest Upload',
      timestamp: timestamp || '00:00',
    },
    total_scans: existingPage?.total_scans || 0,
    unique_visitors: existingPage?.unique_visitors || 0,
    total_clicks: existingPage?.total_clicks || 0,
    total_leads: existingPage?.total_leads || 0,
    created_at: existingPage?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleAddButton = () => {
    setCtaButtons([
      ...ctaButtons,
      { id: Date.now().toString(), label: 'New Action Link', url: 'https://', variant: 'secondary' }
    ]);
  };

  const handleRemoveButton = (idx: number) => {
    setCtaButtons(ctaButtons.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a Page Title.');
      return;
    }

    if (isBlockedByFreeLimit) {
      setErrorMessage('Free Tier limit reached (1 active Tapframe). Upgrade to Pro to create more.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      if (isEditing && id) {
        await updatePage(id, {
          title: title.trim(),
          slug: slug.trim(),
          campaign_name: campaignName.trim(),
          destination_type: destinationType,
          external_url: externalUrl.trim(),
          headline: headline.trim(),
          subheadline: subheadline.trim(),
          badge_text: badgeText.trim(),
          lead_capture_enabled: leadCaptureEnabled,
          lead_capture_button_text: leadCaptureButtonText.trim(),
          lead_magnet_title: leadMagnetTitle.trim(),
          cta_buttons: ctaButtons,
          custom_theme: previewPage.custom_theme,
          associated_content: previewPage.associated_content,
        });
      } else {
        await createPage({
          title: title.trim(),
          slug: slug.trim(),
          campaign_name: campaignName.trim() || `${activeChannel?.name || 'Main'} Campaign`,
          destination_type: destinationType,
          external_url: externalUrl.trim(),
          headline: headline.trim() || title.trim(),
          subheadline: subheadline.trim(),
          badge_text: badgeText.trim(),
          lead_capture_enabled: leadCaptureEnabled,
          lead_capture_button_text: leadCaptureButtonText.trim(),
          lead_magnet_title: leadMagnetTitle.trim(),
          cta_buttons: ctaButtons,
          custom_theme: previewPage.custom_theme,
          associated_content: previewPage.associated_content,
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error saving page:', err);
      if (err.message === 'FREE_TIER_LIMIT_REACHED') {
        setErrorMessage('Free Tier limit reached. Please upgrade to Pro for unlimited Tapframes.');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">
              {isEditing ? 'Edit QR Tapframe' : 'Create New QR Tapframe'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {title || 'Untitled QR Page'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isBlockedByFreeLimit}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish QR'}</span>
          </button>
        </div>
      </div>

      {isBlockedByFreeLimit && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span><strong>Free Tier Limit (1 Tapframe):</strong> You already have 1 active QR link. Upgrade to Pro to create unlimited pages.</span>
          </div>
          <Link to="/dashboard/plan" className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs whitespace-nowrap">
            Upgrade to Pro
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main 2-Column Editor + Real-time Mobile/QR Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Editor */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: Campaign & Basic Setup */}
            <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                <Layers className="w-4 h-4" />
                <span>1. Core Page & Campaign Association</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Page Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 6-Figure Online Business Starter Kit 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Campaign Name (For grouping in Leads)</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. YouTube: Online Business Series"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom URL Slug</label>
                  <div className="flex items-center rounded-xl bg-[#0B0D15] border border-white/10 px-3">
                    <span className="text-xs text-slate-500 font-mono">/q/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="my-offer"
                      className="w-full py-2.5 pl-1 bg-transparent text-white text-sm font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Video Association info */}
              <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="podcast">Podcast Episode</option>
                    <option value="livestream">Live Stream</option>
                    <option value="tiktok">TikTok / Shorts</option>
                    <option value="presentation">Keynote / Slides</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Video Title & Timestamp</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                      placeholder="e.g. Episode 12: How to Grow using Meta Ads"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      placeholder="04:35"
                      className="w-20 px-3 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Destination Switcher */}
            <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                  <Sparkles className="w-4 h-4" />
                  <span>2. Dynamic Destination Mode</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Dynamic routing
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationType('landing_page')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    destinationType === 'landing_page'
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/15'
                      : 'bg-[#0B0D15] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-2 text-violet-400" />
                  <div className="font-bold text-xs text-white">Mobile Landing Page Builder</div>
                  <div className="text-[11px] text-slate-400 mt-1">Collect emails, show buttons, and give free downloads directly.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationType('external_url')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    destinationType === 'external_url'
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/15'
                      : 'bg-[#0B0D15] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <ExternalLink className="w-5 h-5 mb-2 text-indigo-400" />
                  <div className="font-bold text-xs text-white">Direct External URL</div>
                  <div className="text-[11px] text-slate-400 mt-1">Instantly redirect to checkout, booking link, or sponsor site.</div>
                </button>
              </div>

              {destinationType === 'external_url' && (
                <div className="mt-3 p-4 rounded-xl bg-violet-950/30 border border-violet-500/20">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Direct Destination URL *</label>
                  <input
                    type="url"
                    required
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://yourwebsite.com/offer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    When viewers scan the QR code, they will be immediately redirected to this URL without seeing the landing page.
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Mobile Landing Page Customizer */}
            {destinationType === 'landing_page' && (
              <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                  <Palette className="w-4 h-4" />
                  <span>3. Mobile Page Content & Conversion Elements</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge / Callout Ribbon</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. 🔥 Free Download for Viewers"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Main Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Get My Free 6-Figure Business Blueprint & AI Toolkit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm font-semibold placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subheadline / Description</label>
                  <textarea
                    rows={2}
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder="e.g. Step-by-step systems, Notion templates, and software stack as seen in the video."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                {/* Email Lead Capture Box Toggle */}
                <div className="p-4 rounded-xl bg-[#0B0D15] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Enable Email Lead Capture</div>
                      <div className="text-[11px] text-slate-400">Collect visitor email addresses before granting access.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={leadCaptureEnabled}
                      onChange={(e) => setLeadCaptureEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-violet-600 focus:ring-0 cursor-pointer"
                    />
                  </div>

                  {leadCaptureEnabled && (
                    <div className="space-y-3 pt-2 border-t border-white/5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Lead Magnet / Asset Title</label>
                        <input
                          type="text"
                          value={leadMagnetTitle}
                          onChange={(e) => setLeadMagnetTitle(e.target.value)}
                          placeholder="e.g. 6-Figure Blueprint PDF + Notion Template Pack"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#11131E] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Submit Button CTA Text</label>
                        <input
                          type="text"
                          value={leadCaptureButtonText}
                          onChange={(e) => setLeadCaptureButtonText(e.target.value)}
                          placeholder="e.g. Get Instant Access (Free)"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#11131E] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Custom Action & Product Buttons</label>
                    <button
                      type="button"
                      onClick={handleAddButton}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Button</span>
                    </button>
                  </div>

                  {ctaButtons.map((btn, idx) => (
                    <div key={btn.id || idx} className="p-3 rounded-xl bg-[#0B0D15] border border-white/5 flex items-center gap-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={btn.label}
                          onChange={(e) => {
                            const updated = [...ctaButtons];
                            updated[idx].label = e.target.value;
                            setCtaButtons(updated);
                          }}
                          placeholder="Button Label (e.g. Book Consultation)"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#11131E] border border-white/10 text-white text-xs focus:outline-none"
                        />
                        <input
                          type="url"
                          value={btn.url}
                          onChange={(e) => {
                            const updated = [...ctaButtons];
                            updated[idx].url = e.target.value;
                            setCtaButtons(updated);
                          }}
                          placeholder="https://yourlink.com"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#11131E] border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveButton(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: On-Screen QR Code Video Design */}
            <div className="p-6 rounded-2xl bg-[#11131E] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                <Tv className="w-4 h-4" />
                <span>4. On-Screen Video QR Code Framing</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Visual Style for Video Overlay</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark_pill', label: 'Dark Callout Pill' },
                    { id: 'gradient_border', label: 'Gradient Border Frame' },
                    { id: 'standard', label: 'Standard Minimal' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setFrameStyle(st.id as any)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        frameStyle === st.id
                          ? 'bg-violet-600/20 border-violet-500 text-white'
                          : 'bg-[#0B0D15] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">On-Screen Callout Prompt Text</label>
                <textarea
                  rows={2}
                  value={calloutText}
                  onChange={(e) => setCalloutText(e.target.value)}
                  placeholder="e.g. Scan the QR code to get my free bundle on how to grow your business using AI"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Sticky Preview with Mascot Co-Pilot */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="flex bg-[#11131E] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setPreviewTab('mobile')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                previewTab === 'mobile' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Viewer Mobile View</span>
            </button>
            <button
              onClick={() => setPreviewTab('qr')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                previewTab === 'qr' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Video On-Screen Frame</span>
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-[#11131E] border border-white/10 flex flex-col items-center justify-center relative">
            <div className="mb-2">
              <Mascot 
                mood="curious" 
                size="xs" 
                badge="Co-Pilot Review" 
                message="Looking clean! This mobile page will load instantly for viewers scanning your video screen." 
              />
            </div>

            {previewTab === 'mobile' ? (
              <div className="w-full max-w-[320px] rounded-[36px] bg-[#090A0F] border-4 border-slate-700 shadow-2xl overflow-hidden p-4 text-center relative">
                <div className="flex items-center justify-center gap-2 mb-4 pb-2 border-b border-white/5">
                  {activeChannel?.avatar_url && (
                    <img
                      src={activeChannel.avatar_url}
                      alt="Channel"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-violet-500"
                    />
                  )}
                  <span className="text-xs font-bold text-white">{activeChannel?.name || 'Creator'}</span>
                </div>

                {badgeText && (
                  <div className="inline-block px-3 py-0.5 rounded-full bg-violet-600/30 border border-violet-500/40 text-[10px] font-bold text-violet-300 mb-2">
                    {badgeText}
                  </div>
                )}

                <h3 className="text-sm font-bold text-white leading-tight mb-2">
                  {headline || title || 'Your Headline Here'}
                </h3>

                <p className="text-[11px] text-slate-400 mb-4 line-clamp-3">
                  {subheadline || 'Subheadline and benefits for your viewers.'}
                </p>

                {leadCaptureEnabled && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4 space-y-2">
                    <input
                      type="email"
                      disabled
                      placeholder="Enter your email address..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 text-[11px] text-slate-300 border border-white/5"
                    />
                    <button
                      type="button"
                      disabled
                      className="w-full py-1.5 rounded-lg bg-violet-600 text-white font-bold text-xs"
                    >
                      {leadCaptureButtonText || 'Get Instant Access'}
                    </button>
                  </div>
                )}

                {ctaButtons.length > 0 && (
                  <div className="space-y-1.5">
                    {ctaButtons.map((btn, i) => (
                      <div
                        key={i}
                        className="py-2 px-3 rounded-xl bg-white/10 border border-white/5 text-xs font-semibold text-slate-200"
                      >
                        {btn.label || 'Action Link'}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-3 border-t border-white/5 text-[9px] text-slate-500">
                  Powered by ClearpathQR
                </div>
              </div>
            ) : (
              <div className="w-full">
                <QRCodeDisplay page={previewPage} size={180} showCardWrapper={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
