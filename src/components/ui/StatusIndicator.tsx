'use client';

import React from 'react';

interface StatusIndicatorProps {
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'ACTIVE' | 'PENDING' | 'RESOLVED' | 'CRITICAL' | 'HIGH';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export function StatusIndicator({
  status,
  label,
  size = 'md',
  showPulse = true,
}: StatusIndicatorProps) {
  let colorClass = 'bg-emerald-500';
  let pingClass = 'bg-emerald-400';
  let textClass = 'text-emerald-400';
  let badgeBorder = 'border-emerald-500/30 bg-emerald-950/40';

  if (status === 'DEGRADED' || status === 'PENDING' || status === 'HIGH') {
    colorClass = 'bg-amber-500';
    pingClass = 'bg-amber-400';
    textClass = 'text-amber-400';
    badgeBorder = 'border-amber-500/30 bg-amber-950/40';
  } else if (status === 'OFFLINE' || status === 'CRITICAL') {
    colorClass = 'bg-rose-500';
    pingClass = 'bg-rose-400';
    textClass = 'text-rose-400';
    badgeBorder = 'border-rose-500/30 bg-rose-950/40';
  }

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex items-center justify-center">
        {showPulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingClass}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${colorClass}`} />
      </span>
      {label && <span className={`text-xs font-medium ${textClass}`}>{label}</span>}
    </div>
  );
}
