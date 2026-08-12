import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BadgeCard from '../components/BadgeCard';
import { User, Mail, Save, AlertCircle, CheckCircle, Award } from 'lucide-react';

const BADGES_LIST = [
  '🎯 First Game',
  '🔥 5 Games Completed',
  '🏆 10 Games Completed',
  '🧠 90% Accuracy',
  '⚡ Fast Learner',
];

const Profile = () => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [profileStats, setProfileStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill forms on mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Fetch full profile stats
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfileStats(data);
      } catch (err) {
        console.error('Failed to load profile details', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Name field cannot be blank');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await api.updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      // Update global auth context
      updateUserData({
        name: updatedUser.name,
        email: updatedUser.email,
        level: updatedUser.level,
        badges: updatedUser.badges,
      });

      // Update local state
      setProfileStats(updatedUser);

      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
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

  if (loadingStats) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin"></div>
        <p className="text-slate-500 text-sm font-sans">Loading profile details...</p>
      </div>
    );
  }

  const unlockedBadges = profileStats?.badges || [];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">Student Profile</h1>
        <p className="text-slate-400 text-sm font-sans">
          Manage your personal details, review your learning ranks, and view achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings Form */}
        <div className="lg:col-span-1 glass-card p-6 md:p-8 space-y-6 self-start">
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-900">
            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center text-slate-300 text-3xl font-black mb-3">
              {name ? name.substring(0, 1).toUpperCase() : 'S'}
            </div>
            <h2 className="text-lg font-bold text-white font-sans">{profileStats?.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-brand-400 text-xs font-semibold uppercase tracking-wider font-sans">
              <Award size={14} />
              <span>Level {profileStats?.level} ({getLevelLabel(profileStats?.level)})</span>
            </div>
          </div>

          {successMsg && (
            <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans">
              <CheckCircle size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-sans">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
                  disabled={saving}
                  required
                />
              </div>
            </div>

            {/* Email (with security warning warning) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
                  disabled={saving}
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                Changing your email requires verifying format and ensuring uniqueness across accounts.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>

        {/* Achievements / Badges Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white font-sans tracking-tight">Earned Badges</h3>
            <p className="text-slate-400 text-xs md:text-sm font-sans leading-relaxed">
              Complete different configurations of quizzes, score high accuracy, or set record times to unlock all achievements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {BADGES_LIST.map((badgeName) => {
                const isUnlocked = unlockedBadges.includes(badgeName);
                return (
                  <BadgeCard key={badgeName} name={badgeName} isUnlocked={isUnlocked} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
