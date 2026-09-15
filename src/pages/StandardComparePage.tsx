import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Scale, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiCompareStandards, apiSearchStandards } from '../services/api';

export const StandardComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idsParam = searchParams.get('ids') || 'std-is-17526,std-is-302-2-25';
  const [standards, setStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, [idsParam]);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const ids = idsParam.split(',').filter(Boolean);
      const data = await apiCompareStandards(ids);
      setStandards(data);
    } catch (err) {
      console.error('Failed to compare standards:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
            <Scale className="w-4 h-4" />
            <span>Comparing {standards.length} Indian Standards</span>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Indian Standards Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Side-by-side analysis of regulatory scope, testing methods, mandatory QCOs, and compliance budgets
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Comparing Indian Standards...
        </div>
      ) : standards.length < 2 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-bold text-slate-800">Please select at least 2 standards to compare</p>
          <Link to="/standards" className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline">
            Go to Standards Catalog →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider w-48 shrink-0">
                  Feature / Parameter
                </th>
                {standards.map((std) => (
                  <th key={std.id} className="p-4 font-extrabold text-slate-900 min-w-[240px] max-w-[320px]">
                    <span className="font-mono text-blue-700 text-sm block">{std.is_code}</span>
                    <span className="text-xs font-semibold text-slate-700 mt-1 block leading-snug">{std.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Category */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Category & Industry</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4 text-slate-800">
                    <p className="font-semibold">{std.category}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{std.industry}</p>
                  </td>
                ))}
              </tr>

              {/* Mandatory Status */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Mandatory (QCO)</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4">
                    <StatusBadge status={std.mandatory ? 'Mandatory' : 'Voluntary'} size="xs" />
                  </td>
                ))}
              </tr>

              {/* Scope */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Scope & Applicability</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4 text-slate-600 leading-relaxed">
                    <p className="text-xs">{std.scope}</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">{std.applicability}</p>
                  </td>
                ))}
              </tr>

              {/* Required Tests */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Laboratory Tests</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4">
                    <span className="font-bold text-slate-900 block mb-1">
                      {std.tests?.length || 0} Mandatory Tests
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {std.tests?.map((t: any) => (
                        <li key={t.id} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{t.test_name}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Required Documents */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Statutory Dossiers</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4">
                    <span className="font-bold text-slate-900 block mb-1">
                      {std.documents?.length || 0} Required Documents
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {std.documents?.slice(0, 4).map((d: any) => (
                        <li key={d.id} className="truncate">
                          • {d.document_name}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Timeline */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Estimated Timeline</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4 font-extrabold text-slate-900">
                    ~{std.timeline_days} Days
                  </td>
                ))}
              </tr>

              {/* Cost */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Estimated Cost Range</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4">
                    <span className="font-extrabold text-blue-700 block">
                      ₹{std.estimated_cost_inr?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">50% MSME concession available</span>
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr className="bg-slate-50/60">
                <td className="p-4 font-bold text-slate-600">Next Action</td>
                {standards.map((std) => (
                  <td key={std.id} className="p-4">
                    <Link
                      to={`/standards/${encodeURIComponent(std.is_code)}`}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
