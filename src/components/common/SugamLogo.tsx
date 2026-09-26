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
  variant = 'dark',
  subtitle = 'BIS Compliance Intelligence Assistant',
  size = 'md'
}) => {
  const isLight = variant === 'light';

  return (
    <Link to="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Shield Emblem */}
      <div className="w-10 h-10 rounded-xl border border-blue-200 bg-white flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
          {/* Outer shield */}
          <path
            d="M16 3L26 7V15C26 21.5 21.7 27.2 16 29C10.3 27.2 6 21.5 6 15V7L16 3Z"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Inner shield */}
          <path
            d="M16 7L22 10V15.5C22 19.5 19.5 23.2 16 24.5C12.5 23.2 10 19.5 10 15.5V10L16 7Z"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="#EFF6FF"
          />
          {/* Center check */}
          <path
            d="M13.5 15.5L15.5 17.5L19 13"
            stroke="#2563EB"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col text-left leading-tight">
        <span className={`text-base lg:text-lg font-black tracking-tight ${isLight ? 'text-white' : 'text-[#0E2046]'}`}>
          SUGAM-AI
        </span>
        {subtitle && (
          <span className={`text-[10px] font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'} tracking-tight`}>
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
};
