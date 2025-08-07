import { create } from 'zustand';
import { EventData, CategoryStats, DistributionData, TimelineData, AppStats, ChartData } from '../types';

interface AppState {
  // Data management
  rawData: Record<string, EventData[]>;
  filteredData: EventData[];
  isLoading: boolean;
  error: string | null;
  
  // UI state
  selectedModel: string;
  activeFilters: Record<string, string[]>;
  expandedFilterGroups: Set<string>;
  selectedEvent: EventData | null;
  mapRegion: string | null;
  
  // Comparison mode
  comparisonMode: boolean;
  selectedModelsForComparison: string[];
  
  // Computed data
  accuracyByRegion: Record<string, number>;
  categoryStats: CategoryStats[];
  confidenceDistribution: DistributionData[];
  timelineData: TimelineData[];
  
  // Actions
  loadModelData: (model: string) => Promise<void>;
  applyFilters: (group: string, filters: string[]) => void;
  toggleFilterGroup: (groupId: string) => void;
  selectEvent: (event: EventData | null) => void;
  exportData: (format: 'csv' | 'json') => void;
  resetFilters: (group?: string) => void;
  setSelectedModel: (model: string) => void;
  setMapRegion: (region: string | null) => void;
  toggleComparisonMode: () => void;
  setSelectedModelsForComparison: (models: string[]) => void;
  
  // Computed getters
  getStats: () => AppStats;
  getChartData: () => ChartData;
  getComparisonData: () => Record<string, any>;
}

