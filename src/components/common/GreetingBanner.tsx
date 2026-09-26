import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const GreetingBanner: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Afnan';

  return (
    <div className="relative bg-gradient-to-r from-[#DDEBFC] via-[#EAF2FD] to-[#DCEAFB] border border-blue-200/80 rounded-2xl p-5 lg:px-7 lg:py-5.5 shadow-xs overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none min-h-[92px]">
      {/* Background Monument Silhouette & Flowing Indian Tricolor Wave */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[65%] pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 720 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover object-right"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="flagSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="60%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#FFAE42" />
            </linearGradient>
            <linearGradient id="flagGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B7506" />
              <stop offset="60%" stopColor="#138808" />
              <stop offset="100%" stopColor="#1EA711" />
            </linearGradient>
            <linearGradient id="monumentFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5B87BD" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#5B87BD" stopOpacity="0.30" />
            </linearGradient>
          </defs>

          {/* Central Vista / Rashtrapati Bhavan Skyline Silhouette */}
          <g fill="url(#monumentFade)" opacity="0.9">
            {/* Ground line */}
            <rect x="0" y="112" width="720" height="8" />

            {/* Central Grand Dome & Drum */}
            <path d="M375 75 C375 32, 435 32, 435 75 Z" />
            <rect x="368" y="75" width="74" height="37" />
            {/* Lantern on dome */}
            <rect x="401" y="18" width="8" height="14" />
            <path d="M399 18 L405 9 L411 18 Z" />

            {/* Left pavilion towers */}
            <path d="M336 78 C336 62, 356 62, 356 78 Z" />
            <rect x="334" y="78" width="24" height="34" />
            <line x1="346" y1="52" x2="346" y2="62" stroke="#5B87BD" strokeWidth="1.5" />

            <path d="M298 82 C298 70, 316 70, 316 82 Z" />
            <rect x="296" y="82" width="22" height="30" />

            <path d="M260 85 C260 75, 276 75, 276 85 Z" />
            <rect x="258" y="85" width="20" height="27" />

            {/* Right pavilion towers */}
            <path d="M454 78 C454 62, 474 62, 474 78 Z" />
            <rect x="452" y="78" width="24" height="34" />
            <line x1="464" y1="52" x2="464" y2="62" stroke="#5B87BD" strokeWidth="1.5" />

            <path d="M494 82 C494 70, 512 70, 512 82 Z" />
            <rect x="492" y="82" width="22" height="30" />

            <path d="M532 85 C532 75, 548 75, 548 85 Z" />
            <rect x="530" y="85" width="20" height="27" />

            {/* Extended Colonnade facades */}
            <rect x="200" y="94" width="58" height="18" />
            <rect x="550" y="94" width="170" height="18" />
          </g>

          {/* Flowing 3D Indian Flag Tricolor Ribbon */}
          {/* Saffron Band */}
          <path
            d="M390 100 C470 95, 530 35, 720 18 L720 -2 C530 15, 470 75, 390 80 Z"
            fill="url(#flagSaffron)"
          />
          {/* White Band */}
          <path
            d="M390 110 C470 105, 530 45, 720 30 L720 18 C530 35, 470 95, 390 100 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="0.5"
          />
          {/* Green Band */}
          <path
            d="M390 120 C470 115, 530 55, 720 42 L720 30 C530 45, 470 105, 390 110 Z"
            fill="url(#flagGreen)"
          />
        </svg>
      </div>

      {/* Left: Greeting Text */}
      <div className="z-10 max-w-sm">
        <h1 className="text-xl lg:text-2xl font-black text-[#0B2553] tracking-tight flex items-center gap-2">
          <span>Good Morning, {firstName}!</span>
          <span className="inline-block transform hover:rotate-12 transition-transform cursor-pointer">👋</span>
        </h1>
        <p className="text-xs lg:text-sm text-[#4A648C] mt-0.5 font-semibold">
          Let's make compliance simpler, together.
        </p>
      </div>

      {/* Center/Right: Quote Block */}
      <div className="z-10 mr-16 lg:mr-28 max-w-md hidden sm:block">
        <p className="text-xs font-serif italic text-[#1E3A8A] leading-snug">
          "Standards build trust, compliance builds a better tomorrow."
        </p>
        <p className="text-[10px] text-blue-700 font-bold mt-0.5">
          — Bureau of Indian Standards
        </p>
      </div>
    </div>
  );
};
