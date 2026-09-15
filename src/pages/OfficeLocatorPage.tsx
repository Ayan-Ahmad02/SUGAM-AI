import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { apiGetOffices } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const OfficeLocatorPage: React.FC = () => {
  const { t } = useLanguage();

  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [regionFilter, setRegionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOffices();
  }, [regionFilter, searchQuery]);

  const loadOffices = async () => {
    try {
      setLoading(true);
      const data = await apiGetOffices({
        region: regionFilter !== 'All' ? regionFilter : '',
        q: searchQuery
      });
      setOffices(data);
    } catch (err) {
      console.error('Failed to load offices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('bisOfficeLocator')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Official Directory of Bureau of Indian Standards Headquarters, Regional Offices, and Branch Inspection Directorates
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search Office or City
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Manak Bhavan, Mumbai, Chennai..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="All">All Regions (Pan-India)</option>
              <option value="Headquarters">Headquarters (New Delhi)</option>
              <option value="Northern">Northern Region</option>
              <option value="Western">Western Region</option>
              <option value="Southern">Southern Region</option>
              <option value="Eastern">Eastern Region</option>
              <option value="Central">Central Region</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading BIS Offices directory...
          </div>
        ) : (
          offices.map((office) => (
            <div
              key={office.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
            >
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {office.office_name}
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {office.region}
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {office.phone}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {office.email}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {office.working_hours}
                  </span>
                </div>

                {/* Services */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {office.services?.map((serv: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                      {serv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Map Placeholder Graphic Frame (Matching Mobile Screen 14) */}
              <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center justify-center text-center p-3 select-none">
                {/* Visual grid lines simulating street map */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`map-${office.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64748B" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#map-${office.id})`} />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                    {office.city}, {office.state}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
