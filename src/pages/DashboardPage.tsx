import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  FlaskConical,
  FolderCheck,
  MapPin,
  ArrowRight,
  Target,
  QrCode,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Clock,
  BookOpen,
  Search,
  Upload,
  Pencil,
  Bookmark,
  Sliders,
  Tag,
  Package,
  Check,
  Bell,
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
    <div className="max-w-[1400px] mx-auto space-y-4 select-none">
      {/* 1. Welcome Greeting Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:px-7 lg:py-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Tricolor wave swoop in the top right */}
        <div className="absolute top-0 right-0 w-64 h-full pointer-events-none opacity-85">
          <svg viewBox="0 0 240 80" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M40 0 C110 35, 160 5, 240 25 L240 0 Z" fill="#FF9933" opacity="0.45" />
            <path d="M15 0 C95 45, 145 15, 240 45 L240 25 C160 5, 110 35, 40 0 Z" fill="#FFFFFF" opacity="0.75" />
            <path d="M0 10 C80 55, 130 25, 240 65 L240 45 C145 15, 95 45, 15 0 Z" fill="#138808" opacity="0.35" />
          </svg>
        </div>

        {/* Left greeting text */}
        <div className="z-10">
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good Morning, {user?.name?.split(' ')[0] || 'Afnan'}!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 mt-0.5 font-medium">
            Let's make compliance simpler, together.
          </p>
        </div>

        {/* Center/Right monuments illustration & quote */}
        <div className="hidden md:flex items-center gap-4 z-10 mr-12 lg:mr-16">
          <div className="w-24 h-12 shrink-0 opacity-40">
            <MonumentsIllustration theme="light" showText={false} className="scale-90" />
          </div>
          <div className="text-left">
            <p className="text-xs font-serif italic text-slate-700 leading-snug">
              "Standards build trust, compliance builds a better tomorrow."
            </p>
            <p className="text-[10px] text-blue-700 font-bold mt-0.5">
              — Bureau of Indian Standards
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4.5 items-start">
        {/* LEFT COLUMN (approx 74% width) */}
        <div className="xl:col-span-9 space-y-4.5">
          {/* Row 1: Key Metrics Row (4 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Metric 1: Applicable Standards */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col justify-between hover:border-blue-300 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
                <Link to="/standards" className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                  View →
                </Link>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {dashboardData?.metrics?.applicableStandards || 12}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-1.5">Applicable Standards</p>
              </div>
            </div>

            {/* Metric 2: Required Tests */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col justify-between hover:border-emerald-300 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <Link to="/compliance" className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                  View →
                </Link>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {dashboardData?.metrics?.requiredTests || 5}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-1.5">Required Tests</p>
              </div>
            </div>

            {/* Metric 3: Documents Required */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col justify-between hover:border-purple-300 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <FolderCheck className="w-5 h-5" />
                </div>
                <Link to="/documents" className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                  View →
                </Link>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {dashboardData?.metrics?.documentsRequired || 8}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-1.5">Documents Required</p>
              </div>
            </div>

            {/* Metric 4: BIS Labs Nearby */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col justify-between hover:border-amber-300 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <Link to="/laboratories" className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                  View →
                </Link>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {dashboardData?.metrics?.labsNearby || 3}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-1.5">BIS Labs Nearby</p>
              </div>
            </div>
          </div>

          {/* Row 2: Two Interactive Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Card 1: Find Your Applicable Standard (Spans 8 cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Find Your Applicable Standard</h3>
                      <p className="text-[11px] text-slate-500">
                        Describe your product and get matched with relevant BIS standards using AI
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProductQuery('Stainless steel water bottle, 750 ml, insulated, for drinking water')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    Try an example →
                  </button>
                </div>

                {/* Mode Tabs */}
                <div className="flex items-center gap-2 mt-4 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('describe')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'describe' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Describe Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === 'code' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>Search by IS Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/documents')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload Document</span>
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
                      className="w-full p-3 text-xs lg:text-sm border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all placeholder:text-slate-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={isCodeInput}
                      onChange={(e) => setIsCodeInput(e.target.value)}
                      placeholder="e.g., IS 17526 or IS 302-2-25"
                      className="w-full p-3 text-xs lg:text-sm border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                  )}
                </div>

                {/* Quick Pills & Get Standards Button */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
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

                  <button
                    type="button"
                    onClick={handleGetStandards}
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors ml-auto"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Get Standards</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Verify BIS Mark / Product (Spans 4 cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Verify BIS Mark / Product</h3>
                    <p className="text-[11px] text-slate-500">
                      Scan QR code or upload product image to verify authenticity
                    </p>
                  </div>
                </div>

                {/* Upload Dropzone */}
                <label className="mt-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-2">
                    Upload Image <span className="font-normal text-slate-500">or drag and drop</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Supports: JPG, PNG (Max 5MB)
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Row 3: Compliance Navigator Horizontal Step Progress */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Compliance Navigator</h3>
                  <p className="text-[11px] text-slate-500">
                    From standard to certification — your step-by-step guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600">
                  Overall Progress
                </span>
                <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
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

            {/* 5-Step Stepper with Arrows */}
            <div className="flex items-center justify-between gap-2 pt-1 overflow-x-auto pb-1">
              {/* Step 1 */}
              <div className="flex-1 min-w-[110px] flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  ✓
                </div>
                <p className="text-xs font-bold text-slate-800 mt-2">Standard Identified</p>
                <Link to="/standards/IS%2017526:2021" className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5">
                  View Details
                </Link>
              </div>

              <div className="text-slate-300 font-bold shrink-0">→</div>

              {/* Step 2 */}
              <div className="flex-1 min-w-[110px] flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  ✓
                </div>
                <p className="text-xs font-bold text-slate-800 mt-2">Tests Mapped</p>
                <Link to="/compliance" className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5">
                  View Tests
                </Link>
              </div>

              <div className="text-slate-300 font-bold shrink-0">→</div>

              {/* Step 3 */}
              <div className="flex-1 min-w-[110px] flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  3
                </div>
                <p className="text-xs font-bold text-slate-800 mt-2">Documents Preparation</p>
                <Link to="/documents" className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5">
                  View Checklist
                </Link>
              </div>

              <div className="text-slate-300 font-bold shrink-0">→</div>

              {/* Step 4 */}
              <div className="flex-1 min-w-[110px] flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-xs font-bold text-slate-700 mt-2">Laboratory Selection</p>
                <Link to="/laboratories" className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5">
                  Find Labs
                </Link>
              </div>

              <div className="text-slate-300 font-bold shrink-0">→</div>

              {/* Step 5 */}
              <div className="flex-1 min-w-[110px] flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                  5
                </div>
                <p className="text-xs font-bold text-slate-700 mt-2">Application & Certification</p>
                <Link to="/compliance" className="text-[11px] font-semibold text-blue-600 hover:underline mt-0.5">
                  Guidance
                </Link>
              </div>
            </div>
          </div>

          {/* Row 4: Two-Card Grid: Recommended for You & Key Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Recommended for You */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">Recommended for You</h3>
                  </div>
                  <Link to="/standards" className="text-xs font-bold text-blue-600 hover:underline">
                    View All →
                  </Link>
                </div>

                {/* Standard Profile Preview with Real Image */}
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 flex items-center gap-3.5">
                  <div className="w-14 h-24 sm:w-16 sm:h-28 bg-[#EAEFF4] rounded-lg flex items-center justify-center shrink-0 p-1 border border-slate-200/60 overflow-hidden">
                    <img
                      src="/water-bottle.jpg"
                      alt="Stainless Steel Water Bottle"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">
                        Stainless Steel Water Bottle
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        High Match
                      </span>
                    </div>
                    <p className="text-xs font-black text-slate-900 mt-1">
                      IS 17526:2021
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      Stainless steel vacuum insulated flasks and bottles — Specification
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <Link
                  to="/standards/IS%2017526:2021"
                  className="py-1.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Standard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setWhyModalOpen(true)}
                  className="py-1.5 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Why this Standard?
                </button>
                <Link
                  to="/compliance"
                  className="py-1.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1 ml-auto"
                >
                  <span>Start Compliance Journey</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Key Requirements (Summary) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Key Requirements (Summary)</h3>
                  <Link to="/standards/IS%2017526:2021" className="text-xs font-bold text-blue-600 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      title: 'Material requirements',
                      clause: 'Clause 4.2',
                      iconBg: 'bg-purple-100 text-purple-700',
                      icon: Package,
                      detail: 'Food grade Stainless Steel SS 304/316'
                    },
                    {
                      title: 'Performance requirements',
                      clause: 'Clause 5.1',
                      iconBg: 'bg-blue-100 text-blue-700',
                      icon: Sliders,
                      detail: 'Thermal retention ≥ 70°C after 6 hours'
                    },
                    {
                      title: 'Testing methods',
                      clause: 'Clause 6',
                      iconBg: 'bg-rose-100 text-rose-700',
                      icon: FlaskConical,
                      detail: 'Hydrostatic, drop impact, and corrosion tests'
                    },
                    {
                      title: 'Marking and labelling',
                      clause: 'Clause 7',
                      iconBg: 'bg-amber-100 text-amber-700',
                      icon: Tag,
                      detail: 'CM/L licence number, ISI logo, batch code'
                    },
                    {
                      title: 'Packaging requirements',
                      clause: 'Clause 8',
                      iconBg: 'bg-indigo-100 text-indigo-700',
                      icon: Package,
                      detail: 'Protective unit sleeve and moisture barrier'
                    },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.clause}
                        type="button"
                        onClick={() => setSelectedClause(item)}
                        className="w-full text-left p-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-6 h-6 rounded-md ${item.iconBg} flex items-center justify-center shrink-0`}>
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800 truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
                          <span className="text-xs font-medium text-slate-600">{item.clause}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Need help? Ask SUGAM-AI Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 lg:px-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs lg:text-sm font-bold text-slate-900">Need help? Ask SUGAM-AI</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get source-backed answers from BIS documents, standards and regulatory guidelines.
                </p>
              </div>
            </div>

            <Link
              to="/assistant"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with SUGAM-AI →</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN (approx 26% width) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Card 1: Regulatory Updates */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Regulatory Updates</span>
              </h4>
              <Link to="/alerts" className="text-xs font-bold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3.5">
              {/* Item 1: Red */}
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">New QCO Notified</p>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      New
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">12 Sep 2025</p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Stainless Steel Utensils (IS 17526:2021)
                  </p>
                </div>
              </div>

              {/* Item 2: Blue */}
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">Amendment Released</p>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      Update
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">28 Aug 2025</p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    IS 302 (Part 1):2024 Electrical Appliances
                  </p>
                </div>
              </div>

              {/* Item 3: Green */}
              <div className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 leading-snug">Draft Standard for Comments</p>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Draft
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">10 Aug 2025</p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Plastics for Food Contact Comments open till 30 Sep 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Activity (Connected Timeline) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-subtle">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>Recent Activity</span>
              </h4>
              <Link to="/saved" className="text-xs font-bold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="relative pl-1">
              {/* Vertical connector line */}
              <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-slate-200" />

              <div className="space-y-4 relative">
                {/* Node 1: Blue file */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 z-10">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Standard matched</p>
                    <p className="text-[11px] text-slate-600">IS 17526:2021</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 minutes ago</p>
                  </div>
                </div>

                {/* Node 2: Green pencil */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Product profile updated</p>
                    <p className="text-[11px] text-slate-600">Stainless Steel Water Bottle</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">10 minutes ago</p>
                  </div>
                </div>

                {/* Node 3: Red beaker */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 z-10">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Test requirements retrieved</p>
                    <p className="text-[11px] text-slate-600">3 tests identified</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">12 minutes ago</p>
                  </div>
                </div>

                {/* Node 4: Green bookmark */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Saved to workspace</p>
                    <p className="text-[11px] text-slate-600">"SS Bottle Project"</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">25 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Atmanirbhar Bharat Quality Seal */}
          <AtmanirbharBadge />
        </div>
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
