import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Bell,
  Globe,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Shield,
  Layers
} from 'lucide-react';
import { BISEmblem } from './BISEmblem';
import { TricolorRibbon } from './TricolorRibbon';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../context/LanguageContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const roles: UserRole[] = ['Manufacturer', 'MSME', 'Consultant', 'Laboratory', 'Compliance Lead', 'Admin'];

  return (
    <header className="relative bg-white border-b border-slate-200 sticky top-0 z-30 select-none shadow-xs">
      {/* Top right Indian Tricolor Ribbon accent */}
      <TricolorRibbon className="absolute top-0 right-0 w-44 h-2.5 z-10" />

      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5 gap-4">
        {/* Left: Global Smart Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl relative flex items-center"
        >
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-12 py-2 text-xs lg:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-colors shadow-xs"
              title="Search SUGAM-AI"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          {/* Notifications link */}
          <Link
            to="/alerts"
            className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Regulatory Updates & Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
              3
            </span>
          </Link>

          {/* Multilingual Selector (12+ Languages) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">
                {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName || 'English'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Language (12+)
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      language === lang.code
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[11px] text-slate-400">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile & Demo Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:flex flex-col leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800">{user?.name || 'Afnan'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{user?.role || 'Manufacturer'}</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <p className="text-[10px] text-blue-600 font-medium mt-0.5">{user?.company}</p>
                </div>

                {/* Role Switcher */}
                <div className="py-2 border-b border-slate-100">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-400" />
                    Switch Role (Demo Mode)
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {roles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          switchRole(r);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-md flex items-center justify-between ${
                          user?.role === r ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{r}</span>
                        {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    Profile & Preferences
                  </Link>
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-purple-700 hover:bg-purple-50 rounded-lg font-semibold"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-600" />
                      Admin Directorate
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/signin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    {t('signOut')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BIS Official Emblem */}
          <div className="hidden xl:flex items-center border-l border-slate-200 pl-4">
            <BISEmblem />
          </div>
        </div>
      </div>
    </header>
  );
};
