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
    <div className="min-h-screen bg-[#090A0F] text-slate-100 selection:bg-purple-500/30">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-violet-900/40 border-b border-violet-500/20 py-2 px-4 text-center text-xs sm:text-sm font-medium">
        <span className="inline-flex items-center gap-1.5 text-violet-300">
          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-bold uppercase tracking-wide border border-violet-500/30">
            New
          </span>
          Timestamp QR codes & 4K TV video overlays are now live →
          <Link to="/auth?signup=true" className="underline hover:text-white font-semibold ml-1">Try free</Link>
        </span>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#090A0F]/85 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo to="/" size="md" />

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-white transition-colors">For Creators & Brands</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Auth Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/auth?signup=true"
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/25 transition-all hover:scale-105"
            >
              Get my free QR code
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Copy & Animated Mascot Greeting */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-xs font-semibold text-violet-300">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>Next-Gen QR Engine for YouTube, Podcasters & TV</span>
              </div>
            </div>

            <h1 className="hero-headline text-white">
              Turn your viewers <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                into leads.
              </span>
            </h1>

            <p className="hero-subheadline text-slate-300 max-w-xl">
              Display a dynamic QR code on any screen — YouTube, Smart TVs, podcasts, live streams, or webinars. Viewers scan instantly without pausing what they’re watching. You capture the lead automatically.
            </p>

            {/* Mascot Interactive Bar */}
            <div className="p-4 rounded-2xl bg-[#121524] border border-violet-500/25 flex items-center gap-4 shadow-lg shadow-purple-950/30">
              <Mascot 
                mood="wave" 
                size="sm" 
                interactive={true}
                badge="Meet TapBot"
                message="Click me to get real YouTube conversion tips! 🚀"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Smart Video Tapframe Assistant</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">ONLINE</span>
                </div>
                <p className="text-slate-400 mt-0.5">
                  Automates lead capture from 4K Smart TVs and mobile screens in 1 tap.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/auth?signup=true"
                className="px-7 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5"
              >
                <span>Get my free QR code</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free to get started</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Setup in 60 seconds</span>
              </div>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090A0F]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090A0F]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090A0F]" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090A0F]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Creator" />
              </div>
              <div className="text-xs">
                <div className="flex text-amber-400 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-slate-300 font-semibold">Trusted by 700+ top creators worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic (YouTube On-Screen Video Preview Mockup) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#12141F] shadow-2xl shadow-purple-950/50 group">
              {/* Actual High-Res YouTube In-Video Graphic from uploads */}
              <img 
                src="/assets/youtube-creator-male.png" 
                alt="YouTube In-Video ClearpathQR Overlay Mockup" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Floating Pill on bottom left */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-4 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/15 flex items-center gap-3">
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
      <section className="border-y border-white/5 py-4 bg-[#0B0D14]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-slate-500 font-normal">Works on</span>
          <span className="flex items-center gap-2 text-slate-300"><Play className="w-3.5 h-3.5 text-red-500 fill-red-500" /> YouTube</span>
          <span className="flex items-center gap-2 text-slate-300"><Tv className="w-3.5 h-3.5 text-indigo-400" /> TV Screens (Living Room)</span>
          <span className="flex items-center gap-2 text-slate-300"><Radio className="w-3.5 h-3.5 text-pink-400" /> Live Streams</span>
          <span className="flex items-center gap-2 text-slate-300"><Smartphone className="w-3.5 h-3.5 text-violet-400" /> TikTok & Reels</span>
          <span className="flex items-center gap-2 text-slate-300"><Video className="w-3.5 h-3.5 text-emerald-400" /> Video Podcasts</span>
          <span className="flex items-center gap-2 text-slate-300"><Presentation className="w-3.5 h-3.5 text-amber-400" /> Presentations</span>
        </div>
      </section>

      {/* WHY QR CODES IN VIDEO MATTER */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#090A0F] via-[#0F111C] to-[#090A0F]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Why QR codes in video matter now more than ever
            </span>
            <h2 className="section-headline text-white">
              The living room is YouTube's fastest-growing screen.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 tracking-tight">2.7B+</span>
              <span className="text-xs text-slate-300 font-medium mt-1">people use YouTube every month</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Source: YouTube (2025)</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 tracking-tight">70%+</span>
              <span className="text-xs text-slate-300 font-medium mt-1">of YouTube watch time happens on TV screens</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Source: Google (2025)</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 tracking-tight">61%</span>
              <span className="text-xs text-slate-300 font-medium mt-1">of viewers switch videos before taking action</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Source: Think with Google</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#141724] border border-white/5 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 tracking-tight">10–20%</span>
              <span className="text-xs text-slate-300 font-medium mt-1">of viewers ever click links in description</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Source: Riverside.fm</span>
            </div>

            <div className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-[#141724] border border-white/5 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 tracking-tight">$1,000s</span>
              <span className="text-xs text-slate-300 font-medium mt-1">in lost revenue every single day from missed actions</span>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">High-Ticket / Digital Offers</span>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-violet-950/40 border border-violet-500/20 text-center text-sm text-violet-200">
            ⚡ <strong>Your audience is ready to act. Make it effortless for them.</strong> ClearpathQR bridges the gap between watching and doing — right in the moment.
          </div>
        </div>
      </section>

      {/* THREE SIMPLE STEPS (HOW CLEARPATH WORKS) WITH MASCOT */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16 relative">
          <div className="flex justify-center mb-2">
            <Mascot mood="curious" size="sm" badge="Easy 3-Step Setup" message="Let's build your first video QR funnel in 60s!" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
            How ClearpathQR Works
          </span>
          <h2 className="section-headline text-white">
            Three simple steps. <br />
            <span className="text-violet-400">Powerful results.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-2xl bg-[#11131E] border border-white/5 relative flex flex-col justify-between hover:border-violet-500/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-lg shadow-violet-600/30">
                1
              </div>
              <h3 className="card-headline text-white mb-2">Create your QR page</h3>
              <p className="body-custom text-slate-400">
                Pick your action, add your link or lead magnet, customize the page. Done in under 60 seconds with mobile-first templates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-violet-400">
              <span>Automated fast builder</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#11131E] border border-white/5 relative flex flex-col justify-between hover:border-violet-500/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-lg shadow-violet-600/30">
                2
              </div>
              <h3 className="card-headline text-white mb-2">Add it to your video</h3>
              <p className="body-custom text-slate-400">
                Drop the high-resolution QR code into a corner of your video, live stream, podcast slides, or TV screen in Premiere or Final Cut.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-violet-400">
              <span>PNG & SVG high-res exports</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#11131E] border border-white/5 relative flex flex-col justify-between hover:border-violet-500/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-lg shadow-violet-600/30">
                3
              </div>
              <h3 className="card-headline text-white mb-2">Watch the leads come in</h3>
              <p className="body-custom text-slate-400">
                Viewers scan instantly. You get real-time scans, clicks, and lead capture notifications directly in your CRM dashboard.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-violet-400">
              <span>Live cohort conversion tracking</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Big visual showcase of Cozy Living Room setup */}
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#121422] shadow-2xl relative">
          <img 
            src="/assets/hero-living-room.png" 
            alt="Viewer scanning YouTube on TV in Cozy Living Room" 
            className="w-full h-auto object-cover max-h-[600px]"
          />
          <div className="p-6 md:p-8 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/90 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-lg md:text-xl font-bold text-white">Seamless Multi-Screen Experience</div>
              <div className="text-sm text-slate-300">From YouTube on the 65" 4K TV directly to their iPhone or Android in 1 tap.</div>
            </div>
            <Link
              to="/auth?signup=true"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold whitespace-nowrap shadow-lg shadow-violet-600/25"
            >
              Start Free Setup Now
            </Link>
          </div>
        </div>
      </section>

      {/* POWERFUL FEATURES GRID */}
      <section id="features" className="py-20 px-4 sm:px-8 bg-[#0C0E17]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Powerful Features
            </span>
            <h2 className="section-headline text-white">
              Everything you need to turn <br />
              attention into <span className="text-violet-400">action.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#131624] border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="card-headline text-white mb-2">Smart Landing Pages</h4>
              <p className="body-custom text-slate-400 text-sm">
                Mobile-first pages designed to convert instantly. No coding or complicated builder needed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131624] border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="card-headline text-white mb-2">One Powerful Link</h4>
              <p className="body-custom text-slate-400 text-sm">
                Add your most important action — a download, product, course checkout, or newsletter signup.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131624] border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Tv className="w-5 h-5" />
              </div>
              <h4 className="card-headline text-white mb-2">Timestamp QR Codes</h4>
              <p className="body-custom text-slate-400 text-sm">
                Connect QR codes to specific moments or topics in your video for maximum context and conversion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131624] border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="card-headline text-white mb-2">Dynamic QR Codes</h4>
              <p className="body-custom text-slate-400 text-sm">
                Update your destination anytime. The QR code embedded in your already-published videos never changes!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131624] border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <BarChart className="w-5 h-5" />
              </div>
              <h4 className="card-headline text-white mb-2">Real-Time Analytics</h4>
              <p className="body-custom text-slate-400 text-sm">
                Track scans, clicks, visitors, device types, and lead conversions the moment they happen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131624] border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="card-headline text-white mb-2">Full Custom Branding</h4>
              <p className="body-custom text-slate-400 text-sm">
                Any color, your channel avatar, verified handle, and custom callout style. Make it feel uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S BUILT FOR */}
      <section id="use-cases" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
            One QR Code. Endless Possibilities.
          </span>
          <h2 className="section-headline text-white">
            Built for every <span className="text-violet-400">creator</span> and every <span className="text-pink-400">business</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🎬</div>
              <h4 className="font-bold text-white text-base">YouTubers</h4>
              <p className="text-xs text-slate-400 mt-1">Drive newsletter subs, sponsor deals, and digital product sales right from TV screens.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">YouTube overlays</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🎙️</div>
              <h4 className="font-bold text-white text-base">Podcasters</h4>
              <p className="text-xs text-slate-400 mt-1">Share episode show notes, recommended reading, and sponsor offers during video podcasts.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">Video podcast ready</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-bold text-white text-base">TikTok & IG Creators</h4>
              <p className="text-xs text-slate-400 mt-1">Convert short-form video viewers with high-converting mobile Tapframes and instant magnets.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">Short-form friendly</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">💼</div>
              <h4 className="font-bold text-white text-base">Coaches & Consultants</h4>
              <p className="text-xs text-slate-400 mt-1">Book discovery calls, share masterclasses, and capture qualified client leads.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">High-ticket sales</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🎓</div>
              <h4 className="font-bold text-white text-base">Course Creators</h4>
              <p className="text-xs text-slate-400 mt-1">Provide instant cheatsheets, Notion templates, and workshop enrollments.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">Resource delivery</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🎤</div>
              <h4 className="font-bold text-white text-base">Speakers & Presenters</h4>
              <p className="text-xs text-slate-400 mt-1">Engage room audiences in real-time from keynote stage slides and conference halls.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">Keynote slides</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-bold text-white text-base">Agencies & Media</h4>
              <p className="text-xs text-slate-400 mt-1">Manage multiple client channels, generate dynamic client reports, and track ROAS.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">Multi-channel support</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131E] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📺</div>
              <h4 className="font-bold text-white text-base">Digital Signage</h4>
              <p className="text-xs text-slate-400 mt-1">Display interactive dynamic offers in retail stores, gyms, and live events.</p>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 mt-4">Digital screens</span>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-8 bg-[#0C0E17]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Simple, transparent pricing
            </span>
            <h2 className="section-headline text-white">
              Start free. Upgrade as you scale.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#121422] border border-white/10 flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Free Creator</h3>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300">
                    Always Free
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-sm text-slate-400"> / forever</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Perfect for testing ClearpathQR on your next video upload or single campaign.
                </p>

                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>1 Active Tapframe</strong> QR link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dynamic destination switching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Lead capture form with CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>4K PNG and SVG downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic scan count statistics</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?signup=true"
                className="mt-8 w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm text-center transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1E1736] to-[#121424] border-2 border-violet-500/50 shadow-2xl shadow-violet-950/40 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Pro Creator & Agency</h3>
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-xs font-semibold text-violet-300 border border-violet-500/30">
                    Pro
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">$19</span>
                  <span className="text-sm text-slate-400"> / month</span>
                </div>
                <p className="text-sm text-slate-300 mb-6">
                  For serious YouTubers, video podcasters, agencies, and digital product builders.
                </p>

                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span><strong>Unlimited Tapframes & QR codes</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span><strong>Unlimited YouTube channel profiles</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Timestamped video moment associations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Deep cohort analytics & city-level breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Custom domain mapping (e.g. qr.yourdomain.com)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Remove Clearpath watermark</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?signup=true&pro=true"
                className="mt-8 w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm text-center shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
              >
                Upgrade to Pro (14-Day Free Trial)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM HERO CTA WITH CELEBRATING MASCOT */}
      <section className="py-24 px-4 sm:px-8 bg-[#07080D] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6 flex flex-col items-center">
          <Mascot mood="celebrate" size="md" badge="Let's Go!" message="Tap me for a celebration cheer! 🎉" />

          <h2 className="section-headline text-white">
            Don't let your next viewer be your last.
          </h2>
          <p className="body-custom text-slate-400 max-w-xl mx-auto">
            Make it easy for your audience to take action while they're still watching. Create your first dynamic QR code in under 60 seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/auth?signup=true"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base shadow-xl shadow-violet-600/30 transition-all hover:scale-105"
            >
              <span>Get my free QR code</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-center gap-4">
            <span>Free to get started</span>
            <span>•</span>
            <span>No credit card required</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-8 bg-[#05060A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo to="/" size="sm" />
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} ClearpathQR. Built for creators & high-growth brands.
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/auth" className="hover:text-white">Sign In</Link>
            <Link to="/auth?signup=true" className="hover:text-white">Create Account</Link>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
