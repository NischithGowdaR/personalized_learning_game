import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import { BarChart3, TrendingUp, Percent, Award, Gamepad2, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.getProgress();
        setStats(data);
      } catch (err) {
        console.error('Error fetching progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getLevelName = (level) => {
    const names = {
      1: 'Beginner',
      2: 'Learner',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert',
    };
    return names[level] || 'Novice';
  };

  const getNextLevelRequirement = (level) => {
    const reqs = {
      1: 'Complete 1 game to level up to Learner.',
      2: 'Complete 3 games to level up to Intermediate.',
      3: 'Complete 7 games to level up to Advanced.',
      4: 'Complete 12 games and maintain an overall accuracy of 80% or more to reach Expert.',
      5: 'Maximum Expert level achieved! 🏆 Keep practicing to maintain your rank.',
    };
    return reqs[level] || 'Complete quizzes to increase your rank.';
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-900 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">Performance Analytics</h1>
        <p className="text-slate-400 text-sm font-sans">
          Review your learning statistics, level advancement, and individual topic summaries.
        </p>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Overall Rank"
          value={`Level ${stats?.level || 1}`}
          icon={Award}
          color="emerald"
          description={getLevelName(stats?.level)}
        />
        <StatsCard
          title="Games Completed"
          value={stats?.totalGames || 0}
          icon={Gamepad2}
          color="brand"
        />
        <StatsCard
          title="Questions Solved"
          value={stats?.totalQuestions || 0}
          icon={BarChart3}
          color="accent"
        />
        <StatsCard
          title="Mean Accuracy"
          value={`${stats?.accuracy || 0}%`}
          icon={Percent}
          color={stats?.accuracy >= 80 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Level progression helper */}
      <div className="glass-card p-6 md:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-brand-400 font-bold">
          <TrendingUp size={20} />
          <h3 className="text-white font-sans font-semibold">Learning Progression</h3>
        </div>

        <div className="space-y-4">
          <ProgressBar progress={(stats?.level / 5) * 100} label={`Level ${stats?.level} of 5 (${getLevelName(stats?.level)})`} color="brand" />
          <p className="text-slate-400 text-sm font-sans flex items-start gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
            <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Next Milestone:</strong> {getNextLevelRequirement(stats?.level)}</span>
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score History Line Chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-white tracking-wide font-sans">Accuracy Log Over Time</h3>
          <div className="h-72">
            {stats?.scoreHistory && stats.scoreHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                    }}
                  />
                  <Line name="Accuracy (%)" type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-sans border border-dashed border-slate-800 rounded-xl">
                No history to graph. Complete a quiz first!
              </div>
            )}
          </div>
        </div>

        {/* Topic accuracy bar chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-white tracking-wide font-sans">Performance by Topic</h3>
          <div className="h-72">
            {stats?.topicProgress && stats.topicProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topicProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="topic" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-sans border border-dashed border-slate-800 rounded-xl">
                No topic data recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic-Wise Breakdown Table */}
      <div className="glass-card p-6 md:p-8 space-y-4">
        <h3 className="font-bold text-white tracking-wide font-sans">Topic Mastery Detailed Report</h3>
        
        {stats?.topicProgress && stats.topicProgress.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Questions Solved</th>
                  <th className="py-3 px-4">Correct</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Difficulty Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-sans text-slate-300">
                {stats.topicProgress.map((topic, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-400">{topic.subject}</td>
                    <td className="py-4 px-4 font-semibold text-white">{topic.topic}</td>
                    <td className="py-4 px-4">{topic.attempts}</td>
                    <td className="py-4 px-4 text-emerald-400 font-semibold">{topic.correct}</td>
                    <td className="py-4 px-4 font-bold text-brand-400">{topic.accuracy}%</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        topic.difficulty === 'Advanced'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : topic.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-6 italic font-sans">
            Start a custom game to begin gathering topic statistics!
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
