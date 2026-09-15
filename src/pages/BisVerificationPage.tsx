import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  Search,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Camera,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiVerifyMark, apiVerifyQr } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const BisVerificationPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const [licenceInput, setLicenceInput] = useState('CM/L-71020123');
  const [isCodeInput, setIsCodeInput] = useState('IS 17526:2021');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Check if prefilled from OCR page or navigation
    const state = location.state as any;
    if (state?.prefilledLicence) {
      setLicenceInput(state.prefilledLicence);
      if (state.prefilledIsCode) setIsCodeInput(state.prefilledIsCode);
      handleVerify(state.prefilledLicence, state.prefilledIsCode);
    } else {
      // Run initial check on default
      handleVerify('CM/L-71020123', 'IS 17526:2021');
    }
  }, [location.state]);

  const handleVerify = async (licence?: string, code?: string) => {
    setLoading(true);
    try {
      const res = await apiVerifyMark({
        licenceNumber: licence || licenceInput,
        isCode: code || isCodeInput
      });
      setResult(res);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setTimeout(() => {
      // Simulate QR decoder extracting payload
      setLicenceInput('CM/L-71020123');
      setIsCodeInput('IS 17526:2021');
      handleVerify('CM/L-71020123', 'IS 17526:2021');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('bisMarkVerification')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify ISI mark authenticity and registration validity via CM/L licence number or QR code scan
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Verification Query
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Licence Number (CM/L or R-No)
            </label>
            <input
              type="text"
              value={licenceInput}
              onChange={(e) => setLicenceInput(e.target.value)}
              placeholder="e.g. CM/L-71020123 or R-71020123"
              className="w-full p-2.5 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Indian Standard (IS Code)
            </label>
            <input
              type="text"
              value={isCodeInput}
              onChange={(e) => setIsCodeInput(e.target.value)}
              placeholder="e.g. IS 17526:2021 or IS 302-2-25"
              className="w-full p-2.5 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Quick test buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-semibold">Try sample records:</span>
          <button
            type="button"
            onClick={() => {
              setLicenceInput('CM/L-71020123');
              setIsCodeInput('IS 17526:2021');
              handleVerify('CM/L-71020123', 'IS 17526:2021');
            }}
            className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200"
          >
            Verified Bottle (CM/L-71020123)
          </button>
          <button
            type="button"
            onClick={() => {
              setLicenceInput('CM/L-55443322');
              setIsCodeInput('IS 4151:2015');
              handleVerify('CM/L-55443322', 'IS 4151:2015');
            }}
            className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200"
          >
            Warning Helmet (CM/L-55443322)
          </button>
          <button
            type="button"
            onClick={() => {
              setLicenceInput('CM/L-99999999');
              setIsCodeInput('IS 17526:2021');
              handleVerify('CM/L-99999999', 'IS 17526:2021');
            }}
            className="text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200"
          >
            Suspicious (CM/L-99999999)
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto border border-slate-200">
              <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Scan QR / Upload Mark</span>
            </label>
            <Link
              to="/verification/ocr"
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto border border-slate-200"
            >
              <span>OCR Scanner</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={loading}
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
          >
            <span>{loading ? 'Verifying...' : 'Verify Mark'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Card (Matching Mobile Screen 12) */}
      {result && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Verification Result</h3>
            <span className="text-[11px] text-slate-400">Status ID: {Date.now().toString().slice(-6)}</span>
          </div>

          {/* Large Status Card */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              result.status === 'VERIFIED'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : result.status === 'WARNING'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${
                result.status === 'VERIFIED'
                  ? 'bg-emerald-600'
                  : result.status === 'WARNING'
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
            >
              {result.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : result.status === 'WARNING' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight">{result.status}</span>
                <span className="text-xs font-bold uppercase bg-white/80 px-2 py-0.5 rounded border border-black/10">
                  Risk: {result.riskLevel}
                </span>
              </div>
              <p className="text-xs font-mono font-bold mt-1">
                Licence No: {result.licenceNumber} | {result.isCode}
              </p>
            </div>
          </div>

          {/* Product & Manufacturer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Product Registered</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{result.productName}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Certified Manufacturer</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{result.manufacturer}</p>
            </div>
          </div>

          {result.factoryLocation && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Manufacturing Facility</span>
              <p className="text-xs text-slate-700 mt-0.5">{result.factoryLocation}</p>
              {result.validTill && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Licence Validity: Valid till {result.validTill}
                </p>
              )}
            </div>
          )}

          {/* Evidence Checklist */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Verification Evidence
            </span>
            <div className="space-y-1 text-xs">
              {result.evidence?.map((ev: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Alert */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-800 italic leading-snug">
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
