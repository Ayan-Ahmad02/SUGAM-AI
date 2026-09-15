import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Printer,
  Calendar,
  IndianRupee,
  ShieldCheck,
  FileCheck,
  Building2,
  Share2
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiGetCompliance, apiUpdateComplianceStep, apiGetCompliancePlanner } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ComplianceNavigatorPage: React.FC = () => {
  const { t } = useLanguage();

  const [plan, setPlan] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Planner Modal
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [plannerData, setPlannerData] = useState<any>(null);

  // Selected Step Editor
  const [editingStep, setEditingStep] = useState<any>(null);

  useEffect(() => {
    loadCompliance();
  }, []);

  const loadCompliance = async () => {
    try {
      setLoading(true);
      const res = await apiGetCompliance();
      if (res.plan) {
        setPlan(res.plan);
        setSteps(res.plan.steps || []);
      }
    } catch (err) {
      console.error('Failed to load compliance plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepStatusChange = async (stepNumber: number, newStatus: string) => {
    if (!plan) return;
    try {
      const res = await apiUpdateComplianceStep(plan.id, stepNumber, newStatus);
      setSteps(prev =>
        prev.map(s => (s.step_number === stepNumber ? { ...s, status: newStatus } : s))
      );
      setPlan((prev: any) => ({ ...prev, overall_progress_pct: res.progressPct }));
      setEditingStep(null);
    } catch (err) {
      console.error('Failed to update step status:', err);
    }
  };

  const openPlanner = async () => {
    try {
      const p = await apiGetCompliancePlanner();
      setPlannerData(p);
      setPlannerOpen(true);
    } catch (err) {
      console.error('Failed to get planner data:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 select-none">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {t('complianceNavigator')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                From standard identification to ISI mark grant — your real-time step-by-step roadmap
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openPlanner}
            className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-slate-200"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Timeline & Cost Planner</span>
          </button>
        </div>

        {/* Current Active Product Banner */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Compliance Roadmap
            </span>
            <h2 className="text-sm font-bold text-slate-900 mt-0.5">
              {plan?.product_name || 'Stainless Steel Water Bottle (750ml)'}
            </h2>
            <p className="text-xs font-mono font-bold text-blue-700 mt-0.5">
              Governing Standard: {plan?.is_code || 'IS 17526:2021'}
            </p>
          </div>

          {/* Progress % Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-900 block">
                {plan?.overall_progress_pct || 40}% Complete
              </span>
              <span className="text-[10px] text-slate-500">
                {steps.filter(s => s.status === 'completed').length} of {steps.length} Steps Done
              </span>
            </div>
            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${plan?.overall_progress_pct || 40}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 10-Step Interactive Workflow List (Matching Mobile Screen 9) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Certification Milestones
        </h3>

        <div className="space-y-3">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isBlocked = step.status === 'blocked';

            return (
              <div
                key={step.id}
                onClick={() => setEditingStep(step)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                    : isBlocked
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : isBlocked
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? '✓' : step.step_number}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {step.step_title}
                    </h4>
                    {step.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={step.status} size="xs" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Status Update Modal */}
      {editingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Step {editingStep.step_number}: {editingStep.step_title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingStep(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Update Step Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { status: 'completed', label: 'Completed (Done)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                  { status: 'current', label: 'Current (In Progress)', color: 'bg-blue-50 text-blue-700 border-blue-300' },
                  { status: 'pending', label: 'Pending', color: 'bg-slate-50 text-slate-700 border-slate-300' },
                  { status: 'blocked', label: 'Blocked / Issue', color: 'bg-rose-50 text-rose-700 border-rose-300' }
                ].map((s) => (
                  <button
                    key={s.status}
                    type="button"
                    onClick={() => handleStepStatusChange(editingStep.step_number, s.status)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                      editingStep.status === s.status ? `${s.color} ring-2 ring-blue-500` : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setEditingStep(null)}
                className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cost & Timeline Planner Modal */}
      {plannerOpen && plannerData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Timeline & Cost Estimate</h3>
              </div>
              <button
                type="button"
                onClick={() => setPlannerOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <p className="font-bold text-blue-900">{plannerData.product}</p>
                <p className="text-blue-700 font-mono mt-0.5">Standard: {plannerData.standard}</p>
              </div>

              {/* Timeline Breakdown */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-2">
                  Duration Estimates
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>Laboratory Testing Duration</span>
                    <span className="font-bold text-slate-900">~{plannerData.timeline.testing_duration_days} days</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>Dossier & Documentation Preparation</span>
                    <span className="font-bold text-slate-900">~{plannerData.timeline.documentation_duration_days} days</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>BIS Application Review & Inspection</span>
                    <span className="font-bold text-slate-900">~{plannerData.timeline.inspection_and_grant_days} days</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-blue-50/60 font-extrabold text-blue-900">
                    <span>Total Estimated Duration</span>
                    <span>~{plannerData.timeline.total_estimated_duration_days} days</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-2">
                  Budget & Fee Breakdown
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>Recognized Laboratory Testing Charges</span>
                    <span className="font-bold text-slate-900">₹{plannerData.costs.laboratory_testing_estimate_inr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>Official BIS Application Fee</span>
                    <span className="font-bold text-slate-900">₹{plannerData.costs.bis_application_fee_inr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>Factory Audit Inspection Charges</span>
                    <span className="font-bold text-slate-900">₹{plannerData.costs.inspection_charges_inr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                    <span>Annual Minimum Marking & Licence Fee</span>
                    <span className="font-bold text-slate-900">₹{plannerData.costs.annual_licence_and_marking_fee_inr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-50 font-extrabold text-emerald-900">
                    <span>Total Estimated Compliance Investment</span>
                    <span>₹{plannerData.costs.total_estimated_cost_inr.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <strong>MSME Concession:</strong> {plannerData.msme_benefit}
              </div>

              <p className="text-[10px] text-slate-400 italic">
                {plannerData.disclaimer}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Planner</span>
              </button>
              <button
                type="button"
                onClick={() => setPlannerOpen(false)}
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
