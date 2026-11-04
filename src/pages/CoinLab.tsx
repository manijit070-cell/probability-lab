import React, { useState, useEffect } from 'react';
import { probabilityApi } from '../services/api';
import { CoinSimulationResponse } from '../types';
import { CoinVisual } from '../components/CoinVisual';
import { StatCard } from '../components/StatCard';
import { ConvergenceChart } from '../components/ConvergenceChart';
import { MathExplainer } from '../components/MathExplainer';
import {
  Coins,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const CoinLab: React.FC = () => {
  const [numTrials, setNumTrials] = useState<number>(1000);
  const [numCoins, setNumCoins] = useState<number>(1);
  const [experimentType, setExperimentType] = useState<string>('single_heads');
  const [targetHeads, setTargetHeads] = useState<number>(1);
  const [consecutiveCount, setConsecutiveCount] = useState<number>(2);
  const [seed, setSeed] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoinSimulationResponse | null>(null);

  // Animation states
  const [currentOutcome, setCurrentOutcome] = useState<'H' | 'T'>('H');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // Preset trial buttons
  const trialPresets = [10, 100, 1000, 10000, 100000, 1000000];

  const runSimulation = async () => {
    setLoading(true);
    setIsFlipping(true);
    setError(null);

    try {
      const parsedSeed = seed.trim() !== '' ? parseInt(seed.trim(), 10) : undefined;
      const res = await probabilityApi.simulateCoin({
        num_trials: numTrials,
        num_coins: numCoins,
        experiment_type: experimentType,
        target_heads: targetHeads,
        consecutive_count: consecutiveCount,
        seed: isNaN(parsedSeed as number) ? undefined : parsedSeed,
      });

      // Update sample flip animation
      if (res.sample_flips && res.sample_flips.length > 0) {
        const lastFlip = res.sample_flips[0][0] as 'H' | 'T';
        setCurrentOutcome(lastFlip);
      }

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Simulation failed to execute.');
    } finally {
      setTimeout(() => {
        setIsFlipping(false);
        setLoading(false);
      }, 700);
    }
  };

  // Initial simulation run on mount
  useEffect(() => {
    runSimulation();
  }, []);

  // Format heads distribution data for Recharts
  const headsDistributionChartData = result
    ? Object.entries(result.heads_distribution).map(([k, count]) => ({
        heads: `${k} Heads`,
        count: count,
        frequency: ((count / result.total_trials) * 100).toFixed(2),
      }))
    : [];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Coin Experiment Laboratory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate Bernoulli trials, binomial combinations, and consecutive runs computed natively in Python.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_-3px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{loading ? 'Simulating in Python...' : 'Run Simulation'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Controls & Visual Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                Experiment Configuration
              </h2>
            </div>

            {/* Experiment Scenario Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                Experiment Scenario
              </label>
              <select
                value={experimentType}
                onChange={(e) => {
                  const val = e.target.value;
                  setExperimentType(val);
                  if (val === 'single_heads' || val === 'single_tails') {
                    setNumCoins(1);
                  }
                }}
                className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="single_heads">Single Coin: Probability of Heads (0.5)</option>
                <option value="single_tails">Single Coin: Probability of Tails (0.5)</option>
                <option value="exact_heads">Multiple Coins: Exactly m Heads (Binomial)</option>
                <option value="at_least_one_head">Multiple Coins: At least one Head</option>
                <option value="consecutive_heads">Multiple Coins: Consecutive Heads Run</option>
              </select>
            </div>

            {/* Number of Coins (if multi-coin) */}
            {experimentType !== 'single_heads' && experimentType !== 'single_tails' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Number of Coins (k):</span>
                  <span className="text-amber-400 font-bold">{numCoins}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={numCoins}
                  onChange={(e) => {
                    const k = parseInt(e.target.value, 10);
                    setNumCoins(k);
                    if (targetHeads > k) setTargetHeads(k);
                  }}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            {/* Target Heads (for exact_heads) */}
            {experimentType === 'exact_heads' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Exact Heads (m):</span>
                  <span className="text-amber-400 font-bold">{targetHeads}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={numCoins}
                  value={targetHeads}
                  onChange={(e) => setTargetHeads(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            {/* Consecutive count (for consecutive_heads) */}
            {experimentType === 'consecutive_heads' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Consecutive Run Length (r):</span>
                  <span className="text-amber-400 font-bold">{consecutiveCount}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={Math.max(2, numCoins)}
                  value={consecutiveCount}
                  onChange={(e) => setConsecutiveCount(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            {/* Number of Trials (Presets & Custom) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Number of Trials (N)</span>
                <span className="text-amber-400 font-bold">{numTrials.toLocaleString()}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {trialPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNumTrials(preset)}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      numTrials === preset
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {preset >= 1000000
                      ? '1M'
                      : preset >= 1000
                      ? `${preset / 1000}k`
                      : preset}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="pt-2">
                <input
                  type="number"
                  min={1}
                  max={1000000}
                  value={numTrials}
                  onChange={(e) => setNumTrials(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="Custom trial count (max 1,000,000)"
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Optional Reproducibility Seed */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                Random Seed (Optional for Reproducibility)
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="e.g. 42 (Leave blank for true pseudo-random)"
                className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Stage */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <CoinVisual
              currentOutcome={currentOutcome}
              isFlipping={isFlipping}
              extraFlips={result?.sample_flips?.[0]}
            />
          </div>

          {/* Key Metric Cards */}
          {result && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Experimental P"
                value={(result.experimental_probability * 100).toFixed(2) + '%'}
                subValue={result.experimental_probability.toFixed(5)}
                accentColor="cyan"
                badge={`k=${result.successful_outcomes}`}
              />

              <StatCard
                label="Theoretical P"
                value={(result.theoretical_probability * 100).toFixed(2) + '%'}
                subValue={result.theoretical_probability.toFixed(5)}
                accentColor="purple"
                badge={result.math_explanation.theoretical_probability_fraction}
              />

              <StatCard
                label="Absolute Error"
                value={result.absolute_error.toFixed(5)}
                subValue={
                  result.percentage_error !== null
                    ? `${result.percentage_error.toFixed(2)}% rel. err`
                    : 'Exact'
                }
                accentColor="amber"
              />

              <StatCard
                label="Std. Error (SE)"
                value={result.standard_error.toFixed(5)}
                subValue={`95% CI: [${result.confidence_interval_95[0].toFixed(3)}, ${result.confidence_interval_95[1].toFixed(3)}]`}
                accentColor="emerald"
              />
            </div>
          )}
        </div>
      </div>

      {/* Heads vs Tails Distribution Bar Chart */}
      {headsDistributionChartData.length > 0 && result && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Heads Count Frequency Distribution</span>
              </h3>
              <p className="text-xs text-slate-400">
                Total microstates observed across {result.total_trials.toLocaleString()} trials ({result.total_tosses.toLocaleString()} individual coin flips).
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Heads: <span className="text-amber-400 font-bold">{result.heads_count.toLocaleString()}</span> | Tails:{' '}
              <span className="text-cyan-400 font-bold">{result.tails_count.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headsDistributionChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="heads" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="glass-panel p-3 rounded-lg border border-white/10 text-xs font-mono space-y-1">
                          <div className="font-bold text-white">{d.heads}</div>
                          <div className="text-amber-400">Trials: {Number(d.count).toLocaleString()}</div>
                          <div className="text-cyan-300">Relative Frequency: {d.frequency}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stochastic Convergence Chart */}
      {result && (
        <ConvergenceChart
          data={result.convergence_data}
          theoreticalP={result.theoretical_probability}
          title="Coin Probability Convergence Curve (Law of Large Numbers)"
        />
      )}

      {/* Academic Mathematical Breakdown */}
      {result && <MathExplainer explanation={result.math_explanation} />}
    </div>
  );
};