const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  rawData: {},
  filteredData: [],
  isLoading: false,
  error: null,
  selectedModel: 'gemma3:1b',
  activeFilters: {},
  expandedFilterGroups: new Set(['geographic']),
  selectedEvent: null,
  mapRegion: null,
  comparisonMode: false,
  selectedModelsForComparison: ['gemma3:1b', 'gemma3:4b'],
  accuracyByRegion: {},
  categoryStats: [],
  confidenceDistribution: [],
  timelineData: [],

  // Actions
  loadModelData: async (model: string) => {
    set({ isLoading: true, error: null });
    try {
      let url = "";
      switch (model) {
        case "gemma3:1b":
          url = "https://raw.githubusercontent.com/sergeicu/hierarchical_reasoning_model_vs_wikipedia/main/demo_gemma/output/results_gemma3_1b.json";
          break;
        case "gemma3:4b":
          url = "https://raw.githubusercontent.com/sergeicu/hierarchical_reasoning_model_vs_wikipedia/main/demo_gemma/output/results_gemma3_4b.json";
          break;
        case "gemma3:27b":
          url = "https://raw.githubusercontent.com/sergeicu/hierarchical_reasoning_model_vs_wikipedia/main/demo_gemma/output/results_gemma3_27b.json";
          break;
        default:
          throw new Error("Modèle non supporté");
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur de chargement des données: ${response.statusText}`);
      }
      const data: EventData[] = await response.json();
      set(state => ({
        rawData: { ...state.rawData, [model]: data },
        filteredData: data,
        isLoading: false,
        selectedModel: model
      }));
      
      // Update computed data
      get().updateComputedData();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  applyFilters: (group: string, filters: string[]) => {
    set(state => {
      const newActiveFilters = { ...state.activeFilters, [group]: filters };
      const filteredData = filterData(state.rawData[state.selectedModel] || [], newActiveFilters);
      
      return {
        activeFilters: newActiveFilters,
        filteredData
      };
    });
    get().updateComputedData();
  },

  toggleFilterGroup: (groupId: string) => {
    set(state => {
      const newExpanded = new Set(state.expandedFilterGroups);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return { expandedFilterGroups: newExpanded };
    });
  },

  selectEvent: (event: EventData | null) => {
    set({ selectedEvent: event });
  },

  exportData: (format: 'csv' | 'json') => {
    const { filteredData } = get();
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredData, null, 2);
      downloadFile(dataStr, 'gemma-analysis.json', 'application/json');
    } else {
      const csvStr = convertToCSV(filteredData);
      downloadFile(csvStr, 'gemma-analysis.csv', 'text/csv');
    }
  },

  resetFilters: (group?: string) => {
    set(state => {
      if (group) {
        const newActiveFilters = { ...state.activeFilters };
        delete newActiveFilters[group];
        const filteredData = filterData(state.rawData[state.selectedModel] || [], newActiveFilters);
        return { activeFilters: newActiveFilters, filteredData };
      } else {
        const filteredData = state.rawData[state.selectedModel] || [];
        return { activeFilters: {}, filteredData };
      }
    });
    get().updateComputedData();
  },

  setSelectedModel: (model: string) => {
    set({ selectedModel: model });
    if (!get().rawData[model]) {
      get().loadModelData(model);
    } else {
      set({ filteredData: get().rawData[model] });
      get().updateComputedData();
    }
  },

  setMapRegion: (region: string | null) => {
    set({ mapRegion: region });
  },

  toggleComparisonMode: () => {
    set(state => ({ comparisonMode: !state.comparisonMode }));
  },

  setSelectedModelsForComparison: (models: string[]) => {
    set({ selectedModelsForComparison: models });
    // Load data for selected models if not already loaded
    const { rawData, loadModelData } = get();
    models.forEach(model => {
      if (!rawData[model]) {
        loadModelData(model);
      }
    });
  },

  getStats: (): AppStats => {
    const { filteredData } = get();
    const totalEvents = filteredData.length;
    const correctEvents = filteredData.filter(event => event.is_correct).length;
    const accuracy = totalEvents > 0 ? correctEvents / totalEvents : 0;
    const avgConfidence = totalEvents > 0 
      ? filteredData.reduce((sum, event) => sum + event.confidence_score, 0) / totalEvents 
      : 0;

    return { accuracy, totalEvents, avgConfidence };
  },

  getChartData: (): ChartData => {
    const { categoryStats, confidenceDistribution, timelineData } = get();
    return {
      categoryAccuracy: categoryStats,
      confidenceDistribution,
      timelineData
    };
  },

  getComparisonData: () => {
    const { selectedModelsForComparison, rawData, activeFilters } = get();
    const comparisonData: Record<string, any> = {};
    
    selectedModelsForComparison.forEach(model => {
      const data = rawData[model] || [];
      const filteredData = filterData(data, activeFilters);
      
      const totalEvents = filteredData.length;
      const correctEvents = filteredData.filter(event => event.is_correct).length;
      const accuracy = totalEvents > 0 ? correctEvents / totalEvents : 0;
      const avgConfidence = totalEvents > 0 
        ? filteredData.reduce((sum, event) => sum + event.confidence_score, 0) / totalEvents 
        : 0;

      // Calculate category stats for this model
      const categoryMap: Record<string, { correct: number; total: number }> = {};
      filteredData.forEach(event => {
        const category = event.event.primary_category;
        if (!categoryMap[category]) {
          categoryMap[category] = { correct: 0, total: 0 };
        }
        categoryMap[category].total++;
        if (event.is_correct) {
          categoryMap[category].correct++;
        }
      });

      const categoryStats = Object.entries(categoryMap).map(([category, stats]) => ({
        category,
        accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
        count: stats.total
      }));

      comparisonData[model] = {
        accuracy,
        totalEvents,
        avgConfidence,
        categoryStats,
        data: filteredData
      };
    });
    
    return comparisonData;
  },

  // Helper method to update computed data
  updateComputedData: () => {
    const { filteredData } = get();
    
    // Calculate accuracy by region
    const accuracyByRegion: Record<string, number> = {};
    const regionCounts: Record<string, { correct: number; total: number }> = {};
    
    filteredData.forEach(event => {
      const region = event.event.continental;
      if (!regionCounts[region]) {
        regionCounts[region] = { correct: 0, total: 0 };
      }
      regionCounts[region].total++;
      if (event.is_correct) {
        regionCounts[region].correct++;
      }
    });
    
    Object.entries(regionCounts).forEach(([region, counts]) => {
      accuracyByRegion[region] = counts.total > 0 ? counts.correct / counts.total : 0;
    });

    // Calculate category stats
    const categoryMap: Record<string, { correct: number; total: number; confidenceSum: number }> = {};
    filteredData.forEach(event => {
      const category = event.event.primary_category;
      if (!categoryMap[category]) {
        categoryMap[category] = { correct: 0, total: 0, confidenceSum: 0 };
      }
      categoryMap[category].total++;
      categoryMap[category].confidenceSum += event.confidence_score;
      if (event.is_correct) {
        categoryMap[category].correct++;
      }
    });

    const categoryStats: CategoryStats[] = Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
      count: stats.total,
      avgConfidence: stats.total > 0 ? stats.confidenceSum / stats.total : 0
    }));

    // Calculate confidence distribution
    const confidenceBins = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const confidenceDistribution: DistributionData[] = [];
    
    for (let i = 0; i < confidenceBins.length - 1; i++) {
      const min = confidenceBins[i];
      const max = confidenceBins[i + 1];
      const count = filteredData.filter(event => 
        event.confidence_score >= min && event.confidence_score < max
      ).length;
      
      confidenceDistribution.push({
        range: `${min.toFixed(1)}-${max.toFixed(1)}`,
        count,
        percentage: filteredData.length > 0 ? (count / filteredData.length) * 100 : 0
      });
    }

    // Calculate timeline data
    const timelineMap: Record<string, { correct: number; total: number }> = {};
    filteredData.forEach(event => {
      const period = event.event.historical_period;
      if (!timelineMap[period]) {
        timelineMap[period] = { correct: 0, total: 0 };
      }
      timelineMap[period].total++;
      if (event.is_correct) {
        timelineMap[period].correct++;
      }
    });

    const timelineData: TimelineData[] = Object.entries(timelineMap).map(([period, stats]) => ({
      period,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
      count: stats.total
    }));

    set({ accuracyByRegion, categoryStats, confidenceDistribution, timelineData });
  }
}));

// Helper functions


function filterData(data: EventData[], activeFilters: Record<string, string[]>): EventData[] {
  return data.filter(event => {
    return Object.entries(activeFilters).every(([group, filters]) => {
      if (filters.length === 0) return true;
      
      // Check if event matches any of the filters in this group
      return filters.some(filter => {
        switch (group) {
          case 'geographic':
            return event.event.continental === filter || 
                   event.event.cultural_region === filter ||
                   event.event.development_status === filter ||
                   event.event.colonial_status === filter;
          case 'temporal':
            return event.event.century === filter ||
                   event.event.decade === filter ||
                   event.event.historical_period === filter ||
                   event.event.seasonal === filter;
          case 'event_characteristics':
            return event.event.primary_category === filter ||
                   event.event.violence_level === filter ||
                   event.event.scale === filter ||
                   event.event.human_impact === filter;
          case 'societal_context':
            return event.event.development_status === filter ||
                   event.event.colonial_status === filter ||
                   event.event.seasonal === filter;
          default:
            return false;
        }
      });
    });
  });
}

function convertToCSV(data: EventData[]): string {
  const headers = ['Model', 'Event Text', 'Ground Truth Year', 'Model Response', 'Is Correct', 'Confidence', 'Category', 'Region'];
  const rows = data.map(event => [
    event.model_name,
    event.event.text,
    event.event.year,
    event.model_response,
    event.is_correct,
    event.confidence_score,
    event.event.primary_category,
    event.event.continental
  ]);
  
  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default useAppStore;

