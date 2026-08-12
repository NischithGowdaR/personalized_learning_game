import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const res = await register(name, email, password, confirmPassword);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to register account.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-slate-950 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-card p-8 md:p-10 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-sans text-white">Create Account</h2>
          <p className="text-slate-400 text-sm">Join EduPlay AI and personalize your learning</p>
        </div>

        {error && (
          <div className="flex items-center space-x-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 pl-11 pr-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
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
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 pl-11 pr-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
            <span>{submitting ? 'Creating Account...' : 'Sign Up'}</span>
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold underline transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
