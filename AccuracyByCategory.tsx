import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoryStats } from '../../types';

interface AccuracyByCategoryProps {
  data: CategoryStats[];
}

const AccuracyByCategory: React.FC<AccuracyByCategoryProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    accuracyPercent: item.accuracy * 100,
    shortCategory: item.category.split(' ')[0] // Shorten category names for display
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{data.category}</p>
          <p className="text-sm text-slate-600">
            Accuracy: <span className="font-medium">{data.accuracyPercent.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-slate-600">
            Events: <span className="font-medium">{data.count}</span>
          </p>
          <p className="text-sm text-slate-600">
            Avg Confidence: <span className="font-medium">{data.avgConfidence.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="shortCategory" 
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
          <Bar 
            dataKey="accuracyPercent" 
            fill="#3b82f6"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyByCategory;

