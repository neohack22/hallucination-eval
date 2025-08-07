import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import SmartFilterSidebar from './components/filters/SmartFilterSidebar';
import WorldMap from './components/map/WorldMap';
import ResultsDashboard from './components/dashboard/ResultsDashboard';
import ComparisonDashboard from './components/dashboard/ComparisonDashboard';
import EventModal from './components/modals/EventModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Filter, Map, BarChart3, List } from 'lucide-react';
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
    loadModelData,
    comparisonMode
  } = useAppStore();

  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(-1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load initial data
  useEffect(() => {
    loadModelData(selectedModel);
  }, []);

  const handleRegionClick = (region: string) => {
    setMapRegion(region);
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

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="h-screen flex flex-col bg-slate-100">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          <SmartFilterSidebar />
          
          <div className="flex-1 flex">
            {/* Section carte réduite */}
            <div className="flex-1 flex flex-col">
              <div className="h-96 p-4">
                <WorldMap
                  accuracyData={accuracyByRegion}
                  onRegionClick={handleRegionClick}
                  isLoading={isLoading}
                />
              </div>
              
              {/* Event List - Expanded */}
              <div className="flex-1 bg-white border-t border-slate-200 p-4 overflow-y-auto">
                <h3 className="text-sm font-medium text-slate-900 mb-3">
                  Recent Events ({filteredData.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredData.slice(0, 20).map((event, index) => (
                    <button
                      key={index}
                      onClick={() => handleEventSelect(event)}
                      className={`p-3 text-xs rounded border text-left ${
                        event.is_correct 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-red-50 border-red-200 text-red-800'
                      } hover:shadow-sm transition-shadow`}
                    >
                      <div className="truncate mb-1 font-medium">
                        {event.event.text.substring(0, 80)}...
                      </div>
                      <div className="text-xs opacity-75 flex justify-between">
                        <span>Truth: {event.event.year}</span>
                        <span>Model: {event.model_response}</span>
                      </div>
                      <div className="text-xs mt-1 opacity-60">
                        {event.event.primary_category} • {event.event.continental}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Panneau des résultats ou comparaison */}
            {comparisonMode ? (
              <ComparisonDashboard />
            ) : (
              <ResultsDashboard stats={stats} chartData={chartData} />
            )}
          </div>
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

  // Mobile Layout with Tabs
  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Header />
      
      <Tabs defaultValue="filters" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-white border-b border-slate-200 px-2">
          <TabsTrigger value="filters" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Map className="h-4 w-4" />
            <span>Map</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>Events</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="flex-1 overflow-hidden">
          <SmartFilterSidebar />
        </TabsContent>

        <TabsContent value="map" className="flex-1 p-4">
          <WorldMap
            accuracyData={accuracyByRegion}
            onRegionClick={handleRegionClick}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="events" className="flex-1 bg-white p-4 overflow-y-auto">
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Recent Events ({filteredData.length})
          </h3>
          <div className="space-y-3">
            {filteredData.slice(0, 50).map((event, index) => (
              <button
                key={index}
                onClick={() => handleEventSelect(event)}
                className={`w-full p-4 text-sm rounded border text-left ${
                  event.is_correct 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                } hover:shadow-sm transition-shadow`}
              >
                <div className="mb-2 font-medium leading-tight">
                  {event.event.text}
                </div>
                <div className="text-xs opacity-75 flex justify-between mb-1">
                  <span>Truth: {event.event.year}</span>
                  <span>Model: {event.model_response}</span>
                </div>
                <div className="text-xs opacity-60">
                  {event.event.primary_category} • {event.event.continental}
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 overflow-hidden">
          {comparisonMode ? (
            <ComparisonDashboard />
          ) : (
            <ResultsDashboard stats={stats} chartData={chartData} />
          )}
        </TabsContent>
      </Tabs>

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
