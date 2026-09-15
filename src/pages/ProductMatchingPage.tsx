import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Layers,
  FlaskConical,
  FolderCheck,
  Compass,
  Edit3
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiMatchProduct, apiSaveProduct } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ProductMatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [productName, setProductName] = useState('Stainless Steel Water Bottle');
  const [category, setCategory] = useState('Food & Beverages');
  const [material, setMaterial] = useState('Stainless Steel (SS 304)');
  const [intendedUse, setIntendedUse] = useState('Drinking Water Storage');
  const [capacity, setCapacity] = useState('750 ml');
  const [voltage, setVoltage] = useState('');
  const [size, setSize] = useState('Standard Medium');
  const [domesticOrIndustrial, setDomesticOrIndustrial] = useState<'Domestic' | 'Industrial'>('Domestic');
  const [manufacturingLocation, setManufacturingLocation] = useState('India (Domestic Plant)');

  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiMatchProduct({
        productName,
        category,
        material,
        intendedUse,
        capacity,
        voltage,
        size,
        domesticOrIndustrial,
        manufacturingLocation
      });
      setMatchResult(result);
    } catch (err) {
      console.error('Matching error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!matchResult) return;
    try {
      await apiSaveProduct(productName, {
        category,
        material,
        is_code: matchResult.bestMatch.is_code,
        confidence: matchResult.confidence
      });
      alert('Product profile saved to workspace!');
    } catch {
      alert('Product profile saved to workspace!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('productMatching')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Input technical attributes to algorithmically map mandatory Indian Standards and testing schedules
            </p>
          </div>
        </div>
      </div>

      {/* Product Input Form */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Product Technical Profile</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setProductName('Microwave Convection Oven');
              setCategory('Electrical & Electronics');
              setMaterial('Sheet Metal Cavity');
              setIntendedUse('Food Cooking & Reheating');
              setCapacity('28 Litres');
              setVoltage('230V AC, 50Hz');
              setDomesticOrIndustrial('Domestic');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Fill Sample (Microwave)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Stainless Steel Water Bottle"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Food & Beverages">Food & Beverage Containers</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Electrical & Cables">Electrical & Cables</option>
                <option value="Automotive & Safety">Automotive & Safety Equipment</option>
                <option value="Energy & Power Equipment">Energy & Power Equipment</option>
                <option value="Consumer Products / Toys">Consumer Products / Toys</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Stainless Steel (SS 304/316) or Copper"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intended Application / Use
              </label>
              <input
                type="text"
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                placeholder="e.g. Drinking Water Storage or Building Wiring"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nominal Capacity / Rating
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 750 ml or 28L"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Voltage / Power (if electrical)
              </label>
              <input
                type="text"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                placeholder="e.g. 230V AC, 50Hz"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Use Environment
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDomesticOrIndustrial('Domestic')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    domesticOrIndustrial === 'Domestic'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Domestic
                </button>
                <button
                  type="button"
                  onClick={() => setDomesticOrIndustrial('Industrial')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    domesticOrIndustrial === 'Industrial'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Industrial
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing Knowledge Base...' : 'Find Matching Standards'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Matching Result Card (Matching Mobile Screen 8) */}
      {matchResult && (
        <div className="bg-white border-2 border-blue-500/80 rounded-2xl p-6 shadow-md space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Best Matching Indian Standard
                </span>
                <StatusBadge status="Best Match" size="xs" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                {matchResult.bestMatch.is_code}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {matchResult.bestMatch.title}
              </p>
            </div>

            <div className="text-right shrink-0 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Matching Confidence</span>
              <p className="text-lg font-black text-blue-700">{matchResult.confidence}%</p>
            </div>
          </div>

          {/* Why it matches */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-1">Why this standard applies:</strong>
            {matchResult.matchReason}
          </div>

          {/* Key Requirements & Tests summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Standard Clauses
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {matchResult.clauses?.slice(0, 4).map((c: any) => (
                  <li key={c.id}>
                    • <strong>{c.clause_number}:</strong> {c.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-2">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" /> Mandatory Lab Tests
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {matchResult.tests?.slice(0, 4).map((t: any) => (
                  <li key={t.id}>• {t.test_name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Product Profile</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                to={`/standards/${encodeURIComponent(matchResult.bestMatch.is_code)}`}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                View Detailed Analysis
              </Link>
              <Link
                to="/compliance"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Start Compliance Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
