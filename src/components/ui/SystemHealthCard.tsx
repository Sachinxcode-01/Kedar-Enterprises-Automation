'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SystemHealthItem } from '@/lib/types';
import { StatusIndicator } from './StatusIndicator';
import { Zap, Activity, Clock } from 'lucide-react';

interface SystemHealthCardProps {
  item: SystemHealthItem;
  index?: number;
}

export function SystemHealthCard({ item, index = 0 }: SystemHealthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="glass-panel p-4 rounded-xl glass-card-hover flex flex-col justify-between space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">{item.name}</h4>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.service}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[10px]">
          <StatusIndicator status={item.status} size="sm" showPulse={item.status === 'OPERATIONAL'} />
          <span
            className={`font-semibold ${
              item.status === 'OPERATIONAL'
                ? 'text-emerald-400'
                : item.status === 'DEGRADED'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {item.status}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-snug">{item.description}</p>

      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-slate-200 font-semibold">{item.latency_ms}ms</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-300">{item.uptime} uptime</span>
        </div>
      </div>
    </motion.div>
  );
}
