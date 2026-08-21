'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecurityStatusCard } from '@/components/ui/SecurityStatusCard';
import { initialAuditLogs } from '@/lib/data';
import { FileText, Shield, User, Clock, Terminal, ChevronDown, ChevronRight, Search, Lock } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
            <FileText className="w-4 h-4" />
            <span>Immutable Observability & Audit Trail</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Tamper-Evident Administrative Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log trail of administrative actions, data erasures, mode transitions, and system access.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, action, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
            <tr>
              <th className="p-4 w-10"></th>
              <th className="p-4">User / Performer</th>
              <th className="p-4">Action Code</th>
              <th className="p-4">Resource Target</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filteredLogs.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <React.Fragment key={log.id}>
                  <tr
                    onClick={() => toggleExpand(log.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 text-slate-500">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-brand-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </td>
                    <td className="p-4 font-sans font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {log.user_name.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{log.user_name}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{log.resource_type}</td>
                    <td className="p-4 text-slate-400">{log.ip_address}</td>
                    <td className="p-4 font-sans text-slate-400">{log.created_at}</td>
                  </tr>

                  {/* Expanded JSON Inspector */}
                  {isExpanded && (
                    <tr className="bg-slate-950/80 border-b border-slate-800/80">
                      <td colSpan={6} className="p-5">
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-bold text-white flex items-center gap-1.5 font-sans">
                              <Terminal className="w-3.5 h-3.5 text-brand-400" />
                              Payload Metadata Inspector
                            </span>
                            <span className="text-[10px] text-emerald-400">Audit Checksum Verified</span>
                          </div>
                          <pre className="text-[11px] text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono">
                            {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Security Status Posture */}
      <SecurityStatusCard />
    </div>
  );
}
