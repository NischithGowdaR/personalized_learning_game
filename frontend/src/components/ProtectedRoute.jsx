import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-accent-500/20 border-b-accent-500 animate-spin animate-pulse-slow"></div>
        </div>
        <p className="text-slate-400 font-sans tracking-wide text-sm animate-pulse">
          Personalizing your experience...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
