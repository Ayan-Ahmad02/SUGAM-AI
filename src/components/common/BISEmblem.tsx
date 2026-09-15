import React from 'react';

export const BISEmblem: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false
}) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Official styled emblem / Standard stamp */}
      <div className="w-8 h-8 rounded-full border border-slate-300 bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-slate-700">
          <circle cx="16" cy="16" r="14" stroke="#1E3A8A" strokeWidth="1.5" />
          <path d="M16 4 L16 28" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="1 1" />
          <path d="M4 16 L28 16" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="1 1" />
          {/* Stylized ISI geometric emblem */}
          <rect x="10" y="10" width="12" height="12" rx="1" fill="#1E40AF" />
          <path d="M13 16 L15 19 L19 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {!compact && (
        <div className="flex flex-col text-left leading-none">
          <span className="text-[10px] font-bold text-slate-800 tracking-tight">
            Bureau of Indian Standards
          </span>
          <span className="text-[9px] font-medium text-slate-600 mt-0.5">
            भारतीय मानक ब्यूरो
          </span>
          <span className="text-[8px] text-blue-700 italic font-medium">
            Standards for a Better India
          </span>
        </div>
      )}
    </div>
  );
};
