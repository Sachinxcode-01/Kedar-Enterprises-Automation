'use client';

import { useState } from 'react';
import { initialAuditLogs } from '@/lib/data';
import { FileText, Shield, User, Clock, Terminal } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" /> Tamper-Evident Administrative Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log trail of all administrative actions, data erasures, mode changes, and system access.
          </p>
        </div>

        <input
          type="text"
          placeholder="Filter by user or action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
            <tr>
              <th className="p-4">User / Performer</th>
              <th className="p-4">Action Code</th>
              <th className="p-4">Resource Type</th>
              <th className="p-4">Metadata Payload</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-sans font-bold text-white">{log.user_name}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{log.resource_type}</td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{log.metadata}</td>
                <td className="p-4 text-slate-400">{log.ip_address}</td>
                <td className="p-4 font-sans text-slate-400">{log.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
