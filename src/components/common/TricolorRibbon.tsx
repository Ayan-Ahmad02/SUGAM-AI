import React from 'react';

export const TricolorRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 160 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Saffron band */}
        <path
          d="M0 6 C40 16, 90 0, 160 12 L160 0 L0 0 Z"
          fill="#FF9933"
        />
        {/* White band */}
        <path
          d="M0 12 C40 22, 90 6, 160 18 L160 12 C90 0, 40 16, 0 6 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="0.5"
        />
        {/* Green band */}
        <path
          d="M0 18 C40 28, 90 12, 160 24 L160 18 C90 6, 40 22, 0 12 Z"
          fill="#138808"
        />
      </svg>
    </div>
  );
};
