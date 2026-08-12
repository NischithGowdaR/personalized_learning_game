import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Award, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLevelLabel = (lvl) => {
    const labels = {
      1: 'Beginner',
      2: 'Learner',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert',
    };
    return labels[lvl] || 'Novice';
  };

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Brand logo */}
      <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-black group-hover:rotate-6 transition-transform">
          L
        </div>
        <span className="text-lg font-bold font-sans tracking-wide text-white bg-clip-text bg-gradient-to-r from-white to-slate-300">
          EduPlay <span className="text-brand-400">AI</span>
        </span>
      </Link>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Level badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-xs font-semibold text-brand-400">
              <Award size={14} className="animate-bounce" />
              <span>Level {user.level} ({getLevelLabel(user.level)})</span>
            </div>

            {/* Profile Dropdown Indicator */}
            <div className="flex items-center space-x-3 border-l border-slate-900 pl-4">
              <Link to="/profile" className="flex items-center space-x-2 hover:text-brand-400 transition-colors group">
                <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-300 group-hover:border-brand-500 transition-all">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors max-w-[120px] truncate">
                  {user.name}
                </span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="space-x-3">
            <Link
              to="/login"
              className="text-sm text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-600/10"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
