import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { signIn, signUp, resetPasswordForEmail, updateUserPassword } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';
import { Mascot } from '../components/Mascot';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../lib/context';

type AuthViewMode = 'signin' | 'signup' | 'forgot_password' | 'reset_password';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSignUpParam = searchParams.get('signup') === 'true';
  const isPro = searchParams.get('pro') === 'true';
  const isRecoveryParam = searchParams.get('type') === 'recovery' || window.location.hash.includes('type=recovery');

  const [viewMode, setViewMode] = useState<AuthViewMode>(() => {
    if (isRecoveryParam) return 'reset_password';
    if (isSignUpParam) return 'signup';
    return 'signin';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAge, setAgreeAge] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { refreshData } = useApp();
  const navigate = useNavigate();

  // Listen for Supabase password recovery events from email links
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setViewMode('reset_password');
        setError(null);
        setNotice('Enter your new password below to complete the reset.');
      }
    });

    if (isRecoveryParam) {
      setViewMode('reset_password');
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [isRecoveryParam]);

  // Handle Standard Sign In / Sign Up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (viewMode === 'signup') {
      if (!agreeTerms) {
        setError('Please agree to the Terms of Service and Privacy Policy to continue.');
        return;
      }
      if (!agreeAge) {
        setError('You must confirm you are at least 13 years of age (COPPA & GDPR-K compliant).');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify and re-enter your password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (viewMode === 'signup') {
        const data = await signUp(email.trim(), password, fullName.trim());
        if (data.user && !data.session) {
          setNotice('Account created! Please check your email to confirm your account or sign in directly.');
          setViewMode('signin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const data = await signIn(email.trim(), password);
        if (data.user) {
          try {
            await refreshData();
          } catch (e) {}
        }
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const rawMsg = (err.message || '').toLowerCase();
      
      if (rawMsg.includes('invalid login credentials') || rawMsg.includes('invalid_grant') || rawMsg.includes('load failed')) {
        setError('Incorrect email or password. Please verify your details or reset your password.');
      } else if (rawMsg.includes('user already registered') || rawMsg.includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
        setViewMode('signin');
      } else if (rawMsg.includes('email not confirmed')) {
        setError('Please confirm your email address or sign in directly.');
      } else if (rawMsg.includes('password should be at least')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Unable to sign in. Please check your email and password, or check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordForEmail(email.trim());
      setNotice(`Password reset instructions have been sent to ${email.trim()}. Please check your inbox for an email from Bethel from Clearpath.`);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Unable to send password reset email. Please verify the email address.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Setting New Password from Recovery Link
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please re-enter your new password.');
      return;
    }

    setLoading(true);

    try {
      await updateUserPassword(newPassword);
      setNotice('Password updated successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Unable to update password. The reset link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-purple-500/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center relative z-10 flex flex-col items-center w-full max-w-sm">
        <Logo to="/" size="lg" theme="light" className="justify-center mb-3" />
        
        {/* Mascot */}
        <div className="my-1">
          <Mascot 
            mood={viewMode === 'signup' ? 'celebrate' : (viewMode === 'forgot_password' ? 'curious' : 'wave')} 
            size="xs"
            badge={
              viewMode === 'forgot_password' ? 'Password Help' :
              viewMode === 'reset_password' ? 'Security Update' :
              (viewMode === 'signup' ? 'Welcome Creator!' : 'Welcome Back!')
            }
            message={
              viewMode === 'forgot_password' ? "Enter your email and Bethel will send you a reset link!" :
              viewMode === 'reset_password' ? "Create a secure new password for your account." :
              (viewMode === 'signup' ? 'Excited to help you capture leads from your videos!' : 'Welcome back! Ready to manage your video Tapframes?')
            }
          />
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {viewMode === 'forgot_password' && 'Reset your ClearpathQR account password'}
          {viewMode === 'reset_password' && 'Set a new password for your account'}
          {viewMode === 'signup' && 'Create your creator account with email'}
          {viewMode === 'signin' && 'Sign in to your ClearpathQR dashboard'}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative z-10">
        {isPro && viewMode === 'signup' && (
          <div className="mb-5 p-3 rounded-2xl bg-violet-50 border border-violet-200 flex items-center gap-2 text-xs text-violet-800">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
            <span>You've selected the <strong>Pro Plan</strong> (14-day trial included).</span>
          </div>
        )}

        {/* Tab Toggle (Only shown when not in forgot/reset password mode) */}
        {(viewMode === 'signin' || viewMode === 'signup') && (
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => { setViewMode('signin'); setError(null); setNotice(null); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                viewMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setViewMode('signup'); setError(null); setNotice(null); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                viewMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {notice && (
          <div className="mb-4 p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-violet-900 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{notice}</span>
          </div>
        )}

        {/* ================= VIEW 1: SIGN IN / SIGN UP ================= */}
        {(viewMode === 'signin' || viewMode === 'signup') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {viewMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Name or Brand</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oluwaseun Amusan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="you@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                {viewMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('forgot_password');
                      setError(null);
                      setNotice(null);
                    }}
                    className="text-[11px] text-violet-600 hover:text-violet-700 font-semibold cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="•••••••• (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {viewMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="•••••••• (re-enter password)"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Consents */}
            {viewMode === 'signup' && (
              <div className="space-y-2 pt-1 text-[11px] text-slate-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-0 mt-0.5 cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-violet-600 underline font-semibold">
                      Terms of Service
                    </Link>
                    ,{' '}
                    <Link to="/privacy" target="_blank" className="text-violet-600 underline font-semibold">
                      Privacy Policy
                    </Link>
                    , and{' '}
                    <Link to="/refund" target="_blank" className="text-violet-600 underline font-semibold">
                      Refund Policy
                    </Link>.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeAge}
                    onChange={(e) => setAgreeAge(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-0 mt-0.5 cursor-pointer"
                  />
                  <span>
                    I confirm I am at least 13 years of age (COPPA & GDPR compliant).
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{viewMode === 'signup' ? 'Create Free Account' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= VIEW 2: FORGOT PASSWORD REQUEST ================= */}
        {viewMode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-left space-y-1 mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-violet-600" />
                <span>Reset Your Password</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your account email. <strong>Bethel from Clearpath</strong> will send you a secure link to reset your password.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="you@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setViewMode('signin');
                  setError(null);
                  setNotice(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= VIEW 3: SET NEW PASSWORD ================= */}
        {viewMode === 'reset_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-left space-y-1 mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-violet-600" />
                <span>Create New Password</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please enter a new password (min 6 characters) for your ClearpathQR account.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="•••••••• (new password)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="•••••••• (re-enter new password)"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Password & Continue to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-[10px] text-slate-400">
          Clearpath Media Technologies, Inc. • support@clearpathqr.com
        </p>
      </div>
    </div>
  );
};
