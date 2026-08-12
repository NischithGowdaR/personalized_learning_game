import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle, Sparkles, Award, LayoutDashboard } from 'lucide-react';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replaying, setReplaying] = useState(false);

  // Retrieve level-ups or unlocked badges passed from Game navigation state
  const notifications = location.state || {};

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const gameData = await api.getGameById(id);
        
        if (!gameData.completed) {
          setError('This game is not completed yet.');
          return;
        }

        setGame(gameData);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const handlePlayAgain = async () => {
    if (!game) return;
    setReplaying(true);
    try {
      const newGame = await api.generateGame({
        subject: game.subject,
        topic: game.topic,
        difficulty: game.difficulty,
        gameType: game.gameType,
        numQuestions: game.questions.length,
      });
      navigate(`/game/${newGame._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate replay game.');
      setReplaying(false);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const getPerformanceFeedback = (accuracy) => {
    if (accuracy >= 90) return { text: 'Outstanding Mastermind! 🏆', color: 'text-emerald-400' };
    if (accuracy >= 80) return { text: 'Excellent! 🌟', color: 'text-teal-400' };
    if (accuracy >= 60) return { text: 'Good Effort! 👍', color: 'text-brand-400' };
    return { text: 'Needs More Practice! 📚', color: 'text-rose-400' };
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
        <p className="text-slate-400 text-sm animate-pulse">Calculating scores and updating records...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 glass-card text-center space-y-4">
        <AlertTriangle size={40} className="text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Error Loading Results</h3>
        <p className="text-slate-400 text-sm">{error || 'Game not found'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2 px-6 rounded-xl transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const performance = getPerformanceFeedback(game.accuracy);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Gamification Notification Modals */}
      {(notifications.levelUp || (notifications.unlockedBadges && notifications.unlockedBadges.length > 0)) && (
        <div className="p-6 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-transparent space-y-4 animate-bounce">
          <div className="flex items-center space-x-2 text-yellow-500 font-extrabold uppercase tracking-wide">
            <Sparkles size={22} className="animate-spin" />
            <span>Achievements Unlocked!</span>
          </div>

          <div className="space-y-2 text-slate-200 text-sm font-sans">
            {notifications.levelUp && (
              <p className="flex items-center gap-2">
                <Award className="text-amber-400 shrink-0" size={18} />
                <span>Congratulations! You leveled up to <strong className="text-white">Level {notifications.currentLevel}</strong>!</span>
              </p>
            )}
            
            {notifications.unlockedBadges && notifications.unlockedBadges.map((badge, idx) => (
              <p key={idx} className="flex items-center gap-2">
                <span className="text-lg">🏅</span>
                <span>You unlocked the <strong className="text-white">{badge}</strong> badge! View it on your profile.</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Completion Banner */}
      <div className="text-center space-y-3 py-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-black text-white font-sans tracking-tight">
          🎉 Game Completed!
        </h1>
        <p className={`text-xl font-bold font-sans ${performance.color}`}>
          {performance.text}
        </p>
      </div>

      {/* Score Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="glass-card p-5 text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Score</p>
          <p className="text-3xl font-extrabold text-white font-mono">
            {game.score} <span className="text-slate-600 text-xl">/ {game.questions.length}</span>
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Accuracy</p>
          <p className="text-3xl font-extrabold text-brand-400 font-mono">
            {game.accuracy}%
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Correct</p>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">
            {game.correctAnswers}
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Incorrect</p>
          <p className="text-3xl font-extrabold text-rose-500 font-mono">
            {game.wrongAnswers}
          </p>
        </div>

        <div className="glass-card p-5 text-center col-span-2 md:col-span-1">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Time Taken</p>
          <p className="text-3xl font-extrabold text-white font-mono">
            {formatTime(game.timeTaken)}
          </p>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handlePlayAgain}
          disabled={replaying}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all"
        >
          <RotateCcw size={16} />
          <span>{replaying ? 'Rebuilding game...' : 'Play Again'}</span>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold py-3.5 px-6 rounded-xl transition-all"
        >
          <LayoutDashboard size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Question Review List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white font-sans tracking-tight border-b border-slate-900 pb-3">
          Question Review
        </h2>

        <div className="space-y-6">
          {game.questions.map((q, index) => {
            const studentAns = game.userId === undefined ? '' : 'placeholder'; // Check submission answers or match index
            // Wait, we didn't save the student's selected answers in the database! Oh, wait! The user progress is calculated from submissions, but did we store the student's individual answers inside the Game schema? No, the Game schema fields are:
            // "userId, subject, topic, difficulty, gameType, questions, score, correctAnswers, wrongAnswers, accuracy, timeTaken, completed, createdAt, completedAt"
            // Wait! If the student wants a question-by-question review showing the "Student answer", we should know what they chose!
            // Wait, if the Game model doesn't store student answers, where do we get them? We can pass them or we can save them, or we can just show the correct answer and the options, or we could update the Game schema to also store the submitted answers!
            // Ah! Storing `selectedAnswers` in the Game schema or updating the questions sub-schema with a `userAnswer` field makes this 100% correct, robust, and matches:
            // "For each question display: Question, Student answer, Correct answer, Explanation, Correct/incorrect status"
            // Yes! Let's check how the Game model is structured. In `models/Game.js`, we did not add a `userAnswer` field to the question schema. We can easily update the `Game` Schema or `submitGame` logic to add a `userAnswer` string property dynamically when the student submits! Mongoose schema is flexible if we set strict: false, or we can simply allow the `userAnswer` string in the Mongoose questions schema!
            // Let's modify `models/Game.js` to add `userAnswer: { type: String }` inside the `questionSchema` so it is permanently and cleanly saved! That is a brilliant design decision.
            // Let's first finish this page and then edit the schema and controller.
            // Wait, let's write `Results.jsx` using `q.userAnswer` (the userAnswer will be stored on each question in the array when submitted). If they got it right, `q.userAnswer === q.correctAnswer`. This is extremely clean.
            const isStudentCorrect = q.userAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

            return (
              <div
                key={index}
                className={`glass-card p-6 border ${
                  isStudentCorrect
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-rose-500/20 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4 w-full">
                    {/* Header */}
                    <div className="flex items-center space-x-2 text-xs uppercase font-extrabold tracking-wider font-sans">
                      <span className="text-slate-400">Question {index + 1}</span>
                      <span className="text-slate-600">•</span>
                      <span className={isStudentCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                        {isStudentCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    {/* Question text */}
                    <h4 className="text-lg font-bold text-white font-sans leading-relaxed">
                      {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {q.options.map((opt, oIdx) => {
                        const isOptCorrect = opt === q.correctAnswer;
                        const isOptChosen = opt === q.userAnswer;
                        
                        let optStyle = 'border-slate-800 bg-slate-950/20 text-slate-400';
                        if (isOptCorrect) {
                          optStyle = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold';
                        } else if (isOptChosen && !isOptCorrect) {
                          optStyle = 'border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold';
                        }

                        return (
                          <div key={oIdx} className={`p-3 rounded-lg border flex items-center justify-between ${optStyle}`}>
                            <span>{opt}</span>
                            {isOptCorrect && <span className="text-[10px] uppercase font-bold text-emerald-400">Correct Answer</span>}
                            {isOptChosen && !isOptCorrect && <span className="text-[10px] uppercase font-bold text-rose-400">Your Selection</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="pt-3 border-t border-slate-900 mt-2 space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans block">
                        Explanation
                      </span>
                      <p className="text-slate-300 text-sm leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator Icon */}
                  <div className="shrink-0 mt-1">
                    {isStudentCorrect ? (
                      <CheckCircle2 className="text-emerald-400" size={24} />
                    ) : (
                      <XCircle className="text-rose-500" size={24} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;
