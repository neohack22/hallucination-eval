import React from 'react';
import { Button } from '@/components/ui/button';
import FilterGroup from './FilterGroup';
import { FILTER_GROUPS } from '../../config/filters';
import useAppStore from '../../store/appStore';

const SmartFilterSidebar: React.FC = () => {
  const {
    activeFilters,
    expandedFilterGroups,
    applyFilters,
    toggleFilterGroup,
    resetFilters
  } = useAppStore();

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, filters) => sum + filters.length,
    0
  );

  return (
    <div className="w-96 bg-slate-50 border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Analysis Filters
          </h2>
          {totalActiveFilters > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
              {totalActiveFilters}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          {FILTER_GROUPS.map(group => (
            <FilterGroup
              key={group.id}
              group={group}
              activeFilters={activeFilters[group.id] || []}
              isExpanded={expandedFilterGroups.has(group.id)}
              onToggleExpand={() => toggleFilterGroup(group.id)}
              onFilterChange={filters => applyFilters(group.id, filters)}
              onClear={() => resetFilters(group.id)}
            />
          ))}
        </div>
        
        {totalActiveFilters > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <Button
              onClick={() => resetFilters()}
              variant="outline"
              className="w-full text-sm"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="text-xs font-medium text-blue-900 mb-2">
            Smart Filtering Tips
          </h3>
          <ul className="text-xs text-blue-800 space-y-0.5">
            <li>• Combine filters across groups for precise analysis</li>
            <li>• Geographic filters auto-suggest cultural regions</li>
            <li>• Time periods filter relevant decades</li>
            <li>• Event categories suggest typical violence levels</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmartFilterSidebar;

