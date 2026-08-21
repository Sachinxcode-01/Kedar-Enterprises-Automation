'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { initialNotifications } from '@/lib/data';
import { NotificationItem } from '@/lib/types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Users,
  Briefcase,
  Bot,
  ShieldCheck,
  Zap,
  ExternalLink,
  Trash2,
  Filter,
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'HANDOFF', 'LEAD', 'DPDP', 'SYSTEM'];

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === 'ALL' || n.category === activeCategory
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HANDOFF':
        return <Users className="w-4 h-4 text-amber-400" />;
      case 'LEAD':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'DPDP':
        return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'AI':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'SYSTEM':
      default:
        return <Zap className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
            <Bell className="w-4 h-4" />
            <span>Platform Alerting & Event Notification Desk</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Notification Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of urgent customer handoffs, new CRM lead captures, DPDP erasure events, and webhook health.
          </p>
        </div>

        {/* Clear Actions */}
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-xs">
            <Bell className="w-10 h-10 mx-auto text-slate-600 mb-3 opacity-40" />
            <p className="font-bold text-slate-200 text-sm">No notifications found</p>
            <p className="text-slate-400 mt-1">All events in this category have been cleared.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel p-5 rounded-2xl border transition-all ${
                notif.read
                  ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                  : 'bg-slate-900/80 border-brand-500/30 text-slate-200 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {notif.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-4 mt-2.5 text-[11px] font-mono text-slate-400">
                      <span>{notif.created_at}</span>
                      {notif.target_url && (
                        <Link
                          href={notif.target_url}
                          className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                        >
                          <span>Open associated record</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
