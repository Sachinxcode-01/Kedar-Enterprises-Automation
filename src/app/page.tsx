'use client';

import { useState } from 'react';
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
import Link from 'next/link';

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
    { name: 'Bot Handled', value: 78, color: '#22c55e' },
    { name: 'Human Handled', value: 22, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kedar Enterprises Platform v1.0</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            WhatsApp Automation & Privacy Control Center
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Realtime customer messaging powered by Meta WhatsApp Cloud API, n8n workflows, and strict DPDP Act 2023 privacy controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/inbox"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open WhatsApp Inbox</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Chats</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2">367</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% this week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Open Leads</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2">42</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>12 Needs Follow-up</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bot Resolution</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2">78.4%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>287 Automation Replies</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">DPDP Compliance</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">100%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Consent & Audit Active</span>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Message Volume Overview</h3>
              <p className="text-xs text-slate-400">Daily WhatsApp incoming and outgoing traffic breakdown</p>
            </div>
            <span className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 font-medium">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversationData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="bot" name="Bot Handled" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="human" name="Human Handled" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bot vs Human Breakdown */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Bot vs Human Ratio</h3>
            <p className="text-xs text-slate-400">Conversations resolution distribution</p>
          </div>
          <div className="h-48 w-full flex items-center justify-center my-2">
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
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Automated Bot Reply</span>
              </div>
              <span className="font-bold text-white">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-300">Staff Human Handoff</span>
              </div>
              <span className="font-bold text-white">22%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Realtime Event Feed */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Realtime Platform Activity Stream</h3>
          <span className="text-xs text-slate-400 font-mono">Live Sync</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Staff Takeover: Rahul Sharma</span>
                <span className="text-[10px] text-slate-500">5 mins ago</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Staff took over chat for customer <strong className="text-slate-300">Amit Verma (+919876543210)</strong> (Mode: HUMAN).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Automated FAQ Answer Dispatched</span>
                <span className="text-[10px] text-slate-500">30 mins ago</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Matched FAQ keyword <code className="text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded">hours</code> for customer <strong className="text-slate-300">Sunita Rao</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">DPDP Data Anonymization Executed</span>
                <span className="text-[10px] text-slate-500">Yesterday</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Executed right-to-erasure for requested customer record ID <span className="font-mono text-slate-300">c5555555</span>. All PII scrubbed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
