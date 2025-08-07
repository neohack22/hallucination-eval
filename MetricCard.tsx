import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-amber-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        {getTrendIcon()}
      </div>
      <div className="space-y-1">
        <p className={`text-2xl font-bold ${getTrendColor()}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

