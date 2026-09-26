import React from 'react';

export const BISEmblem: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* State Emblem of India (Ashoka Lion Capital) */}
      <div className="w-8 h-9 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 36 42" fill="none" className="w-full h-full text-slate-800">
          {/* Top Lions */}
          {/* Center Lion Head */}
          <path d="M18 4 C15 4, 13 6, 13 9 C13 11, 14 12, 14 14 C13 15, 12 17, 13 19 C14 21, 16 22, 18 22 C20 22, 22 21, 23 19 C24 17, 23 15, 22 14 C22 12, 23 11, 23 9 C23 6, 21 4, 18 4 Z" fill="#1E293B" />
          {/* Left Lion Head */}
          <path d="M9 7 C7 7, 6 9, 6 11 C6 13, 7 14, 8 16 C8 18, 9 20, 11 21 C12 18, 12 15, 11 12 C11 9, 10 7, 9 7 Z" fill="#334155" />
          {/* Right Lion Head */}
          <path d="M27 7 C29 7, 30 9, 30 11 C30 13, 29 14, 28 16 C28 18, 27 20, 25 21 C24 18, 24 15, 25 12 C25 9, 26 7, 27 7 Z" fill="#334155" />
          {/* Lion facial details */}
          <circle cx="16" cy="11" r="1" fill="#FFFFFF" />
          <circle cx="20" cy="11" r="1" fill="#FFFFFF" />
          <ellipse cx="18" cy="14" rx="1.5" ry="1" fill="#FFFFFF" />
          {/* Abacus platform */}
          <rect x="5" y="24" width="26" height="3" rx="0.5" fill="#1E293B" />
          {/* Central Ashoka Chakra on abacus */}
          <circle cx="18" cy="30" r="3" stroke="#1E293B" strokeWidth="1" fill="none" />
          <circle cx="18" cy="30" r="0.8" fill="#1E293B" />
          {/* Horse left & Bull right stylized */}
          <path d="M8 29 Q10 28, 12 30" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
          <path d="M24 30 Q26 28, 28 29" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
          {/* Base pedestal */}
          <path d="M7 34 L29 34 L27 37 L9 37 Z" fill="#1E293B" />
          <line x1="11" y1="39" x2="25" y2="39" stroke="#1E293B" strokeWidth="1" />
        </svg>
      </div>

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
