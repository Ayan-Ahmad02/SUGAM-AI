import React from 'react';

export const TricolorRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF7700" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#138808" />
            <stop offset="100%" stopColor="#0B6604" />
          </linearGradient>
        </defs>

        {/* Saffron band */}
        <path
          d="M0 45 C70 55, 140 10, 240 20 L240 0 L0 0 Z"
          fill="url(#saffronGrad)"
        />
        {/* White band */}
        <path
          d="M0 55 C70 65, 140 20, 240 32 L240 20 C140 10, 70 55, 0 45 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="0.5"
        />
        {/* Green band */}
        <path
          d="M0 65 C70 75, 140 30, 240 44 L240 32 C140 20, 70 65, 0 55 Z"
          fill="url(#greenGrad)"
        />
      </svg>
    </div>
  );
};
