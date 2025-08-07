import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import SmartFilterSidebar from './components/filters/SmartFilterSidebar';
import WorldMap from './components/map/WorldMap';
import ResultsDashboard from './components/dashboard/ResultsDashboard';
import EventModal from './components/modals/EventModal';
import useAppStore from './store/appStore';
import './App.css';

function App() {
  const {
    selectedModel,
    filteredData,
    isLoading,
    selectedEvent,
    accuracyByRegion,
    selectEvent,
    setMapRegion,
    getStats,
    getChartData,
    loadModelData
  } = useAppStore();

  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(-1);

  // Load initial data
  useEffect(() => {
    loadModelData(selectedModel);
  }, []);

  const handleRegionClick = (region: string) => {
    setMapRegion(region);
    // Could filter by region here
  };

  const handleEventNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedEventIndex > 0) {
      const newIndex = selectedEventIndex - 1;
      setSelectedEventIndex(newIndex);
      selectEvent(filteredData[newIndex]);
    } else if (direction === 'next' && selectedEventIndex < filteredData.length - 1) {
      const newIndex = selectedEventIndex + 1;
      setSelectedEventIndex(newIndex);
      selectEvent(filteredData[newIndex]);
    }
  };

  const handleEventSelect = (event: any) => {
    const index = filteredData.findIndex(e => e === event);
    setSelectedEventIndex(index);
    selectEvent(event);
  };

  const canNavigate = {
    prev: selectedEventIndex > 0,
    next: selectedEventIndex < filteredData.length - 1
  };

  const stats = getStats();
  const chartData = getChartData();

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <SmartFilterSidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <WorldMap
              accuracyData={accuracyByRegion}
              onRegionClick={handleRegionClick}
              isLoading={isLoading}
            />
          </div>
          
          {/* Event List - Simple implementation for demo */}
          <div className="h-32 bg-white border-t border-slate-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-slate-900 mb-2">
              Recent Events ({filteredData.length})
            </h3>
            <div className="flex space-x-2 overflow-x-auto">
              {filteredData.slice(0, 10).map((event, index) => (
                <button
                  key={index}
                  onClick={() => handleEventSelect(event)}
                  className={`flex-shrink-0 p-2 text-xs rounded border ${
                    event.is_correct 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  } hover:shadow-sm transition-shadow`}
                >
                  <div className="w-32 truncate">
                    {event.event.text.substring(0, 50)}...
                  </div>
                  <div className="text-xs opacity-75">
                    {event.event.year} → {event.model_response}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <ResultsDashboard stats={stats} chartData={chartData} />
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => selectEvent(null)}
        onNavigate={handleEventNavigation}
        canNavigate={canNavigate}
      />
    </div>
  );
}

export default App;
