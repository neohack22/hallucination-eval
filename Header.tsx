import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, BarChart3, Eye } from 'lucide-react';
import useAppStore from '../store/appStore';

const Header: React.FC = () => {
  const { 
    selectedModel, 
    setSelectedModel, 
    exportData, 
    isLoading,
    comparisonMode,
    toggleComparisonMode,
    selectedModelsForComparison,
    setSelectedModelsForComparison
  } = useAppStore();

  const models = [
    { value: 'gemma3:1b', label: 'Gemma 1B' },
    { value: 'gemma3:4b', label: 'Gemma 4B' },
    { value: 'gemma3:27b', label: 'Gemma 27B' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-slate-900 truncate">
            Gemma Hallucination Visualizer
          </h1>
          <div className="hidden md:block h-6 w-px bg-slate-300" />
          
          {!comparisonMode ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm font-medium text-slate-700 hidden sm:block">Model:</span>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-24 md:w-40 bg-blue-50 border-blue-200 text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {models.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center space-x-2 md:space-x-3 flex-wrap">
              <span className="text-xs md:text-sm font-medium text-slate-700 hidden sm:block">Compare:</span>
              {models.map(model => (
                <label key={model.value} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedModelsForComparison.includes(model.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModelsForComparison([...selectedModelsForComparison, model.value]);
                      } else {
                        setSelectedModelsForComparison(selectedModelsForComparison.filter(m => m !== model.value));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-xs md:text-sm font-medium text-slate-700">{model.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 md:space-x-3">
          <Button
            variant={comparisonMode ? "default" : "outline"}
            size="sm"
            onClick={toggleComparisonMode}
            className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 md:px-3"
          >
            {comparisonMode ? <Eye className="h-3 w-3 md:h-4 md:w-4" /> : <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />}
            <span className="hidden sm:inline">{comparisonMode ? 'Single View' : 'Compare Models'}</span>
          </Button>
          
          <div className="hidden md:block h-6 w-px bg-slate-300" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('csv')}
            disabled={isLoading}
            className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 md:px-3"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('json')}
            disabled={isLoading}
            className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 md:px-3"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">JSON</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

