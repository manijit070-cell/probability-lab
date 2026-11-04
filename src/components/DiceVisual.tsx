import React from 'react';
import { motion } from 'framer-motion';

interface SingleDieProps {
  value: number;
  isRolling: boolean;
  color?: 'violet' | 'cyan' | 'rose';
}

const renderPips = (val: number, pipColor: string) => {
  switch (val) {
    case 1:
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`w-4 h-4 rounded-full ${pipColor} shadow-inner`}></span>
        </div>
      );
    case 2:
      return (
        <div className="w-full h-full flex justify-between p-2">
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor} self-start`}></span>
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor} self-end`}></span>
        </div>
      );
    case 3:
      return (
        <div className="w-full h-full flex justify-between p-2">
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor} self-start`}></span>
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor} self-center`}></span>
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor} self-end`}></span>
        </div>
      );
    case 4:
      return (
        <div className="w-full h-full grid grid-cols-2 p-2 gap-2 place-items-center">
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor}`}></span>
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor}`}></span>
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor}`}></span>
          <span className={`w-3.5 h-3.5 rounded-full ${pipColor}`}></span>
        </div>
      );
    case 5:
      return (
        <div className="w-full h-full grid grid-cols-3 p-2 gap-1 place-items-center">
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
        </div>
      );
    case 6:
      return (
        <div className="w-full h-full grid grid-cols-2 p-2 gap-1.5 place-items-center">
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
          <span className={`w-3 h-3 rounded-full ${pipColor}`}></span>
        </div>
      );
    default:
      return null;
  }
};

export const SingleDie: React.FC<SingleDieProps> = ({ value, isRolling, color = 'violet' }) => {
  const bgStyles = {
    violet: 'bg-gradient-to-br from-midnight-800 to-purple-950/70 border-purple-500/40 shadow-[0_8px_25px_-5px_rgba(139,92,246,0.3)]',
    cyan: 'bg-gradient-to-br from-midnight-800 to-cyan-950/70 border-cyan-500/40 shadow-[0_8px_25px_-5px_rgba(6,182,212,0.3)]',
    rose: 'bg-gradient-to-br from-midnight-800 to-rose-950/70 border-rose-500/40 shadow-[0_8px_25px_-5px_rgba(244,63,94,0.3)]',
  }[color];

  const pipColor = {
    violet: 'bg-purple-300 shadow-[0_0_6px_rgba(216,180,254,0.8)]',
    cyan: 'bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.8)]',
    rose: 'bg-rose-300 shadow-[0_0_6px_rgba(253,164,175,0.8)]',
  }[color];

  return (
    <motion.div
      animate={
        isRolling
          ? {
              rotateX: [0, 720, 1080],
              rotateY: [0, -720, -1080],
              rotateZ: [0, 360, 720],
              y: [0, -60, 0],
              scale: [1, 1.15, 1],
            }
          : {
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
      className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center p-1 relative select-none ${bgStyles}`}
    >
      <div className="w-full h-full rounded-xl bg-midnight-900/40 border border-white/5 flex items-center justify-center">
        {renderPips(value, pipColor)}
      </div>
    </motion.div>
  );
};

interface DiceVisualProps {
  diceValues: number[];
  isRolling: boolean;
}

export const DiceVisual: React.FC<DiceVisualProps> = ({ diceValues, isRolling }) => {
  const sum = diceValues.reduce((a, b) => a + b, 0);
  const colors: ('violet' | 'cyan' | 'rose')[] = ['violet', 'cyan', 'rose'];

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Dice group */}
      <div className="flex items-center space-x-6 min-h-[110px]">
        {diceValues.map((val, idx) => (
          <SingleDie
            key={idx}
            value={val}
            isRolling={isRolling}
            color={colors[idx % colors.length]}
          />
        ))}
      </div>

      {/* Sum & Roll Result Badge */}
      <div className="mt-5 flex items-center space-x-3">
        <div className="px-4 py-1.5 rounded-full bg-midnight-800/90 border border-white/10 flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Roll:</span>
          <span className="text-white font-bold tracking-wider">
            [{diceValues.join(', ')}]
          </span>
        </div>

        {diceValues.length > 1 && (
          <div className="px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center space-x-2 text-xs font-mono">
            <span className="text-purple-300">Sum:</span>
            <span className="text-purple-200 font-extrabold text-sm">{sum}</span>
          </div>
        )}
      </div>
    </div>
  );
};
