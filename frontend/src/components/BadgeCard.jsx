import React from 'react';

const BADGE_DETAILS = {
  '🎯 First Game': {
    description: 'Began your educational journey by completing your first game.',
    emoji: '🎯',
    colorClass: 'from-sky-500/20 to-transparent border-sky-500/30 text-sky-400',
  },
  '🔥 5 Games Completed': {
    description: 'Showed consistent dedication by finishing 5 learning sessions.',
    emoji: '🔥',
    colorClass: 'from-orange-500/20 to-transparent border-orange-500/30 text-orange-400',
  },
  '🏆 10 Games Completed': {
    description: 'A true scholar! Completed 10 full learning games.',
    emoji: '🏆',
    colorClass: 'from-amber-500/20 to-transparent border-amber-500/30 text-amber-400',
  },
  '🧠 90% Accuracy': {
    description: 'Excelled in precision, scoring 90% or higher in a game.',
    emoji: '🧠',
    colorClass: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
  },
  '⚡ Fast Learner': {
    description: 'Completed a quiz in record time with speedy thinking.',
    emoji: '⚡',
    colorClass: 'from-yellow-500/20 to-transparent border-yellow-500/30 text-yellow-400',
  },
};

const BadgeCard = ({ name, isUnlocked = false }) => {
  const details = BADGE_DETAILS[name] || {
    description: 'Special learning achievement.',
    emoji: '🏅',
    colorClass: 'from-slate-500/20 to-transparent border-slate-500/30 text-slate-400',
  };

  return (
    <div
      className={`glass-card p-5 relative overflow-hidden flex flex-col items-center text-center transition-transform hover:-translate-y-1 ${
        isUnlocked
          ? `bg-gradient-to-b ${details.colorClass}`
          : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 border ${
          isUnlocked
            ? 'bg-slate-900 border-white/10 shadow-lg shadow-black/40'
            : 'bg-slate-950/60 border-slate-900'
        }`}
      >
        <span className={isUnlocked ? 'grayscale-0 scale-100 animate-pulse-slow' : 'grayscale scale-90'}>
          {details.emoji}
        </span>
      </div>

      <h4 className={`font-semibold tracking-wide font-sans text-sm ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
        {name}
      </h4>
      <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-[200px]">
        {details.description}
      </p>

      {!isUnlocked && (
        <span className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900/60 text-slate-500 border border-slate-800">
          Locked
        </span>
      )}
      {isUnlocked && (
        <span className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
          Unlocked
        </span>
      )}
    </div>
  );
};

export default BadgeCard;
