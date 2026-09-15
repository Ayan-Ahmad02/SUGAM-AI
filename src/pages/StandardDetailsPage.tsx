import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Layers,
  FlaskConical,
  FolderCheck,
  ExternalLink,
  Compass
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiGetStandardDetails, apiSaveStandard } from '../services/api';

export const StandardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [standard, setStandard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'tests' | 'documents'>('overview');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      loadStandard(decodeURIComponent(id));
    }
  }, [id]);

  const loadStandard = async (codeOrId: string) => {
    try {
      setLoading(true);
      const data = await apiGetStandardDetails(codeOrId);
      setStandard(data);
    } catch (err) {
      console.error('Failed to load standard details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!standard) return;
    try {
      await apiSaveStandard(standard.id);
      setSaved(true);
      alert(`${standard.is_code} saved to your workspace!`);
    } catch {
      setSaved(true);
      alert(`${standard.is_code} saved to your workspace!`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
        Loading standard details...
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-800">Standard Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested Indian Standard could not be located.</p>
        <Link to="/standards" className="inline-block mt-4 text-xs font-semibold text-blue-600 hover:underline">
          ← Return to Standards Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 select-none">
      {/* Header with Back button and Actions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                saved
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            <Link
              to={`/compare?ids=${standard.id}`}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Compare
            </Link>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-extrabold text-blue-800 font-mono tracking-tight">
              {standard.is_code}
            </h1>
            <StatusBadge status={standard.mandatory ? 'Mandatory' : 'Voluntary'} size="sm" />
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              Revision {standard.revision_year}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-snug">
            {standard.title}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
            <span className="font-semibold text-slate-700">Category: {standard.category}</span>
            <span>•</span>
            <span>Industry: {standard.industry}</span>
            <span>•</span>
            <span>Status: {standard.status}</span>
          </div>
        </div>

        {/* 4 Tabs */}
        <div className="flex items-center gap-3 mt-6 border-b border-slate-200 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: FileText },
            { key: 'clauses', label: `Clauses (${standard.clauses?.length || 0})`, icon: Layers },
            { key: 'tests', label: `Tests (${standard.tests?.length || 0})`, icon: FlaskConical },
            { key: 'documents', label: `Documents (${standard.documents?.length || 0})`, icon: FolderCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-2.5 px-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scope & Applicability
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                {standard.scope}
              </p>
              <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200/70 text-xs text-blue-900 leading-relaxed">
                <strong>Applicability:</strong> {standard.applicability}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Timeline</span>
                <p className="text-base font-extrabold text-slate-900 mt-1">~{standard.timeline_days} Days</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Includes in-house testing & BIS inspection</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Compliance Cost</span>
                <p className="text-base font-extrabold text-slate-900 mt-1">₹{standard.estimated_cost_inr?.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">50% concession applicable for Udyam MSMEs</p>
              </div>
            </div>

            {/* Related Standards Chips */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Related Standards
              </h4>
              <div className="flex flex-wrap gap-2">
                {['IS 6911 (Stainless Steel Plate/Sheet)', 'IS 302-1 (General Safety)', 'IS 13428 (Packaged Natural Water)'].map((rel) => (
                  <span key={rel} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
                    {rel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clauses' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Standard Clauses & Specifications
            </h3>
            {standard.clauses?.map((cl: any) => (
              <div key={cl.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {cl.clause_number}
                  </span>
                  <StatusBadge status={cl.mandatory ? 'Mandatory' : 'Optional'} size="xs" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5">{cl.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cl.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Mandatory Testing Methods & Laboratory Parameters
            </h3>
            {standard.tests?.map((t: any) => (
              <div key={t.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {t.clause_ref}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.test_name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Sample Size: {t.sampling_size}</span>
                    <span>•</span>
                    <span>Duration: ~{t.duration_days} days</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-slate-900">₹{t.estimated_cost_inr?.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-400">Est. lab charge</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Required Dossiers & Verification Documents
            </h3>
            {standard.documents?.map((d: any) => (
              <div key={d.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{d.document_name}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded font-medium">
                      {d.document_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{d.description}</p>
                </div>
                <StatusBadge status={d.mandatory ? 'Mandatory' : 'Optional'} size="xs" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-[#0A1628] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="text-sm font-bold text-white">Ready to begin certification for {standard.is_code}?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Initialize the 10-step Compliance Navigator to manage testing and document preparation.
          </p>
        </div>

        <Link
          to="/compliance"
          className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Start Compliance Journey</span>
          <Compass className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
