import React from 'react';
import { Sparkles, Terminal, Code2, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-midnight-950/80 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">
                PROBABILITY<span className="text-cyan-400">LAB</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                Academic Mini-Project
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A high-precision educational probability simulation studio built for the B.Tech Probability
              and Statistics curriculum. Comparing theoretical combinatorial distributions with live stochastic
              empirical trials computed natively in Python.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-midnight-900 border border-white/10 font-mono text-[11px] text-cyan-300">
                <Terminal className="w-3 h-3 mr-1.5 text-cyan-400" />
                Python 3.12 Backend
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-midnight-900 border border-white/10 font-mono text-[11px] text-purple-300">
                <Cpu className="w-3 h-3 mr-1.5 text-purple-400" />
                NumPy Vectorized Engine
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-midnight-900 border border-white/10 font-mono text-[11px] text-emerald-300">
                <Code2 className="w-3 h-3 mr-1.5 text-emerald-400" />
                Vercel Serverless Ready
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Laboratory Modules
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Coin Laboratory (Binomial & Runs)</li>
              <li>Dice Laboratory (Sum of 2 Dice, Doubles)</li>
              <li>Card Laboratory (Hypergeometric vs Binomial)</li>
              <li>Statistics (Law of Large Numbers)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Academic Assignment
            </h4>
            <div className="p-3 rounded-lg bg-midnight-900/60 border border-white/5 space-y-1 font-mono text-[11px]">
              <div className="text-slate-300 font-bold">Group 7 Evaluation</div>
              <div className="text-slate-400">Topic: Coin, Dice & Card Simulation</div>
              <div className="text-cyan-400 text-[10px]">Theoretical vs Experimental</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ProbabilityLab. Designed for B.Tech Probability & Statistics Mini-Project.</p>
          <p className="font-mono text-purple-400/80">
            P(E) = |E| / |S| • As N → ∞, P_exp(E) → P_theo(E)
          </p>
        </div>
      </div>
    </footer>
  );
};
