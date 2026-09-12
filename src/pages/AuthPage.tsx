import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../lib/auth';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Lock, Mail, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const data = await signUp(email, password, fullName);
        if (data.user && !data.session) {
          setNotice('Account created! If email confirmation is enabled in your Supabase project, check your inbox to confirm, or try logging in.');
          setIsSignUp(false);
        } else {
          navigate('/channel-setup');
        }
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials or click "Instant Demo Preview" below.');
      } else if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setIsSignUp(false);
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email address before signing in, or disable email confirmation in your Supabase Auth settings.');
      } else if (msg.includes('Password should be at least')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(msg || 'Authentication error. You can also explore instantly using the demo button.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google OAuth initiated', err);
      setError(err?.message || 'Google OAuth is not configured on this Supabase project yet. Use email/password or Instant Demo.');
    }
  };

  const handleDemoLogin = () => {
    navigate('/dashboard');
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
            message={isSignUp ? 'Excited to help you capture leads from your videos!' : 'Great to see you again! Ready to check your scans?'}
          />
        </div>

        <p className="text-sm text-slate-400">
          {isSignUp ? 'Create your creator account in seconds' : 'Sign in to your ClearpathQR dashboard'}
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
                  placeholder="e.g. Ali Abdaal or Growth Academy"
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
                placeholder="creator@yourbrand.com"
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

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-[#121422] px-3 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Quick Demo Access Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant Demo Preview (Pre-seeded Channels & Stats)</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.5 0 2.8.5 3.9 1.4l2.9-2.9C17 1.8 14.7 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.2L1.6 16c1.9 3.8 5.8 7 10.4 7z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-[11px] text-slate-500">
          By signing up, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
