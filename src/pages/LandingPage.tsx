import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Star, 
  Radio, 
  Video, 
  Tv, 
  Smartphone,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-purple-500/20 overflow-x-hidden">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-b border-violet-100 py-2.5 px-3 text-center text-[11px] sm:text-xs font-medium">
        <span className="inline-flex items-center gap-1.5 text-violet-900">
          <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wide shrink-0">
            New
          </span>
          <span className="truncate">Timestamp QR codes & 4K video overlays live</span>
          <Link to="/auth?signup=true" className="text-violet-700 hover:text-violet-900 underline font-semibold ml-0.5 shrink-0">Try free →</Link>
        </span>
      </div>

      {/* Header / Navbar - GUARANTEED SINGLE-LINE ON MOBILE & DESKTOP */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <Logo to="/" size="sm" theme="light" />

          {/* Nav links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#why-qr" className="hover:text-slate-900 transition-colors">Why QR Video</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          {/* Auth Actions - SINGLE ROW ON MOBILE */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/auth"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 whitespace-nowrap transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/auth?signup=true"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-600/20 whitespace-nowrap transition-all hover:scale-105 shrink-0"
            >
              Get Free QR
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION (Apple-Style Clean Light Hero) */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-[11px] sm:text-xs font-bold text-violet-700">
                <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping" />
                <span>Next-Gen QR Engine for YouTube & TV</span>
              </div>
            </div>

            <h1 className="hero-headline text-slate-950">
              Turn your viewers <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                into leads.
              </span>
            </h1>

            <p className="hero-subheadline text-slate-600 max-w-xl">
              Display a dynamic QR code on any screen — YouTube, Smart TVs, podcasts, or live streams. Viewers scan instantly without leaving what they’re watching.
            </p>

            {/* Mascot Interactive Bar */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center gap-3.5 shadow-md shadow-slate-200/50">
              <Mascot 
                mood="wave" 
                size="xs" 
                interactive={true}
                badge="Meet TapBot"
                message="Click me to get real YouTube conversion tips! 🚀"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Smart Video Tapframe Assistant</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">ONLINE</span>
                </div>
                <p className="text-slate-500 mt-0.5 text-[11px] sm:text-xs">
                  Automates lead capture from 4K Smart TVs and mobile screens in 1 tap.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/auth?signup=true"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Get my free QR code</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>60-second setup</span>
              </div>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt="Creator" />
              </div>
              <div className="text-xs">
                <div className="flex text-amber-500 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-slate-600 font-semibold text-[11px]">Trusted by 700+ video creators</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 group">
              <img 
                src="/assets/youtube-creator-male.png" 
                alt="YouTube In-Video ClearpathQR Overlay Mockup" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:left-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">Live On-Screen Dynamic Tapframe</div>
                  <div className="text-[11px] text-slate-600">Point phone camera → Instant lead form capture</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS ON PLATFORMS BAR */}
      <section className="border-y border-slate-200/80 py-5 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="text-slate-400 font-normal">Works on</span>
          <span className="flex items-center gap-1.5 text-slate-700"><Play className="w-4 h-4 text-red-600 fill-red-600" /> YouTube</span>
          <span className="flex items-center gap-1.5 text-slate-700"><Tv className="w-4 h-4 text-indigo-600" /> Smart TVs</span>
          <span className="flex items-center gap-1.5 text-slate-700"><Radio className="w-4 h-4 text-pink-600" /> Live Streams</span>
          <span className="flex items-center gap-1.5 text-slate-700"><Smartphone className="w-4 h-4 text-violet-600" /> TikTok/IG</span>
          <span className="flex items-center gap-1.5 text-slate-700"><Video className="w-4 h-4 text-emerald-600" /> Podcasts</span>
        </div>
      </section>

      {/* WHY QR CODES IN VIDEO MATTER */}
      <section id="why-qr" className="py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Why QR codes in video matter
            </span>
            <h2 className="section-headline text-slate-950">
              The living room is YouTube's fastest-growing screen.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 tracking-tight">2.7B+</span>
              <span className="text-xs text-slate-700 font-semibold mt-1">Monthly YouTube viewers</span>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">YouTube Official</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 tracking-tight">70%+</span>
              <span className="text-xs text-slate-700 font-semibold mt-1">Watch time on TV screens</span>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Google Data</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 tracking-tight">10–20%</span>
              <span className="text-xs text-slate-700 font-semibold mt-1">Ever open description links</span>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">Riverside.fm</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 tracking-tight">3.2x</span>
              <span className="text-xs text-slate-700 font-semibold mt-1">Higher on-screen opt-in rate</span>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">ClearpathQR Benchmark</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
            Three Simple Steps
          </span>
          <h2 className="section-headline text-slate-950">
            From video view to verified lead in 60 seconds.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-md shadow-violet-600/25">
                1
              </div>
              <h3 className="card-headline text-slate-900 mb-1.5">Create your QR Tapframe</h3>
              <p className="body-custom text-slate-600 text-xs sm:text-sm">
                Add your headline, free guide or product link, and choose which details to collect from viewers.
              </p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-md shadow-violet-600/25">
                2
              </div>
              <h3 className="card-headline text-slate-900 mb-1.5">Drop into your video</h3>
              <p className="body-custom text-slate-600 text-xs sm:text-sm">
                Export 4K PNG/SVG and overlay directly into Premiere, Final Cut, DaVinci, Canva, or OBS.
              </p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-md shadow-violet-600/25">
                3
              </div>
              <h3 className="card-headline text-slate-900 mb-1.5">Capture leads automatically</h3>
              <p className="body-custom text-slate-600 text-xs sm:text-sm">
                Viewers scan from their couch. Verified leads, cities, and countries sync to your CRM in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Pricing
            </span>
            <h2 className="section-headline text-slate-950">
              Start free. Scale when ready.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Free Creator</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                    $0 / forever
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Perfect for your next video upload or lead magnet test.
                </p>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>1 Active Tapframe</strong> QR link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Lead capture CRM with CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4K PNG & SVG downloads</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?signup=true"
                className="mt-6 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm text-center transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-violet-50/70 via-white to-white border-2 border-violet-500 flex flex-col justify-between relative shadow-lg shadow-violet-200/50">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Most Popular
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Pro Creator</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 border border-violet-200">
                    $19 / month
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-6">
                  For active YouTubers, podcasters, and digital product creators.
                </p>

                <ul className="space-y-3 text-xs text-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span><strong>Unlimited Tapframes & QR codes</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span><strong>Unlimited Product & Resource links</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Real-time audience CRM & analytics</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?signup=true&pro=true"
                className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm text-center shadow-md shadow-violet-600/25 transition-all"
              >
                Start Pro (14-Day Free Trial)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 py-8 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo to="/" size="sm" theme="light" />
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} ClearpathQR. Built for video creators.
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link to="/auth" className="hover:text-slate-900">Sign In</Link>
            <Link to="/auth?signup=true" className="hover:text-slate-900">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
