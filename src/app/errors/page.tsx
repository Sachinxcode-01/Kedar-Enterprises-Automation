'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { initialErrorLogs } from '@/lib/data';
import { ErrorLog } from '@/lib/types';
import {
  AlertTriangle,
  Zap,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>(initialErrorLogs);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredErrors = errors.filter(
    (e) => filterSeverity === 'ALL' || e.severity === filterSeverity
  );

  const toggleResolved = (id: string) => {
    setErrors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, resolved: !e.resolved } : e))
    );
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'LOW':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 font-mono">
            <Zap className="w-4 h-4" />
            <span>Platform Observability & Error Diagnosis</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Error Logs & Health Incident Center
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Sanitized diagnostic traces across Meta WhatsApp webhook payloads, n8n automations, and LLM inference timeouts. All tokens and secrets are automatically scrubbed.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold font-mono">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterSeverity === sev
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredErrors.map((err) => (
          <motion.div
            key={err.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-3xl space-y-3 glass-card-hover border border-slate-800"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold font-mono ${getSeverityBadge(err.severity)}`}>
                  {err.severity}
                </span>
                <h4 className="font-bold text-sm text-white">{err.service}: {err.message}</h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{err.timestamp}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-850 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>Sanitized Diagnostic Trace</span>
                <span className="text-emerald-400">Secrets Filtered (Zero Leakage)</span>
              </div>
              <code>{err.sanitized_trace}</code>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
              <span className="text-slate-400">Status: <strong className={err.resolved ? 'text-emerald-400' : 'text-amber-400'}>{err.resolved ? 'RESOLVED' : 'UNRESOLVED'}</strong></span>
              <button
                onClick={() => toggleResolved(err.id)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {err.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
