import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signIn, signUp } from '../lib/auth';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Lock, Mail, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../lib/context';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSignUpParam = searchParams.get('signup') === 'true';
  const isPro = searchParams.get('pro') === 'true';

  const [isSignUp, setIsSignUp] = useState(isSignUpParam);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { refreshData } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const data = await signUp(email.trim(), password, fullName.trim());
        if (data.user && !data.session) {
          setNotice('Account created! Please check your email to confirm your account.');
          setIsSignUp(false);
        } else {
          // New user -> channel branding setup
          navigate('/channel-setup');
        }
      } else {
        const data = await signIn(email.trim(), password);
        // Refresh and pull remote user data immediately so channel & pages are already loaded!
        if (data.user) {
          try {
            await refreshData();
          } catch (e) {}
        }
        // Direct returning creators straight to their dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials or create a new account.');
      } else if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setIsSignUp(false);
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email address before signing in, or disable email confirmation in your Supabase Auth settings.');
      } else if (msg.includes('Password should be at least')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(msg || 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center relative z-10 flex flex-col items-center w-full max-w-sm">
        <Logo to="/" size="lg" className="justify-center mb-3" />
        
        {/* Mascot */}
        <div className="my-1">
          <Mascot 
            mood={isSignUp ? 'celebrate' : 'wave'} 
            size="xs"
            badge={isSignUp ? 'Welcome New Creator!' : 'Welcome Back!'}
            message={isSignUp ? 'Excited to help you capture leads from your videos!' : 'Welcome back! Ready to manage your video Tapframes?'}
          />
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {isSignUp ? 'Create your creator account with email' : 'Sign in to your ClearpathQR dashboard'}
        </p>
      </div>

      {/* Main Card (Apple Minimalist styling) */}
      <div className="w-full max-w-sm sm:max-w-md bg-[#10121E] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative z-10">
        {isPro && (
          <div className="mb-5 p-3 rounded-2xl bg-violet-950/50 border border-violet-500/30 flex items-center gap-2 text-xs text-violet-300">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span>You've selected the <strong>Pro Plan</strong> (14-day trial included).</span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex bg-[#0A0C14] p-1 rounded-2xl mb-6 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); setNotice(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              !isSignUp ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); setNotice(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              isSignUp ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="mb-4 p-3 rounded-2xl bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Name or Brand</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Amusan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@yourdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="•••••••• (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090A12] border border-white/[0.08] text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Free Account' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-slate-500">
          By continuing, you agree to ClearpathQR Terms & Privacy.
        </p>
      </div>
    </div>
  );
};
