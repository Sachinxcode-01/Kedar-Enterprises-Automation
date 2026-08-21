'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Users,
  Briefcase,
  Bot,
  BookOpen,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  X,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const navigationItems = [
    { name: 'Overview Dashboard', category: 'Navigation', href: '/', icon: LayoutDashboard, keywords: 'home stats metrics' },
    { name: 'WhatsApp Inbox & Live Chat', category: 'Navigation', href: '/inbox', icon: MessageSquare, keywords: 'conversations messages customer chat' },
    { name: 'Customers Directory', category: 'Navigation', href: '/customers', icon: Users, keywords: 'contacts customers clients phone' },
    { name: 'Leads & CRM Pipeline', category: 'Navigation', href: '/leads', icon: Briefcase, keywords: 'leads opportunities sales kanban' },
    { name: 'Human Handoff Queue', category: 'Navigation', href: '/handoff', icon: Users, keywords: 'staff handoff takeover escalations urgent' },
    { name: 'AI Automation Hub & Router', category: 'Navigation', href: '/automation', icon: Bot, keywords: 'ai groq gemini intent rules workflows' },
    { name: 'Knowledge Base & Guardrails', category: 'Navigation', href: '/knowledge', icon: BookOpen, keywords: 'products services prices faqs company' },
    { name: 'Analytics & Performance', category: 'Navigation', href: '/analytics', icon: BarChart3, keywords: 'charts traffic latency response' },
    { name: 'Privacy & DPDP Act 2023', category: 'Compliance', href: '/privacy', icon: ShieldCheck, keywords: 'consent erasure data requests grievance dpdp' },
    { name: 'Audit Logs (Tamper-Evident)', category: 'Observability', href: '/audit-logs', icon: FileText, keywords: 'audit logs security actions history' },
    { name: 'Errors & System Health', category: 'Observability', href: '/errors', icon: Zap, keywords: 'errors stack latency debug status' },
    { name: 'Platform Settings & Webhooks', category: 'Settings', href: '/settings', icon: Settings, keywords: 'meta api waba credentials supabase webhook' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = navigationItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Input Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-brand-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command, route, or feature name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No matching platform commands found for &quot;{query}&quot;.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleSelect(item.href)}
                      className="w-full p-3 rounded-xl flex items-center justify-between text-left hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-brand-400 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {item.category} • {item.href}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Navigation shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> to close</span>
              <span>Kedar Enterprises OS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
