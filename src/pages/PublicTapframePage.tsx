import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  User, 
  Phone, 
  Tv, 
  Lock, 
  QrCode 
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import type { TapframePage, Channel } from '../types';
import confetti from 'canvas-confetti';

const normalizeUrl = (raw: string): string => {
  if (!raw || !raw.trim()) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return 'https://' + trimmed;
};

export const PublicTapframePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pages, channels, addLead, recordScan, recordClick } = useApp();

  const [remotePage, setRemotePage] = useState<TapframePage | null>(null);
  const [remoteChannel, setRemoteChannel] = useState<Channel | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const targetSlug = (slug || '').trim().toLowerCase();

  // 1. Check local context state first (case-insensitive)
  const localPage = pages.find(p => 
    p.slug.toLowerCase() === targetSlug || 
    p.id.toLowerCase() === targetSlug
  );
  const localChannel = channels.find(c => c.id === localPage?.channel_id);

  // 2. Fetch from Supabase public.pages (or fallback workflows)
  useEffect(() => {
    let isMounted = true;

    async function fetchPublicData() {
      if (localPage) {
        setRemotePage(localPage);
        setRemoteChannel(localChannel || channels[0] || null);
        setLoadingPage(false);
        recordScan(localPage.id);
        return;
      }

      try {
        // A. Primary query: Query public.pages table (Accessible by any anonymous mobile scanner)
        const { data: pageRow } = await supabase
          .from('pages')
          .select('*')
          .ilike('slug', targetSlug)
          .maybeSingle();

        if (pageRow && isMounted) {
          const loadedPage: TapframePage = {
            id: pageRow.id,
            channel_id: pageRow.channel_id || 'ch-1',
            user_id: pageRow.user_id || 'user',
            title: pageRow.title || 'Creator Offer',
            slug: pageRow.slug,
            campaign_name: pageRow.campaign_name || 'Campaign',
            destination_type: 'landing_page',
            status: 'active',
            badge_text: pageRow.badge_text || '',
            headline: pageRow.headline || pageRow.title,
            subheadline: pageRow.subheadline || '',
            product_links: pageRow.product_links || [],
            lead_capture_enabled: pageRow.lead_capture_enabled !== false,
            lead_capture_fields: pageRow.lead_capture_fields || { collect_email: true, collect_name: false, collect_phone: false },
            lead_magnet_title: pageRow.lead_magnet_title || 'Free Strategy Guide & Template',
            lead_capture_button_text: pageRow.lead_capture_button_text || 'Get Access',
            total_scans: (pageRow.total_scans || 0) + 1,
            unique_visitors: (pageRow.total_scans || 0) + 1,
            total_leads: pageRow.total_leads || 0,
            total_clicks: pageRow.total_clicks || 0,
            created_at: pageRow.created_at || new Date().toISOString(),
            updated_at: pageRow.updated_at || new Date().toISOString(),
          };

          setRemotePage(loadedPage);
          if (pageRow.channel_data) {
            setRemoteChannel(pageRow.channel_data);
          }
          setLoadingPage(false);
          recordScan(loadedPage.id);

          // Increment scan counter in Supabase
          try {
            await supabase
              .from('pages')
              .update({ total_scans: (pageRow.total_scans || 0) + 1 })
              .eq('id', pageRow.id);
          } catch (e) {}
          return;
        }

        // B. Fallback query: check localStorage directly if stored in another tab/session
        const savedPages = localStorage.getItem('clearpath_pages_v2');
        if (savedPages) {
          try {
            const parsed = JSON.parse(savedPages) as TapframePage[];
            const foundLocal = parsed.find(p => p.slug.toLowerCase() === targetSlug || p.id.toLowerCase() === targetSlug);
            if (foundLocal && isMounted) {
              setRemotePage(foundLocal);
              setLoadingPage(false);
              recordScan(foundLocal.id);
              return;
            }
          } catch (e) {}
        }

        // C. Fallback query: workflows table
        const { data: wfData, error: wfErr } = await supabase
          .from('workflows')
          .select('data')
          .limit(50);

        if (!wfErr && wfData && wfData.length > 0) {
          for (const row of wfData) {
            const workflowData = row.data as { pages?: TapframePage[]; channels?: Channel[] };
            const found = workflowData.pages?.find(p => 
              p.slug.toLowerCase() === targetSlug || 
              p.id.toLowerCase() === targetSlug
            );
            if (found && isMounted) {
              setRemotePage(found);
              const chan = workflowData.channels?.find(c => c.id === found.channel_id) || workflowData.channels?.[0];
              if (chan) setRemoteChannel(chan);
              setLoadingPage(false);
              recordScan(found.id);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Public page remote fetch notice:', err);
      } finally {
        if (isMounted) setLoadingPage(false);
      }
    }

    fetchPublicData();

    return () => {
      isMounted = false;
    };
  }, [targetSlug, localPage]);

  const page = localPage || remotePage;
  const channel = localChannel || remoteChannel || {
    id: 'ch-fallback',
    user_id: 'user',
    name: 'Creator Offer',
    handle: '@creator',
    platform: 'youtube',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    primary_color: '#8B5CF6',
    created_at: new Date().toISOString()
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#07080E] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium">Connecting to creator Tapframe...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-white flex flex-col items-center justify-center p-6 text-center">
        <Logo to="/" size="md" className="mb-4" />
        <h2 className="text-xl font-bold mb-2">Offer Not Found</h2>
        <p className="text-xs text-slate-400 mb-6 max-w-sm">
          This dynamic QR link (/q/{slug}) does not exist or may have been updated.
        </p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold">
          Visit ClearpathQR
        </Link>
      </div>
    );
  }

  const collectName = page.lead_capture_fields?.collect_name ?? false;
  const collectPhone = page.lead_capture_fields?.collect_phone ?? false;
  const productLinks = page.product_links || [];
  const primaryDestinationRaw = productLinks[0]?.url || page.lead_magnet_download_url || '';
  const primaryDestinationUrl = normalizeUrl(primaryDestinationRaw);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      await addLead({
        page_id: page.id,
        page_title: page.title,
        campaign_name: page.campaign_name || 'General Campaign',
        channel_id: channel.id,
        email: email.trim(),
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        source: 'Mobile QR Scan',
        referrer: 'TV / Video Stream',
        device: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : /Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        country: 'Global Viewer',
        city: 'Mobile User',
      });

      // Also record to Supabase leads table
      try {
        await supabase
          .from('leads')
          .insert({
            page_id: page.id,
            page_title: page.title,
            campaign_name: page.campaign_name || 'General Campaign',
            channel_id: channel.id,
            email: email.trim(),
            name: name.trim() || null,
            phone: phone.trim() || null,
            source: 'Mobile QR Scan',
            referrer: 'TV Screen',
            device: 'mobile',
            country: 'Global Viewer',
          });
      } catch (e) {}

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setSubmitted(true);

      // Redirect to product link if configured
      if (primaryDestinationUrl) {
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = primaryDestinationUrl;
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true);
      if (primaryDestinationUrl) {
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = primaryDestinationUrl;
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkClick = (url: string) => {
    recordClick(page.id);
    const target = normalizeUrl(url);
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGoToLanding = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 flex flex-col justify-between items-center px-4 py-8 selection:bg-purple-500/30">
      {/* Background radial glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Mobile-First Container */}
      <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
        {/* 1. Creator Channel Header */}
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            {channel.avatar_url && (
              <img
                src={channel.avatar_url}
                alt={channel.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500 shadow-md"
              />
            )}
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{channel.name || 'Creator Offer'}</span>
                <span className="w-3.5 h-3.5 rounded-full bg-violet-600 text-white inline-flex items-center justify-center text-[9px] font-bold">✓</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {channel.handle || '@creator'} {channel.subscriber_count ? `• ${channel.subscriber_count}` : ''}
              </div>
            </div>
          </div>

          <Logo to="/" size="sm" showText={false} />
        </div>

        {/* Mascot Greeting */}
        <div className="my-1">
          <Mascot 
            mood={submitted ? 'celebrate' : 'wave'} 
            size="xs" 
            badge="Scan Connected!"
            message={
              submitted 
                ? (redirecting ? "Access granted! Redirecting to your resource now... 🚀" : "Access granted! Click below to open your resource 🎉")
                : "Welcome! Enter your details below to get instant access."
            } 
          />
        </div>

        {/* Video context if associated */}
        {page.associated_content?.title && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <Tv className="w-3 h-3 text-red-500" />
            <span>As seen in: <strong>{page.associated_content.title}</strong></span>
            {page.associated_content?.timestamp && (
              <span className="text-violet-400 font-mono font-bold">({page.associated_content.timestamp})</span>
            )}
          </div>
        )}

        {/* 2. Badge / Callout Ribbon */}
        {page.badge_text && (
          <div className="inline-block px-3.5 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 mb-3 shadow-sm">
            {page.badge_text}
          </div>
        )}

        {/* 3. Main Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
          {page.headline || page.title}
        </h1>

        {/* Subheadline / Description */}
        {page.subheadline && (
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {page.subheadline}
          </p>
        )}

        {/* 4. Lead Capture Form (Name, Email, Phone + [Get Access] button) */}
        {page.lead_capture_enabled ? (
          <div className="w-full p-5 rounded-2xl bg-[#121422] border border-violet-500/30 shadow-2xl shadow-violet-950/40 mb-5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            {!submitted ? (
              <form onSubmit={handleLeadSubmit} className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>{page.lead_magnet_title || 'Free Strategy Guide & Template'}</span>
                </div>

                {/* Full Name Field if enabled */}
                {collectName && (
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Phone No. Field if enabled */}
                {collectPhone && (
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number / WhatsApp..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{page.lead_capture_button_text || 'Get Access'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Instant access granted immediately upon submission.</span>
                </div>
              </form>
            ) : (
              /* Once submitted: Displays Unlocked State & Redirects to Product Link */
              <div className="text-center py-4 space-y-4 relative z-10 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Access Unlocked! 🎉</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {redirecting 
                      ? "Redirecting you directly to your product/resource..."
                      : `Details delivered to ${email}. Click below to access:`}
                  </p>
                </div>

                {/* Primary Destination Action Button */}
                {primaryDestinationUrl && (
                  <a
                    href={primaryDestinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Open {productLinks[0]?.title || 'Resource Link'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* If multiple product links exist, show all unlocked links */}
                {productLinks.length > 1 && (
                  <div className="space-y-2 pt-2 border-t border-white/10 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">All Unlocked Resources:</span>
                    {productLinks.slice(1).map((link) => (
                      <button
                        key={link.id}
                        onClick={() => handleLinkClick(link.url)}
                        className="w-full py-2.5 px-3 rounded-lg bg-[#0B0D15] hover:bg-[#151828] border border-white/10 text-white text-xs font-semibold flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{link.title || 'Product Link'}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* When lead capture is disabled, product links are shown directly */
          productLinks.length > 0 && (
            <div className="w-full space-y-2.5 mb-6">
              {productLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.url)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#121422] hover:bg-[#181B2D] border border-white/10 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <span>{link.title || 'View Resource'}</span>
                  <ExternalLink className="w-4 h-4 text-violet-400" />
                </button>
              ))}
            </div>
          )
        )}

        {/* Viral Growth Loop Marketing Card for Viewers */}
        <div className="w-full mt-4 pt-4 border-t border-white/10 text-left">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleGoToLanding();
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/70 via-[#121424] to-indigo-950/70 border border-violet-500/30 hover:border-violet-400/60 transition-all hover:scale-[1.01] shadow-xl group flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0 text-violet-300 group-hover:scale-110 transition-transform">
                <QrCode className="w-4 h-4 text-violet-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                  Want dynamic QR codes for your YouTube channel?
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>Create your free video Tapframe</span>
                  <span className="text-violet-400 font-semibold">on ClearpathQR →</span>
                </div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-violet-600/40 group-hover:bg-violet-600 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 transition-all">
              <span>Create</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </a>
        </div>
      </div>

      {/* Powered by ClearpathQR Footer logo */}
      <footer className="mt-8 text-center relative z-10">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleGoToLanding();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#11131E] border border-white/5 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>Created with</span>
          <Logo to="/" size="sm" />
        </a>
      </footer>
    </div>
  );
};
