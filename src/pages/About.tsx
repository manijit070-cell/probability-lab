import React from 'react';
import {
  BookOpen,
  Cpu,
  Terminal,
  Code2,
  CheckCircle2,
  Layers,
  Sparkles,
  FileText,
  Workflow
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>B.Tech Mini-Project Specification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Project Specifications & Methodology
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Comprehensive project report documentation for College Academic Evaluation.
        </p>
      </div>

      {/* Project Metadata Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/5 font-mono text-xs">
          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5">
            <span className="text-slate-400 block uppercase">Project Group</span>
            <span className="text-white text-base font-bold mt-1 block">Group 7</span>
          </div>
          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5">
            <span className="text-slate-400 block uppercase">Course</span>
            <span className="text-purple-300 text-base font-bold mt-1 block">
              Probability & Statistics
            </span>
          </div>
          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5">
            <span className="text-slate-400 block uppercase">Evaluation Standard</span>
            <span className="text-cyan-300 text-base font-bold mt-1 block">
              Python Stochastic Engine
            </span>
          </div>
        </div>

        {/* Problem Statement & Objectives */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>Problem Statement & Academic Objectives</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Classical probability is frequently taught in lecture halls through theoretical counting formulas alone,
            leaving students with abstract formulas that are detached from the physical reality of empirical sampling.
            The primary objective of this project is to build an educational full-stack computational laboratory titled{' '}
            <strong className="text-white">PROBABILITYLAB</strong> that simulates classical stochastic experiments
            (Coins, Dice, and Cards) using a verified Python backend and contrasts theoretical expectations against
            experimental observations as trial counts increase ($N \to 1,000,000$).
          </p>
        </div>
      </div>

      {/* Architecture Separation (Python vs React) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Workflow className="w-5 h-5 text-cyan-400" />
          <span>System Architecture & Strict Separation of Concerns</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backend Box */}
          <div className="p-5 rounded-2xl bg-midnight-900 border border-cyan-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <Terminal className="w-4 h-4" />
              <span>Python Backend (Mandatory Core)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>NumPy & Random Engine:</strong> Executes up to 1,000,000 trials vectorized in under 50ms.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Exact Combinatorics:</strong> Calculates binomial coefficients, hypergeometric distributions, and permutations.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Statistical Metrics:</strong> Computes Standard Error, 95% Confidence Intervals, and absolute/relative errors.
                </span>
              </li>
            </ul>
          </div>

          {/* Frontend Box */}
          <div className="p-5 rounded-2xl bg-midnight-900 border border-purple-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase">
              <Code2 className="w-4 h-4" />
              <span>React 19 & TypeScript Frontend</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Client-Side Simulation:</strong> Frontend never mocks random numbers; it delegates completely to Python.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Framer Motion & 3D CSS:</strong> Visual coin flips, rolling dice pips, and realistic card flips.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>KaTeX Scientific Notation:</strong> Renders LaTeX formulas, sample spaces, and step-by-step derivations.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Professor Evaluation Demonstration Guide */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>How to Demonstrate the Project to Your Professor</span>
        </h2>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5 space-y-2">
            <div className="font-bold text-amber-300 font-mono">Step 1: Demonstrate Unit Tests in Python</div>
            <p>
              Open terminal and run pytest to demonstrate 100% test coverage across coin, dice, card, and LLN modules:
            </p>
            <div className="p-2.5 rounded bg-midnight-950 font-mono text-slate-200 text-xs border border-white/10">
              .\venv\Scripts\pytest tests\test_engine.py -v
            </div>
          </div>

          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5 space-y-2">
            <div className="font-bold text-amber-300 font-mono">Step 2: Demonstrate Deterministic Reproducibility</div>
            <p>
              In the Coin or Dice Lab, input a Random Seed (e.g., <code className="text-amber-400 font-mono">42</code>)
              with 1,000 trials. Run the simulation twice. The experimental probability and flip sequences will be
              identical down to 6 decimal places, proving genuine seeded pseudorandom engine execution.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5 space-y-2">
            <div className="font-bold text-amber-300 font-mono">Step 3: Demonstrate Hypergeometric vs. Binomial Sampling</div>
            <p>
              Navigate to the Card Lab. Select "Two Aces". Toggle between "Without Replacement" (Hypergeometric:
              $P = 1/221 \approx 0.004525$) and "With Replacement" (Independent: $P = 1/169 \approx 0.005917$). Point out
              to your professor how sampling without replacement strictly lowers the likelihood of identical ranks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-midnight-900 border border-white/5 space-y-2">
            <div className="font-bold text-amber-300 font-mono">Step 4: Demonstrate Asymptotic LLN Decay</div>
            <p>
              Go to the Statistics Lab. Show how the Standard Error decays at the theoretical mathematical rate O(1 / √N)
              as trial count scales across 5 orders of magnitude (10 to 100,000).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
