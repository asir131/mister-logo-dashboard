import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}
export function MetricCard({
  label,
  value,
  trend,
  trendDirection,
  icon: Icon
}: MetricCardProps) {
  return <div className="bg-surface border border-slate-700/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-800/50 rounded-lg group-hover:bg-primary/10 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend !== undefined && <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trendDirection === 'up' ? 'bg-green-500/10 text-green-400' : trendDirection === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
            {trendDirection === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
            {trendDirection === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trendDirection === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
            {trend}%
          </div>}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-text-primary mb-1">{value}</h3>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </div>;
}