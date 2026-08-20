'use client';

import { useState } from 'react';
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
    setActiveAlert(`DPDP Right-to-Erasure executed for customer ID ${id.substring(0, 8)}.`);
    setTimeout(() => setActiveAlert(null), 4000);
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" /> Customer Management Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customer directory with DPDP Act 2023 consent tracking, personal data export, and right-to-erasure workflows.
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
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Alert Banner */}
      {activeAlert && (
        <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{activeAlert}</span>
          </div>
          <span className="text-[10px] font-mono">Logged to Audit Trail</span>
        </div>
      )}

      {/* Customers Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">WhatsApp Phone</th>
                <th className="p-4">Location</th>
                <th className="p-4">Tags</th>
                <th className="p-4">DPDP Consent</th>
                <th className="p-4 text-right">Data Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px]">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{c.phone}</td>
                  <td className="p-4">{c.location}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            c.is_anonymized
                              ? 'bg-red-950/60 text-red-400 border-red-800/40'
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
                      <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-semibold">
                        ANONYMIZED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-semibold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> GRANTED
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleExportData(c)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Data
                    </button>
                    {!c.is_anonymized && (
                      <button
                        onClick={() => handleAnonymize(c.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900/80 text-red-300 border border-red-800/60 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
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
