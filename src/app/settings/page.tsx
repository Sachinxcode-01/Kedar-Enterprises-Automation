'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SecurityStatusCard } from '@/components/ui/SecurityStatusCard';
import {
  Settings as SettingsIcon,
  Key,
  Globe,
  Database,
  Cpu,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Zap,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const webhookUrl = 'https://kedarenterprises.com/api/whatsapp/webhook';

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
            <SettingsIcon className="w-4 h-4" />
            <span>Infrastructure & Integrations</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Platform & Webhook Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure Meta WhatsApp Cloud API credentials, Webhook endpoints, Supabase connections, and n8n triggers.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved Configuration!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Meta WhatsApp Setup */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-brand-400" />
            Meta WhatsApp Business Cloud API Configuration
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            CONNECTED
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 font-mono">
              Webhook Callback URL (Meta App Dashboard Endpoint)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none"
              />
              <button
                onClick={copyWebhook}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5 transition-all text-xs"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
                Phone Number ID
              </label>
              <input
                type="text"
                defaultValue="109847583920194"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
                WhatsApp Business Account (WABA) ID
              </label>
              <input
                type="text"
                defaultValue="948372615049382"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Connection */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-400" />
            Supabase PostgreSQL Connection
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
            AWS MUMBAI (ap-south-1)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
              NEXT_PUBLIC_SUPABASE_URL
            </label>
            <input
              type="text"
              defaultValue="https://xyzproject.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 font-mono">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </label>
            <input
              type="password"
              defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Security Status Posture */}
      <SecurityStatusCard />
    </div>
  );
}
