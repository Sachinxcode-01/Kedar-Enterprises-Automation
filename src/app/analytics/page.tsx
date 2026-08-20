'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, Clock, TrendingUp, UserCheck, Bot } from 'lucide-react';

export default function AnalyticsPage() {
  const trendData = [
    { time: '09:00', msgs: 24, responseSec: 12 },
    { time: '11:00', msgs: 56, responseSec: 8 },
    { time: '13:00', msgs: 45, responseSec: 15 },
    { time: '15:00', msgs: 78, responseSec: 9 },
    { time: '17:00', msgs: 62, responseSec: 11 },
    { time: '19:00', msgs: 30, responseSec: 6 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-400" /> WhatsApp Platform Performance Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Server-side aggregated metrics on bot resolution rates, response latency, and lead conversions.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Avg Bot Response Time</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">1.2 Seconds</div>
          <div className="text-[10px] text-slate-500 mt-1">Instant Webhook Dispatch</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Human Staff Response Time</div>
          <div className="text-3xl font-bold text-indigo-400 mt-1">4.5 Minutes</div>
          <div className="text-[10px] text-slate-500 mt-1">Within SLA Guidelines</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Lead Conversion Rate</div>
          <div className="text-3xl font-bold text-brand-400 mt-1">32.8%</div>
          <div className="text-[10px] text-slate-500 mt-1">From Inbound WhatsApp Menu</div>
        </div>
      </div>

      {/* Latency & Traffic Charts */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Intraday Message Volume vs Latency</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="msgs" name="Messages" stroke="#22c55e" strokeWidth={3} />
              <Line type="monotone" dataKey="responseSec" name="Response Latency (sec)" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
