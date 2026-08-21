'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ShieldCheck,
  Search,
  Bot,
  Globe,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { NotificationDrawer } from '@/components/ui/NotificationDrawer';
import { initialNotifications } from '@/lib/data';
import { NotificationItem } from '@/lib/types';

export function Header() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<'ADMIN' | 'STAFF'>('ADMIN');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getBreadcrumbName = (path: string) => {
    switch (path) {
      case '/':
        return 'Overview';
      case '/inbox':
        return 'WhatsApp Inbox';
      case '/customers':
        return 'Customers';
      case '/leads':
        return 'Leads Pipeline';
      case '/handoff':
        return 'Human Handoff';
      case '/automation':
        return 'AI Automation';
      case '/knowledge':
        return 'Knowledge Base';
      case '/analytics':
        return 'Analytics';
      case '/privacy':
        return 'Privacy & DPDP';
      case '/notifications':
        return 'Notifications';
      case '/audit-logs':
        return 'Audit Logs';
      case '/errors':
        return 'Errors & Health';
      case '/settings':
        return 'Settings';
      default:
        return path.replace('/', '').toUpperCase();
    }
  };

  return (
    <>
      <header className="h-16 bg-slate-900/80 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl shrink-0 select-none">
        {/* Left: Breadcrumbs & Status Pills */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="text-slate-400 hidden sm:inline">Kedar Enterprises</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
            <span className="text-white font-bold tracking-tight">
              {getBreadcrumbName(pathname)}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          {/* Status Pills */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
              <StatusIndicator status="OPERATIONAL" size="sm" showPulse={true} />
              <span>Meta API Active</span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-[11px] font-medium text-indigo-300">
              <Bot className="w-3 h-3 text-indigo-400" />
              <span>AI Router Online</span>
            </div>
          </div>
        </div>

        {/* Right: Search, Notifications, Role Switcher, Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
            <span className="hidden sm:inline font-medium">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-850 border border-slate-700 rounded text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Role Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentUser('ADMIN')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                currentUser === 'ADMIN'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setCurrentUser('STAFF')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                currentUser === 'STAFF'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staff
            </button>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 font-bold text-xs shadow-sm">
              {currentUser === 'ADMIN' ? 'KA' : 'RS'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-none">
                {currentUser === 'ADMIN' ? 'Kedar Admin' : 'Rahul Sharma'}
              </div>
              <div className="text-[10px] text-brand-400 font-mono mt-1">
                {currentUser === 'ADMIN' ? 'Full Control' : 'Sales & Support'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAll}
      />
    </>
  );
}
