import React from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterGroupConfig } from '../../types';

interface FilterGroupProps {
  group: FilterGroupConfig;
  activeFilters: string[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onFilterChange: (filters: string[]) => void;
  onClear: () => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  group,
  activeFilters,
  isExpanded,
  onToggleExpand,
  onFilterChange,
  onClear
}) => {
  const handleFilterToggle = (filterValue: string) => {
    const newFilters = activeFilters.includes(filterValue)
      ? activeFilters.filter(f => f !== filterValue)
      : [...activeFilters, filterValue];
    onFilterChange(newFilters);
  };

  const activeCount = activeFilters.length;

  return (
    <div className="border border-slate-200 rounded-lg mb-3 bg-white">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
        onClick={onToggleExpand}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-base flex-shrink-0">{group.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-slate-900 text-sm truncate">{group.title}</h3>
            <p className="text-xs text-slate-600 truncate">{group.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {activeCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 p-3">
          {activeCount > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-700">
                {activeCount} filter{activeCount !== 1 ? 's' : ''} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-slate-600 hover:text-slate-900 h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {Object.entries(group.filters).map(([filterKey, filterOptions]) => (
              <div key={filterKey}>
                <h4 className="text-xs font-medium text-slate-900 mb-2 capitalize">
                  {filterKey.replace('_', ' ')}
                </h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {filterOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${group.id}-${filterKey}-${option}`}
                        checked={activeFilters.includes(option)}
                        onCheckedChange={() => handleFilterToggle(option)}
                        className="h-3 w-3"
                      />
                      <label
                        htmlFor={`${group.id}-${filterKey}-${option}`}
                        className="text-xs text-slate-700 cursor-pointer flex-1 leading-tight"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterGroup;

