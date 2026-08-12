import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { Timer, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Game state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of strings (student's selections)
  const [selectedInCurrent, setSelectedInCurrent] = useState(null); // Selected answer for current question
  const [showFeedbackInCurrent, setShowFeedbackInCurrent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [totalAllowedTime, setTotalAllowedTime] = useState(0);
  const timerRef = useRef(null);

  // Fetch Game on Mount
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameData = await api.getGameById(id);
        
        // If already completed, redirect to results page
        if (gameData.completed) {
          navigate(`/results/${id}`);
          return;
        }

        setGame(gameData);
        
        // Timer configuration: 60 seconds per question
        const seconds = gameData.questions.length * 60;
        setTimeLeft(seconds);
        setTotalAllowedTime(seconds);
        
        // Pre-fill empty answers array
        setAnswers(new Array(gameData.questions.length).fill(''));
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load the game.');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id, navigate]);

  // Start Timer once game data is loaded
  useEffect(() => {
    if (!game || timeLeft <= 0 || submitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [game, timeLeft, submitting]);

  // Handle Select Answer
  const handleSelectAnswer = (option) => {
    setSelectedInCurrent(option);
    setShowFeedbackInCurrent(true);

    // Save choice into our array
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIdx] = option;
      return updated;
    });
  };

  // Handle Timeout
  const handleTimeOut = () => {
    console.log('Timer expired! Submitting game...');
    handleSubmit(true);
  };

  // Move to next question or finish
  const handleNext = () => {
    if (currentIdx < game.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      // Reset current state
      setSelectedInCurrent(null);
      setShowFeedbackInCurrent(false);
    } else {
      handleSubmit(false);
    }
  };

  // Submit results to server
  const handleSubmit = async (isTimeout = false) => {
    if (submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = totalAllowedTime - timeLeft;

    try {
      // If timeout, ensure empty answers are filled with empty string
      const finalAnswers = isTimeout ? answers : answers;

      const submitResponse = await api.submitGame(id, {
        answers: finalAnswers,
        timeTaken: elapsed,
      });

      // Redirect to the Results page
      navigate(`/results/${id}`, {
        state: {
          levelUp: submitResponse.levelUp,
          currentLevel: submitResponse.currentLevel,
          unlockedBadges: submitResponse.unlockedBadges,
        },
      });
    } catch (err) {
      console.error(err);
      alert('Error submitting answers. Please try again.');
      setSubmitting(false);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
        <p className="text-slate-400 text-sm animate-pulse">Loading questions...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 glass-card text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Error Loading Game</h3>
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

  const currentQuestion = game.questions[currentIdx];
  const totalQuestions = game.questions.length;
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 font-sans">
            {game.subject}
          </span>
          <h1 className="text-2xl font-bold text-white font-sans tracking-tight">
            {game.topic}
          </h1>
        </div>

        {/* Timer Box */}
        <div className="flex items-center space-x-2.5 bg-slate-900 border border-slate-800 py-2.5 px-4 rounded-xl text-slate-300 font-sans self-start md:self-auto shadow-inner shadow-black/20">
          <Timer size={18} className={timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-brand-400'} />
          <span className="text-sm font-semibold tracking-wide">
            Remaining: <span className={`font-mono text-base font-bold ${timeLeft < 60 ? 'text-rose-400' : 'text-white'}`}>{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        progress={progressPercent}
        label={`Question ${currentIdx + 1} of ${totalQuestions}`}
        color={timeLeft < 60 ? 'emerald' : 'brand'}
      />

      {/* Interactive Question Card */}
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedInCurrent}
        onSelectAnswer={handleSelectAnswer}
        showFeedback={showFeedbackInCurrent}
      />

      {/* Next Question Navigation Controls */}
      <div className="flex justify-end pt-2">
        {showFeedbackInCurrent && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all"
          >
            <span>
              {currentIdx < totalQuestions - 1 ? 'Next Question' : submitting ? 'Submitting...' : 'Finish Game'}
            </span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
