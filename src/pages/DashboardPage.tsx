import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  FlaskConical,
  FolderCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  QrCode,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Clock,
  BookmarkCheck,
  Info
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { AtmanirbharBadge } from '../components/common/AtmanirbharBadge';
import { MonumentsIllustration } from '../components/common/MonumentsIllustration';
import { apiGetDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Find standard form state
  const [activeTab, setActiveTab] = useState<'describe' | 'code' | 'upload'>('describe');
  const [productQuery, setProductQuery] = useState('');
  const [isCodeInput, setIsCodeInput] = useState('');

  // Selected Clause Modal
  const [selectedClause, setSelectedClause] = useState<any>(null);
  const [whyModalOpen, setWhyModalOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiGetDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStandards = () => {
    if (activeTab === 'code' && isCodeInput.trim()) {
      navigate(`/standards/${encodeURIComponent(isCodeInput.trim())}`);
    } else if (productQuery.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(productQuery.trim())}`);
    } else {
      navigate(`/assistant?q=Stainless steel water bottle, 750 ml, insulated`);
    }
  };

  const handleQuickTagClick = (tagText: string) => {
    setProductQuery(tagText);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      navigate('/verification', { state: { preloadedImageName: file.name } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 select-none">
      {/* 1. Welcome Greeting Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Tricolor corner wash */}
        <div className="absolute top-0 right-0 w-48 h-full pointer-events-none opacity-40">
          <svg viewBox="0 0 160 80" fill="none" className="w-full h-full">
            <path d="M40 0 C90 20, 110 5, 160 30 L160 0 Z" fill="#FF9933" opacity="0.4" />
            <path d="M10 0 C70 30, 100 15, 160 60 L160 30 C110 5, 90 20, 40 0 Z" fill="#FFFFFF" opacity="0.6" />
            <path d="M0 20 C60 50, 90 30, 160 80 L160 60 C100 15, 70 30, 10 0 Z" fill="#138808" opacity="0.3" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('goodMorning')}, {user?.name?.split(' ')[0] || 'Afnan'}!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 font-medium">
            {t('letsMakeComplianceSimpler')}
          </p>
        </div>

        {/* Bureau of Indian Standards Quote Widget */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 max-w-md z-10">
          <div className="w-12 h-10 shrink-0 opacity-80">
            <MonumentsIllustration theme="light" showText={false} className="scale-75" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-semibold text-slate-700 italic leading-snug">
              "{t('standardsBuildTrust')}"
            </p>
            <p className="text-[10px] text-blue-700 font-bold mt-0.5">
              — Bureau of Indian Standards
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Applicable Standards */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-subtle flex flex-col justify-between hover:border-blue-300 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <Link to="/standards" className="text-[11px] font-semibold text-blue-600 group-hover:underline flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 leading-none">
              {dashboardData?.metrics?.applicableStandards || 12}
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1.5">{t('applicableStandards')}</p>
          </div>
        </div>

        {/* Metric 2: Required Tests */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-subtle flex flex-col justify-between hover:border-emerald-300 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FlaskConical className="w-5 h-5" />
            </div>
            <Link to="/compliance" className="text-[11px] font-semibold text-emerald-600 group-hover:underline flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 leading-none">
              {dashboardData?.metrics?.requiredTests || 5}
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1.5">{t('requiredTests')}</p>
          </div>
        </div>

        {/* Metric 3: Documents Required */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-subtle flex flex-col justify-between hover:border-purple-300 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <FolderCheck className="w-5 h-5" />
            </div>
            <Link to="/documents" className="text-[11px] font-semibold text-purple-600 group-hover:underline flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 leading-none">
              {dashboardData?.metrics?.documentsRequired || 8}
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1.5">{t('documentsRequired')}</p>
          </div>
        </div>

        {/* Metric 4: BIS Labs Nearby */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-subtle flex flex-col justify-between hover:border-amber-300 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <MapPin className="w-5 h-5" />
            </div>
            <Link to="/laboratories" className="text-[11px] font-semibold text-amber-600 group-hover:underline flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 leading-none">
              {dashboardData?.metrics?.labsNearby || 3}
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1.5">{t('labsNearby')}</p>
          </div>
        </div>
      </div>

      {/* 3. Two Interactive Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Find Your Applicable Standard (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t('findApplicableStandard')}</h3>
                  <p className="text-[11px] text-slate-500">
                    Describe your product and get matched with relevant BIS standards using AI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProductQuery('Stainless steel water bottle, 750 ml, insulated, for drinking water')}
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
              >
                Try an example <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-2 mt-4 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('describe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'describe' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Describe Product
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'code' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Search by IS Code
              </button>
              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Upload Document
              </button>
            </div>

            {/* Input area */}
            <div className="mt-3">
              {activeTab === 'describe' ? (
                <textarea
                  rows={2}
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="e.g., Stainless steel water bottle, 750 ml, insulated, for drinking water..."
                  className="w-full p-3 text-xs lg:text-sm border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all placeholder:text-slate-400"
                />
              ) : (
                <input
                  type="text"
                  value={isCodeInput}
                  onChange={(e) => setIsCodeInput(e.target.value)}
                  placeholder="e.g., IS 17526 or IS 302-2-25"
                  className="w-full p-3 text-xs lg:text-sm border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              )}
            </div>

            {/* Quick Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {[
                'Water Bottle',
                'Smartphone Charger',
                'LED Bulb',
                'Helmet',
                'Pressure Cooker'
              ].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleQuickTagClick(pill)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors border border-slate-200/60"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleGetStandards}
              className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-colors"
            >
              <span>{t('getStandards')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Verify BIS Mark / Product */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('verifyBisMark')}</h3>
                <p className="text-[11px] text-slate-500">
                  Scan QR code or upload product image to verify authenticity
                </p>
              </div>
            </div>

            {/* Upload Dropzone */}
            <label className="mt-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-2">
                Upload Image <span className="font-normal text-slate-500">or drag and drop</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supports: JPG, PNG (Max 5MB)
              </p>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Local Verification Engine
            </span>
            <Link to="/verification" className="text-blue-600 font-semibold hover:underline">
              Enter Licence No. →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Compliance Navigator Horizontal Step Progress */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{t('complianceNavigator')}</h3>
            </div>
            <p className="text-[11px] text-slate-500">
              From standard to certification — your step-by-step guide
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">
              Overall Progress
            </span>
            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${dashboardData?.activePlan?.overall_progress_pct || 40}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {dashboardData?.activePlan?.overall_progress_pct || 40}%
            </span>
          </div>
        </div>

        {/* 5-Step Wizard Horizontal */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="flex flex-col p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Done</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-2">1. Standard Identified</p>
            <Link to="/standards/IS%2017526:2021" className="text-[11px] font-semibold text-blue-600 hover:underline mt-1">
              View Details →
            </Link>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Done</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-2">2. Tests Mapped</p>
            <Link to="/compliance" className="text-[11px] font-semibold text-blue-600 hover:underline mt-1">
              View Tests →
            </Link>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col p-3 rounded-xl bg-blue-50 border border-blue-300 ring-2 ring-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                3
              </div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Active</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-2">3. Documents Preparation</p>
            <Link to="/documents" className="text-[11px] font-semibold text-blue-600 hover:underline mt-1">
              View Checklist →
            </Link>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pending</span>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-2">4. Laboratory Selection</p>
            <Link to="/laboratories" className="text-[11px] font-medium text-slate-500 hover:text-slate-800 mt-1">
              Find Labs →
            </Link>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                5
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pending</span>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-2">5. Application & Certification</p>
            <Link to="/compliance" className="text-[11px] font-medium text-slate-500 hover:text-slate-800 mt-1">
              Guidance →
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Three-Column Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Recommended for You */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{t('recommendedForYou')}</h3>
              </div>
              <Link to="/standards" className="text-xs font-semibold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            {/* Standard Profile Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-start gap-3">
                <div className="w-12 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 p-1">
                  {/* Water bottle icon illustration */}
                  <svg viewBox="0 0 24 40" fill="none" className="w-6 h-12 text-slate-400">
                    <rect x="7" y="2" width="10" height="4" rx="1" fill="#64748B" />
                    <path d="M5 8 C5 6, 19 6, 19 8 L19 36 C19 38, 5 38, 5 36 Z" fill="#94A3B8" />
                    <line x1="8" y1="14" x2="16" y2="14" stroke="#CBD5E1" strokeWidth="1" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#CBD5E1" strokeWidth="1" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900">
                      Stainless Steel Water Bottle
                    </h4>
                    <StatusBadge status="High Match" size="xs" />
                  </div>
                  <p className="text-xs font-extrabold text-blue-700 mt-0.5">
                    IS 17526:2021
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Stainless steel vacuum insulated flasks and bottles — Specification
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/standards/IS%2017526:2021"
                className="py-1.5 px-3 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                View Standard
              </Link>
              <button
                type="button"
                onClick={() => setWhyModalOpen(true)}
                className="py-1.5 px-3 text-center text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Why this Standard?
              </button>
            </div>
            <Link
              to="/compliance"
              className="w-full py-2 px-3 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Start Compliance Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Key Requirements Summary */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Key Requirements (Summary)</h3>
              </div>
              <Link to="/standards/IS%2017526:2021" className="text-xs font-semibold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-1.5">
              {[
                { title: 'Material requirements', clause: 'Clause 4.2', detail: 'Food grade Stainless Steel SS 304/316' },
                { title: 'Performance requirements', clause: 'Clause 5.1', detail: 'Thermal retention ≥ 70°C after 6 hours' },
                { title: 'Testing methods', clause: 'Clause 6', detail: 'Hydrostatic, drop impact, and corrosion tests' },
                { title: 'Marking and labelling', clause: 'Clause 7', detail: 'CM/L licence number, ISI logo, batch code' },
                { title: 'Packaging requirements', clause: 'Clause 8', detail: 'Protective unit sleeve and moisture barrier' },
              ].map((item) => (
                <button
                  key={item.clause}
                  type="button"
                  onClick={() => setSelectedClause(item)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between border border-transparent hover:border-slate-200"
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
                    <span className="text-[11px] font-mono font-medium text-blue-600">{item.clause}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Reference: IS 17526:2021</span>
            <Link to="/assistant?q=Explain clauses for IS 17526" className="text-blue-600 font-semibold hover:underline">
              Ask AI about Clauses →
            </Link>
          </div>
        </div>

        {/* Column 3: Regulatory Updates + Recent Activity */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Regulatory Updates card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Regulatory Updates
              </h4>
              <Link to="/alerts" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800">New QCO Notified</p>
                    <StatusBadge status="New" size="xs" showIcon={false} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">12 Sep 2025 • Stainless Steel Utensils</p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800">Amendment Released</p>
                    <StatusBadge status="Update" size="xs" showIcon={false} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">28 Aug 2025 • IS 302 (Part 1):2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Recent Activity
              </h4>
              <Link to="/saved" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">Standard matched</p>
                  <p className="text-[10px] text-slate-400">IS 17526:2021 • 2 mins ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">Product profile saved</p>
                  <p className="text-[10px] text-slate-400">Stainless Steel Water Bottle • 10 mins ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Atmanirbhar Bharat Quality Badge */}
          <AtmanirbharBadge />
        </div>
      </div>

      {/* 6. Bottom Banner: Need help? Ask SUGAM-AI */}
      <div className="bg-[#0A1628] text-white border border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Need help? Ask SUGAM-AI</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Get source-backed answers from BIS documents, standards and regulatory guidelines.
            </p>
          </div>
        </div>

        <Link
          to="/assistant"
          className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 shrink-0"
        >
          <span>Chat with SUGAM-AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clause Detail Modal */}
      {selectedClause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {selectedClause.clause}
              </span>
              <button
                type="button"
                onClick={() => setSelectedClause(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">{selectedClause.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedClause.detail}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedClause(null)}
                className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Why this Standard?" Modal */}
      {whyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Why IS 17526:2021 Applies</h3>
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Regulatory Grounding:</strong> Under the Stainless Steel & Aluminium Utensils (Quality Control) Order notified by the Ministry of Commerce and Industry, all vacuum insulated flasks and bottles made of stainless steel are legally mandated to bear the Standard (ISI) Mark.
              </p>
              <p>
                <strong>Scope Alignment:</strong> Conforms specifically to portable containers designed for holding hot or cold potable liquids with vacuum thermal barrier insulation between SS 304 inner lining and outer casing.
              </p>
              <p>
                <strong>Mandatory Certification Scheme:</strong> Requires Bureau of Indian Standards Product Certification Scheme-I (Domestic Manufacturers).
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              <Link
                to="/compliance"
                onClick={() => setWhyModalOpen(false)}
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
              >
                Open Compliance Roadmap
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
