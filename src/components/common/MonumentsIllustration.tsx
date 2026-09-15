import React from 'react';

interface MonumentsIllustrationProps {
  className?: string;
  theme?: 'dark' | 'light';
  showText?: boolean;
}

export const MonumentsIllustration: React.FC<MonumentsIllustrationProps> = ({
  className = '',
  theme = 'dark',
  showText = false
}) => {
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#38BDF8' : '#0284C7';
  const fillColor = isDark ? '#0F172A' : '#F0F9FF';
  const accentColor = isDark ? '#38BDF8' : '#0369A1';
  const flagSaffron = '#FF9933';
  const flagGreen = '#138808';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[220px]"
      >
        {/* Base steps */}
        <line x1="10" y1="84" x2="230" y2="84" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="25" y1="81" x2="215" y2="81" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="40" y1="78" x2="200" y2="78" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.9" />

        {/* Central Rashtrapati Bhavan / Parliament Dome */}
        <path
          d="M95 55 C95 38, 145 38, 145 55 Z"
          fill={fillColor}
          stroke={accentColor}
          strokeWidth="1.6"
        />
        {/* Main Central Cupola / Finial with tricolor dot */}
        <path d="M120 22 L120 38" stroke={accentColor} strokeWidth="1.8" />
        <circle cx="120" cy="21" r="2.5" fill={flagSaffron} />
        <circle cx="120" cy="26" r="1.5" fill="#FFFFFF" />
        <circle cx="120" cy="30" r="2.5" fill={flagGreen} />

        {/* Central Drum & Columns */}
        <rect x="92" y="55" width="56" height="23" fill={fillColor} stroke={accentColor} strokeWidth="1.4" />
        {/* Columns */}
        <line x1="99" y1="55" x2="99" y2="78" stroke={strokeColor} strokeWidth="1.2" />
        <line x1="107" y1="55" x2="107" y2="78" stroke={strokeColor} strokeWidth="1.2" />
        <line x1="116" y1="55" x2="116" y2="78" stroke={strokeColor} strokeWidth="1.2" />
        <line x1="124" y1="55" x2="124" y2="78" stroke={strokeColor} strokeWidth="1.2" />
        <line x1="133" y1="55" x2="133" y2="78" stroke={strokeColor} strokeWidth="1.2" />
        <line x1="141" y1="55" x2="141" y2="78" stroke={strokeColor} strokeWidth="1.2" />

        {/* Left Pavilion / Dome */}
        <path d="M50 62 C50 50, 78 50, 78 62 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.3" />
        <line x1="64" y1="44" x2="64" y2="50" stroke={strokeColor} strokeWidth="1.3" />
        <circle cx="64" cy="43" r="1.5" fill={flagSaffron} />
        <rect x="48" y="62" width="32" height="16" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
        <line x1="55" y1="62" x2="55" y2="78" stroke={strokeColor} strokeWidth="1" />
        <line x1="64" y1="62" x2="64" y2="78" stroke={strokeColor} strokeWidth="1" />
        <line x1="73" y1="62" x2="73" y2="78" stroke={strokeColor} strokeWidth="1" />

        {/* Right Pavilion / Dome */}
        <path d="M162 62 C162 50, 190 50, 190 62 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.3" />
        <line x1="176" y1="44" x2="176" y2="50" stroke={strokeColor} strokeWidth="1.3" />
        <circle cx="176" cy="43" r="1.5" fill={flagGreen} />
        <rect x="160" y="62" width="32" height="16" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
        <line x1="167" y1="62" x2="167" y2="78" stroke={strokeColor} strokeWidth="1" />
        <line x1="176" y1="62" x2="176" y2="78" stroke={strokeColor} strokeWidth="1" />
        <line x1="185" y1="62" x2="185" y2="78" stroke={strokeColor} strokeWidth="1" />

        {/* Outer colonnade walls */}
        <path d="M22 70 L48 70 L48 78 L22 78 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1" opacity="0.8" />
        <line x1="28" y1="70" x2="28" y2="78" stroke={strokeColor} strokeWidth="1" />
        <line x1="38" y1="70" x2="38" y2="78" stroke={strokeColor} strokeWidth="1" />

        <path d="M192 70 L218 70 L218 78 L192 78 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1" opacity="0.8" />
        <line x1="202" y1="70" x2="202" y2="78" stroke={strokeColor} strokeWidth="1" />
        <line x1="212" y1="70" x2="212" y2="78" stroke={strokeColor} strokeWidth="1" />
      </svg>

      {showText && (
        <div className="mt-2 text-center">
          <p className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-cyan-200/90' : 'text-slate-700'}`}>
            Simpler Compliance
          </p>
          <p className={`text-[10px] font-semibold tracking-wider ${isDark ? 'text-cyan-400' : 'text-blue-800'}`}>
            Stronger India
          </p>
        </div>
      )}
    </div>
  );
};
