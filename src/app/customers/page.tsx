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
  X,
  MessageSquare,
  Briefcase,
  Activity,
  FileText,
  Clock,
  ChevronRight,
  Bot,
  UserCheck,
} from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONVERSATIONS' | 'LEADS' | 'CONSENT' | 'ACTIVITY'>('OVERVIEW');
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

    if (selectedCustomer?.id === id) {
      setSelectedCustomer((prev) =>
        prev
          ? {
              ...prev,
              name: 'Anonymized User',
              phone: `+91-XXXX-XXXX-${id.substring(0, 4)}`,
              location: 'Redacted',
              tags: ['ANONYMIZED'],
              is_anonymized: true,
              anonymized_at: new Date().toISOString(),
            }
          : null
      );
    }

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
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
              <Users className="w-4 h-4" />
              <span>Customer Directory & 360 View</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Customer Directory</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any customer record to inspect conversation history, active leads, DPDP consent proof, and audit metadata.
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
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 font-mono"
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
              <span className="text-[10px] font-mono font-bold text-amber-400/80">DPDP Ledger Recorded</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customers Table */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">WhatsApp Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">DPDP Consent</th>
                <th className="p-4">Tags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-bold text-white flex items-center gap-2.5 font-sans">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs group-hover:border-brand-500 transition-colors">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="group-hover:text-brand-300 transition-colors">{customer.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {customer.id.substring(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 flex items-center gap-1.5 pt-5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{customer.phone}</span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="flex items-center gap-1.5 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{customer.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {customer.dpdp_consent ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> GRANTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 font-sans">
                      {customer.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <span>360 View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CUSTOMER 360 DRAWER */}
        <AnimatePresence>
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-base shadow-lg">
                      {selectedCustomer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{selectedCustomer.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span>{selectedCustomer.phone}</span>
                        <span>•</span>
                        <span>{selectedCustomer.location}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center bg-slate-950 px-6 border-b border-slate-800 text-xs font-bold font-mono overflow-x-auto">
                  {(['OVERVIEW', 'CONVERSATIONS', 'LEADS', 'CONSENT', 'ACTIVITY'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-3 border-b-2 transition-all shrink-0 ${
                        activeTab === tab
                          ? 'border-brand-500 text-brand-400'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Drawer Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'OVERVIEW' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">Full Name</span>
                          <p className="text-sm font-bold text-white font-sans">{selectedCustomer.name}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">WhatsApp Number</span>
                          <p className="text-sm font-bold text-white font-mono">{selectedCustomer.phone}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">City & Region</span>
                          <p className="text-sm font-bold text-white font-sans">{selectedCustomer.location}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">Consent Status</span>
                          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> GRANTED
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Associated Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCustomer.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-slate-850 border border-slate-700 text-xs font-semibold text-slate-200 font-sans"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CONVERSATIONS */}
                  {activeTab === 'CONVERSATIONS' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1 text-indigo-400">
                            <Bot className="w-3 h-3" /> AI Router Automated Response
                          </span>
                          <span>Today at 10:14 AM</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-sans">
                          &ldquo;Hello! Thank you for contacting Kedar Enterprises. How can we assist you with our products today?&rdquo;
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span className="text-brand-400">Customer Inquiry</span>
                          <span>Today at 10:15 AM</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-sans">
                          &ldquo;I would like to inquire about the pricing and bulk delivery terms for industrial lubricants.&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LEADS */}
                  {activeTab === 'LEADS' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm font-sans">Industrial Supply Contract</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                            PROPOSAL_SENT
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                          <span>Est. Value: ₹2,40,000</span>
                          <span>Follow-up: Tomorrow</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CONSENT & DPDP */}
                  {activeTab === 'CONSENT' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <ShieldCheck className="w-4 h-4" />
                          <span>DPDP Act 2023 Proof Ledger</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                          Explicit opt-in recorded via WhatsApp interaction on 2024-01-15T09:30:00Z. Purpose limited to commercial inquiries and order dispatch.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Download className="w-3.5 h-3.5" />}
                          onClick={() => handleExportData(selectedCustomer)}
                        >
                          Export Data Subject Record (JSON)
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() => handleAnonymize(selectedCustomer.id)}
                        >
                          Execute Right-to-Erasure
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: ACTIVITY & AUDIT */}
                  {activeTab === 'ACTIVITY' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-300">WHATSAPP_MESSAGE_RECEIVED</span>
                        <span className="text-slate-500">10:14 AM</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-300">AI_ROUTER_PROCESSED (Groq Llama 3)</span>
                        <span className="text-slate-500">10:14 AM</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-300">DPDP_CONSENT_VERIFIED</span>
                        <span className="text-slate-500">10:15 AM</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
