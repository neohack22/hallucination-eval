import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelineData } from '../../types';

interface TimelineChartProps {
  data: TimelineData[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    accuracyPercent: item.accuracy * 100
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{data.period}</p>
          <p className="text-sm text-slate-600">
            Accuracy: <span className="font-medium">{data.accuracyPercent.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-slate-600">
            Events: <span className="font-medium">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 10 }}
            stroke="#64748b"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="#64748b"
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="accuracyPercent" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;

