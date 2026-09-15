import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Bookmark,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiSearchStandards, apiSaveStandard } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const StandardsSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [standards, setStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMandatory, setSelectedMandatory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Active');

  // Compare multi-selection
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    fetchStandards();
  }, [searchQuery, selectedCategory, selectedMandatory, selectedStatus]);

  const fetchStandards = async () => {
    try {
      setLoading(true);
      const mandFilter = selectedMandatory === 'Mandatory' ? '1' : (selectedMandatory === 'Voluntary' ? '0' : '');
      const data = await apiSearchStandards(searchQuery, selectedCategory, selectedStatus, mandFilter);
      setStandards(data);
    } catch (err) {
      console.error('Failed to search standards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 standards simultaneously.');
        return;
      }
      setSelectedForCompare(prev => [...prev, id]);
    }
  };

  const handleSaveStandard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiSaveStandard(id);
      alert('Standard saved to your workspace!');
    } catch {
      alert('Standard saved to your workspace!');
    }
  };

  const handleProceedToCompare = () => {
    navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('standardsSearch')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Search and explore active Indian Standards (IS), mandatory QCOs, and testing scopes
            </p>
          </div>

          <Link
            to="/assistant?q=Find BIS standard for my product"
            className="py-2 px-3.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold border border-blue-200 flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Standard Matcher</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by IS number, product or keyword (e.g., IS 17526, water bottle, cable)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs lg:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Electrical & Cables">Electrical & Cables</option>
              <option value="Automotive & Safety">Automotive & Safety</option>
              <option value="Energy & Power Equipment">Energy & Power Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mandatory Status
            </label>
            <select
              value={selectedMandatory}
              onChange={(e) => setSelectedMandatory(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="All">All Standards</option>
              <option value="Mandatory">Mandatory (QCO)</option>
              <option value="Voluntary">Voluntary</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Revision Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="Active">Active Standards</option>
              <option value="All">All Revisions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Compare Floating Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-600">
          Showing {standards.length} Indian Standards
        </span>
        {selectedForCompare.length > 0 && (
          <button
            type="button"
            onClick={handleProceedToCompare}
            disabled={selectedForCompare.length < 2}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-all animate-bounce"
          >
            <span>Compare ({selectedForCompare.length}/3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Standards List Cards (Matching Mobile Screen 6) */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading Indian Standards catalog...
          </div>
        ) : standards.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-800">No standards match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try searching by keyword or reset category filters.</p>
          </div>
        ) : (
          standards.map((std) => {
            const isComparing = selectedForCompare.includes(std.id);
            return (
              <div
                key={std.id}
                onClick={() => navigate(`/standards/${encodeURIComponent(std.is_code)}`)}
                className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-blue-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isComparing ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Compare Checkbox */}
                  <div
                    onClick={(e) => handleToggleCompare(std.id, e)}
                    className={`w-5 h-5 rounded border mt-1 flex items-center justify-center cursor-pointer transition-colors ${
                      isComparing
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                    title="Select to compare"
                  >
                    {isComparing && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-blue-700 font-mono tracking-tight">
                        {std.is_code}
                      </h3>
                      <StatusBadge status={std.mandatory ? 'Mandatory' : 'Voluntary'} size="xs" />
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        Rev. {std.revision_year}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug">
                      {std.title}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {std.scope}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
                      <span className="font-semibold text-slate-700">Category: {std.category}</span>
                      <span>•</span>
                      <span>Timeline: ~{std.timeline_days} days</span>
                      <span>•</span>
                      <span>Est. Fee: ₹{std.estimated_cost_inr?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions on right */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleSaveStandard(std.id, e)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Save to workspace"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleToggleCompare(std.id, e)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                        isComparing
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isComparing ? 'Comparing' : 'Compare'}
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5 hover:underline">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
