import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import {
  Gamepad2,
  HelpCircle,
  Percent,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [launchingRec, setLaunchingRec] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await api.getProgress();
        const recData = await api.getRecommendations();

        setStats(statsData);
        setRecommendation(recData);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStartRecommended = async () => {
    if (!recommendation) return;
    setLaunchingRec(true);
    try {
      const newGame = await api.generateGame({
        subject: recommendation.subject,
        topic: recommendation.topic,
        difficulty: recommendation.difficulty,
        gameType: recommendation.gameType || 'Multiple Choice',
        numQuestions: recommendation.numQuestions || 10,
      });
      // Redirect to the newly generated game screen
      navigate(`/game/${newGame._id}`);
    } catch (error) {
      console.error('Error launching recommended game', error);
      alert('Could not generate the recommended game. Please try customizing one manually.');
    } finally {
      setLaunchingRec(false);
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

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-900 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-slate-900 rounded-2xl"></div>
          <div className="h-80 bg-slate-900 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-brand-950/20 p-6 md:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-500/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-sans">
            Ready to challenge your mind and level up your skills today?
          </p>
        </div>
        
        <button
          onClick={() => navigate('/create-game')}
          className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-brand-600/10 hover:-translate-y-0.5 transition-all text-sm"
        >
          <span>Create Custom Game</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Games Played"
          value={stats?.totalGames || 0}
          icon={Gamepad2}
          color="brand"
        />
        <StatsCard
          title="Questions Answered"
          value={stats?.totalQuestions || 0}
          icon={HelpCircle}
          color="accent"
        />
        <StatsCard
          title="Average Correct"
          value={stats?.averageScore !== undefined ? `${stats.averageScore} Qs` : '0 Qs'}
          icon={Award}
          color="amber"
          description="Average correct per game"
        />
        <StatsCard
          title="Overall Accuracy"
          value={`${stats?.accuracy || 0}%`}
          icon={Percent}
          color={stats?.accuracy >= 75 ? 'emerald' : stats?.accuracy >= 50 ? 'brand' : 'rose'}
        />
        <StatsCard
          title="Current Level"
          value={`Lv. ${stats?.level || 1}`}
          icon={TrendingUp}
          color="emerald"
          description={getLevelLabel(stats?.level)}
        />
      </div>

      {/* AI Recommendation */}
      {recommendation && (
        <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-brand-900/20 via-slate-900/90 to-slate-950 border-brand-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-start space-x-4 max-w-3xl">
            <div className="p-3 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl shrink-0">
              <BrainCircuit size={26} className="animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 font-sans flex items-center gap-1">
                <Sparkles size={12} />
                <span>AI Recommendation</span>
              </span>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed font-sans font-medium">
                {recommendation.recommendation}
              </p>
            </div>
          </div>

          <button
            onClick={handleStartRecommended}
            disabled={launchingRec}
            className="w-full md:w-auto shrink-0 flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all"
          >
            <span>{launchingRec ? 'Generating Game...' : 'Start Recommended Game'}</span>
            {!launchingRec && <ArrowRight size={16} />}
          </button>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score History Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white tracking-wide">Performance Over Time</h3>
            <span className="text-xs text-slate-400">Score & Accuracy logs</span>
          </div>

          <div className="h-72 w-full">
            {stats?.scoreHistory && stats.scoreHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.scoreHistory}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line
                    name="Accuracy (%)"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Correct Answers"
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans space-y-2 border border-dashed border-slate-800 rounded-xl">
                <span>📊 No game history recorded yet.</span>
                <span className="text-xs text-slate-600">Complete your first game to generate charts!</span>
              </div>
            )}
          </div>
        </div>

        {/* Topic accuracy chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-white tracking-wide">Accuracy by Topic</h3>
          <div className="h-72 w-full">
            {stats?.topicProgress && stats.topicProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topicProgress.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="topic" stroke="#64748b" fontSize={10} tickFormatter={(tick) => tick.length > 10 ? `${tick.substring(0, 10)}...` : tick} />
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
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans space-y-2 border border-dashed border-slate-800 rounded-xl">
                <span>📈 Topic accuracies will map here.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strong and Weak Topics list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strong Topics */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold border-b border-slate-900 pb-3">
            <span>🔥</span>
            <h3 className="font-sans text-white font-semibold">Strong Topics</h3>
          </div>
          
          <div className="space-y-3">
            {stats?.strongTopics && stats.strongTopics.length > 0 ? (
              stats.strongTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl">
                  <span className="text-sm text-slate-300 font-medium">{topic.topic}</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-sans">
                    {topic.accuracy}% accuracy
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm py-4 text-center italic">
                Complete more quizzes with &gt;= 80% accuracy to identify strengths!
              </div>
            )}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 font-bold border-b border-slate-900 pb-3">
            <span>⚠️</span>
            <h3 className="font-sans text-white font-semibold">Weak Topics</h3>
          </div>

          <div className="space-y-3">
            {stats?.weakTopics && stats.weakTopics.length > 0 ? (
              stats.weakTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl">
                  <span className="text-sm text-slate-300 font-medium">{topic.topic}</span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold font-sans">
                    {topic.accuracy}% accuracy
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm py-4 text-center italic">
                Awesome! No weak topics detected (&lt; 60% accuracy) at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
