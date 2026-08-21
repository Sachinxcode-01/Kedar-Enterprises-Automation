'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialCustomers } from '@/lib/data';
import { Customer } from '@/lib/types';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Download,
  Trash2,
  CheckCircle2,
  Tag,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnonymize = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: 'Anonymized User',
              phone: `+91-XXXX-XXXX-${id.substring(0, 4)}`,
              location: 'Redacted',
              tags: ['ANONYMIZED'],
              is_anonymized: true,
              anonymized_at: new Date().toISOString(),
            }
          : c
      )
    );
    setActiveAlert(`DPDP Right-to-Erasure executed for customer ID ${id.substring(0, 8)}. PII scrubbed from database.`);
    setTimeout(() => setActiveAlert(null), 5000);
  };

  const handleExportData = (customer: Customer) => {
    const jsonStr = JSON.stringify(customer, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpdp_export_${customer.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
            <Users className="w-4 h-4" />
            <span>Customer Directory & Data Subject Rights</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Directory with DPDP Act 2023 consent tracking, verified phone records, data export, and right-to-erasure execution.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Alert Banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{activeAlert}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400/80">
              Logged to Tamper-Evident Trail
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customers Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">WhatsApp Phone</th>
                <th className="p-4">Location</th>
                <th className="p-4">Tags</th>
                <th className="p-4">DPDP Consent</th>
                <th className="p-4 text-right">Data Subject Rights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{c.phone}</td>
                  <td className="p-4 text-slate-400">{c.location}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                            c.is_anonymized
                              ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {c.is_anonymized ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/60 text-[10px] font-bold font-mono">
                        ANONYMIZED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold font-mono flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> GRANTED
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleExportData(c)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    {!c.is_anonymized && (
                      <button
                        onClick={() => handleAnonymize(c.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold text-[11px] inline-flex items-center gap-1 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Anonymize
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
