import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { ConvergencePoint } from '../types';
import { Activity } from 'lucide-react';

interface ConvergenceChartProps {
  data: ConvergencePoint[];
  theoreticalP: number;
  title?: string;
  metricLabel?: string;
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({
  data,
  theoreticalP,
  title = "Stochastic Convergence Trajectory (Law of Large Numbers)",
  metricLabel = "Experimental Relative Frequency"
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center text-slate-500">
        <Activity className="w-8 h-8 mb-2 animate-pulse text-purple-400" />
        <p className="text-sm">Run simulation to visualize experimental probability convergence.</p>
      </div>
    );
  }

  // Calculate clean Y bounds around theoretical probability
  const values = data.map(d => d.experimental);
  const minVal = Math.min(...values, theoreticalP);
  const maxVal = Math.max(...values, theoreticalP);
  const padding = Math.max(0.05, (maxVal - minVal) * 0.25);
  const yDomain = [
    Math.max(0, parseFloat((minVal - padding).toFixed(3))),
    Math.min(1, parseFloat((maxVal + padding).toFixed(3)))
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating <code className="text-cyan-300 font-mono">P_exp → P_theo</code> as trial count N expands.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded"></span>
            <span className="text-slate-300">Experimental P</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-purple-400"></span>
            <span className="text-purple-300">Theoretical ({theoreticalP.toFixed(4)})</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 25, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="trial"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              domain={yDomain}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(3)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as ConvergencePoint;
                  return (
                    <div className="glass-panel p-3 rounded-lg border border-white/10 shadow-xl text-xs font-mono space-y-1">
                      <div className="font-bold text-slate-200 border-b border-white/10 pb-1">
                        Trial #{Number(label).toLocaleString()}
                      </div>
                      <div className="text-cyan-400 flex justify-between space-x-4">
                        <span>{metricLabel}:</span>
                        <span className="font-bold">{d.experimental.toFixed(5)}</span>
                      </div>
                      <div className="text-purple-300 flex justify-between space-x-4">
                        <span>Theoretical P(E):</span>
                        <span>{d.theoretical.toFixed(5)}</span>
                      </div>
                      <div className="text-slate-400 flex justify-between space-x-4 pt-1 border-t border-white/5">
                        <span>Absolute Error:</span>
                        <span className="text-amber-400">{d.absolute_error.toFixed(5)}</span>
                      </div>
                      <div className="text-slate-400 flex justify-between space-x-4">
                        <span>Cumulative Successes:</span>
                        <span>{d.successes.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Theoretical Reference Line */}
            <ReferenceLine
              y={theoreticalP}
              stroke="#A855F7"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `P(E) = ${theoreticalP.toFixed(4)}`,
                position: 'insideTopRight',
                fill: '#C084FC',
                fontSize: 11,
                fontFamily: 'monospace'
              }}
            />
            {/* Experimental Convergence Line */}
            <Line
              type="monotone"
              dataKey="experimental"
              stroke="#06B6D4"
              strokeWidth={2.5}
              dot={data.length <= 25 ? { fill: '#06B6D4', r: 3 } : false}
              activeDot={{ r: 5, fill: '#38BDF8', stroke: '#080D1C', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
