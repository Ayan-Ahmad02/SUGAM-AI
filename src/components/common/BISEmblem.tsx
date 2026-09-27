import React from 'react';

export const BISEmblem: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Ashoka Stambh (State Emblem of India) */}
      <img
        src="/ashok-stambh.svg"
        alt="Ashoka Stambh - State Emblem of India"
        className="h-9 w-auto object-contain shrink-0"
      />

      {!compact && (
        <div className="flex flex-col text-left leading-tight shrink-0">
          <span className="text-[11px] font-bold text-slate-900 tracking-tight whitespace-nowrap">
            Bureau of Indian Standards
          </span>
          <span className="text-[10px] font-bold text-slate-800 tracking-tight whitespace-nowrap font-serif">
            मानकः पथप्रदर्शकः
          </span>
          <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap">
            Standards for a Better India
          </span>
        </div>
      )}
    </div>
  );
};
