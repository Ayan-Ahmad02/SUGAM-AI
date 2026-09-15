import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiCheckClaim } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ClaimCheckerPage: React.FC = () => {
  const { t } = useLanguage();

  const [inputText, setInputText] = useState(
    'Stainless Steel Vacuum Insulated Water Bottle 750ml. BIS Certified ISI mark conforming to IS 17526:2021. CM/L-71020123. Made in India.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (overrideText?: string) => {
    const textToAnalyze = overrideText || inputText;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    try {
      const data = await apiCheckClaim({ listingText: textToAnalyze });
      setResult(data);
    } catch (err) {
      console.error('Claim check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('claimChecker')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste e-commerce listings, marketing claims, or packaging text to identify unsubstantiated or deceptive BIS claims
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Product Listing & Packaging Copy
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const sample = 'Stainless Steel Bottle - BIS Certified ISI mark conforming to IS 17526:2021 with CM/L-71020123';
                setInputText(sample);
                handleAnalyze(sample);
              }}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100"
            >
              Verified Sample
            </button>
            <button
              type="button"
              onClick={() => {
                const sample = 'High Grade Insulated Flask - 100% ISI Certified and BIS Approved for food safety';
                setInputText(sample);
                handleAnalyze(sample);
              }}
              className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 hover:bg-rose-100"
            >
              Deceptive Sample
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste product description or e-commerce listing text here..."
          className="w-full p-3 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all placeholder:text-slate-400"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={loading || !inputText.trim()}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Auditing Claims...' : 'Audit Compliance Claims'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Claim Verification Assessment
              </span>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={result.overallStatus} size="sm" />
                <span className="text-xs font-bold text-slate-700">
                  Risk Rating: <span className="font-extrabold">{result.riskLevel}</span>
                </span>
              </div>
            </div>

            {result.detectedLicence && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Detected Licence</span>
                <p className="text-xs font-mono font-extrabold text-blue-700">{result.detectedLicence}</p>
              </div>
            )}
          </div>

          {/* Breakdown of Extracted Claims */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Claim Audit Breakdown
            </h4>

            {result.claims?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{item.claim}</h5>
                  <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={item.status} size="xs" />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1.5 text-xs text-blue-900">
            <h4 className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-700" />
              Compliance Advice & Consumer Safeguards
            </h4>
            <ul className="space-y-1 text-slate-700 mt-2">
              {result.recommendations?.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
