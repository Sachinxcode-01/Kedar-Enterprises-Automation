'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialLeads } from '@/lib/data';
import { Lead, LeadStatus } from '@/lib/types';
import {
  Briefcase,
  Plus,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Calendar,
  Phone,
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeView, setActiveView] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [searchTerm, setSearchTerm] = useState('');

  const stages: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];

  const stageColors: Record<LeadStatus, string> = {
    NEW: 'border-blue-500/30 bg-blue-950/20 text-blue-400',
    CONTACTED: 'border-purple-500/30 bg-purple-950/20 text-purple-400',
    QUALIFIED: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
    FOLLOW_UP: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    CONVERTED: 'border-teal-500/30 bg-teal-950/20 text-teal-400',
    LOST: 'border-slate-700 bg-slate-900/40 text-slate-400',
  };

  const moveStage = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customer_phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
            <Briefcase className="w-4 h-4" />
            <span>Commercial CRM Pipeline</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            WhatsApp Lead Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track, qualify, and convert commercial sales inquiries captured by WhatsApp automation.
          </p>
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveView('KANBAN')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeView === 'KANBAN'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setActiveView('LIST')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeView === 'LIST'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {activeView === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            return (
              <div
                key={stage}
                className="glass-panel rounded-2xl p-3.5 flex flex-col min-h-[520px] bg-slate-950/60"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider font-mono">
                    {stage.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${stageColors[stage]}`}
                  >
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="p-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-800/80 rounded-xl">
                      No leads in {stage}
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-md group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-xs text-white group-hover:text-brand-300 transition-colors">
                            {lead.customer_name}
                          </span>
                          {lead.score && (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              {lead.score} pts
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] font-semibold text-brand-400">
                          {lead.product}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">
                          {lead.requirement}
                        </p>

                        <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[10px] font-mono text-slate-400">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {lead.customer_phone}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Assignee:</span>
                            <strong className="text-slate-200">{lead.assigned_name || 'Unassigned'}</strong>
                          </div>
                          {lead.follow_up_date && (
                            <div className="flex items-center gap-1 text-amber-400 font-semibold pt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>Follow-up: {lead.follow_up_date}</span>
                            </div>
                          )}
                        </div>

                        {/* Move Stage Selector */}
                        <div className="pt-2">
                          <select
                            value={lead.status}
                            onChange={(e) => moveStage(lead.id, e.target.value as LeadStatus)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-300 focus:outline-none font-mono"
                          >
                            {stages.map((s) => (
                              <option key={s} value={s}>
                                Move to {s.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Product Requirement</th>
                <th className="p-4">Lead Score</th>
                <th className="p-4">Pipeline Stage</th>
                <th className="p-4">Assigned Staff</th>
                <th className="p-4">Follow-Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{l.customer_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{l.customer_phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-brand-400 font-semibold">{l.product}</div>
                    <div className="text-slate-400 text-[11px] max-w-sm truncate">{l.requirement}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{l.score || 80}/100</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${stageColors[l.status]}`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{l.assigned_name || 'Unassigned'}</td>
                  <td className="p-4 font-mono text-slate-400">{l.follow_up_date || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
