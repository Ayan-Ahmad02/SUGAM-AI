import React from 'react';

export const AtmanirbharBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-subtle ${className}`}>
      {/* Decorative India silhouette */}
      <div className="flex items-center gap-3 z-10">
        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 44 48" fill="none" className="w-full h-full">
            {/* India Map stylized geometry */}
            <path
              d="M20 3 L23 7 L26 8 L27 12 L33 14 L34 19 L28 24 L27 30 L22 38 L20 45 L18 45 L15 36 L12 28 L8 22 L10 16 L14 12 L17 11 L18 6 Z"
              fill="#0E3A5A"
            />
            {/* Ashoka Chakra in center */}
            <circle cx="21" cy="23" r="3.5" stroke="#38BDF8" strokeWidth="1" fill="#0E3A5A" />
            <circle cx="21" cy="23" r="0.8" fill="#38BDF8" />
          </svg>
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-800 leading-tight">
            Atmanirbhar Bharat
          </h5>
          <p className="text-[11px] font-medium text-slate-600">
            Through Quality
          </p>
        </div>
      </div>

      {/* Tricolor corner wave swoop at bottom right */}
      <div className="absolute right-0 bottom-0 w-32 h-16 pointer-events-none">
        <svg viewBox="0 0 130 65" fill="none" className="w-full h-full">
          <path d="M0 65 C40 60, 75 35, 130 15 L130 25 C80 45, 50 65, 0 65 Z" fill="#FF9933" opacity="0.8" />
          <path d="M10 65 C50 62, 85 45, 130 25 L130 35 C90 52, 60 65, 10 65 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          <path d="M20 65 C60 65, 95 55, 130 35 L130 65 L20 65 Z" fill="#138808" opacity="0.75" />
        </svg>
      </div>
    </div>
  );
};
