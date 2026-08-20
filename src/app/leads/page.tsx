'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'LIST'>('KANBAN');

  const stages: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];

  const moveStage = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-400" /> WhatsApp Lead Qualification Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture, qualify, and assign commercial lead opportunities generated via WhatsApp automation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('KANBAN')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'KANBAN' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'LIST' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {activeTab === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage);
            return (
              <div key={stage} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{stage}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-400">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="font-bold text-xs text-white">{lead.customer_name}</div>
                      <div className="text-[11px] font-semibold text-brand-400">{lead.product}</div>
                      <p className="text-[10px] text-slate-400 leading-snug">{lead.requirement}</p>
                      
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Assignee: <strong className="text-slate-300">{lead.assigned_name || 'Unassigned'}</strong></span>
                      </div>

                      {/* Move Stage Selector */}
                      <div className="pt-1">
                        <select
                          value={lead.status}
                          onChange={(e) => moveStage(lead.id, e.target.value as LeadStatus)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>Move to {s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Product / Service</th>
                <th className="p-4">Requirement Details</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Assigned Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">{l.customer_name}</td>
                  <td className="p-4 text-brand-400 font-semibold">{l.product}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{l.requirement}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{l.assigned_name || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
