import React, { useState } from 'react';
import { 
  QrCode, 
  Users, 
  BarChart3, 
  PlusCircle, 
  LogOut, 
  ChevronRight, 
  Tv, 
  Menu, 
  X, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Logo } from './Logo';
import { signOut } from '../lib/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { activeChannel, channels, setActiveChannel, user, profile } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error(e);
    }
    navigate('/');
  };

  const navItems = [
    { name: 'Video Pages & QR', path: '/dashboard', icon: QrCode, exact: true },
    { name: 'Leads & CRM', path: '/dashboard/leads', icon: Users },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Channel Branding', path: '/dashboard/channel', icon: Tv },
    { name: 'Plan & Billing', path: '/dashboard/plan', icon: Sparkles, badge: profile?.plan === 'pro' ? 'Pro' : 'Free' },
  ];

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-500/30">
      {/* Top Mobile Bar (Apple-style frosted glass with sleek, flowing layout) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#08090E]/90 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-40">
        <Logo to="/" size="sm" />
        
        <div className="flex items-center gap-2.5">
          {activeChannel && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] rounded-full border border-white/[0.08] transition-all cursor-pointer active:scale-95"
            >
              <img 
                src={activeChannel.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={activeChannel.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-violet-500/50 shrink-0" 
              />
              <span className="text-[11px] font-semibold text-slate-200 max-w-[120px] truncate">
                {activeChannel.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] transition-all cursor-pointer active:scale-95 flex items-center justify-center"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Apple Minimalist Desktop & Mobile Drawer) */}
      <aside 
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[#0C0E17] border-r border-white/[0.08] flex flex-col transition-transform duration-300 md:translate-x-0 h-screen ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo at Top */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Logo to="/" size="md" />
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Channel Card with Logo & Switcher */}
        <div className="p-4 border-b border-white/[0.08]">
          <div className="relative">
            <div 
              onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <div className="relative shrink-0">
                  <img 
                    src={activeChannel?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={activeChannel?.name || 'Channel'} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/40 shadow"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center border-2 border-[#0C0E17]">
                    <Tv className="w-1.5 h-1.5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col text-left truncate min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                    {activeChannel?.name || 'My Channel'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {activeChannel?.handle || '@creator'} {activeChannel?.subscriber_count ? `• ${activeChannel.subscriber_count}` : ''}
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${channelDropdownOpen ? 'rotate-90' : ''}`} />
            </div>

            {/* Dropdown for Channels */}
            {channelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121524] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1.5">
                  Connected Channels
                </div>
                {channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setActiveChannel(chan);
                      setChannelDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      activeChannel?.id === chan.id ? 'bg-violet-600/20 text-violet-300 font-semibold' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <img src={chan.avatar_url} alt={chan.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <span className="text-xs truncate flex-1">{chan.name}</span>
                    {activeChannel?.id === chan.id && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />}
                  </button>
                ))}
                <div className="pt-2 mt-1 border-t border-white/[0.08]">
                  <Link
                    to="/channel-setup"
                    onClick={() => {
                      setChannelDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl transition-colors font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Connect Another Channel</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action: New QR Page Button */}
        <div className="p-4">
          <Link
            to="/dashboard/new"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-violet-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New QR Page</span>
          </Link>
        </div>

        {/* Main Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isNavActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-violet-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    item.badge === 'Pro' ? 'bg-violet-500/30 text-violet-300 border border-violet-500/40' : 'bg-white/10 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Sign out */}
        <div className="p-4 border-t border-white/[0.08] space-y-3">
          <div className="p-3 rounded-2xl bg-[#121524] border border-white/[0.08]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">Plan Status</span>
              <span className="text-violet-400 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30">
                {profile?.plan === 'pro' ? 'Pro Plan (Unlimited)' : 'Free Tier (1 Tapframe)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {profile?.plan === 'pro' 
                ? 'Unlimited dynamic QR pages and advanced lead capture active.'
                : '1 dynamic QR link included. Upgrade to Pro for unlimited.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2 truncate min-w-0 flex-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-400 truncate text-[11px]">
                {user?.email || 'Logged in'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden relative">
        {/* Top Channel Bar for Desktop (Channel logo on EVERY page) */}
        <div className="hidden md:flex items-center justify-between px-8 py-3.5 bg-[#08090E]/80 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img 
              src={activeChannel?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={activeChannel?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40 shadow"
            />
            <div>
              <span className="text-xs font-bold text-white">
                {activeChannel?.name || 'Creator Hub'}
              </span>
              <span className="text-[11px] text-slate-400 ml-2 font-mono">
                {activeChannel?.subscriber_count ? `(${activeChannel.subscriber_count})` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition-all hover:scale-105"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New QR Page</span>
            </Link>
          </div>
        </div>

        {/* Page Inner Container */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
