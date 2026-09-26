import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Package,
  FileText,
  LayoutGrid,
  BookOpen,
  Bell,
  FlaskConical,
  FileCheck,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { MonumentsIllustration } from './MonumentsIllustration';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
    { to: '/product-matching', label: 'Product Compliance', icon: Package },
    { to: '/standards', label: 'Standards Search', icon: FileText },
    { to: '/verification', label: 'BIS Mark Verification', icon: LayoutGrid },
    { to: '/compliance', label: 'Compliance Navigator', icon: BookOpen },
    { to: '/alerts', label: 'Regulatory Updates', icon: Bell },
    { to: '/laboratories', label: 'Laboratory Finder', icon: FlaskConical },
    { to: '/documents', label: 'Documents & Templates', icon: FileCheck },
    { to: '/complaints', label: 'Complaints & Support', icon: ShieldCheck },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-[#0A1628] text-slate-300 h-[calc(100vh-65px)] sticky top-[65px] shrink-0 select-none border-r border-slate-800/80">
      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white font-medium'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="pt-3 mt-3 border-t border-slate-800/80">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Governance
            </span>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 mt-1 rounded-xl text-xs font-medium transition-all ${
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

      {/* Bottom Heritage Monument Graphic (Image 2 Vector) */}
      <div className="p-4 bg-[#071120] border-t border-slate-800/80 flex flex-col items-center">
        <MonumentsIllustration theme="dark" showText={true} />
      </div>
    </aside>
  );
};
