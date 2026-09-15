import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  Filter
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiGetAlerts, apiMarkAlertRead } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const AlertsPage: React.FC = () => {
  const { t } = useLanguage();

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    loadAlerts();
  }, [activeCategory]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await apiGetAlerts({
        category: activeCategory !== 'All' ? activeCategory : ''
      });
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await apiMarkAlertRead(id);
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, is_read: true } : a)));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('regulatoryUpdates')} & Alerts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Official Quality Control Orders (QCO), standard amendments, and statutory deadlines
            </p>
          </div>
        </div>

        {/* Filter Chips (Matching Mobile Screen 15) */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          {['All', 'QCO', 'Amendment', 'Draft', 'Deadline'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Updates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading alerts...
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleMarkRead(alert.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-subtle ${
                alert.is_read ? 'border-slate-200 opacity-80' : 'border-blue-300 ring-2 ring-blue-500/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.is_read ? 'bg-slate-300' : 'bg-rose-500 animate-pulse'
                    }`}
                  />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {alert.title}
                  </h3>
                  <StatusBadge status={alert.category} size="xs" />
                </div>

                <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                  {alert.date_published}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {alert.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                {alert.is_code_ref && (
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Ref: {alert.is_code_ref}
                  </span>
                )}
                <span className="text-[10px] text-slate-400">
                  {alert.is_read ? 'Read' : 'Click to mark as read'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
