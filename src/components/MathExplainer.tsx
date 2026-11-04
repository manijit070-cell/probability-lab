import React, { useState } from 'react';
import { MathExplanation } from '../types';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';
import katex from 'katex';

interface MathExplainerProps {
  explanation: MathExplanation;
}

export const MathExplainer: React.FC<MathExplainerProps> = ({ explanation }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Helper to render KaTeX safely
  const renderFormula = (latex: string) => {
    try {
      return {
        __html: katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false
        })
      };
    } catch {
      return { __html: `<code>${latex}</code>` };
    }
  };

  const renderInlineFormula = (latex: string) => {
    try {
      return {
        __html: katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false
        })
      };
    } catch {
      return { __html: `<code>${latex}</code>` };
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl mt-6 transition-all duration-300">
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-midnight-850 to-midnight-800 hover:from-purple-900/40 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-mono text-purple-400 font-semibold">
                Rigorous Academic Theory
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                KaTeX Math
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">Understand the Mathematics</h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white">
          <span>{isOpen ? 'Collapse Breakdown' : 'Expand Derivation'}</span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-6 space-y-6 bg-midnight-900/60 divide-y divide-white/5">
          {/* Top Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-midnight-800/80 border border-white/5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Sample Space |S|</span>
              <p className="text-xl font-bold text-white mt-1 font-mono">
                {explanation.sample_space_size.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{explanation.sample_space_description}</p>
            </div>

            <div className="p-4 rounded-xl bg-midnight-800/80 border border-white/5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Favorable Outcomes |E|</span>
              <p className="text-xl font-bold text-purple-400 mt-1 font-mono">
                {explanation.favorable_outcomes_count.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{explanation.favorable_outcomes_description}</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <span className="text-xs font-mono text-purple-300 uppercase tracking-wide">Theoretical P(E)</span>
              <p className="text-xl font-bold text-cyan-300 mt-1 font-mono">
                {explanation.theoretical_probability_fraction}
                <span className="text-sm text-slate-400 font-normal ml-2">
                  ≈ {(explanation.theoretical_probability_decimal * 100).toFixed(2)}%
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Exact classical combinatorial probability</p>
            </div>
          </div>

          {/* Formula Display */}
          <div className="pt-6">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Core Formula</span>
            </h4>
            <div className="p-5 rounded-xl bg-midnight-950/80 border border-purple-500/20 overflow-x-auto text-purple-200 shadow-inner">
              <div dangerouslySetInnerHTML={renderFormula(explanation.formula_latex)} />
            </div>
          </div>

          {/* Step-by-Step Derivation */}
          <div className="pt-6">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono mb-4">
              Step-by-Step Mathematical Derivation
            </h4>
            <div className="space-y-3">
              {explanation.calculation_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-midnight-850/60 border border-white/5 flex items-start space-x-3"
                >
                  <span className="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div
                    className="text-sm text-slate-200 overflow-x-auto flex-1 font-sans"
                    dangerouslySetInnerHTML={renderInlineFormula(step)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation & LLN Notes */}
          <div className="pt-6">
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-blue-300 block mb-1">
                  Theoretical vs. Experimental Discrepancy Note:
                </span>
                {explanation.notes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
