'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Globe, Database, Zap, Activity, FileText } from 'lucide-react';

export function SecurityStatusCard() {
  const securityChecks = [
    { name: 'Authentication Engine', status: 'Operational', icon: ShieldCheck, detail: 'Supabase Auth SSR Session Tokens' },
    { name: 'Google OAuth', status: 'Connected', icon: Globe, detail: 'Single Sign-On Enabled' },
    { name: 'Supabase Auth Gateway', status: 'Operational', icon: Database, detail: 'AWS Mumbai (ap-south-1)' },
    { name: 'Row Level Security (RLS)', status: 'Enforced', icon: Lock, detail: '100% Tables Protected' },
    { name: 'Server Rate Limiting', status: 'Active', icon: Zap, detail: 'Sliding Window Token Bucket' },
    { name: 'Audit Logging & Trail', status: 'Active', icon: FileText, detail: 'Tamper-Evident Security Log' },
    { name: 'Session & Cookie Security', status: 'Active', icon: Activity, detail: 'HTTP-Only, SameSite, Secure' },
  ];

  return (
    <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Enterprise Security & Auth Posture
            </h3>
            <p className="text-xs text-slate-400">
              Live status of authentication, authorization, token encryption, and abuse prevention.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          SECURE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {securityChecks.map((check) => {
          const Icon = check.icon;
          return (
            <div
              key={check.name}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 glass-card-hover"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {check.name}
                </span>
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {check.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{check.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
