import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Home,
  Bot,
  Package,
  FileText,
  QrCode,
  BookOpen,
  FlaskConical,
  FolderCheck,
  LifeBuoy,
  ShieldAlert,
  Bookmark,
  CheckSquare,
  Building2,
  Globe,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { SugamLogo } from './SugamLogo';
import { MonumentsIllustration } from './MonumentsIllustration';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

export const MobileNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: Home },
    { to: '/assistant', label: t('aiAssistant'), icon: Bot },
    { to: '/product-matching', label: t('productCompliance'), icon: Package },
    { to: '/standards', label: t('standardsSearch'), icon: FileText },
    { to: '/verification', label: t('bisMarkVerification'), icon: QrCode },
    { to: '/compliance', label: t('complianceNavigator'), icon: BookOpen },
    { to: '/alerts', label: t('regulatoryUpdates'), icon: Bell, badge: '3' },
    { to: '/laboratories', label: t('laboratoryFinder'), icon: FlaskConical },
    { to: '/documents', label: t('documentsTemplates'), icon: FolderCheck },
    { to: '/claim-check', label: t('claimChecker'), icon: CheckSquare },
    { to: '/offices', label: t('bisOfficeLocator'), icon: Building2 },
    { to: '/saved', label: t('savedWorkspace'), icon: Bookmark },
    { to: '/complaints', label: t('complaintsSupport'), icon: LifeBuoy },
  ];

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Mobile Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-1.5 -ml-1.5 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <SugamLogo variant="dark" size="sm" subtitle="BIS Assistant" />
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/alerts"
            className="relative p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
          <Link
            to="/profile"
            className="w-7 h-7 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-bold text-xs"
          >
            {user?.name?.charAt(0) || 'A'}
          </Link>
        </div>
      </div>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#0A1628] text-slate-300 flex flex-col h-full shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <SugamLogo variant="light" size="sm" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User card in drawer */}
            <div className="p-4 border-b border-slate-800 bg-[#0c1b33]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-blue-400">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Links list */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}

              {isAdmin && (
                <div className="pt-2 mt-2 border-t border-slate-800">
                  <NavLink
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium bg-purple-900/40 text-purple-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span>{t('adminDashboard')}</span>
                  </NavLink>
                </div>
              )}

              {/* Language Switcher in Drawer */}
              <div className="pt-3 mt-3 border-t border-slate-800 px-3">
                <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1 mb-1">
                  <Globe className="w-3 h-3 text-blue-400" /> Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-md p-1.5 focus:outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drawer Footer with Monument */}
            <div className="p-3 border-t border-slate-800/80 bg-[#071120] flex flex-col items-center">
              <MonumentsIllustration theme="dark" showText={true} />
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate('/signin');
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 text-xs text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
