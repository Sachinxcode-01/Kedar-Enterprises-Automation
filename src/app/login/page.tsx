'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  KeyRound,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode: 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD'
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD'>('SIGN_IN');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'oauth_cancelled':
          setErrorMessage('Google sign-in was cancelled. Please try again.');
          break;
        case 'oauth_failed':
          setErrorMessage('Google authentication failed. Please verify your credentials.');
          break;
        case 'invalid_code':
          setErrorMessage('Invalid or expired authentication code. Please sign in again.');
          break;
        case 'session_expired':
          setErrorMessage('Your session has expired. Please sign in to continue.');
          break;
        case 'account_disabled':
          setErrorMessage('Your account has been deactivated. Please contact an administrator.');
          break;
        case 'auth_config_missing':
          setErrorMessage('Authentication service is temporarily unavailable. Please check system status.');
          break;
        default:
          setErrorMessage('Authentication error. Please try again or contact your administrator.');
      }
    }
  }, [errorParam]);

  // 1. Google OAuth Initiation
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('[Google OAuth Error]', error.message);
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[OAuth Exception]', err);
      setErrorMessage('Unable to initiate Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  // 2. Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Generic error message to prevent account enumeration
        setErrorMessage('Invalid email or password. Please check your credentials.');
        setLoading(false);
      } else if (data.user) {
        // Verify active status in profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('active, role')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.active === false) {
          await supabase.auth.signOut();
          setErrorMessage('Your account has been deactivated. Contact an administrator.');
          setLoading(false);
          return;
        }

        router.push('/');
      }
    } catch (err: any) {
      setErrorMessage('Authentication service error. Please try again.');
      setLoading(false);
    }
  };

  // 3. Email & Password Sign Up (Defaults to STAFF)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim() || 'Staff Member',
            role: 'STAFF', // Server-safe default
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      } else {
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage('Sign up failed. Please try again.');
      setLoading(false);
    }
  };

  // 4. Forgot Password Trigger
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      } else {
        setSuccessMessage('If that email exists in our system, a password reset link has been dispatched.');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage('Unable to process password reset. Please try again.');
      setLoading(false);
    }
  };

  const handleBypassDemo = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 lg:p-10 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-brand-500/25">
            KE
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Kedar Enterprises</h1>
            <p className="text-xs text-slate-400 mt-1">WhatsApp Automation & DPDP Compliance Portal</p>
          </div>
        </div>

        {/* Tab Selector */}
        {authMode !== 'FORGOT_PASSWORD' && (
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-850 text-xs font-bold font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMode('SIGN_IN');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'SIGN_IN'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('SIGN_UP');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'SIGN_UP'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 shadow-md"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google OAuth Section */}
        {authMode !== 'FORGOT_PASSWORD' && (
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
              <div className="flex-1 h-px bg-slate-800" />
              <span>OR ENTER CREDENTIALS</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
          </div>
        )}

        {/* MODE 1: SIGN IN FORM */}
        {authMode === 'SIGN_IN' && (
          <form onSubmit={handleEmailSignIn} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@kedarenterprises.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold font-mono">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('FORGOT_PASSWORD');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[11px] text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: SIGN UP FORM */}
        {authMode === 'SIGN_UP' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@kedarenterprises.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">Password (min. 8 characters)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Staff Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 3: FORGOT PASSWORD FORM */}
        {authMode === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <KeyRound className="w-8 h-8 text-brand-400 mx-auto mb-2" />
              <h3 className="font-bold text-white text-sm">Reset Password</h3>
              <p className="text-[11px] text-slate-400">Enter your email to receive recovery instructions</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@kedarenterprises.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGN_IN');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold text-xs border border-slate-800"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
              >
                {loading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="pt-2 space-y-2">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Secure authentication powered by Supabase Auth</span>
          </div>

          <div className="text-center">
            <button
              onClick={handleBypassDemo}
              className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors underline font-mono"
            >
              Development / Local Preview Bypass
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
