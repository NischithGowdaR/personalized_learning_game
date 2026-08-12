import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, Dices, ChevronRight, HelpCircle, GraduationCap, Laptop, BookOpen } from 'lucide-react';

const SUBJECT_PRESETS = [
  'Programming',
  'Mathematics',
  'Science',
  'Computer Networks',
  'Database',
  'Operating Systems',
  'Web Development',
  'Java',
  'Python',
  'JavaScript',
];

const CreateGame = () => {
  const navigate = useNavigate();

  const [subjectMode, setSubjectMode] = useState('select'); // 'select' or 'custom'
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_PRESETS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [gameType, setGameType] = useState('Multiple Choice');
  const [numQuestions, setNumQuestions] = useState(10);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    const subject = subjectMode === 'select' ? selectedSubject : customSubject.trim();

    if (!subject) {
      setError('Please specify a subject');
      return;
    }

    if (!topic.trim()) {
      setError('Please add a specific topic to practice');
      return;
    }

    setLoading(true);

    try {
      const game = await api.generateGame({
        subject,
        topic: topic.trim(),
        difficulty,
        gameType,
        numQuestions,
      });

      // Redirect to the Game playing screen
      navigate(`/game/${game._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate personalized game from AI. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative w-24 h-24">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-brand-500 animate-spin"></div>
          {/* Outer ring */}
          <div className="absolute -inset-4 rounded-full border-4 border-dashed border-accent-500/20 animate-spin animate-pulse-slow"></div>
          <div className="absolute inset-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <Sparkles className="text-brand-400 animate-bounce" size={24} />
          </div>
        </div>

        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold font-sans text-white">Consulting Groq AI...</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-sans">
            Structuring questions for <span className="text-brand-400 font-semibold">{topic}</span>. We are custom tailoring the difficulty based on your historical progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">Create Learning Game</h1>
        <p className="text-slate-400 text-sm font-sans">
          Specify a topic to have Groq AI generate a custom adaptive assessment.
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
          <HelpCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className="glass-card p-6 md:p-8 space-y-6">
        {/* Subject Mode Selector */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject Domain</label>
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSubjectMode('select')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  subjectMode === 'select'
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Presets
              </button>
              <button
                type="button"
                onClick={() => setSubjectMode('custom')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  subjectMode === 'custom'
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {subjectMode === 'select' ? (
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 pl-4 pr-10 py-3 rounded-xl text-sm focus:border-brand-500 outline-none appearance-none cursor-pointer"
            >
              {SUBJECT_PRESETS.map((preset, idx) => (
                <option key={idx} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Geography, World History"
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 px-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
              required
            />
          )}
        </div>

        {/* Topic Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Python Functions, DNA Replication, Newton's Laws"
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 px-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none transition-colors"
            required
          />
        </div>

        {/* Configurations Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Difficulty setting */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Adaptive">Adaptive (Learns from history)</option>
            </select>
          </div>

          {/* Game Type setting */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Game Type</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none cursor-pointer"
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False" disabled>True/False (Coming Soon)</option>
              <option value="Fill in the Blank" disabled>Fill in the Blank (Coming Soon)</option>
            </select>
          </div>

          {/* Question Limit setting */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Number of Questions</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:border-brand-500 outline-none cursor-pointer"
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-brand-500/10 flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5 duration-150"
        >
          <Dices size={18} />
          <span>Generate Personalized Game</span>
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
