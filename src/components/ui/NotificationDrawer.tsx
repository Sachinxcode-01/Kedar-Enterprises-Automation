'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { NotificationItem } from '@/lib/types';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Users,
  Briefcase,
  Bot,
  ShieldCheck,
  Zap,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const router = useRouter();

  const categories = ['ALL', 'HANDOFF', 'LEAD', 'DPDP', 'SYSTEM'];

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === 'ALL' || n.category === activeCategory
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigate = (targetUrl?: string) => {
    if (targetUrl) {
      router.push(targetUrl);
      onClose();
    }
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-400" />
                  <h3 className="font-bold text-white text-base">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 text-xs font-medium"
                      title="Clear notifications"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800 overflow-x-auto text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
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
              <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/40">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                    <p className="font-semibold text-slate-300">All caught up!</p>
                    <p className="text-slate-400 mt-1">No notifications in this category.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkAsRead(notif.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        notif.read
                          ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                          : 'bg-slate-800/60 border-brand-500/30 text-slate-200 shadow-md'
                      } hover:border-slate-700`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                          {getCategoryIcon(notif.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-xs text-white">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {notif.created_at}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.target_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(notif.target_url);
                              }}
                              className="mt-2 text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
