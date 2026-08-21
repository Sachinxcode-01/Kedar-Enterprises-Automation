'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  Clock,
  TrendingUp,
  UserCheck,
  Bot,
  Zap,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7D' | '30D' | '90D'>('7D');

  const hourlyTrendData = [
    { time: '08:00', msgs: 18, responseSec: 1.1, groqMs: 240, geminiMs: 380 },
    { time: '10:00', msgs: 64, responseSec: 1.4, groqMs: 280, geminiMs: 410 },
    { time: '12:00', msgs: 82, responseSec: 1.2, groqMs: 290, geminiMs: 395 },
    { time: '14:00', msgs: 76, responseSec: 1.5, groqMs: 310, geminiMs: 430 },
    { time: '16:00', msgs: 95, responseSec: 1.3, groqMs: 275, geminiMs: 400 },
    { time: '18:00', msgs: 54, responseSec: 1.0, groqMs: 260, geminiMs: 370 },
    { time: '20:00', msgs: 28, responseSec: 0.9, groqMs: 230, geminiMs: 360 },
  ];

  const resolutionFunnel = [
    { stage: 'Inbound Inquiries', value: 367, fill: '#3b82f6' },
    { stage: 'Menu / FAQ Grounded', value: 287, fill: '#22c55e' },
    { stage: 'Staff Escalations', value: 44, fill: '#6366f1' },
    { stage: 'Converted Leads', value: 42, fill: '#eab308' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 font-mono">
            <BarChart3 className="w-4 h-4" />
            <span>Platform Performance & Operational Analytics</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            WhatsApp Traffic & Latency Telemetry
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Real-time analytics for automated bot resolutions, human handoffs, provider latencies, and conversion funnels.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold font-mono">
          {(['7D', '30D', '90D'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                period === p
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics Cards (4 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          index={0}
          title="Avg Bot Response"
          value="1.2s"
          numericValue={1.2}
          suffix="s"
          change="-0.3s"
          trend="up"
          icon={Bot}
          color="emerald"
          microDetail="Instant webhook dispatch"
        />

        <MetricCard
          index={1}
          title="Human Response Time"
          value="4.5m"
          numericValue={4.5}
          suffix="m"
          change="SLA Met"
          trend="up"
          icon={UserCheck}
          color="indigo"
          microDetail="Under 15m threshold"
        />

        <MetricCard
          index={2}
          title="Lead Conversion Rate"
          value="32.8%"
          numericValue={32.8}
          suffix="%"
          change="+4.2%"
          trend="up"
          icon={TrendingUp}
          color="amber"
          microDetail="From WhatsApp menu"
        />

        <MetricCard
          index={3}
          title="Groq Primary Latency"
          value="290ms"
          numericValue={290}
          suffix="ms"
          change="Optimal"
          trend="up"
          icon={Zap}
          color="blue"
          microDetail="llama-3.3-70b-versatile"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intraday Message Volume vs Latency */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Intraday Traffic vs Latency
            </h3>
            <p className="text-xs text-slate-400">
              Message volume per hour with average response latency
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrendData}>
                <defs>
                  <linearGradient id="colorMsgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="msgs"
                  name="Messages Handled"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMsgs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Model Provider Latency Comparison */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Provider Latency Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Comparative latency (Groq LPU vs Google Gemini) in milliseconds
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrendData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="groqMs"
                  name="Groq LPU (ms)"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="geminiMs"
                  name="Gemini Flash (ms)"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
