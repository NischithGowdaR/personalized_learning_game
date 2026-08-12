import React from 'react';

const ProgressBar = ({ progress, label, color = 'brand' }) => {
  const percentage = Math.min(Math.max(0, Math.round(progress)), 100);

  const colors = {
    brand: 'bg-brand-500 shadow-brand-500/30',
    accent: 'bg-accent-500 shadow-accent-500/30',
    emerald: 'bg-emerald-500 shadow-emerald-500/30',
  };

  const currentColorClass = colors[color] || colors.brand;

  return (
    <div className="space-y-1.5 w-full">
      {(label || progress !== undefined) && (
        <div className="flex justify-between text-xs font-semibold text-slate-400 font-sans">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${currentColorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
