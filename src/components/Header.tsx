'use client';

import { useState } from 'react';
import { Bell, ShieldAlert, User, CheckCircle2, ChevronDown } from 'lucide-react';

export function Header() {
  const [currentUser, setCurrentUser] = useState<'ADMIN' | 'STAFF'>('ADMIN');

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Search or Quick Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-medium text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Meta API & Webhook Active</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>DPDP Mode: Active Compliance</span>
        </div>
      </div>

      {/* Action Items & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Role Toggle for Demo */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setCurrentUser('ADMIN')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentUser === 'ADMIN'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setCurrentUser('STAFF')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentUser === 'STAFF'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Staff View
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
            {currentUser === 'ADMIN' ? 'KA' : 'RS'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">
              {currentUser === 'ADMIN' ? 'Kedar Administrator' : 'Rahul Sharma'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {currentUser === 'ADMIN' ? 'Role: ADMIN' : 'Role: STAFF'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
