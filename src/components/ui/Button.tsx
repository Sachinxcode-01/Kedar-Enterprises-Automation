'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all rounded-xl focus:outline-none select-none disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-3 text-sm gap-2.5 rounded-2xl',
  };

  const variantStyles = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 active:scale-[0.98]',
    destructive: 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 shadow-sm active:scale-[0.98]',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    outline: 'border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white bg-transparent',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
