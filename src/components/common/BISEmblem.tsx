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
        className="h-10 w-auto object-contain shrink-0"
      />

      {!compact && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[11px] font-bold text-slate-800 tracking-tight">
            Bureau of Indian Standards
          </span>
          <span className="text-[10px] font-bold text-slate-700 tracking-tight">
            भारतीय मानक ब्यूरो
          </span>
          <span className="text-[9px] text-slate-500 font-medium">
            Standards for a Better India
          </span>
        </div>
      )}
    </div>
  );
};
