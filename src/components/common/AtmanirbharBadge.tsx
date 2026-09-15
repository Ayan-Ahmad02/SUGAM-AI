import React from 'react';

export const AtmanirbharBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/70 to-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shadow-subtle ${className}`}>
      {/* Decorative India silhouette */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-sm">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            {/* India Map stylized geometry */}
            <path
              d="M18 6 L22 8 L24 12 L28 14 L30 18 L26 22 L24 28 L20 34 L16 32 L14 26 L10 20 L12 14 L16 10 Z"
              fill="#0284C7"
              opacity="0.8"
            />
            {/* Ashoka Chakra in center */}
            <circle cx="20" cy="20" r="3.5" stroke="#000080" strokeWidth="0.8" fill="none" />
            <circle cx="20" cy="20" r="0.8" fill="#000080" />
          </svg>
        </div>
        <div>
          <h5 className="text-[12px] font-bold text-slate-800 leading-tight">
            Atmanirbhar Bharat
          </h5>
          <p className="text-[11px] text-slate-500">
            Through Quality & Standards
          </p>
        </div>
      </div>

      {/* Tricolor corner wave */}
      <div className="absolute right-0 bottom-0 top-0 w-20 pointer-events-none opacity-80">
        <svg viewBox="0 0 80 48" fill="none" className="w-full h-full">
          <path d="M10 0 C40 20, 50 10, 80 30 L80 48 L0 48 Z" fill="#138808" opacity="0.15" />
          <path d="M30 0 C55 15, 65 5, 80 20 L80 30 L10 0 Z" fill="#FF9933" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
};
