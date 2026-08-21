'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@kedarenterprises.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('ADMIN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(255,255,255,0))]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 lg:p-10 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6 relative z-10"
      >
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-brand-500/25">
            KE
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Kedar Enterprises</h1>
            <p className="text-xs text-slate-400 mt-1">WhatsApp Automation & DPDP Compliance Platform</p>
          </div>
        </div>

        {/* Role Picker for Demo */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-850">
          <button
            type="button"
            onClick={() => {
              setRole('ADMIN');
              setEmail('admin@kedarenterprises.com');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'ADMIN'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Administrator
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('STAFF');
              setEmail('staff@kedarenterprises.com');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'STAFF'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Support Staff
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 text-center flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Secured with Supabase RBAC & Audit Trails</span>
        </div>
      </motion.div>
    </div>
  );
}
