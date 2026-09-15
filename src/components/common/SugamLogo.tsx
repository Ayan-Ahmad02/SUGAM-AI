import React from 'react';
import { Link } from 'react-router-dom';

interface SugamLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SugamLogo: React.FC<SugamLogoProps> = ({
  className = '',
  variant = 'light',
  subtitle = 'BIS Compliance Intelligence Assistant',
  size = 'md'
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  };

  return (
    <Link to="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Shield Emblem */}
      <div className={`${iconSizes[size]} rounded-xl ${isLight ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'bg-sugam-navy border border-slate-200 shadow-sm'} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
        <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5">
          <path
            d="M18 5L28 9V17C28 23.5 23.8 29.5 18 31.5C12.2 29.5 8 23.5 8 17V9L18 5Z"
            fill={isLight ? '#1E40AF' : '#2563EB'}
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 18L17 21L23 14"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="18" r="1.5" fill="#F59E0B" />
        </svg>
      </div>

      <div className="flex flex-col text-left leading-tight">
        <span className={`${titleSizes[size]} font-extrabold tracking-tight ${isLight ? 'text-white' : 'text-slate-900'}`}>
          SUGAM<span className="text-blue-500">-AI</span>
        </span>
        {subtitle && (
          <span className={`${subSizes[size]} font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'} tracking-tight`}>
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
};
