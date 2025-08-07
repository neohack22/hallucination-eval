import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DistributionData } from '../../types';

interface ConfidenceHistogramProps {
  data: DistributionData[];
}

const ConfidenceHistogram: React.FC<ConfidenceHistogramProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">Confidence: {data.range}</p>
          <p className="text-sm text-slate-600">
            Count: <span className="font-medium">{data.count}</span>
          </p>
          <p className="text-sm text-slate-600">
            Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 10 }}
            stroke="#64748b"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="#64748b"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="#8b5cf6"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConfidenceHistogram;

