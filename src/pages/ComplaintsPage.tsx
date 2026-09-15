import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiGetComplaints, apiSubmitComplaint } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ComplaintsPage: React.FC = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'faq' | 'form' | 'history'>('faq');
  const [faqs, setFaqs] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Complaint Form State
  const [category, setCategory] = useState('Misleading BIS Claim');
  const [subject, setSubject] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiGetComplaints();
      setFaqs(data.faqs || []);
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiSubmitComplaint({
        category,
        subject,
        productName,
        description,
        contactInfo
      });
      setSuccessMsg(res.message);
      setSubject('');
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('complaintsSupport')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Consumer grievances, fraudulent ISI mark reporting, and regulatory compliance assistance
            </p>
          </div>
        </div>

        {/* Tabs (Matching Mobile Screen 17) */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'faq' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Frequently Asked Questions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'form' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Submit a Complaint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            History ({complaints.length})
          </button>
        </div>
      </div>

      {/* 1. FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Compliance Knowledge & Guidance
          </h3>

          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-3.5 text-left bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Submit Complaint Form */}
      {activeTab === 'form' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle">
          {successMsg ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Grievance Successfully Registered</h3>
              <p className="text-xs text-slate-600">{successMsg}</p>
              <button
                type="button"
                onClick={() => setSuccessMsg('')}
                className="mt-2 py-1.5 px-4 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                Lodge Grievance or Quality Report
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Misleading BIS Claim">Deceptive / Misleading BIS Claim</option>
                    <option value="Fake ISI Mark">Counterfeit or Fake ISI Mark</option>
                    <option value="Product Quality Failure">Product Quality Standard Failure</option>
                    <option value="Licence Verification">Licence Verification Inquiry</option>
                    <option value="Laboratory Grievance">Laboratory Testing Delay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Unregistered bottle claiming ISI mark"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Details & Brand Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. HydroSteel Flask (Model X-750)"
                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Grievance Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the discrepancy, store location, or defective product condition..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Phone / Email (Optional for updates)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="+91 98765 43210 or email@domain.com"
                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Lodging Report...' : 'Submit Grievance'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Complaints History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Registered Inquiries & Grievances
          </h3>

          {complaints.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No grievances lodged yet.</p>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-600">{c.id}</span>
                  <StatusBadge status={c.status} size="xs" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{c.subject}</h4>
                <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                <p className="text-[10px] text-slate-400 mt-2">
                  Category: {c.category} • Date: {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
