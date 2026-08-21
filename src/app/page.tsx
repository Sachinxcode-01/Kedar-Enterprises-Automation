'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Briefcase,
  Bot,
  UserCheck,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
  Globe,
  Database,
  Lock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MetricCard } from '@/components/ui/MetricCard';
import { SystemHealthCard } from '@/components/ui/SystemHealthCard';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { initialSystemHealth } from '@/lib/data';

export default function OverviewPage() {
  const conversationData = [
    { day: 'Mon', total: 42, bot: 34, human: 8 },
    { day: 'Tue', total: 58, bot: 46, human: 12 },
    { day: 'Wed', total: 65, bot: 52, human: 13 },
    { day: 'Thu', total: 80, bot: 65, human: 15 },
    { day: 'Fri', total: 72, bot: 58, human: 14 },
    { day: 'Sat', total: 50, bot: 42, human: 8 },
  ];

  const botRatioData = [
    { name: 'Bot Handled', value: 78.4, color: '#22c55e' },
    { name: 'Human Escalation', value: 21.6, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Welcome & Command Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Kedar Enterprises Platform v2.0 • Enterprise Operational Suite</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            WhatsApp Automation & Privacy Control Center
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            Realtime customer messaging powered by Meta WhatsApp Cloud API, n8n workflows, and strict DPDP Act 2023 privacy guardrails.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link
            href="/inbox"
            className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open WhatsApp Inbox</span>
          </Link>
          <Link
            href="/automation"
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Router Flow</span>
          </Link>
        </div>
      </motion.div>

      {/* Primary KPI Grid (8 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-400" />
            Platform Performance KPIs
          </h3>
          <span className="text-xs text-slate-500">Auto-refresh active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            index={0}
            title="Total Conversations"
            value="367"
            numericValue={367}
            change="+14.2%"
            trend="up"
            icon={MessageSquare}
            color="emerald"
            microDetail="367 total threads"
          />

          <MetricCard
            index={1}
            title="Active Conversations"
            value="24"
            numericValue={24}
            change="Real-time"
            trend="neutral"
            icon={MessageSquare}
            color="blue"
            microDetail="4 Waiting on staff"
          />

          <MetricCard
            index={2}
            title="New Leads Captured"
            value="42"
            numericValue={42}
            change="+8 this week"
            trend="up"
            icon={Briefcase}
            color="indigo"
            microDetail="12 Follow-ups due"
          />

          <MetricCard
            index={3}
            title="AI Bot Resolutions"
            value="78.4%"
            numericValue={78.4}
            suffix="%"
            change="+5.1%"
            trend="up"
            icon={Bot}
            color="purple"
            microDetail="287 automated answers"
          />

          <MetricCard
            index={4}
            title="Human Handoffs"
            value="21.6%"
            numericValue={21.6}
            suffix="%"
            change="44 escalations"
            trend="neutral"
            icon={UserCheck}
            color="amber"
            microDetail="Avg wait 4.2 mins"
          />

          <MetricCard
            index={5}
            title="Response Rate"
            value="99.4%"
            numericValue={99.4}
            suffix="%"
            change="Avg 1.2s bot latency"
            trend="up"
            icon={Clock}
            color="emerald"
            microDetail="Instant webhook dispatch"
          />

          <MetricCard
            index={6}
            title="Automation Success"
            value="98.8%"
            numericValue={98.8}
            suffix="%"
            change="Zero dropped frames"
            trend="up"
            icon={Zap}
            color="blue"
            microDetail="6 n8n pipelines active"
          />

          <MetricCard
            index={7}
            title="DPDP Compliance"
            value="100%"
            numericValue={100}
            suffix="%"
            change="Statutory Compliant"
            trend="up"
            icon={ShieldCheck}
            color="emerald"
            microDetail="Consent & Ledger intact"
          />
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Message Volume Overview
              </h3>
              <p className="text-xs text-slate-400">
                Daily WhatsApp incoming & outgoing traffic breakdown
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Bot Handled
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-300 ml-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Human Handled
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversationData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="bot" name="Bot Handled" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="human" name="Human Handled" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bot vs Human Breakdown */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Bot vs Human Resolution Ratio
            </h3>
            <p className="text-xs text-slate-400">
              Conversations resolution distribution
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={botRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {botRatioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-medium">Automated Bot Reply</span>
              </div>
              <span className="font-extrabold text-emerald-400 font-mono">78.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-300 font-medium">Staff Human Handoff</span>
              </div>
              <span className="font-extrabold text-indigo-400 font-mono">21.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time System Health Section (10 Services Grid) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Real-time Service Health & Latency Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Live operational verification across Meta API, Supabase, n8n, AI Providers, and DPDP Engines
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {initialSystemHealth.map((item, idx) => (
            <SystemHealthCard key={item.name} item={item} index={idx} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Realtime Event Feed */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Realtime Platform Activity Stream
            </h3>
            <p className="text-xs text-slate-400">
              Live event audit trail for inbound WhatsApp messages, AI resolutions, and staff takeovers
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Sync Active
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Staff Takeover: Rahul Sharma</span>
                <span className="text-[10px] text-slate-400 font-mono">5 mins ago</span>
              </div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Staff took over chat for customer <strong className="text-slate-200">Amit Verma (+919876543210)</strong> (Mode: HUMAN, Product: Commercial HVAC Solutions).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Automated FAQ Answer Dispatched</span>
                <span className="text-[10px] text-slate-400 font-mono">30 mins ago</span>
              </div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Matched FAQ keyword <code className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">hours</code> for customer <strong className="text-slate-200">Sunita Rao</strong> via Supabase knowledge grounding.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">DPDP Data Anonymization Executed</span>
                <span className="text-[10px] text-slate-400 font-mono">Yesterday</span>
              </div>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Executed right-to-erasure for requested customer record ID <span className="font-mono text-slate-200">c5555555</span> under DPDP Act 2023 Sec 12.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
