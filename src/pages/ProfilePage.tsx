import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Building,
  Mail,
  Shield,
  Globe,
  LogOut,
  Bookmark,
  FlaskConical,
  MessageSquare,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../context/LanguageContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const roles: UserRole[] = ['Manufacturer', 'MSME', 'Consultant', 'Laboratory', 'Compliance Lead', 'Admin'];

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 select-none">
      {/* Profile Card (Matching Mobile Screen 18) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold text-slate-900 truncate">
              {user?.name || 'Afnan Ahmad'}
            </h1>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {user?.role || 'Manufacturer'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {user?.company}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-xl font-extrabold text-slate-900 block leading-none">12</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Standards Saved</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-xl font-extrabold text-emerald-600 block leading-none">5</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Tests Mapped</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-xl font-extrabold text-blue-600 block leading-none">48</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">AI Queries</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Section (Demo Mode) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Switch Compliance Role (Demo Mode)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Select a role to preview tailored compliance workflows and administrative privileges:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                user?.role === r
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{r}</span>
              {user?.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Multilingual Selector Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Globe className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Platform Language (12+ Official Indian Languages)
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`p-2 rounded-xl text-xs border transition-all text-left flex items-center justify-between ${
                language === l.code
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{l.nativeName}</span>
              <span className="text-[10px] text-slate-400">{l.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="py-2 px-5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
};
