import React from 'react';
import { motion } from 'framer-motion';

interface CoinVisualProps {
  currentOutcome: 'H' | 'T';
  isFlipping: boolean;
  extraFlips?: string[];
}

export const CoinVisual: React.FC<CoinVisualProps> = ({
  currentOutcome,
  isFlipping,
  extraFlips
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* 3D Coin Container */}
      <div className="w-40 h-40 relative perspective-1000 flex items-center justify-center">
        <motion.div
          animate={
            isFlipping
              ? {
                  rotateY: [0, 1800],
                  y: [0, -70, 0],
                  scale: [1, 1.15, 1],
                }
              : {
                  rotateY: currentOutcome === 'T' ? 180 : 0,
                  y: 0,
                  scale: 1,
                }
          }
          transition={
            isFlipping
              ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
              : { duration: 0.6, ease: "easeOut" }
          }
          className="w-36 h-36 relative transform-style-preserve-3d shadow-2xl rounded-full"
        >
          {/* Heads Face */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-4 border-yellow-200/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),0_0_25px_rgba(245,158,11,0.3)] backface-hidden flex flex-col items-center justify-center p-3 select-none">
            <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono tracking-widest text-amber-950 font-bold uppercase">
                Probability
              </span>
              <span className="text-4xl font-extrabold text-amber-950 my-0.5 tracking-tighter">
                H
              </span>
              <span className="text-[9px] font-mono font-semibold text-amber-900">
                HEADS • P=0.5
              </span>
            </div>
          </div>

          {/* Tails Face */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-100 border-4 border-slate-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),0_0_25px_rgba(148,163,184,0.3)] backface-hidden flex flex-col items-center justify-center p-3 select-none"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full rounded-full border-2 border-dashed border-slate-700/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono tracking-widest text-slate-800 font-bold uppercase">
                Statistics
              </span>
              <span className="text-4xl font-extrabold text-slate-900 my-0.5 tracking-tighter">
                T
              </span>
              <span className="text-[9px] font-mono font-semibold text-slate-700">
                TAILS • P=0.5
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Outcome Status Badge */}
      <div className="mt-4 flex items-center space-x-2">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
          Last Outcome:
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-mono font-bold border transition-colors ${
            currentOutcome === 'H'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
          }`}
        >
          {isFlipping ? 'FLIPPING...' : currentOutcome === 'H' ? 'HEADS (1)' : 'TAILS (0)'}
        </span>
      </div>

      {/* Multi-coin mini badges if num_coins > 1 */}
      {extraFlips && extraFlips.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5 justify-center max-w-xs">
          {extraFlips.map((flip, idx) => (
            <span
              key={idx}
              className={`w-6 h-6 rounded-md text-xs font-mono font-bold flex items-center justify-center border ${
                flip === 'H'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-700 text-slate-200 border-slate-600'
              }`}
            >
              {flip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
