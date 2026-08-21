'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users as UsersIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { logSecurityEvent } from '@/lib/auth-audit';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  active: boolean;
  last_sign_in_at: string;
  created_at: string;
}

const initialUsersList: UserProfile[] = [
  {
    id: 'usr_admin_001',
    full_name: 'Sachin (Platform Admin)',
    email: 'admin@kedarenterprises.com',
    role: 'ADMIN',
    active: true,
    last_sign_in_at: 'Just now',
    created_at: '2024-01-15',
  },
  {
    id: 'usr_staff_002',
    full_name: 'Vikram Mehta',
    email: 'vikram@kedarenterprises.com',
    role: 'STAFF',
    active: true,
    last_sign_in_at: '10 mins ago',
    created_at: '2024-02-01',
  },
  {
    id: 'usr_staff_003',
    full_name: 'Pooja Nair',
    email: 'pooja@kedarenterprises.com',
    role: 'STAFF',
    active: true,
    last_sign_in_at: '1 hour ago',
    created_at: '2024-03-10',
  },
  {
    id: 'usr_staff_004',
    full_name: 'Rahul Sharma',
    email: 'rahul@kedarenterprises.com',
    role: 'STAFF',
    active: false,
    last_sign_in_at: '3 days ago',
    created_at: '2024-02-18',
  },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>(initialUsersList);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = (user: UserProfile) => {
    const nextActive = !user.active;
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, active: nextActive } : u))
    );

    const event = nextActive ? 'ACCOUNT_ACTIVATED' : 'ACCOUNT_DEACTIVATED';
    logSecurityEvent({
      event,
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      details: { previousState: user.active, newState: nextActive },
    });

    setActionAlert(
      `Account for ${user.full_name} (${user.email}) has been ${
        nextActive ? 'activated' : 'deactivated'
      }. Action recorded to immutable audit trail.`
    );
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleToggleRole = (user: UserProfile) => {
    const nextRole: 'ADMIN' | 'STAFF' = user.role === 'ADMIN' ? 'STAFF' : 'ADMIN';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
    );

    logSecurityEvent({
      event: 'ROLE_CHANGED',
      userId: user.id,
      userEmail: user.email,
      role: nextRole,
      details: { previousRole: user.role, newRole: nextRole },
    });

    setActionAlert(
      `Role for ${user.full_name} changed from ${user.role} to ${nextRole}. Action recorded in audit log.`
    );
    setTimeout(() => setActionAlert(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 font-mono">
            <UsersIcon className="w-4 h-4" />
            <span>Administrator Security Desk</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            User & Role Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage staff accounts, assign operational or administrator roles, and control active platform authorization.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>
      </div>

      {/* Action Notification Alert */}
      <AnimatePresence>
        {actionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionAlert}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400/80">
              Audit Event Dispatched
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
            <tr>
              <th className="p-4">Staff Member</th>
              <th className="p-4">Work Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4 text-right">Security Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-2.5 font-sans">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
                    {user.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <span>{user.full_name}</span>
                </td>
                <td className="p-4 text-slate-300">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {user.active ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                      <UserX className="w-3 h-3" /> DEACTIVATED
                    </span>
                  )}
                </td>
                <td className="p-4 font-sans text-slate-400 text-[11px]">{user.last_sign_in_at}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>Set {user.role === 'ADMIN' ? 'STAFF' : 'ADMIN'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all inline-flex items-center gap-1 ${
                      user.active
                        ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800/60'
                        : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-800/60'
                    }`}
                  >
                    {user.active ? (
                      <>
                        <UserX className="w-3 h-3" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3" />
                        <span>Reactivate</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
