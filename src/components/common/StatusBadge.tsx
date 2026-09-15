import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
  className = ''
}) => {
  const norm = (status || '').toUpperCase().trim();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = null;

  if (norm === 'VERIFIED' || norm === 'MANDATORY' || norm === 'COMPLETED' || norm === 'ACTIVE' || norm === 'HIGH MATCH' || norm === 'LOW') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
  } else if (norm === 'WARNING' || norm === 'NEEDS REVIEW' || norm === 'NEEDS_REVIEW' || norm === 'MEDIUM' || norm === 'UPDATE') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
  } else if (norm === 'SUSPICIOUS' || norm === 'HIGH' || norm === 'NEW' || norm === 'BLOCKED' || norm === 'MISSING') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
    icon = <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
  } else if (norm === 'VOLUNTARY' || norm === 'CURRENT' || norm === 'DRAFT' || norm === 'PENDING') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200';
    icon = <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
  } else {
    icon = <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  }

  const textSizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md border ${textSizes[size]} ${bg} ${className}`}>
      {showIcon && icon}
      <span>{status}</span>
    </span>
  );
};
