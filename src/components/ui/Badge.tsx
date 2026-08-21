'use client';

import React from 'react';
import { Bot, UserCheck, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export type BadgeVariant =
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'BOT'
  | 'HUMAN'
  | 'URGENT'
  | 'VERIFIED'
  | 'ADMIN'
  | 'STAFF'
  | 'ACTIVE'
  | 'INACTIVE';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ variant, label, size = 'sm', className = '' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (variant) {
    case 'OPERATIONAL':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{label || 'Operational'}</span>
        </span>
      );
    case 'DEGRADED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>{label || 'Degraded'}</span>
        </span>
      );
    case 'BOT':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono ${sizeClasses} ${className}`}
        >
          <Bot className="w-3 h-3" />
          <span>{label || 'BOT'}</span>
        </span>
      );
    case 'HUMAN':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono ${sizeClasses} ${className}`}
        >
          <UserCheck className="w-3 h-3" />
          <span>{label || 'HUMAN'}</span>
        </span>
      );
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 ${sizeClasses} ${className}`}
        >
          <ShieldCheck className="w-3 h-3" />
          <span>{label || 'Verified'}</span>
        </span>
      );
    case 'URGENT':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse ${sizeClasses} ${className}`}
        >
          <Zap className="w-3 h-3" />
          <span>{label || 'Urgent'}</span>
        </span>
      );
    case 'ADMIN':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono ${sizeClasses} ${className}`}
        >
          <span>{label || 'ADMIN'}</span>
        </span>
      );
    case 'STAFF':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono ${sizeClasses} ${className}`}
        >
          <span>{label || 'STAFF'}</span>
        </span>
      );
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>{label || 'ACTIVE'}</span>
        </span>
      );
    case 'INACTIVE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono ${sizeClasses} ${className}`}
        >
          <span>{label || 'INACTIVE'}</span>
        </span>
      );
  }
}
