import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Game', path: '/create-game', icon: PlusCircle },
    { name: 'Progress Overview', path: '/progress', icon: BarChart3 },
    { name: 'Profile & Badges', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 p-4 hidden md:flex">
      <div className="space-y-6">
        <div className="px-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          General Menu
        </div>
        
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-500/10 border-brand-500/20 text-brand-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon size={18} className="stroke-[2px]" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-900 pt-4">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
