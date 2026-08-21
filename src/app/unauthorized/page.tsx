'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, LogOut, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error');

  const getErrorMessage = () => {
    switch (errorType) {
      case 'account_disabled':
        return 'Your staff account has been deactivated by an administrator. Please contact your system administrator for reactivation.';
      case 'role_unassigned':
        return 'Your account does not have an assigned operational role (ADMIN or STAFF). Access is restricted under enterprise policy.';
      case 'admin_only':
        return 'This section contains sensitive administrative controls and requires an ADMIN role.';
      default:
        return 'Access denied. You do not have permission to view this resource.';
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,63,94,0.1),rgba(255,255,255,0))]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 lg:p-10 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono mb-1">
            Access Restricted (403 Forbidden)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {getErrorMessage()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Enforced by Supabase RLS & Role Isolation</span>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Try Another Account</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace Overview</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
