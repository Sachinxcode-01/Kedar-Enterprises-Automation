'use client';

import { useState } from 'react';
import { initialFaqs, initialAutomationRules } from '@/lib/data';
import { FAQ, AutomationRule } from '@/lib/types';
import {
  Bot,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Clock,
  Zap,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function AutomationPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [rules, setRules] = useState<AutomationRule[]>(initialAutomationRules);
  const [activeTab, setActiveTab] = useState<'RULES' | 'FAQS' | 'TEMPLATES' | 'HOURS'>('RULES');

  // FAQ Modal state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddFaq = () => {
    if (!newQuestion || !newAnswer) return;
    const kws = newKeywords.split(',').map((k) => k.trim()).filter(Boolean);

    const faq: FAQ = {
      id: `f-${Date.now()}`,
      question: newQuestion,
      answer: newAnswer,
      keywords: kws,
      category: 'General Info',
      enabled: true,
      match_count: 0,
    };

    setFaqs((prev) => [faq, ...prev]);
    setNewQuestion('');
    setNewAnswer('');
    setNewKeywords('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-400" /> WhatsApp Automation Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage n8n workflow rules, deterministic FAQ keyword matching, Meta message templates, and business hours schedule.
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              activeTab === 'RULES' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Workflows
          </button>
          <button
            onClick={() => setActiveTab('FAQS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              activeTab === 'FAQS' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FAQ Builder
          </button>
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              activeTab === 'TEMPLATES' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('HOURS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              activeTab === 'HOURS' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Business Hours
          </button>
        </div>
      </div>

      {/* WORKFLOW RULES */}
      {activeTab === 'RULES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-400" />
                    <h3 className="font-bold text-sm text-white">{rule.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rule.description}</p>
                </div>
                <button onClick={() => toggleRule(rule.id)} className="text-slate-400 hover:text-white transition-colors">
                  {rule.enabled ? (
                    <ToggleRight className="w-8 h-8 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Trigger: <strong className="text-slate-200 font-mono">{rule.trigger_event}</strong></span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{rule.success_count} Passed</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">{rule.failure_count} Failed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ BUILDER */}
      {activeTab === 'FAQS' && (
        <div className="space-y-6">
          {/* Add New FAQ Form */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-400" /> Create Deterministic FAQ Matcher
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Question (e.g. What are your working hours?)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <input
                type="text"
                placeholder="Trigger Keywords (comma separated: hours, open, time)"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <textarea
              placeholder="Exact Answer Text Dispatched to WhatsApp Customer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleAddFaq}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all"
            >
              Add FAQ Rule to Supabase
            </button>
          </div>

          {/* Existing FAQs Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="p-4">Question</th>
                  <th className="p-4">Answer Payload</th>
                  <th className="p-4">Trigger Keywords</th>
                  <th className="p-4">Match Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white max-w-xs">{faq.question}</td>
                    <td className="p-4 text-slate-300 max-w-md truncate">{faq.answer}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {faq.keywords.map((kw) => (
                          <span key={kw} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-brand-300 font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">{faq.match_count} hits</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">kedar_lead_followup_24h</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                APPROVED BY META
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
              "Hi {'{{1}}'}, thank you for inquiring with Kedar Enterprises about {'{{2}}'}. Our specialist is ready to inspect your site. Would you like to schedule a call?"
            </p>
            <div className="text-[10px] text-slate-500">Category: UTILITY • Language: en_US</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">kedar_out_of_office_notice</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                APPROVED BY META
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
              "Thank you for contacting Kedar Enterprises. Our team is currently unavailable. We will get back to you during business hours (Mon-Sat 9 AM - 6 PM)."
            </p>
            <div className="text-[10px] text-slate-500">Category: UTILITY • Language: en_US</div>
          </div>
        </div>
      )}

      {/* BUSINESS HOURS */}
      {activeTab === 'HOURS' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" /> Working Schedule Configuration
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-300 font-medium">Working Days</span>
              <span className="font-bold text-white">Monday – Saturday</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-300 font-medium">Opening Hours</span>
              <span className="font-bold text-white">09:00 AM IST</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-300 font-medium">Closing Hours</span>
              <span className="font-bold text-white">06:00 PM IST</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
