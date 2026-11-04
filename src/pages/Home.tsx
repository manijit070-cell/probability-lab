import React, { useState } from 'react';
import { TabType } from '../types';
import {
  Coins,
  Dice5,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  BookOpen,
  CheckCircle,
  Activity,
  Sparkles,
  BarChart2,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeProps {
  setActiveTab: (tab: TabType) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const [heroFlipped, setHeroFlipped] = useState(false);

  const categories = [
    {
      id: 'coin' as TabType,
      title: 'Coin Experiments',
      tagline: 'Binomial Microstates & Consecutive Runs',
      description:
        'Simulate fair and weighted coin flips across single and multi-coin sets. Analyze exact binomial probabilities, runs of consecutive heads, and stochastic convergence toward 0.5.',
      scenarios: '7 Standard Scenarios',
      icon: Coins,
      accent: 'amber',
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      id: 'dice' as TabType,
      title: 'Dice Experiments',
      tagline: 'Uniform Randomness & Sum Distributions',
      description:
        'Roll 1 to 3 dice across up to 1,000,000 trials. Discover why a sum of 7 appears with the highest probability (16.67%) while 2 and 12 remain rare outliers (2.78%).',
      scenarios: '12 Standard Scenarios',
      icon: Dice5,
      accent: 'purple',
      gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      id: 'cards' as TabType,
      title: 'Card Experiments',
      tagline: 'Hypergeometric vs. Independent Sampling',
      description:
        'Explore a standard 52-card deck. Crucially compare sampling with replacement (independent binomial trials) vs without replacement (dependent hypergeometric combinations).',
      scenarios: '13 Standard Scenarios',
      icon: Layers,
      accent: 'cyan',
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 px-4">
          {/* Scientific Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>B.Tech Probability & Statistics Mini-Project • Group 7</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Probability,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              Beyond Theory.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Run experiments. Observe randomness. Understand the rigorous mathematics behind every outcome.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => setActiveTab('coin')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium text-sm shadow-[0_0_30px_-5px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center space-x-2 group border border-purple-400/40"
            >
              <span>Start Experimenting</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-midnight-900/90 hover:bg-midnight-800 text-slate-200 font-medium text-sm border border-white/10 hover:border-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Explore Law of Large Numbers</span>
            </button>
          </motion.div>

          {/* Interactive Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-8"
          >
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl max-w-3xl mx-auto relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-around gap-6">
                {/* Coin Badge */}
                <div
                  onClick={() => setHeroFlipped(!heroFlipped)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 p-1 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-amber-950 font-black text-2xl">
                    {heroFlipped ? 'T' : 'H'}
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-2">Click to flip</span>
                  <span className="text-xs font-mono font-bold text-amber-400">P(H) = 0.5000</span>
                </div>

                {/* Dice Badge */}
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2">
                    <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-200 font-mono font-bold text-xl shadow-lg">
                      3
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-900/60 border border-cyan-400/40 flex items-center justify-center text-cyan-200 font-mono font-bold text-xl shadow-lg">
                      4
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-2">Sum = 7 (Apex)</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">P(S=7) = 1/6 (16.67%)</span>
                </div>

                {/* Card Badge */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 rounded-xl bg-slate-100 border border-slate-300 p-2 shadow-lg flex flex-col justify-between items-center text-red-600">
                    <span className="text-xs font-bold font-mono self-start">A</span>
                    <span className="text-2xl leading-none">♥</span>
                    <span className="text-xs font-bold font-mono self-end">A</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-2">Single Draw</span>
                  <span className="text-xs font-mono font-bold text-rose-400">P(Ace) = 4/52 (7.69%)</span>
                </div>
              </div>

              {/* Formula Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-purple-300">Stochastic Simulation: Real Python Engine</span>
                <span className="text-cyan-300">Law of Large Numbers: N → ∞</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experiment Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Interactive Laboratories
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Select a laboratory to launch stochastic trials, inspect sampling distributions, and study the mathematical mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="glass-card rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden group border border-white/10"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.gradient} rounded-bl-full pointer-events-none`} />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-midnight-900 border ${cat.borderColor} flex items-center justify-center ${cat.textColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {cat.scenarios}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">{cat.tagline}</p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5">
                  <button
                    onClick={() => setActiveTab(cat.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-midnight-800 hover:bg-purple-600/30 text-white text-xs font-semibold font-mono border border-white/10 hover:border-purple-400/40 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Launch {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Probability Works: Academic Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold">
              Mathematical Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Theoretical vs. Experimental Probability
            </h2>
            <p className="text-slate-400 text-sm">
              Classical probability relies on deductive counting; experimental probability relies on empirical observation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Theoretical */}
            <div className="p-6 rounded-2xl bg-midnight-900/80 border border-purple-500/20 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">Theoretical Probability</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculated purely using the ratio of favorable microstates to total equally likely outcomes in the sample space:
              </p>
              <div className="p-3 bg-midnight-950 rounded-lg text-center font-mono text-sm text-purple-300 border border-purple-500/20">
                P(E) = |E| / |S|
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Exact deterministic value determined prior to trials.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Requires assumption of fair/equiprobable outcomes.</span>
                </li>
              </ul>
            </div>

            {/* Experimental */}
            <div className="p-6 rounded-2xl bg-midnight-900/80 border border-cyan-500/20 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">Experimental Probability</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empirical relative frequency of an event occurring over an actual series of N independent trials:
              </p>
              <div className="p-3 bg-midnight-950 rounded-lg text-center font-mono text-sm text-cyan-300 border border-cyan-500/20">
                P_exp(E) = Successes / Total Trials (N)
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Subject to stochastic finite-sample variation.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Standard Error decays at rate O(1 / √N).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Law of Large Numbers Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-cyan-500/20 bg-gradient-to-r from-midnight-900 via-midnight-850 to-midnight-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Core Theorem of Stochastic Convergence</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The Law of Large Numbers (LLN)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              As the number of independent trials increases, the sample average tends toward the expected value. Explore
              multi-scale simulations across 10, 100, 1,000, 10,000, and 100,000 trials to witness variance decay in real time.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('statistics')}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-midnight-950 font-bold text-sm shadow-[0_0_20px_-3px_rgba(6,182,212,0.5)] transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <span>Launch LLN Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
