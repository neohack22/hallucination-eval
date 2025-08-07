import React from 'react';
import MetricCard from './MetricCard';
import AccuracyByCategory from './AccuracyByCategory';
import ConfidenceHistogram from './ConfidenceHistogram';
import TimelineChart from './TimelineChart';
import { AppStats, ChartData } from '../../types';

interface ResultsDashboardProps {
  stats: AppStats;
  chartData: ChartData;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ stats, chartData }) => {
  const getTrend = (accuracy: number) => {
    if (accuracy > 0.7) return 'up';
    if (accuracy > 0.5) return 'neutral';
    return 'down';
  };

  return (
    <div className="w-full md:w-[500px] bg-white border-l border-slate-200 h-full overflow-y-auto">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Analysis Results
        </h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6 md:mb-8">
          <MetricCard
            title="Overall Accuracy"
            value={`${(stats.accuracy * 100).toFixed(1)}%`}
            subtitle={`${stats.totalEvents} events analyzed`}
            trend={getTrend(stats.accuracy)}
          />
          <MetricCard
            title="Average Confidence"
            value={stats.avgConfidence.toFixed(2)}
            subtitle="Model confidence score"
          />
          <MetricCard
            title="Total Events"
            value={stats.totalEvents.toString()}
            subtitle="Filtered dataset size"
          />
        </div>
        
        {/* Charts */}
        <div className="space-y-6 md:space-y-8">
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">
              Accuracy by Category
            </h3>
            <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
              <div className="h-48 md:h-64">
                <AccuracyByCategory data={chartData.categoryAccuracy} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">
              Confidence Distribution
            </h3>
            <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
              <div className="h-48 md:h-64">
                <ConfidenceHistogram data={chartData.confidenceDistribution} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">
              Timeline Analysis
            </h3>
            <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
              <div className="h-48 md:h-64">
                <TimelineChart data={chartData.timelineData} />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Key Insights
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• {chartData.categoryAccuracy.length > 0 && 
              `Best performing category: ${chartData.categoryAccuracy
                .sort((a, b) => b.accuracy - a.accuracy)[0]?.category}`}
            </li>
            <li>• {chartData.timelineData.length > 0 && 
              `Most accurate period: ${chartData.timelineData
                .sort((a, b) => b.accuracy - a.accuracy)[0]?.period}`}
            </li>
            <li>• Confidence correlates with accuracy patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;

