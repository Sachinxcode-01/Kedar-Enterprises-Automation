'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        case 'auth_config_missing':
          setErrorMessage('Authentication service is temporarily unavailable. Please check system status.');
          break;
        default:
          setErrorMessage('Authentication error. Please try again or contact your administrator.');
      }
    }
  }, [errorParam]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);

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
        console.error('[Google OAuth Initiation Error]', error.message);
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[OAuth Exception]', err);
      setErrorMessage('Unable to initiate Google sign-in. Please try again.');
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

        {/* Error Alert */}
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
        </AnimatePresence>

        {/* Google OAuth Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Connecting to Google OAuth...</span>
              </>
            ) : (
              <>
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
                <span className="tracking-wide">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Security Info */}
        <div className="pt-2 space-y-2">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2 font-medium">
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
