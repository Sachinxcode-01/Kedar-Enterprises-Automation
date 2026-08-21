'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Globe,
  KeyRound,
  LogOut,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Server,
  Laptop,
} from 'lucide-react';
import { SecurityStatusCard } from '@/components/ui/SecurityStatusCard';
import { createClient } from '@/utils/supabase/client';
import { logSecurityEvent } from '@/lib/auth-audit';

export default function AccountSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        logSecurityEvent({
          event: 'PASSWORD_RESET_SUCCESS',
          details: { method: 'IN_APP_SECURITY_SETTINGS' },
        });
        setMessage({ type: 'success', text: 'Workspace password updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Unable to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalSignOut = async () => {
    const supabase = createClient();
    logSecurityEvent({ event: 'LOGOUT', details: { scope: 'GLOBAL' } });
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Account Security & Session Management</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Security Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review your authentication methods, active browser sessions, and manage your workspace credentials.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Methods */}
        <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-400" />
            Connected Authentication Providers
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <div className="font-bold text-xs text-white">Google Single Sign-On</div>
                  <div className="text-[10px] text-slate-400 font-mono">OAuth 2.0 via Supabase Auth</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                ENABLED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-xs text-white">Email & Password</div>
                  <div className="text-[10px] text-slate-400 font-mono">Argon2 / bcrypt hash encrypted</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                ENABLED
              </span>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-brand-400" />
              Active Browser Session
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-white font-semibold flex items-center gap-1.5 text-xs">
                  <span>Current Device (Web Session)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">HTTP-Only Cookie • SameSite=Lax</div>
              </div>
              <button
                onClick={handleGlobalSignOut}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Update Password
          </h3>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                  message.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">
                New Password (min. 8 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save New Password</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Global Security Status Posture */}
      <SecurityStatusCard />
    </div>
  );
}
