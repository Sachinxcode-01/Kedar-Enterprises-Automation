'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Key, Globe, Database, Cpu, CheckCircle2, Copy } from 'lucide-react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const webhookUrl = 'https://kedarenterprises.com/api/whatsapp/webhook';

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-brand-400" /> Platform & Integration Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure Meta WhatsApp Cloud API credentials, Webhook endpoints, Supabase connections, and n8n triggers.
        </p>
      </div>

      {/* Meta WhatsApp Setup */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-400" /> Meta WhatsApp Business Cloud API Configuration
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Webhook Callback URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
              <button
                onClick={copyWebhook}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number ID</label>
              <input
                type="text"
                defaultValue="109847583920194"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp Business Account (WABA) ID</label>
              <input
                type="text"
                defaultValue="948372615049382"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Connection */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> Supabase Connection Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">NEXT_PUBLIC_SUPABASE_URL</label>
            <input
              type="text"
              defaultValue="https://xyzproject.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
            <input
              type="password"
              defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
