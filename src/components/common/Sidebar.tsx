import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Bot,
  Package,
  FileText,
  QrCode,
  BookOpen,
  Bell,
  FlaskConical,
  FolderCheck,
  LifeBuoy,
  ShieldAlert,
  Bookmark,
  Building2,
  CheckSquare
} from 'lucide-react';
import { SugamLogo } from './SugamLogo';
import { MonumentsIllustration } from './MonumentsIllustration';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

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
    <aside className="hidden lg:flex flex-col w-64 bg-[#0A1628] border-r border-slate-800 text-slate-300 h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <SugamLogo variant="light" size="md" />
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="pt-3 mt-3 border-t border-slate-800">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Governance
            </span>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 mt-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md font-semibold'
                    : 'text-purple-300 hover:bg-purple-950/40 hover:text-purple-100'
                }`
              }
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400" />
              <span>{t('adminDashboard')}</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Bottom Heritage Monument Vector Illustration */}
      <div className="p-4 border-t border-slate-800/80 bg-[#071120]/60 flex flex-col items-center">
        <MonumentsIllustration theme="dark" showText={true} />
      </div>
    </aside>
  );
};
