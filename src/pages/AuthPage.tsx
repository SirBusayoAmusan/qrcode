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

  const { channels } = useApp();
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
          setNotice('Account created! If email confirmation is enabled in your Supabase project, please check your inbox to confirm before logging in.');
          setIsSignUp(false);
        } else {
          // New users must setup channel branding first!
          navigate('/channel-setup');
        }
      } else {
        await signIn(email.trim(), password);
        // If user already has a channel, go to dashboard; otherwise prompt channel setup
        if (channels && channels.length > 0) {
          navigate('/dashboard');
        } else {
          navigate('/channel-setup');
        }
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
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center relative z-10 flex flex-col items-center">
        <Logo to="/" size="lg" className="justify-center mb-3" />
        
        {/* Perched Mascot reacting to sign in / sign up */}
        <div className="my-2">
          <Mascot 
            mood={isSignUp ? 'celebrate' : 'wave'} 
            size="sm"
            badge={isSignUp ? 'Welcome New Creator!' : 'Welcome Back!'}
            message={isSignUp ? 'Excited to help you capture leads from your videos!' : 'Welcome back! Ready to manage your video Tapframes?'}
          />
        </div>

        <p className="text-sm text-slate-400">
          {isSignUp ? 'Create your creator account with email' : 'Sign in to your ClearpathQR account'}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#121422] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {isPro && (
          <div className="mb-5 p-3 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center gap-2 text-xs text-violet-300">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span>You've selected the <strong>Pro Plan</strong> (14-day free trial included).</span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex bg-[#0B0D15] p-1 rounded-xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); setNotice(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); setNotice(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isSignUp ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name or Creator Brand</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Amusan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@yourdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="•••••••• (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0D15] border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
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

        {/* Clean Footer info */}
        <p className="mt-6 text-center text-[11px] text-slate-500">
          By continuing, you agree to ClearpathQR Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
