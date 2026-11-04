import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  badge?: string;
  icon?: LucideIcon;
  accentColor?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
  tooltip?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  badge,
  icon: Icon,
  accentColor = 'purple'
}) => {
  const accentClasses = {
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.25)]'
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.25)]'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.25)]'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.25)]'
    }
  }[accentColor];

  return (
    <div
      className={`glass-card rounded-xl p-5 border border-white/5 relative overflow-hidden transition-all duration-300 ${accentClasses.border} ${accentClasses.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
            {label}
          </span>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${accentClasses.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subValue && (
          <span className="text-slate-400 font-mono">
            {subValue}
          </span>
        )}
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${accentClasses.badge}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
