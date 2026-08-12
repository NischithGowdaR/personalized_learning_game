import React from 'react';

const StatsCard = ({ title, value, icon: Icon, description, color = 'brand' }) => {
  const colorSchemes = {
    brand: {
      bg: 'from-brand-500/10 to-transparent',
      border: 'hover:border-brand-500/30',
      iconBg: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    },
    accent: {
      bg: 'from-accent-500/10 to-transparent',
      border: 'hover:border-accent-500/30',
      iconBg: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-transparent',
      border: 'hover:border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    rose: {
      bg: 'from-rose-500/10 to-transparent',
      border: 'hover:border-rose-500/30',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    amber: {
      bg: 'from-amber-500/10 to-transparent',
      border: 'hover:border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
  };

  const currentScheme = colorSchemes[color] || colorSchemes.brand;

  return (
    <div className={`glass-card p-6 overflow-hidden relative group bg-gradient-to-br ${currentScheme.bg} ${currentScheme.border}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-slate-400 text-sm font-medium tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold font-sans tracking-tight text-white">{value}</h3>
          {description && (
            <p className="text-slate-500 text-xs mt-1 font-sans">{description}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl border ${currentScheme.iconBg} transition-transform duration-300 group-hover:rotate-6`}>
            <Icon size={22} className="stroke-[2px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
