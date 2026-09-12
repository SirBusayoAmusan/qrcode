import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  Star,
  BarChart,
  Radio,
  Share2,
  Video,
  Presentation,
  Award,
  Zap,
  Tv,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 selection:bg-purple-500/30 overflow-x-hidden">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-violet-950/60 via-purple-900/40 to-violet-950/60 border-b border-violet-500/20 py-2 px-3 text-center text-[11px] sm:text-xs font-medium">
        <span className="inline-flex items-center gap-1.5 text-violet-300">
          <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wide border border-violet-500/30 shrink-0">
            New
          </span>
          <span className="truncate">Timestamp QR codes & 4K video overlays live</span>
          <Link to="/auth?signup=true" className="underline hover:text-white font-semibold ml-0.5 shrink-0">Try free →</Link>
        </span>
      </div>

      {/* Header / Navbar - GUARANTEED SINGLE-LINE ON MOBILE & DESKTOP */}
      <header className="sticky top-0 z-50 bg-[#07080D]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <Logo to="/" size="sm" />

          {/* Nav links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-white transition-colors">For Creators</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Auth Actions - SINGLE ROW ON MOBILE */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/auth"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/5 whitespace-nowrap transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/auth?signup=true"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-violet-600/25 whitespace-nowrap transition-all hover:scale-105 shrink-0"
            >
              Get Free QR
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION (Apple-style spacing & typography) */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-[11px] sm:text-xs font-semibold text-violet-300">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>Next-Gen QR Engine for YouTube & TV</span>
              </div>
            </div>

            <h1 className="hero-headline text-white">
              Turn your viewers <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                into leads.
              </span>
            </h1>

            <p className="hero-subheadline text-slate-300 max-w-xl">
              Display a dynamic QR code on any screen — YouTube, Smart TVs, podcasts, or live streams. Viewers scan instantly without leaving what they’re watching.
            </p>

            {/* Mascot Interactive Bar */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-[#10121E] border border-white/[0.08] flex items-center gap-3.5 shadow-xl shadow-black/40">
              <Mascot 
                mood="wave" 
                size="xs" 
                interactive={true}
                badge="Meet TapBot"
                message="Click me to get real YouTube conversion tips! 🚀"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Smart Video Tapframe Assistant</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">ONLINE</span>
                </div>
                <p className="text-slate-400 mt-0.5 text-[11px] sm:text-xs">
                  Automates lead capture from 4K Smart TVs and mobile screens in 1 tap.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/auth?signup=true"
                className="px-7 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Get my free QR code</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>60-second setup</span>
              </div>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#07080D]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Creator" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#07080D]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Creator" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#07080D]" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt="Creator" />
              </div>
              <div className="text-xs">
                <div className="flex text-amber-400 gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-slate-300 font-medium text-[11px]">Trusted by 700+ top creators</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#10121E] shadow-2xl shadow-purple-950/40 group">
              <img 
                src="/assets/youtube-creator-male.png" 
                alt="YouTube In-Video ClearpathQR Overlay Mockup" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:left-4 p-3 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Live On-Screen Dynamic Tapframe</div>
                  <div className="text-[11px] text-slate-300">Point phone camera → Instant lead form capture</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS ON PLATFORMS BAR */}
      <section className="border-y border-white/[0.08] py-4 bg-[#090A10]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-slate-500 font-normal">Works on</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Play className="w-3.5 h-3.5 text-red-500 fill-red-500" /> YouTube</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Tv className="w-3.5 h-3.5 text-indigo-400" /> Smart TVs</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Radio className="w-3.5 h-3.5 text-pink-400" /> Live Streams</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Smartphone className="w-3.5 h-3.5 text-violet-400" /> TikTok/IG</span>
          <span className="flex items-center gap-1.5 text-slate-300"><Video className="w-3.5 h-3.5 text-emerald-400" /> Podcasts</span>
        </div>
      </section>

      {/* WHY QR CODES IN VIDEO MATTER */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-[#07080D] via-[#0D0F1A] to-[#07080D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Why QR codes in video matter
            </span>
            <h2 className="section-headline text-white">
              The living room is YouTube's fastest-growing screen.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col items-center text-center">
              <span className="text-3xl font-black text-violet-400 tracking-tight">2.7B+</span>
              <span className="text-xs text-slate-300 font-medium mt-1">Monthly YouTube viewers</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">YouTube (2025)</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col items-center text-center">
              <span className="text-3xl font-black text-violet-400 tracking-tight">70%+</span>
              <span className="text-xs text-slate-300 font-medium mt-1">Watch time on TV screens</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Google (2025)</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col items-center text-center">
              <span className="text-3xl font-black text-violet-400 tracking-tight">10–20%</span>
              <span className="text-xs text-slate-300 font-medium mt-1">Ever open description links</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Riverside.fm</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col items-center text-center">
              <span className="text-3xl font-black text-violet-400 tracking-tight">3.2x</span>
              <span className="text-xs text-slate-300 font-medium mt-1">Higher on-screen opt-in rate</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">ClearpathQR Benchmark</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
            Three Simple Steps
          </span>
          <h2 className="section-headline text-white">
            From video view to lead in 60 seconds.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-lg shadow-violet-600/30">
                1
              </div>
              <h3 className="card-headline text-white mb-1.5">Create your QR Tapframe</h3>
              <p className="body-custom text-slate-400 text-xs sm:text-sm">
                Add your headline, free guide or product link, and choose fields to collect.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-lg shadow-violet-600/30">
                2
              </div>
              <h3 className="card-headline text-white mb-1.5">Drop into your video</h3>
              <p className="body-custom text-slate-400 text-xs sm:text-sm">
                Export 4K PNG/SVG and overlay into Premiere, Final Cut, or OBS.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-lg shadow-violet-600/30">
                3
              </div>
              <h3 className="card-headline text-white mb-1.5">Capture leads automatically</h3>
              <p className="body-custom text-slate-400 text-xs sm:text-sm">
                Viewers scan from their couch. Leads and phone numbers sync to your CRM in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-8 bg-[#090A10]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Pricing
            </span>
            <h2 className="section-headline text-white">
              Start free. Scale when ready.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#10121E] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">Free Creator</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-slate-300">
                    $0 / forever
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Perfect for your next video upload or lead magnet test.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>1 Active Tapframe</strong> QR link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Lead capture CRM with CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>4K PNG & SVG downloads</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?signup=true"
                className="mt-6 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm text-center transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18132B] to-[#10121E] border-2 border-violet-500/40 flex flex-col justify-between relative shadow-2xl shadow-violet-950/40">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">Pro Creator</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-[11px] font-semibold text-violet-300 border border-violet-500/30">
                    $19 / month
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-6">
                  For active YouTubers, podcasters, and digital product creators.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span><strong>Unlimited Tapframes & QR codes</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span><strong>Unlimited Product & Resource links</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>Real-time audience CRM & analytics</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?signup=true&pro=true"
                className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg shadow-violet-600/30 transition-all"
              >
                Start Pro (14-Day Free Trial)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-8 bg-[#050609]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo to="/" size="sm" />
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} ClearpathQR. Built for creators.
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link to="/auth" className="hover:text-white">Sign In</Link>
            <Link to="/auth?signup=true" className="hover:text-white">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
