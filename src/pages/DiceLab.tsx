import React, { useState, useEffect } from 'react';
import { probabilityApi } from '../services/api';
import { DiceSimulationResponse } from '../types';
import { DiceVisual } from '../components/DiceVisual';
import { StatCard } from '../components/StatCard';
import { ConvergenceChart } from '../components/ConvergenceChart';
import { MathExplainer } from '../components/MathExplainer';
import {
  Dice5,
  Play,
  Sliders,
  BarChart2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const DiceLab: React.FC = () => {
  const [numDice, setNumDice] = useState<number>(2);
  const [numTrials, setNumTrials] = useState<number>(1000);
  const [experimentType, setExperimentType] = useState<string>('sum_7');
  const [targetNumber, setTargetNumber] = useState<number>(6);
  const [targetSum, setTargetSum] = useState<number>(7);
  const [seed, setSeed] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiceSimulationResponse | null>(null);

  // Animation state
  const [diceValues, setDiceValues] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const trialPresets = [10, 100, 1000, 10000, 100000, 1000000];

  const runSimulation = async () => {
    setLoading(true);
    setIsRolling(true);
    setError(null);

    try {
      const parsedSeed = seed.trim() !== '' ? parseInt(seed.trim(), 10) : undefined;
      const res = await probabilityApi.simulateDice({
        num_dice: numDice,
        num_trials: numTrials,
        experiment_type: experimentType,
        target_number: targetNumber,
        target_sum: targetSum,
        seed: isNaN(parsedSeed as number) ? undefined : parsedSeed,
      });

      if (res.sample_rolls && res.sample_rolls.length > 0) {
        setDiceValues(res.sample_rolls[0]);
      }

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Simulation execution failed.');
    } finally {
      setTimeout(() => {
        setIsRolling(false);
        setLoading(false);
      }, 700);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  // Format sum distribution for Recharts
  const sumDistributionData = result
    ? Object.entries(result.sum_distribution).map(([s, info]) => ({
        sum: `Sum ${s}`,
        count: info.count,
        experimental: (info.experimental_p * 100).toFixed(2),
        theoretical: (info.theoretical_p * 100).toFixed(2),
      }))
    : [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Dice5 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dice Experiment Laboratory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate 1, 2, or 3 dice rolls. Explore sum triangular distributions and combinatorial likelihoods in Python.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_-3px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{loading ? 'Rolling in Python...' : 'Roll Dice'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Controls + Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                Dice Experiment Controls
              </h2>
            </div>

            {/* Number of Dice */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Number of Dice</span>
                <span className="text-purple-400 font-bold">{numDice} {numDice === 1 ? 'Die' : 'Dice'}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setNumDice(d);
                      if (d === 1 && experimentType.startsWith('sum_')) {
                        setExperimentType('specific_number');
                      } else if (d >= 2 && experimentType === 'specific_number') {
                        setExperimentType('sum_7');
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-mono transition-all border ${
                      numDice === d
                        ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-md'
                        : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {d} {d === 1 ? 'Die' : 'Dice'}
                  </button>
                ))}
              </div>
            </div>

            {/* Experiment Scenario Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                Target Scenario
              </label>
              <select
                value={experimentType}
                onChange={(e) => setExperimentType(e.target.value)}
                className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              >
                {numDice === 1 ? (
                  <>
                    <option value="specific_number">Specific Face (1 to 6) — P = 1/6</option>
                    <option value="even_number">Even Face {`{2, 4, 6}`} — P = 1/2</option>
                    <option value="odd_number">Odd Face {`{1, 3, 5}`} — P = 1/2</option>
                    <option value="prime_number">Prime Face {`{2, 3, 5}`} — P = 1/2</option>
                  </>
                ) : (
                  <>
                    <option value="sum_7">Sum of 7 (Apex Likelihood) — P = 6/36 (16.67%)</option>
                    <option value="sum_2">Sum of 2 (Snake Eyes) — P = 1/36 (2.78%)</option>
                    <option value="sum_12">Sum of 12 (Boxcars) — P = 1/36 (2.78%)</option>
                    <option value="sum_target">Custom Sum Target</option>
                    <option value="doubles">Doubles (Same Face on Both) — P = 6/36 (16.67%)</option>
                    <option value="at_least_one_six">At Least One Six</option>
                    <option value="even_number">Even Sum</option>
                    <option value="odd_number">Odd Sum</option>
                  </>
                )}
              </select>
            </div>

            {/* Specific Face selector if 1 die specific */}
            {experimentType === 'specific_number' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Die Face:</span>
                  <span className="text-purple-400 font-bold">{targetNumber}</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((face) => (
                    <button
                      key={face}
                      type="button"
                      onClick={() => setTargetNumber(face)}
                      className={`py-1.5 rounded-lg text-xs font-mono border ${
                        targetNumber === face
                          ? 'bg-purple-600 text-white font-bold border-purple-400'
                          : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                      }`}
                    >
                      {face}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sum Target */}
            {experimentType === 'sum_target' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Sum S:</span>
                  <span className="text-purple-400 font-bold">{targetSum}</span>
                </div>
                <input
                  type="range"
                  min={numDice * 1}
                  max={numDice * 6}
                  value={targetSum}
                  onChange={(e) => setTargetSum(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>
            )}

            {/* Number of Trials */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Number of Trials (N)</span>
                <span className="text-purple-400 font-bold">{numTrials.toLocaleString()}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {trialPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNumTrials(preset)}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      numTrials === preset
                        ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-sm'
                        : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {preset >= 1000000 ? '1M' : preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <input
                  type="number"
                  min={1}
                  max={1000000}
                  value={numTrials}
                  onChange={(e) => setNumTrials(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="Custom trial count (max 1,000,000)"
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            {/* Random Seed */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                Random Seed (Optional)
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="e.g. 777 for deterministic reproducibility"
                className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Stage */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <DiceVisual diceValues={diceValues} isRolling={isRolling} />
          </div>

          {/* Metric Cards */}
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

      {/* Sum Distribution Histogram (Theoretical vs Experimental) */}
      {sumDistributionData.length > 0 && result && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 mb-4 gap-2">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                <span>Sum Probability Distribution: Experimental vs Theoretical</span>
              </h3>
              <p className="text-xs text-slate-400">
                Notice the triangular bell curve peaking at Sum = 7 (6 favorable microstates = 16.67%).
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-purple-500 rounded"></span>
                <span className="text-slate-300">Experimental %</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-cyan-400 rounded"></span>
                <span className="text-slate-300">Theoretical %</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sumDistributionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="sum" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="glass-panel p-3 rounded-lg border border-white/10 text-xs font-mono space-y-1">
                          <div className="font-bold text-white">{d.sum}</div>
                          <div className="text-purple-400">Observed Count: {Number(d.count).toLocaleString()}</div>
                          <div className="text-purple-300">Experimental: {d.experimental}%</div>
                          <div className="text-cyan-300">Theoretical: {d.theoretical}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="experimental" fill="#A855F7" radius={[4, 4, 0, 0]} name="Experimental" />
                <Bar dataKey="theoretical" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Theoretical" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Convergence Chart */}
      {result && (
        <ConvergenceChart
          data={result.convergence_data}
          theoreticalP={result.theoretical_probability}
          title="Dice Probability Convergence Trajectory (Law of Large Numbers)"
        />
      )}

      {/* Academic Explainer */}
      {result && <MathExplainer explanation={result.math_explanation} />}
    </div>
  );
};
