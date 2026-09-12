import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Tv, 
  Lock
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import type { TapframePage, Channel } from '../types';
import confetti from 'canvas-confetti';

export const PublicTapframePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pages, channels, addLead, recordScan, recordClick } = useApp();

  const [remotePage, setRemotePage] = useState<TapframePage | null>(null);
  const [remoteChannel, setRemoteChannel] = useState<Channel | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Try to find page from app context
  const localPage = pages.find(p => p.slug === slug || p.id === slug);
  const localChannel = channels.find(c => c.id === localPage?.channel_id);

  // 2. If not found in memory (e.g. viewer is scanning on their personal phone), fetch directly from Supabase
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
        const { data, error } = await supabase
          .from('workflows')
          .select('data')
          .limit(50);

        if (!error && data && data.length > 0) {
          for (const row of data) {
            const workflowData = row.data as { pages?: TapframePage[]; channels?: Channel[] };
            const found = workflowData.pages?.find(p => p.slug === slug || p.id === slug);
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
  }, [slug, localPage]);

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

  // If destination is external URL, redirect immediately
  useEffect(() => {
    if (page && page.destination_type === 'external_url' && page.external_url) {
      const timer = setTimeout(() => {
        window.location.href = page.external_url || 'https://google.com';
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [page]);

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
          This dynamic QR link (/q/{slug}) does not exist or may have been archived by the creator.
        </p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold">
          Visit ClearpathQR
        </Link>
      </div>
    );
  }

  // If external redirect mode
  if (page.destination_type === 'external_url' && page.external_url) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Redirecting you to offer...</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Destination: <span className="text-violet-400 font-mono break-all">{page.external_url}</span>
        </p>
        <a
          href={page.external_url}
          className="mt-4 text-xs underline text-slate-400 hover:text-white"
        >
          Click here if not redirected automatically
        </a>
      </div>
    );
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      // 1. Record lead locally in app context
      await addLead({
        page_id: page.id,
        page_title: page.title,
        campaign_name: page.campaign_name || 'General Campaign',
        channel_id: channel.id,
        email: email.trim(),
        source: 'Mobile QR Scan',
        referrer: 'Living Room TV Scan',
        device: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : /Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        country: 'Global Viewer',
        city: 'Mobile User',
      });

      // 2. Also record directly to Supabase public leads table if enabled
      try {
        await supabase
          .from('leads')
          .insert({
            page_id: page.id,
            page_title: page.title,
            campaign_name: page.campaign_name || 'General Campaign',
            channel_id: channel.id,
            email: email.trim(),
            source: 'Mobile QR Scan',
            referrer: 'TV / Video Stream',
            device: 'mobile',
            country: 'Global Viewer',
          });
      } catch (e) {}

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleButtonClick = (url: string) => {
    recordClick(page.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-slate-100 flex flex-col justify-between items-center px-4 py-8 selection:bg-purple-500/30">
      {/* Background radial glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Mobile-First Container */}
      <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Creator Channel Header — Logo shows automatically */}
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
            message={submitted ? "Yay! Resource download unlocked below! 🎉" : "Welcome! Drop your email below for instant access."} 
          />
        </div>

        {/* Video context if associated */}
        {page.associated_content?.title && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <Tv className="w-3 h-3 text-red-500" />
            <span>As seen in: <strong>{page.associated_content.title}</strong></span>
            {page.associated_content.timestamp && (
              <span className="text-violet-400 font-mono font-bold">({page.associated_content.timestamp})</span>
            )}
          </div>
        )}

        {/* Badge Ribbon */}
        {page.badge_text && (
          <div className="inline-block px-3.5 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 mb-3 shadow-sm">
            {page.badge_text}
          </div>
        )}

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
          {page.headline || page.title}
        </h1>

        {/* Subheadline */}
        {page.subheadline && (
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {page.subheadline}
          </p>
        )}

        {/* Lead Capture Box */}
        {page.lead_capture_enabled && (
          <div className="w-full p-5 rounded-2xl bg-[#121422] border border-violet-500/30 shadow-2xl shadow-violet-950/40 mb-5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            {!submitted ? (
              <form onSubmit={handleLeadSubmit} className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>{page.lead_magnet_title || 'Free Download for Viewers'}</span>
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={page.lead_capture_placeholder || 'Enter your email address...'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{page.lead_capture_button_text || 'Get Instant Access'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Zero spam. Direct instant access link delivered immediately.</span>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3 relative z-10 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">You're All Set! 🎉</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Your request was received! Access details sent to <strong className="text-white">{email}</strong>.
                  </p>
                </div>
                {page.lead_magnet_download_url && (
                  <a
                    href={page.lead_magnet_download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Resource Now</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Outbound CTA Links */}
        {page.cta_buttons && page.cta_buttons.length > 0 && (
          <div className="w-full space-y-2.5 mb-6">
            {page.cta_buttons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleButtonClick(btn.url)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#121422] hover:bg-[#181B2D] border border-white/10 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>{btn.label}</span>
                <ExternalLink className="w-4 h-4 text-violet-400" />
              </button>
            ))}
          </div>
        )}

        {/* Social Links */}
        {page.social_links && page.social_links.length > 0 && (
          <div className="flex items-center justify-center gap-4 text-slate-400 text-xs pt-2">
            {page.social_links.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="capitalize hover:text-white transition-colors"
              >
                {s.platform}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Powered by ClearpathQR Footer badge */}
      <footer className="mt-12 text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#11131E] border border-white/5 text-[11px] text-slate-400 hover:text-white transition-colors"
        >
          <span>Created with</span>
          <Logo to="/" size="sm" />
        </Link>
      </footer>
    </div>
  );
};
