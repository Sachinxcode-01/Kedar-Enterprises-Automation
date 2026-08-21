'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  comparisonPeriod?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'indigo' | 'amber' | 'purple' | 'rose';
  microDetail?: string;
  index?: number;
}

export function MetricCard({
  title,
  value,
  numericValue,
  suffix = '',
  prefix = '',
  change,
  trend = 'up',
  comparisonPeriod = 'vs last week',
  icon: Icon,
  color = 'emerald',
  microDetail,
  index = 0,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(
    numericValue !== undefined ? 0 : value
  );

  useEffect(() => {
    if (!isInView || numericValue === undefined) return;

    let start = 0;
    const end = numericValue;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(
          Number.isInteger(end) ? Math.floor(start) : Number(start.toFixed(1))
        );
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const colorStyles = {
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      accentGlow: 'hover:border-emerald-500/30',
      textAccent: 'text-emerald-400',
    },
    blue: {
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      accentGlow: 'hover:border-blue-500/30',
      textAccent: 'text-blue-400',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      accentGlow: 'hover:border-indigo-500/30',
      textAccent: 'text-indigo-400',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      accentGlow: 'hover:border-amber-500/30',
      textAccent: 'text-amber-400',
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      accentGlow: 'hover:border-purple-500/30',
      textAccent: 'text-purple-400',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      accentGlow: 'hover:border-rose-500/30',
      textAccent: 'text-rose-400',
    },
  };

  const style = colorStyles[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel p-5 rounded-2xl glass-card-hover relative overflow-hidden group ${style.accentGlow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${style.iconBg} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
          {prefix}
          {numericValue !== undefined ? displayValue : value}
          {suffix}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {change && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              trend === 'up'
                ? 'text-emerald-400'
                : trend === 'down'
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{change}</span>
            <span className="text-slate-500 font-normal text-[11px] ml-0.5">
              {comparisonPeriod}
            </span>
          </div>
        )}
        {microDetail && (
          <span className="text-[11px] text-slate-400 font-mono ml-auto truncate">
            {microDetail}
          </span>
        )}
      </div>
    </motion.div>
  );
}
