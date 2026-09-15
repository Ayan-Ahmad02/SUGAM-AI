import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Scan,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Sparkles,
  Info,
  Edit2
} from 'lucide-react';
import { apiRunOcr } from '../services/api';

export const OcrVerificationPage: React.FC = () => {
  const navigate = useNavigate();

  const [isNumber, setIsNumber] = useState('IS 302-2-25');
  const [licenceNumber, setLicenceNumber] = useState('R-71020123');
  const [productName, setProductName] = useState('Water Bottle');
  const [manufacturer, setManufacturer] = useState('AquaSafe Steelware Pvt. Ltd.');
  const [confidence, setConfidence] = useState(96);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setTimeout(() => {
        setIsNumber('IS 17526:2021');
        setLicenceNumber('CM/L-71020123');
        setProductName('Stainless Steel Water Bottle');
        setManufacturer('AquaSafe Steelware Pvt. Ltd.');
        setConfidence(98);
        setLoading(false);
      }, 700);
    }
  };

  const handleVerify = () => {
    navigate('/verification', {
      state: {
        prefilledLicence: licenceNumber,
        prefilledIsCode: isNumber
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 select-none">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              OCR Label & Mark Scanner
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Optical Character Recognition parses ISI mark stamps, CM/L licence numbers, and packaging details
            </p>
          </div>
        </div>
      </div>

      {/* Simulated / Loaded Image Preview Card (Matching Mobile Screen 11) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900/5 p-4 flex flex-col items-center justify-center min-h-[160px]">
          {/* Simulated BIS mark graphic box */}
          <div className="border-2 border-slate-800 bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
            {/* ISI Emblem */}
            <div className="border-2 border-slate-900 p-2 text-center rounded font-mono">
              <span className="text-[10px] font-bold block leading-none">IS 302-2-25</span>
              <span className="text-xl font-black block my-1">IST</span>
              <span className="text-[9px] font-bold block leading-none">CM/L-71020123</span>
            </div>

            {/* QR Matrix block */}
            <div className="w-16 h-16 bg-slate-900 p-1 flex items-center justify-center rounded">
              <div className="w-full h-full bg-white grid grid-cols-3 gap-0.5 p-1">
                <div className="bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="bg-white" />
                <div className="bg-white" />
                <div className="bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="bg-white" />
                <div className="bg-slate-900" />
              </div>
            </div>
          </div>

          <label className="mt-3 cursor-pointer py-1 px-3 bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold rounded-lg shadow-sm border border-slate-300 transition-colors flex items-center gap-1.5">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Change Image</span>
          </label>
        </div>

        {/* Extracted Information Section (Editable inputs) */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Extracted Credentials
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confidence: {confidence}%
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detected IS Standard Number
              </label>
              <input
                type="text"
                value={isNumber}
                onChange={(e) => setIsNumber(e.target.value)}
                className="w-full p-2.5 text-xs font-mono font-bold text-blue-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detected Licence / Registration Number
              </label>
              <input
                type="text"
                value={licenceNumber}
                onChange={(e) => setLicenceNumber(e.target.value)}
                className="w-full p-2.5 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detected Product Entity
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Demo Mode Notice Box */}
        <div className="mt-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Demo Mode Notice</strong>
            <span>This is a prototype OCR feature. Not an official BIS verification. Confirm findings against official gazette or ManakOnline.</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleVerify}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <span>Verify in BIS Database</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
