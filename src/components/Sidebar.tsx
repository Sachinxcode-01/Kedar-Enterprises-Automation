'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Briefcase,
  Bot,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Inbox', href: '/inbox', icon: MessageSquare, badge: '2' },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Leads', href: '/leads', icon: Briefcase },
    { name: 'Automation', href: '/automation', icon: Bot },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Privacy & Data', href: '/privacy', icon: ShieldCheck, highlight: true },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-40">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-brand-500/20">
          KE
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight leading-none text-base">
            Kedar Enterprises
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">WhatsApp Engine</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-brand-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
              {item.highlight && !item.badge && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> DPDP
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* DPDP Protection Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DPDP Act 2023 Controls</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Consent Ledger & Erasure Engine Active
          </p>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-200 py-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch User / Logout</span>
        </Link>
      </div>
    </aside>
  );
}
