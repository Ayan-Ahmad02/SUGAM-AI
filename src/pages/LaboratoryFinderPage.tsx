import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { apiGetLabs, apiShortlistLab } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const LaboratoryFinderPage: React.FC = () => {
  const { t } = useLanguage();

  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cityFilter, setCityFilter] = useState('All');
  const [standardFilter, setStandardFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLabs();
  }, [cityFilter, standardFilter, searchQuery]);

  const loadLabs = async () => {
    try {
      setLoading(true);
      const data = await apiGetLabs({
        city: cityFilter !== 'All' ? cityFilter : '',
        standard: standardFilter !== 'All' ? standardFilter : '',
        q: searchQuery
      });
      setLabs(data);
    } catch (err) {
      console.error('Failed to load labs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShortlist = async (id: string) => {
    try {
      const res = await apiShortlistLab(id);
      setLabs(prev => prev.map(l => (l.id === id ? { ...l, shortlisted: res.shortlisted } : l)));
    } catch (err) {
      console.error('Failed to toggle shortlist:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-xs">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('laboratoryFinder')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Locate BIS Recognized and Referral testing laboratories accredited for ISI mark pre-certification testing
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search Lab Name
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. National Test House, CPRI..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              City / Region
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Ghaziabad">Ghaziabad / Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Sahibabad">Sahibabad</option>
              <option value="Delhi">Delhi</option>
              <option value="Sonipat">Sonipat</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Accredited Standard
            </label>
            <select
              value={standardFilter}
              onChange={(e) => setStandardFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="All">All Standards</option>
              <option value="IS 17526:2021">IS 17526:2021 (Water Bottles)</option>
              <option value="IS 302-2-25">IS 302-2-25 (Microwave Ovens)</option>
              <option value="IS 694:2010">IS 694:2010 (Cables)</option>
              <option value="IS 17017:2018">IS 17017:2018 (EV Chargers)</option>
              <option value="IS 14543:2016">IS 14543:2016 (Drinking Water)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lab Cards List (Matching Mobile Screen 13) */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Searching accredited BIS laboratories...
          </div>
        ) : (
          labs.map((lab) => (
            <div
              key={lab.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {lab.name}
                  </h3>
                  <StatusBadge status={lab.recognition_status} size="xs" />
                  {lab.shortlisted && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Shortlisted
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lab.address}</span>
                </div>

                {/* Capabilities */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {lab.capabilities?.map((cap: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {lab.contact_phone}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {lab.contact_email}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleShortlist(lab.id)}
                  className={`w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    lab.shortlisted
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{lab.shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
