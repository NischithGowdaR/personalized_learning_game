import React from 'react';

const QuestionCard = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
}) => {
  if (!question) return null;

  const { question: text, options, correctAnswer, explanation } = question;

  const handleOptionClick = (option) => {
    if (showFeedback) return; // Prevent selecting another option after submission
    onSelectAnswer(option);
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      {/* Question Text */}
      <h3 className="text-xl md:text-2xl font-bold font-sans text-white leading-relaxed">
        {text}
      </h3>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === correctAnswer;
          
          let optionStyle = 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
          
          if (showFeedback) {
            if (isCorrect) {
              optionStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-medium';
            } else if (isSelected) {
              optionStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-400 font-medium';
            } else {
              optionStyle = 'border-slate-900 bg-slate-950/20 text-slate-500 cursor-not-allowed';
            }
          } else if (isSelected) {
            optionStyle = 'border-brand-500 bg-brand-500/10 text-brand-300 font-semibold';
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border text-sm md:text-base transition-all duration-200 flex items-center justify-between group ${optionStyle}`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold font-sans ${
                  isSelected
                    ? 'border-brand-400 bg-brand-500 text-white'
                    : showFeedback && isCorrect
                    ? 'border-emerald-400 bg-emerald-500 text-white'
                    : 'border-slate-700 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug">{option}</span>
              </div>

              {/* Status Indicator Icons */}
              {showFeedback && isCorrect && (
                <span className="text-emerald-400 font-sans text-xs uppercase tracking-wider font-bold">
                  ✓ Correct
                </span>
              )}
              {showFeedback && isSelected && !isCorrect && (
                <span className="text-rose-400 font-sans text-xs uppercase tracking-wider font-bold">
                  ✗ Incorrect
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {showFeedback && (
        <div className="p-5 rounded-xl border border-brand-500/20 bg-brand-500/5 mt-6 animate-pulse-slow">
          <div className="flex items-center space-x-2 text-brand-400 font-bold text-sm tracking-wide mb-1">
            <span className="text-base">🧠</span>
            <span className="uppercase font-sans">AI Explanation</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            {explanation || 'The def keyword defines standard functions in Python.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
