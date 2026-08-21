'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { initialConversations, initialCustomers } from '@/lib/data';
import { Conversation } from '@/lib/types';
import {
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Filter,
  User,
  Phone,
} from 'lucide-react';

export default function HandoffPage() {
  const [filterState, setFilterState] = useState<'ALL' | 'WAITING' | 'ASSIGNED' | 'RESOLVED'>('ALL');

  const handoffItems = [
    {
      id: 'h1',
      conversationId: 'b1111111-1111-1111-1111-111111111111',
      customerName: 'Amit Verma',
      phone: '+919876543210',
      reason: 'Customer requested Option 5 (Talk to commercial sales team for 5-floor building HVAC pricing)',
      assignedStaff: 'Rahul Sharma',
      waitingTime: '5 mins',
      urgency: 'URGENT' as const,
      status: 'ASSIGNED' as const,
      lastMessage: 'Can I talk to a human expert right now? Option 5 please.',
    },
    {
      id: 'h2',
      conversationId: 'b4444444-4444-4444-4444-444444444444',
      customerName: 'Ananya Deshmukh',
      phone: '+919655443322',
      reason: 'Solar inverter custom configuration brochure inquiry',
      assignedStaff: 'Unassigned',
      waitingTime: '12 mins',
      urgency: 'WAITING' as const,
      status: 'WAITING' as const,
      lastMessage: 'How can I get product brochures for solar inverters?',
    },
    {
      id: 'h3',
      conversationId: 'b3333333-3333-3333-3333-333333333333',
      customerName: 'Rajesh Gupta',
      phone: '+919711223344',
      reason: 'Industrial generator contract renewal and payment confirmation',
      assignedStaff: 'Priya Patel',
      waitingTime: 'Resolved',
      urgency: 'RESOLVED' as const,
      status: 'RESOLVED' as const,
      lastMessage: 'Confirming industrial generator annual contract renewal for Delhi unit.',
    },
  ];

  const filteredItems = handoffItems.filter((item) => {
    if (filterState === 'ALL') return true;
    return item.status === filterState;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-800/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 font-mono">
            <UserCheck className="w-4 h-4" />
            <span>Staff Escalation & Human Takeover Desk</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Human Handoff Queue
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Monitor real-time customer escalations triggered by Option 5 menu selection, sentiment thresholds, or complex quotation inquiries.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs font-bold">
          <button
            onClick={() => setFilterState('ALL')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterState === 'ALL'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Queue
          </button>
          <button
            onClick={() => setFilterState('WAITING')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterState === 'WAITING'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Waiting
          </button>
          <button
            onClick={() => setFilterState('ASSIGNED')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterState === 'ASSIGNED'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => setFilterState('RESOLVED')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterState === 'RESOLVED'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Escalation Queue Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-6 rounded-3xl border transition-all ${
              item.urgency === 'URGENT'
                ? 'border-amber-500/40 bg-slate-900/90 shadow-lg shadow-amber-500/5'
                : 'border-slate-800/80 bg-slate-900/60'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-base text-white">{item.customerName}</span>
                  <span className="text-xs font-mono text-slate-400">{item.phone}</span>

                  {item.urgency === 'URGENT' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold flex items-center gap-1 font-mono animate-pulse">
                      🔴 URGENT TAKE OVER
                    </span>
                  )}
                  {item.urgency === 'WAITING' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold font-mono">
                      🟡 WAITING ON STAFF
                    </span>
                  )}
                  {item.urgency === 'RESOLVED' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                      🟢 RESOLVED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  <strong>Escalation Reason:</strong> {item.reason}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 italic">
                  &quot;{item.lastMessage}&quot;
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span>Assigned Staff: <strong className="text-slate-200">{item.assignedStaff}</strong></span>
                  <span>•</span>
                  <span>Wait Duration: <strong className="text-amber-400">{item.waitingTime}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/inbox"
                  className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Live Chat</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
