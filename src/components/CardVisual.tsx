import React from 'react';
import { motion } from 'framer-motion';
import { CardItem } from '../types';

interface CardVisualProps {
  cards: CardItem[];
  isDealing: boolean;
  replacement: boolean;
  onStageClick?: () => void;
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
      initial={{ opacity: 0, y: -32, rotateZ: (index - 1) * 3 }}
      animate={
        isDealing
          ? {
              opacity: [0, 1],
              y: [-40, 0],
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
      transition={{
        duration: isDealing ? 0.32 : 0.16,
        delay: isDealing ? index * 0.055 : 0,
        ease: 'easeOut'
      }}
      className="w-20 h-28 sm:w-28 sm:h-40 shrink-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 rounded-xl p-1.5 sm:p-2.5 shadow-2xl border border-slate-300 relative select-none flex flex-col justify-between transform-gpu hover:scale-105 hover:z-10 transition-transform"
    >
      {/* Top Left Pip */}
      <div className={`flex flex-col items-center leading-none self-start ${textColor}`}>
        <span className="text-xs sm:text-base font-extrabold font-mono tracking-tighter">{card.rank}</span>
        <span className="text-xs sm:text-sm font-serif leading-none mt-0.5">{card.symbol}</span>
      </div>

      {/* Center Motif */}
      <div className={`flex items-center justify-center ${symbolColor}`}>
        <span className="text-2xl sm:text-4xl font-serif leading-none drop-shadow-sm">{card.symbol}</span>
      </div>

      {/* Bottom Right Inverted Pip */}
      <div className={`flex flex-col items-center leading-none rotate-180 self-end ${textColor}`}>
        <span className="text-xs sm:text-base font-extrabold font-mono tracking-tighter">{card.rank}</span>
        <span className="text-xs sm:text-sm font-serif leading-none mt-0.5">{card.symbol}</span>
      </div>
    </motion.div>
  );
};

export const CardVisual: React.FC<CardVisualProps> = ({
  cards,
  isDealing,
  replacement,
  onStageClick
}) => {
  const overlapClass =
    cards.length >= 5
      ? '-space-x-6 sm:-space-x-4'
      : cards.length >= 3
      ? '-space-x-3 sm:-space-x-4'
      : 'space-x-2 sm:-space-x-2';

  return (
    <div className="flex flex-col items-center justify-center py-2 px-2 sm:p-5 w-full">
      {/* Card Hand Display */}
      <button
        type="button"
        onClick={onStageClick}
        disabled={!onStageClick || isDealing}
        aria-label="Deal cards visual stage"
        className={`flex items-center justify-center min-h-[124px] sm:min-h-[180px] ${overlapClass} py-2 transition-transform ${
          onStageClick && !isDealing ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : 'cursor-default'
        }`}
      >
        {cards && cards.length > 0 ? (
          cards.map((c, idx) => (
            <SingleCard key={`${c.code}-${idx}`} card={c} index={idx} isDealing={isDealing} />
          ))
        ) : (
          <div className="w-20 h-28 sm:w-28 sm:h-40 rounded-xl border-2 border-dashed border-white/20 bg-midnight-900/40 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-2">
            <span>Empty Hand</span>
            <span className="text-[10px] mt-1 text-slate-600">Draw cards to begin</span>
          </div>
        )}
      </button>

      {/* Mode Badge & Summary */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono bg-midnight-800 border border-white/10 text-slate-300">
          Hand: {cards.map((c) => c.code).join('  ') || 'None'}
        </span>

        <span
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium border ${
            replacement
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {replacement ? 'With Replacement' : 'Without Replacement'}
        </span>
      </div>
    </div>
  );
};

