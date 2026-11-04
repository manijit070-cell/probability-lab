import React, { useState, useEffect } from 'react';
import { probabilityApi } from '../services/api';
import { LLNAnalysisResponse, LLNScalePoint } from '../types';
import { StatCard } from '../components/StatCard';
import {
  BarChart3,
  TrendingDown,
  Activity,
  Play,
  Cpu,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import katex from 'katex';

export const StatisticsLab: React.FC = () => {
  const [domain, setDomain] = useState<'coin' | 'dice' | 'card'>('coin');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LLNAnalysisResponse | null>(null);

  const runLLNAnalysis = async (selectedDomain: 'coin' | 'dice' | 'card') => {
    setLoading(true);
    setError(null);

    try {
      const res = await probabilityApi.analyzeLLN({
        experiment_domain: selectedDomain,
        scenario: 'default',
      });
      setAnalysis(res);
    } catch (err: any) {
      setError(err.message || 'Failed to execute multi-scale LLN analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runLLNAnalysis(domain);
  }, [domain]);

  const renderLatex = (latex: string) => {
    try {
      return {
        __html: katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
        }),
      };
    } catch {
      return { __html: `<code>${latex}</code>` };
    }
  };

  // Format data for Error Decay chart
  const errorDecayChartData = analysis
    ? analysis.scales.map((s) => ({
        scale: `${s.trials.toLocaleString()} trials`,
        trials: s.trials,
        absoluteError: parseFloat(s.absolute_error.toFixed(5)),
        standardError: parseFloat(s.standard_error.toFixed(5)),
        marginOfError: parseFloat(s.margin_of_error.toFixed(5)),
        experimental: parseFloat(s.experimental.toFixed(5)),
        theoretical: parseFloat(s.theoretical.toFixed(5)),
      }))
    : [];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Statistics & Law of Large Numbers (LLN) Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze multi-scale asymptotic convergence and empirical variance decay calculated across logarithmic trial orders in Python.
          </p>
        </div>

        <button
          onClick={() => runLLNAnalysis(domain)}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_-3px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{loading ? 'Analyzing in Python...' : 'Re-Run Multi-Scale LLN'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Domain Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Select Experiment Domain to Benchmark:</span>
        </div>

        <div className="flex items-center space-x-2">
          {[
            { id: 'coin' as const, label: 'Coin Flip (P=0.5000)' },
            { id: 'dice' as const, label: 'Dice Sum of 7 (P=0.1667)' },
            { id: 'card' as const, label: 'Draw an Ace (P=0.0769)' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                domain === d.id
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                  : 'bg-midnight-900 text-slate-400 hover:text-white border-white/5'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Scale Asymptotic Results Table */}
      {analysis && (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-white/5 bg-midnight-900/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Multi-Scale Empirical Trial Progression (10 to 100,000 Trials)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Theoretical Benchmark Probability: <span className="text-cyan-300 font-mono font-bold">{analysis.theoretical_probability.toFixed(5)}</span>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono divide-y divide-white/5">
              <thead className="bg-midnight-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Trial Scale (N)</th>
                  <th className="px-6 py-3.5 text-cyan-300">Experimental P_exp</th>
                  <th className="px-6 py-3.5 text-purple-300">Theoretical P_theo</th>
                  <th className="px-6 py-3.5 text-amber-300">Absolute Error</th>
                  <th className="px-6 py-3.5 text-slate-300">Percentage Error</th>
                  <th className="px-6 py-3.5 text-emerald-300">Standard Error (SE)</th>
                  <th className="px-6 py-3.5 text-slate-300">Margin of Error (95%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-midnight-900/40 text-slate-200">
                {analysis.scales.map((point) => (
                  <tr key={point.trials} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{point.trials.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-cyan-300 font-bold">{point.experimental.toFixed(5)}</td>
                    <td className="px-6 py-4 text-purple-300">{point.theoretical.toFixed(5)}</td>
                    <td className="px-6 py-4 text-amber-300 font-semibold">{point.absolute_error.toFixed(5)}</td>
                    <td className="px-6 py-4 text-slate-300">
                      {point.percentage_error !== null ? `${point.percentage_error.toFixed(2)}%` : '0%'}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-mono">{point.standard_error.toFixed(5)}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono">±{point.margin_of_error.toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error & Uncertainty Decay Chart */}
      {errorDecayChartData.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 mb-4 gap-2">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>Empirical Error & Standard Error Decay Curve</span>
              </h3>
              <p className="text-xs text-slate-400">
                Notice how Standard Error decays at the theoretical rate O(1 / √N) as trials scale from 10 to 100,000.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-amber-400 rounded"></span>
                <span className="text-slate-300">Absolute Error</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 rounded"></span>
                <span className="text-slate-300">Standard Error (SE)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorDecayChartData} margin={{ top: 10, right: 25, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="scale" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => v.toFixed(3)} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="glass-panel p-3 rounded-lg border border-white/10 text-xs font-mono space-y-1">
                          <div className="font-bold text-white">{d.scale}</div>
                          <div className="text-amber-400">Absolute Error: {d.absoluteError.toFixed(5)}</div>
                          <div className="text-emerald-400">Standard Error: {d.standardError.toFixed(5)}</div>
                          <div className="text-cyan-300">P_exp: {d.experimental.toFixed(5)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="absoluteError"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F59E0B' }}
                  name="Absolute Error"
                />
                <Line
                  type="monotone"
                  dataKey="standardError"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981' }}
                  name="Standard Error"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Academic Theorem Presentation */}
      <div className="glass-panel p-8 rounded-2xl border border-purple-500/20 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
              Academic Formulation
            </span>
            <h2 className="text-lg font-bold text-white">
              Rigorous Mathematical Formulation of the Law of Large Numbers
            </h2>
          </div>
        </div>

        {/* Khinchin's Weak Law */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200">1. Weak Law of Large Numbers (WLLN - Khinchin)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Let X₁, X₂, ..., Xₙ be a sequence of independent and identically distributed (i.i.d.) random variables
            with finite expected value E[X] = μ. For any positive margin ε &gt; 0:
          </p>
          <div
            className="p-4 rounded-xl bg-midnight-950 border border-white/5 overflow-x-auto text-purple-300 text-sm"
            dangerouslySetInnerHTML={renderLatex(
              String.raw`\lim_{n \to \infty} P\left( \left| \frac{1}{n}\sum_{i=1}^n X_i - \mu \right| \ge \varepsilon \right) = 0`
            )}
          />
        </div>

        {/* Strong Law */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h4 className="text-sm font-semibold text-slate-200">2. Strong Law of Large Numbers (SLLN - Kolmogorov)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            The sample mean converges almost surely (with probability 1) to the expected value:
          </p>
          <div
            className="p-4 rounded-xl bg-midnight-950 border border-white/5 overflow-x-auto text-cyan-300 text-sm"
            dangerouslySetInnerHTML={renderLatex(
              String.raw`P\left( \lim_{n \to \infty} \bar{X}_n = \mu \right) = 1`
            )}
          />
        </div>

        {/* Statistical Nuance & Gambler's Fallacy Warning */}
        <div className="p-4 rounded-xl bg-midnight-900 border border-white/10 flex items-start space-x-3 text-xs text-slate-300">
          <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-purple-300 block mb-1">
              Critical Academic Distinction: Gambler's Fallacy vs. Law of Averages
            </span>
            The Law of Large Numbers does <strong>NOT</strong> state that future trials will compensate for past imbalances (e.g., getting 5 Heads in a row does not make Tails more likely on the 6th flip). Each flip remains strictly independent ($P=0.5$). The convergence occurs solely through <em>dilution</em>: the denominator $n$ grows much faster than finite numerator fluctuations.
          </div>
        </div>
      </div>
    </div>
  );
};
