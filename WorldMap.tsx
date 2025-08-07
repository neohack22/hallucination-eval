import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WorldMapProps {
  accuracyData: Record<string, number>;
  onRegionClick: (region: string) => void;
  isLoading: boolean;
}

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-slate-200 z-[1000]">
      <h4 className="text-sm font-medium text-slate-900 mb-2">Accuracy Legend</h4>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
          <span className="text-xs text-slate-700">High (80%+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-xs text-slate-700">Medium (50-80%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs text-slate-700">Low (&lt;50%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-slate-400 rounded"></div>
          <span className="text-xs text-slate-700">No data</span>
        </div>
      </div>
    </div>
  );
};

const MapControls: React.FC = () => {
  const map = useMap();

  const resetView = () => {
    map.setView([20, 0], 2);
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg border border-slate-200 z-[1000]">
      <button
        onClick={resetView}
        className="px-3 py-1 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded"
      >
        Reset View
      </button>
    </div>
  );
};

// Region boundaries (simplified for demo)
const REGION_BOUNDARIES = {
  'North America': [
    [85, -180], [85, -50], [15, -50], [15, -180]
  ],
  'South America': [
    [15, -90], [15, -30], [-60, -30], [-60, -90]
  ],
  'Europe': [
    [75, -15], [75, 45], [35, 45], [35, -15]
  ],
  'Asia': [
    [75, 45], [75, 180], [10, 180], [10, 45]
  ],
  'Africa': [
    [35, -20], [35, 55], [-35, 55], [-35, -20]
  ],
  'Oceania': [
    [10, 110], [10, 180], [-50, 180], [-50, 110]
  ]
};

const RegionOverlay: React.FC<{
  region: string;
  accuracy: number;
  onClick: () => void;
}> = ({ region, accuracy, onClick }) => {
  const map = useMap();

  useEffect(() => {
    const getRegionColor = (accuracy: number): string => {
      if (accuracy >= 0.8) return "#10b981"; // Emerald - High accuracy
      if (accuracy >= 0.5) return "#f59e0b"; // Amber - Medium accuracy  
      if (accuracy > 0) return "#ef4444";    // Red - Low accuracy
      return "#9ca3af";                      // Gray - No data
    };

    const bounds = REGION_BOUNDARIES[region as keyof typeof REGION_BOUNDARIES];
    if (!bounds) return;

    const polygon = L.polygon(bounds as L.LatLngExpression[], {
      color: getRegionColor(accuracy),
      fillColor: getRegionColor(accuracy),
      fillOpacity: 0.3,
      weight: 2,
      opacity: 0.8
    });

    polygon.addTo(map);
    
    polygon.on('click', onClick);
    
    // Add tooltip
    polygon.bindTooltip(
      `<strong>${region}</strong><br/>Accuracy: ${(accuracy * 100).toFixed(1)}%`,
      { permanent: false, direction: 'center' }
    );

    return () => {
      map.removeLayer(polygon);
    };
  }, [map, region, accuracy, onClick]);

  return null;
};

const WorldMap: React.FC<WorldMapProps> = ({ accuracyData, onRegionClick, isLoading }) => {
  return (
    <div className="relative h-full bg-white rounded-lg shadow-sm border border-slate-200">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-sm text-slate-600">Loading map data...</span>
          </div>
        </div>
      )}
      
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        
        {/* Region overlays with accuracy-based coloring */}
        {Object.entries(accuracyData).map(([region, accuracy]) => (
          <RegionOverlay
            key={region}
            region={region}
            accuracy={accuracy}
            onClick={() => onRegionClick(region)}
          />
        ))}
        
        <MapLegend />
        <MapControls />
      </MapContainer>
    </div>
  );
};

export default WorldMap;

