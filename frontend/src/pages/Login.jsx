import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-slate-950 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-card p-8 md:p-10 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-sans text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Enter your credentials to access your dashboard</p>
        </div>

        {error && (
          <div className="flex items-center space-x-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 pl-11 pr-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 pl-11 pr-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/10 flex items-center justify-center space-x-2 transition-all duration-150"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold underline transition-colors">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
