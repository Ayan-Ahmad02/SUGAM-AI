import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MonumentsIllustration } from '../components/common/MonumentsIllustration';
import { TricolorRibbon } from '../components/common/TricolorRibbon';

export const SplashPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* Tricolor corner ribbon */}
      <TricolorRibbon className="absolute top-0 right-0 w-48 h-3" />

      {/* Top Brand Logo */}
      <div className="pt-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 border border-blue-400/30 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          SUGAM<span className="text-blue-500">-AI</span>
        </h1>
        <p className="text-sm font-semibold text-slate-300 mt-1">
          National Standards & BIS Compliance Assistant
        </p>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
          <span>Find standards</span> • <span>Check compliance</span> • <span>Build a safer tomorrow</span>
        </p>
      </div>

      {/* Center Monument Artwork */}
      <div className="my-8 flex flex-col items-center">
        <MonumentsIllustration theme="dark" showText={false} className="scale-125 my-4" />
        <div className="max-w-xs text-center mt-6">
          <p className="text-xs text-slate-300 leading-relaxed">
            Empowering manufacturers, MSMEs, consultants, laboratories and consumers with trusted information.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Official Quality Standards Framework</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full max-w-sm mx-auto space-y-3 pb-6">
        <Link
          to="/dashboard"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/signin"
          className="w-full py-3.5 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium rounded-xl text-center text-sm transition-all block"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
