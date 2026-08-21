'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  Bell,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed: propCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ke_sidebar_collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('ke_sidebar_collapsed', String(next));
    if (onToggleCollapse) onToggleCollapse();
  };

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Inbox', href: '/inbox', icon: MessageSquare, badge: '2' },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Leads Pipeline', href: '/leads', icon: Briefcase },
    { name: 'Human Handoff', href: '/handoff', icon: UserCheck, badge: '1', badgeColor: 'amber' },
    { name: 'AI Automation', href: '/automation', icon: Bot },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Privacy & DPDP', href: '/privacy', icon: ShieldCheck, highlight: true },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'User Management', href: '/users', icon: Users, highlightRole: 'ADMIN' },
    { name: 'Security Center', href: '/security', icon: ShieldCheck },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
    { name: 'Errors & Health', href: '/errors', icon: Zap },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-40 shrink-0 backdrop-blur-xl select-none"
    >
      {/* Brand Header */}
      <div className={`p-4 border-b border-slate-800 flex items-center justify-between gap-3 h-16`}>
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-brand-500/25 shrink-0">
            KE
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="truncate"
            >
              <h1 className="font-bold text-white tracking-tight leading-none text-sm truncate">
                Kedar Enterprises
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  AI & WhatsApp OS
                </span>
              </div>
            </motion.div>
          )}
        </Link>

        <button
          onClick={handleToggle}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Platform Menu
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-slate-800/90 text-brand-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </div>

              {!collapsed && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full border ${
                        item.badgeColor === 'amber'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <Sparkles className="w-2.5 h-2.5" /> DPDP
                    </span>
                  )}
                </div>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* DPDP Protection Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">DPDP Act 2023</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              Consent Ledger & Audit Active
            </p>
          </div>
        ) : (
          <div className="flex justify-center p-1" title="DPDP Act 2023 Compliant">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        )}

        <Link
          href="/login"
          title={collapsed ? 'Switch User / Logout' : undefined}
          className={`mt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 py-1.5 rounded-lg hover:bg-slate-800 transition-colors font-medium ${
            collapsed ? 'px-1' : 'px-2'
          }`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Switch Role / Logout</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
