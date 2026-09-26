import React from 'react';

interface MonumentsIllustrationProps {
  className?: string;
  theme?: 'dark' | 'light';
  showText?: boolean;
}

export const MonumentsIllustration: React.FC<MonumentsIllustrationProps> = ({
  className = '',
  theme = 'dark',
  showText = true
}) => {
  const isDark = theme === 'dark';
  const stroke = isDark ? '#38BDF8' : '#2563EB';
  const domeFill = isDark ? '#1D4ED8' : '#DBEAFE';
  const porchFill = isDark ? '#0F274A' : '#EFF6FF';
  const stepColor = isDark ? '#0284C7' : '#93C5FD';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[190px]"
      >
        {/* Base Steps and Plinth */}
        <line x1="8" y1="82" x2="192" y2="82" stroke={stroke} strokeWidth="1.5" />
        <line x1="20" y1="85" x2="180" y2="85" stroke={stepColor} strokeWidth="1.2" />
        <line x1="36" y1="88" x2="164" y2="88" stroke={stepColor} strokeWidth="1" />

        {/* Central Porch & Colonnade Background */}
        <rect x="68" y="52" width="64" height="30" fill={porchFill} stroke={stroke} strokeWidth="1.2" rx="1" />
        {/* Columns of Central Portico */}
        <line x1="75" y1="58" x2="75" y2="82" stroke={stroke} strokeWidth="1.6" />
        <line x1="85" y1="58" x2="85" y2="82" stroke={stroke} strokeWidth="1.6" />
        <line x1="95" y1="58" x2="95" y2="82" stroke={stroke} strokeWidth="1.6" />
        <line x1="105" y1="58" x2="105" y2="82" stroke={stroke} strokeWidth="1.6" />
        <line x1="115" y1="58" x2="115" y2="82" stroke={stroke} strokeWidth="1.6" />
        <line x1="125" y1="58" x2="125" y2="82" stroke={stroke} strokeWidth="1.6" />

        {/* Central Drum (under dome) */}
        <rect x="76" y="38" width="48" height="14" fill={porchFill} stroke={stroke} strokeWidth="1.2" />
        {/* Drum Colonnade Windows */}
        <line x1="84" y1="38" x2="84" y2="52" stroke={stroke} strokeWidth="1" />
        <line x1="92" y1="38" x2="92" y2="52" stroke={stroke} strokeWidth="1" />
        <line x1="100" y1="38" x2="100" y2="52" stroke={stroke} strokeWidth="1" />
        <line x1="108" y1="38" x2="108" y2="52" stroke={stroke} strokeWidth="1" />
        <line x1="116" y1="38" x2="116" y2="52" stroke={stroke} strokeWidth="1" />

        {/* Grand Central Dome */}
        <path
          d="M76 38 C76 16, 124 16, 124 38 Z"
          fill={domeFill}
          stroke={stroke}
          strokeWidth="1.6"
        />
        {/* Lantern & Finial on top of dome */}
        <rect x="97" y="10" width="6" height="6" fill={domeFill} stroke={stroke} strokeWidth="1" />
        <path d="M100 4 L100 10 M97 7 L103 7" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Left Pavilion Tower */}
        <rect x="46" y="44" width="18" height="38" fill={porchFill} stroke={stroke} strokeWidth="1.2" />
        <path d="M47 44 C47 34, 63 34, 63 44 Z" fill={domeFill} stroke={stroke} strokeWidth="1.2" />
        <line x1="55" y1="31" x2="55" y2="34" stroke={stroke} strokeWidth="1.2" />
        {/* Left pavilion window details */}
        <rect x="51" y="50" width="8" height="12" rx="4" stroke={stroke} strokeWidth="0.8" />
        <line x1="51" y1="70" x2="59" y2="70" stroke={stroke} strokeWidth="1" />

        {/* Right Pavilion Tower */}
        <rect x="136" y="44" width="18" height="38" fill={porchFill} stroke={stroke} strokeWidth="1.2" />
        <path d="M137 44 C137 34, 153 34, 153 44 Z" fill={domeFill} stroke={stroke} strokeWidth="1.2" />
        <line x1="145" y1="31" x2="145" y2="34" stroke={stroke} strokeWidth="1.2" />
        {/* Right pavilion window details */}
        <rect x="141" y="50" width="8" height="12" rx="4" stroke={stroke} strokeWidth="0.8" />
        <line x1="141" y1="70" x2="149" y2="70" stroke={stroke} strokeWidth="1" />

        {/* Left Extended Colonnade Wing */}
        <rect x="14" y="60" width="32" height="22" fill={porchFill} stroke={stroke} strokeWidth="1" />
        {/* Balustrade line */}
        <line x1="12" y1="58" x2="46" y2="58" stroke={stroke} strokeWidth="1.2" />
        <line x1="22" y1="60" x2="22" y2="82" stroke={stroke} strokeWidth="1" />
        <line x1="30" y1="60" x2="30" y2="82" stroke={stroke} strokeWidth="1" />
        <line x1="38" y1="60" x2="38" y2="82" stroke={stroke} strokeWidth="1" />

        {/* Right Extended Colonnade Wing */}
        <rect x="154" y="60" width="32" height="22" fill={porchFill} stroke={stroke} strokeWidth="1" />
        {/* Balustrade line */}
        <line x1="154" y1="58" x2="188" y2="58" stroke={stroke} strokeWidth="1.2" />
        <line x1="162" y1="60" x2="162" y2="82" stroke={stroke} strokeWidth="1" />
        <line x1="170" y1="60" x2="170" y2="82" stroke={stroke} strokeWidth="1" />
        <line x1="178" y1="60" x2="178" y2="82" stroke={stroke} strokeWidth="1" />
      </svg>

      {showText && (
        <div className="mt-2 text-center leading-tight">
          <p className={`text-xs font-medium tracking-wide ${isDark ? 'text-[#38BDF8]' : 'text-blue-700'}`}>
            Simpler Compliance
          </p>
          <p className={`text-xs font-bold tracking-wide mt-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-blue-900'}`}>
            Stronger India
          </p>
        </div>
      )}
    </div>
  );
};
