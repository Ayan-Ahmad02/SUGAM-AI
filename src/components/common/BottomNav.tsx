import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Bot, Bookmark, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  const items = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/standards', label: 'Standards', icon: FileText },
    { to: '/assistant', label: 'Assistant', icon: Bot, isCenter: true },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: '/profile', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg select-none">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
                  item.isCenter
                    ? isActive
                      ? 'text-blue-600'
                      : 'text-slate-600'
                    : isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`${
                      item.isCenter
                        ? isActive
                          ? 'w-10 h-10 -mt-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-4 ring-white'
                          : 'w-10 h-10 -mt-4 rounded-full bg-[#0A1628] text-white flex items-center justify-center shadow-md ring-4 ring-white'
                        : 'p-0.5'
                    }`}
                  >
                    <Icon className={`${item.isCenter ? 'w-5 h-5' : 'w-5 h-5'}`} />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
