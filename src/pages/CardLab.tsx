import React, { useState, useEffect } from 'react';
import { probabilityApi } from '../services/api';
import { CardSimulationResponse, CardItem } from '../types';
import { CardVisual } from '../components/CardVisual';
import { StatCard } from '../components/StatCard';
import { ConvergenceChart } from '../components/ConvergenceChart';
import { MathExplainer } from '../components/MathExplainer';
import { soundEngine } from '../utils/sound';
import {
  Layers,
  Play,
  Sliders,
  BarChart3,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  RotateCcw
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

export const CardLab: React.FC = () => {
  const [numTrials, setNumTrials] = useState<number>(1000);
  const [cardsDrawn, setCardsDrawn] = useState<number>(1);
  const [replacement, setReplacement] = useState<boolean>(false);
  const [experimentType, setExperimentType] = useState<string>('draw_ace');
  const [targetSuit, setTargetSuit] = useState<string>('hearts');
  const [seed, setSeed] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CardSimulationResponse | null>(null);

  // Animation state
  const [sampleHand, setSampleHand] = useState<CardItem[]>([
    { suit: 'hearts', symbol: '♥', rank: 'A', color: 'red', code: 'A♥' }
  ]);
  const [isDealing, setIsDealing] = useState<boolean>(false);

  const trialPresets = [10, 100, 1000, 10000, 100000];

  const runSimulation = async (userInitiated = true) => {
    setLoading(true);
    setIsDealing(true);
    setError(null);

    const effectiveCount = experimentType === 'two_aces' ? 2 : cardsDrawn;
    if (userInitiated) {
      soundEngine.playCardDeal(effectiveCount);
    }

    try {
      const parsedSeed = seed.trim() !== '' ? parseInt(seed.trim(), 10) : undefined;
      const res = await probabilityApi.simulateCards({
        num_trials: numTrials,
        cards_drawn: effectiveCount,
        replacement: replacement,
        experiment_type: experimentType,
        target_suit: targetSuit,
        seed: isNaN(parsedSeed as number) ? undefined : parsedSeed,
      });

      if (res.sample_hands && res.sample_hands.length > 0) {
        setSampleHand(res.sample_hands[0]);
      }

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Card simulation failed.');
    } finally {
      setTimeout(() => {
        setIsDealing(false);
        setLoading(false);
        if (userInitiated) {
          soundEngine.playSuccess();
        }
      }, 650);
    }
  };

  useEffect(() => {
    runSimulation(false);
  }, []);

  const handleReset = () => {
    soundEngine.playReset();
    setNumTrials(1000);
    setCardsDrawn(1);
    setReplacement(false);
    setExperimentType('draw_ace');
    setTargetSuit('hearts');
    setSeed('');
  };

  // Format suit distribution for Recharts
  const suitChartData = result
    ? Object.entries(result.suit_distribution).map(([suit, count]) => ({
        suit: suit.toUpperCase(),
        count: count,
        symbol: suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'spades' ? '♠' : '♣',
        color: (suit === 'hearts' || suit === 'diamonds') ? '#EF4444' : '#94A3B8'
      }))
    : [];

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 sm:pb-6 border-b border-white/10 gap-3 sm:gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Playing Card Experiment Laboratory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Standard 52-card deck simulation. Study hypergeometric dependency vs. independent sampling with replacement.
          </p>
        </div>

        <button
          onClick={() => runSimulation(true)}
          disabled={loading}
          className="hidden lg:flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_-3px_rgba(6,182,212,0.5)] transition-all items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{loading ? 'Dealing in Python...' : 'Deal Cards'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Controls + Visuals (Visual Stage first on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column on Desktop / Second on Mobile: Controls */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
          <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                  Card Deck Configuration
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
                title="Reset parameters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Replacement Toggle (Hypergeometric vs Binomial) */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Sampling Mode</span>
                <span className={replacement ? 'text-blue-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {replacement ? 'With Replacement' : 'Without Replacement'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playToggle(false);
                    setReplacement(false);
                  }}
                  className={`py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-mono transition-all border active:scale-95 ${
                    !replacement
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/40 shadow-sm'
                      : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                  }`}
                >
                  Without (Hypergeom)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playToggle(true);
                    setReplacement(true);
                  }}
                  className={`py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-mono transition-all border active:scale-95 ${
                    replacement
                      ? 'bg-blue-500/20 text-blue-300 font-bold border-blue-500/40 shadow-sm'
                      : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                  }`}
                >
                  With (Independent)
                </button>
              </div>
            </div>

            {/* Experiment Scenario */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                Target Card Event
              </label>
              <select
                value={experimentType}
                onChange={(e) => {
                  soundEngine.playClick();
                  const val = e.target.value;
                  setExperimentType(val);
                  if (val === 'two_aces') {
                    setCardsDrawn(2);
                  }
                }}
                className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="draw_ace">Draw an Ace (4 in deck) — P = 4/52 (1/13)</option>
                <option value="draw_king">Draw a King (4 in deck) — P = 4/52 (1/13)</option>
                <option value="draw_queen">Draw a Queen (4 in deck) — P = 4/52 (1/13)</option>
                <option value="draw_face_card">Draw a Face Card (J, Q, K) — P = 12/52 (3/13)</option>
                <option value="draw_red">Draw a Red Card (Hearts or Diamonds) — P = 26/52 (1/2)</option>
                <option value="draw_black">Draw a Black Card (Spades or Clubs) — P = 26/52 (1/2)</option>
                <option value="draw_suit">Draw a Specific Suit — P = 13/52 (1/4)</option>
                <option value="two_aces">Draw Two Aces in 2 Cards</option>
                <option value="at_least_one_ace">At Least One Ace in Draw</option>
              </select>
            </div>

            {/* Specific Suit Selection */}
            {experimentType === 'draw_suit' && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                  Target Suit
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'hearts', label: 'Hearts ♥', color: 'text-red-400' },
                    { id: 'diamonds', label: 'Diamonds ♦', color: 'text-red-400' },
                    { id: 'spades', label: 'Spades ♠', color: 'text-slate-300' },
                    { id: 'clubs', label: 'Clubs ♣', color: 'text-slate-300' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(2);
                        setTargetSuit(s.id);
                      }}
                      className={`py-2 rounded-lg text-xs font-mono border active:scale-95 ${
                        targetSuit === s.id
                          ? 'bg-cyan-600/30 text-white font-bold border-cyan-400'
                          : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                      }`}
                    >
                      <span className={s.color}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cards drawn slider (if not two_aces) */}
            {experimentType !== 'two_aces' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Cards Drawn per Trial:</span>
                  <span className="text-cyan-400 font-bold">{cardsDrawn} Card(s)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={cardsDrawn}
                  onChange={(e) => {
                    soundEngine.playTick();
                    setCardsDrawn(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-cyan-500 text-cyan-400 bg-midnight-900"
                />
              </div>
            )}

            {/* Number of Trials */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Number of Trials (N)</span>
                <span className="text-cyan-400 font-bold">{numTrials.toLocaleString()}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {trialPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1);
                      setNumTrials(preset);
                    }}
                    className={`py-2 rounded-lg text-xs font-mono transition-all border active:scale-95 ${
                      numTrials === preset
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                        : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <input
                  type="number"
                  min={1}
                  max={500000}
                  value={numTrials}
                  onChange={(e) => setNumTrials(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="Custom trial count (max 500,000)"
                  className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
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
                placeholder="e.g. 52 (for exact reproducible hand draws)"
                className="w-full bg-midnight-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column on Desktop / First on Mobile: Visual Stage + Integrated Deal Action Bar */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 sm:space-y-6">
          <div className="glass-stage rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="uppercase tracking-wider text-cyan-300/90">
                {experimentType.replace(/_/g, ' ')}
              </span>
              <span>N = {numTrials.toLocaleString()}</span>
            </div>

            <CardVisual
              cards={sampleHand}
              isDealing={isDealing}
              replacement={replacement}
              onStageClick={() => runSimulation(true)}
            />

            {/* Integrated Action Bar directly beneath Cards */}
            <div className="w-full pt-3 mt-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 overflow-x-auto no-scrollbar">
                {[100, 1000, 10000, 100000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1);
                      setNumTrials(preset);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all border active:scale-95 shrink-0 ${
                      numTrials === preset
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-400/50'
                        : 'bg-midnight-900/80 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => runSimulation(true)}
                disabled={loading}
                className="px-5 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_22px_-3px_rgba(6,182,212,0.55)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{loading ? 'Dealing in Python...' : 'Deal Cards & Simulate'}</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          {result && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
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

      {/* Suit Distribution Bar Chart */}
      {suitChartData.length > 0 && result && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Empirical Suit Frequency Across All Drawn Cards</span>
              </h3>
              <p className="text-xs text-slate-400">
                In a balanced deck, each suit comprises exactly 25.0% of the sample space (13 / 52 cards).
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Total Cards Sampled: <span className="text-cyan-400 font-bold">{(result.total_trials * result.cards_drawn).toLocaleString()}</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={suitChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="suit" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const pct = (((d.count) / (result.total_trials * result.cards_drawn)) * 100).toFixed(2);
                      return (
                        <div className="glass-panel p-3 rounded-lg border border-white/10 text-xs font-mono space-y-1">
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span>{d.suit}</span>
                            <span>{d.symbol}</span>
                          </div>
                          <div className="text-cyan-400">Drawn Count: {Number(d.count).toLocaleString()}</div>
                          <div className="text-purple-300">Empirical Share: {pct}% (Theoretical: 25.00%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
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
          title="Card Probability Convergence Curve (Law of Large Numbers)"
        />
      )}

      {/* Academic Explainer */}
      {result && <MathExplainer explanation={result.math_explanation} />}
    </div>
  );
};

