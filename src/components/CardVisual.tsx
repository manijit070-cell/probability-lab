import React from 'react';
import { motion } from 'framer-motion';
import { CardItem } from '../types';

interface CardVisualProps {
  cards: CardItem[];
  isDealing: boolean;
  replacement: boolean;
}

export const SingleCard: React.FC<{ card: CardItem; index: number; isDealing: boolean }> = ({
  card,
  index,
  isDealing
}) => {
  const isRed = card.color === 'red';
  const textColor = isRed ? 'text-red-500' : 'text-slate-900';
  const symbolColor = isRed ? 'text-red-500' : 'text-slate-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, rotateZ: (index - 1) * 4 }}
      animate={
        isDealing
          ? {
              opacity: [0, 1],
              y: [-60, 0],
              rotateY: [180, 0],
              rotateZ: (index - 1) * 3,
            }
          : {
              opacity: 1,
              y: 0,
              rotateY: 0,
              rotateZ: (index - 1) * 3,
            }
      }
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="w-28 h-40 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 rounded-xl p-2.5 shadow-2xl border border-slate-300 relative select-none flex flex-col justify-between transform-gpu hover:scale-105 transition-transform"
    >
      {/* Top Left Pip */}
      <div className={`flex flex-col items-center leading-none ${textColor}`}>
        <span className="text-base font-extrabold font-mono tracking-tighter">{card.rank}</span>
        <span className="text-sm font-serif leading-none mt-0.5">{card.symbol}</span>
      </div>

      {/* Center Motif */}
      <div className={`flex items-center justify-center ${symbolColor}`}>
        <span className="text-4xl font-serif leading-none drop-shadow-sm">{card.symbol}</span>
      </div>

      {/* Bottom Right Inverted Pip */}
      <div className={`flex flex-col items-center leading-none rotate-180 self-end ${textColor}`}>
        <span className="text-base font-extrabold font-mono tracking-tighter">{card.rank}</span>
        <span className="text-sm font-serif leading-none mt-0.5">{card.symbol}</span>
      </div>
    </motion.div>
  );
};

export const CardVisual: React.FC<CardVisualProps> = ({ cards, isDealing, replacement }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Card Hand Display */}
      <div className="flex items-center justify-center min-h-[180px] -space-x-4 py-2">
        {cards && cards.length > 0 ? (
          cards.map((c, idx) => (
            <SingleCard key={`${c.code}-${idx}`} card={c} index={idx} isDealing={isDealing} />
          ))
        ) : (
          <div className="w-28 h-40 rounded-xl border-2 border-dashed border-white/20 bg-midnight-900/40 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-2">
            <span>Empty Hand</span>
            <span className="text-[10px] mt-1 text-slate-600">Draw cards to begin</span>
          </div>
        )}
      </div>

      {/* Mode Badge & Summary */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-midnight-800 border border-white/10 text-slate-300">
          Hand: {cards.map((c) => c.code).join('  ') || 'None'}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${
            replacement
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {replacement ? 'With Replacement (Independent)' : 'Without Replacement (Hypergeometric)'}
        </span>
      </div>
    </div>
  );
};
