import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Sparkles, Trophy, Award, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Groq AI Powered',
      description: 'Generates context-rich multiple-choice questions custom tailored to your level in milliseconds.',
      icon: Brain,
    },
    {
      title: 'Adaptive Progression',
      description: 'The engine dynamically scales questions up or down in difficulty based on your correctness.',
      icon: Zap,
    },
    {
      title: 'Gamified Achievements',
      description: 'Earn experience levels and unlock special badges as you practice different topics.',
      icon: Trophy,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Customize Your Preset',
      description: 'Select your subject, topic, number of questions, and difficulty preference.',
    },
    {
      step: '02',
      title: 'Play and Practice',
      description: 'Complete interactive multiple choice quizzes with instant AI-driven explanation feedback.',
    },
    {
      step: '03',
      title: 'Adapt & Excel',
      description: 'The platform identifies your weak spots and auto-generates remedial recommendations.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 flex flex-col items-center justify-center text-center px-6">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl space-y-6 md:space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-xs font-semibold text-brand-400 animate-pulse-slow">
            <Sparkles size={12} />
            <span>AI-Driven Personalized Learning Platform</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Learn smarter.<br />
            Play. Improve. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Repeat.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Create personalized learning games in seconds. Our adaptive engine automatically studies your accuracy history and customizes game difficulty on the fly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/10 transition-all hover:-translate-y-0.5 group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/10 transition-all hover:-translate-y-0.5 group"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold px-8 py-4 rounded-2xl transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-950 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-white">Dynamic Platform Features</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to master your subjects in a structured, engaging way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div key={index} className="glass-card p-8 space-y-4 hover:border-brand-500/40 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white font-sans">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-900/40 px-6 border-t border-slate-900 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-white">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our system tracks your correct answers to generate custom exercises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, index) => (
              <div key={index} className="glass-card p-8 relative space-y-4">
                <span className="absolute top-4 right-6 text-5xl font-black font-sans text-brand-500/10">
                  {st.step}
                </span>
                <h3 className="text-xl font-bold text-white font-sans">{st.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-white leading-tight">
              Crafted for students who want to study efficiently.
            </h2>
            <p className="text-slate-400 leading-relaxed text-base md:text-lg">
              No more browsing through standard textbooks. Simply specify the topic you are working on, and let Groq AI test you at the level you currently require.
            </p>

            <ul className="space-y-3.5">
              <li className="flex items-center space-x-3 text-slate-300">
                <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
                <span>Private user data dashboard</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-300">
                <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
                <span>Detailed question explanation log review</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-300">
                <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
                <span>100% automated performance analytics charting</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-brand-500/5 to-transparent border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="text-amber-400" size={22} />
              <span>Adaptive Difficulty Engine Rule</span>
            </h3>

            <div className="space-y-4 font-sans text-sm">
              <div className="flex items-start justify-between border-b border-slate-900 pb-3">
                <div>
                  <h4 className="font-semibold text-emerald-400">Score &gt;= 80%</h4>
                  <p className="text-slate-500 text-xs">Climb difficulty ladder</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase">
                  Up Level
                </span>
              </div>
              
              <div className="flex items-start justify-between border-b border-slate-900 pb-3">
                <div>
                  <h4 className="font-semibold text-slate-300">Score 50% - 79%</h4>
                  <p className="text-slate-500 text-xs">Stabilize difficulty</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase">
                  Maintain
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-rose-400">Score &lt; 50%</h4>
                  <p className="text-slate-500 text-xs">Remedial safety difficulty drop</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase">
                  Down Level
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 px-6 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} EduPlay AI. Learn smarter. Play. Improve. Repeat.</p>
      </footer>
    </div>
  );
};

export default Home;
