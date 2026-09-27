import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoadingLaunchPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // 10-Second (10,000ms) precise loading interval
  useEffect(() => {
    const TOTAL_DURATION_MS = 10000;
    const INTERVAL_MS = 50;
    const step = (INTERVAL_MS / TOTAL_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 250);
          return 100;
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [navigate]);

  // Dynamic progress status text matching BIS context
  const getStatusText = () => {
    if (progress < 25) return 'Initializing BIS Compliance Intelligence...';
    if (progress < 55) return 'Syncing Indian Standards Database...';
    if (progress < 85) return 'Loading Verification & Quality Frameworks...';
    return 'Ready! Launching SUGAM-AI Workspace...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#082252] via-[#051737] to-[#030D1F] text-white flex flex-col justify-between items-center px-4 py-8 select-none relative overflow-hidden">
      {/* Subtle Atmospheric Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,132,255,0.18),transparent_70%)] pointer-events-none" />

      {/* Top Header / Skip Button */}
      <div className="w-full max-w-md flex justify-end z-20">
        <button
          type="button"
          onClick={() => navigate('/dashboard', { replace: true })}
          className="text-[11px] text-blue-300/60 hover:text-blue-200 transition-colors px-2.5 py-1 rounded-md hover:bg-white/5"
          title="Skip to Dashboard"
        >
          Skip →
        </button>
      </div>

      {/* Center Main Stage matching user reference screenshot */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full -mt-4 z-10">
        {/* App Icon Rounded Square Card */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#EAF2FD] rounded-[28px] shadow-2xl shadow-blue-500/25 flex items-center justify-center mb-5 transform transition-transform hover:scale-105">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-13 h-13 sm:w-15 sm:h-15 text-[#0080FF]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Smooth Rounded Shield */}
            <path
              d="M24 6 C32 6, 38.5 9, 39 12.5 C39 27, 31.5 37.5, 24 42 C16.5 37.5, 9 27, 9 12.5 C9.5 9, 16 6, 24 6 Z"
              stroke="#0080FF"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Bold Centered Checkmark */}
            <path
              d="M17 23 L22 28.5 L31 17.5"
              stroke="#0080FF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white flex items-center leading-none">
          <span>SUGAM</span>
          <span className="text-[#0088FF]">-AI</span>
        </h1>

        {/* Subtitle */}
        <div className="text-center mt-2.5 space-y-0.5">
          <p className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide">
            BIS Compliance &
          </p>
          <p className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide">
            Indian Standards Assistant
          </p>
        </div>

        {/* Illuminated Rashtrapati Bhavan Monument Illustration */}
        <div className="my-5 w-full flex justify-center items-center relative">
          <div className="absolute inset-0 bg-blue-500/15 filter blur-xl rounded-full pointer-events-none" />
          <img
            src="/splash-monument.png"
            alt="Central Vista Architectural Facade"
            className="w-full max-w-[270px] sm:max-w-[310px] h-auto object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(0,136,255,0.3)] transition-transform duration-700"
          />
        </div>

        {/* Tagline */}
        <div className="text-center space-y-0.5">
          <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
            Smarter Standards. Easier Compliance.
          </p>
          <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
            For a Safer Tomorrow.
          </p>
        </div>

        {/* 10-Second Loading Progress Bar */}
        <div className="mt-8 flex flex-col items-center w-full">
          {/* Bar track */}
          <div className="w-48 sm:w-56 h-1.5 bg-[#09204A] rounded-full overflow-hidden border border-blue-900/50 shadow-inner relative">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-[#0080FF] rounded-full shadow-[0_0_12px_rgba(56,189,248,0.85)] transition-all duration-75 ease-linear"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Status Text & Percentage */}
          <div className="mt-3 flex items-center justify-between w-48 sm:w-56 text-[10px] text-blue-300/70 font-medium">
            <span className="truncate pr-2">{getStatusText()}</span>
            <span className="font-mono font-bold text-sky-400 shrink-0">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-[10px] text-slate-500/80 z-10 text-center">
        <span>Bureau of Indian Standards Intelligence Platform</span>
      </div>
    </div>
  );
};
