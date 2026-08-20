'use client';

import { useState } from 'react';
import {
  initialConsentRecords,
  initialDataRequests,
  initialGrievanceTickets,
  initialVendors,
  initialRetentionPolicies,
} from '@/lib/data';
import {
  ConsentRecord,
  DataRequest,
  GrievanceTicket,
  Vendor,
  RetentionPolicy,
} from '@/lib/types';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Server,
  Clock,
  HelpCircle,
  Sparkles,
  Download,
  Lock,
} from 'lucide-react';

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState<
    'NOTICE' | 'CONSENT' | 'REQUESTS' | 'GRIEVANCES' | 'VENDORS' | 'RETENTION'
  >('NOTICE');

  const [consents, setConsents] = useState<ConsentRecord[]>(initialConsentRecords);
  const [requests, setRequests] = useState<DataRequest[]>(initialDataRequests);
  const [tickets, setTickets] = useState<GrievanceTicket[]>(initialGrievanceTickets);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [retention, setRetention] = useState<RetentionPolicy[]>(initialRetentionPolicies);

  const resolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'RESOLVED', resolution: 'Resolved by DPDP Compliance Officer.' }
          : t
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Controls</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Privacy-by-Design & Compliance Management Center
          </h2>
          <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
            Architectural controls for Data Principal Rights, Purpose Limitation, Consent Ledger, Grievances, Retention Purges, and Processor Inventory under Indian regulations.
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-emerald-900/40 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>DPDP Active Engine</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('NOTICE')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
            activeTab === 'NOTICE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privacy Notice
        </button>
        <button
          onClick={() => setActiveTab('CONSENT')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
            activeTab === 'CONSENT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Consent Ledger
        </button>
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
            activeTab === 'REQUESTS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Data Principal Requests
        </button>
        <button
          onClick={() => setActiveTab('GRIEVANCES')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
            activeTab === 'GRIEVANCES' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Grievance Officer
        </button>
        <button
          onClick={() => setActiveTab('VENDORS')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
            activeTab === 'VENDORS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Vendor / Processors
        </button>
        <button
          onClick={() => setActiveTab('RETENTION')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
            activeTab === 'RETENTION' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Data Retention
        </button>
      </div>

      {/* TAB 1: PRIVACY NOTICE */}
      {activeTab === 'NOTICE' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Active WhatsApp Transparency Notice (v1.0-2024)
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Published & Live</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              <strong>Kedar Enterprises Privacy Notice for WhatsApp Customers:</strong>
            </p>
            <p>
              Under the Digital Personal Data Protection (DPDP) Act, 2023, Kedar Enterprises collects your name, WhatsApp phone number, location, and inquiry requirements strictly for responding to business inquiries, providing product quotations, and managing commercial service orders.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>Data Fiduciary:</strong> Kedar Enterprises, Plot 45, Industrial Suburb Stage II, Bengaluru.</li>
              <li><strong>Purpose Limitation:</strong> Data is never sold or repurposed for unsolicited third-party marketing.</li>
              <li><strong>Data Principal Rights:</strong> You may request access, correction, or erasure of your personal data at any time by messaging "PRIVACY" or contacting privacy@kedarenterprises.com.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: CONSENT LEDGER */}
      {activeTab === 'CONSENT' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Consent Purpose</th>
                <th className="p-4">Status</th>
                <th className="p-4">Notice Version</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {consents.map((cs) => (
                <tr key={cs.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">{cs.customer_name}</td>
                  <td className="p-4 font-mono text-slate-300">{cs.customer_phone}</td>
                  <td className="p-4 max-w-xs">{cs.purpose}</td>
                  <td className="p-4">
                    {cs.status === 'GRANTED' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        GRANTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                        WITHDRAWN
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono">{cs.notice_version}</td>
                  <td className="p-4 text-slate-400">{cs.granted_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: DATA PRINCIPAL REQUESTS */}
      {activeTab === 'REQUESTS' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Request Type</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Requested At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">{r.customer_name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[10px]">
                      {r.request_type}
                    </span>
                  </td>
                  <td className="p-4 max-w-sm text-slate-400">{r.details}</td>
                  <td className="p-4 font-bold text-emerald-400">{r.status}</td>
                  <td className="p-4 text-slate-400">{r.requested_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: GRIEVANCE REDRESSAL */}
      {activeTab === 'GRIEVANCES' && (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-brand-400 font-bold">{t.ticket_number}</span>
                  <span className="font-bold text-sm text-white">{t.customer_name}</span>
                </div>
                <p className="text-xs text-slate-300">{t.issue}</p>
                <div className="text-[10px] text-slate-500">Category: {t.category} • Created: {t.created_at}</div>
              </div>
              <div>
                {t.status === 'OPEN' ? (
                  <button
                    onClick={() => resolveTicket(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    RESOLVED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: VENDOR / PROCESSORS */}
      {activeTab === 'VENDORS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((v) => (
            <div key={v.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">{v.vendor_name}</h4>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {v.contract_status}
                </span>
              </div>
              <p className="text-xs text-brand-400 font-semibold">{v.service_provided}</p>
              <p className="text-xs text-slate-400">Data Shared: {v.data_shared}</p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>Storage Region: {v.data_location}</span>
                <span>Last Security Audit: {v.last_security_audit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: DATA RETENTION */}
      {activeTab === 'RETENTION' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Data Category</th>
                <th className="p-4">Retention Period</th>
                <th className="p-4">Automated Purge</th>
                <th className="p-4">Legal Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {retention.map((rp) => (
                <tr key={rp.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">{rp.data_category}</td>
                  <td className="p-4 font-bold text-brand-400">{rp.retention_period_days} Days</td>
                  <td className="p-4">
                    {rp.auto_purge ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                        ENABLED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold text-[10px]">
                        MANUAL REVIEW
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{rp.legal_basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
