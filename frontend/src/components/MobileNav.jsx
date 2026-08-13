import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart3, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNav = () => {
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create', path: '/create-game', icon: PlusCircle },
    { name: 'Progress', path: '/progress', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 md:hidden flex justify-around items-center px-2 py-2 safe-area-pb">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand-400 bg-brand-500/10 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon size={20} className="mb-0.5" />
            <span>{link.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
