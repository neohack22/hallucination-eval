import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAppStore from '../../store/appStore';

const ComparisonDashboard: React.FC = () => {
  const { getComparisonData, selectedModelsForComparison } = useAppStore();
  const comparisonData = getComparisonData();

  const modelColors = {
    'gemma3:1b': '#3B82F6',   // Blue
    'gemma3:4b': '#10B981',   // Green  
    'gemma3:27b': '#F59E0B'   // Orange
  };

  const modelLabels = {
    'gemma3:1b': 'Gemma 1B',
    'gemma3:4b': 'Gemma 4B',
    'gemma3:27b': 'Gemma 27B'
  };

  // Prepare overall accuracy comparison data
  const overallAccuracyData = selectedModelsForComparison.map(model => ({
    model: modelLabels[model as keyof typeof modelLabels],
    accuracy: (comparisonData[model]?.accuracy || 0) * 100,
    confidence: comparisonData[model]?.avgConfidence || 0,
    totalEvents: comparisonData[model]?.totalEvents || 0
  }));

  // Prepare category comparison data
  const allCategories = new Set<string>();
  Object.values(comparisonData).forEach((data: any) => {
    data.categoryStats?.forEach((stat: any) => allCategories.add(stat.category));
  });

  const categoryComparisonData = Array.from(allCategories).map(category => {
    const dataPoint: any = { category };
    selectedModelsForComparison.forEach(model => {
      const modelData = comparisonData[model];
      const categoryData = modelData?.categoryStats?.find((stat: any) => stat.category === category);
      dataPoint[modelLabels[model as keyof typeof modelLabels]] = (categoryData?.accuracy || 0) * 100;
    });
    return dataPoint;
  });

  if (selectedModelsForComparison.length === 0) {
    return (
      <div className="w-full md:w-[500px] bg-white border-l border-slate-200 h-full overflow-y-auto">
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Model Comparison
          </h2>
          <div className="text-center text-slate-500 mt-8">
            <p>Sélectionnez au moins un modèle pour commencer la comparaison</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[500px] bg-white border-l border-slate-200 h-full overflow-y-auto">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Model Comparison
        </h2>

        {/* Overall Metrics Comparison */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-slate-800 mb-4">Overall Performance</h3>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {selectedModelsForComparison.map(model => {
              const data = comparisonData[model];
              const color = modelColors[model as keyof typeof modelColors];
              return (
                <div key={model} className="p-3 md:p-4 rounded-lg border" style={{ borderColor: color }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm md:text-base" style={{ color }}>
                      {modelLabels[model as keyof typeof modelLabels]}
                    </h4>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                    <div>
                      <div className="text-slate-600">Accuracy</div>
                      <div className="font-semibold text-base md:text-lg" style={{ color }}>
                        {((data?.accuracy || 0) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600">Confidence</div>
                      <div className="font-semibold text-base md:text-lg" style={{ color }}>
                        {(data?.avgConfidence || 0).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600">Events</div>
                      <div className="font-semibold text-base md:text-lg" style={{ color }}>
                        {data?.totalEvents || 0}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Accuracy Bar Chart */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-slate-800 mb-4">Accuracy Comparison</h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="model" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 100]} fontSize={10} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Accuracy']} />
                <Bar dataKey="accuracy" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Comparison */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-slate-800 mb-4">Accuracy by Category</h3>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryComparisonData} margin={{ left: 10, right: 10, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={8}
                />
                <YAxis domain={[0, 100]} fontSize={10} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Accuracy']} />
                <Legend fontSize={10} />
                {selectedModelsForComparison.map(model => (
                  <Bar 
                    key={model}
                    dataKey={modelLabels[model as keyof typeof modelLabels]}
                    fill={modelColors[model as keyof typeof modelColors]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 rounded-lg p-3 md:p-4">
          <h3 className="text-md font-medium text-blue-900 mb-2">
            Comparison Insights
          </h3>
          <ul className="text-xs md:text-sm text-blue-800 space-y-1">
            <li>• {selectedModelsForComparison.length} models selected for comparison</li>
            <li>• Best performing model: {
              overallAccuracyData.reduce((best, current) => 
                current.accuracy > best.accuracy ? current : best
              ).model
            }</li>
            <li>• Most confident model: {
              overallAccuracyData.reduce((best, current) => 
                current.confidence > best.confidence ? current : best
              ).model
            }</li>
            <li>• Performance varies significantly across categories</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComparisonDashboard;

