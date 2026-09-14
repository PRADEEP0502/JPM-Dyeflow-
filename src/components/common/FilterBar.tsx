import { X } from 'lucide-react';
import { MatchResult, RecordFilters } from '../../types';
import { FilterSelect } from './FilterSelect';

export interface FilterSelectConfig {
  key: keyof RecordFilters;
  label: string;
  options: string[];
}

interface FilterBarProps {
  filters: RecordFilters;
  selects: FilterSelectConfig[];
  onFilterChange: (key: keyof RecordFilters, value: string) => void;
  onClearAll: () => void;
  totalCount: number;
  showStatusToggle?: boolean;
}

export function FilterBar({
  filters,
  selects,
  onFilterChange,
  onClearAll,
  totalCount,
  showStatusToggle = true,
}: FilterBarProps) {
  const activeKeys = selects
    .map((select) => select.key)
    .filter((key) => filters[key] !== 'all');
  const statusActive = showStatusToggle && filters.status !== 'all';
  const activeCount = activeKeys.length + (statusActive ? 1 : 0);

  const setStatus = (value: 'all' | MatchResult) => onFilterChange('status', value);

  return (
    <div className="flex flex-col gap-2 items-stretch sm:items-end">
      <div className="flex items-center gap-2 flex-wrap sm:justify-end">
        {showStatusToggle && (
          <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-white text-xs font-medium">
            <button
              type="button"
              onClick={() => setStatus('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filters.status === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatus('Bulk Order Found')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filters.status === 'Bulk Order Found'
                  ? 'bg-emerald-600 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Converted
            </button>
            <button
              type="button"
              onClick={() => setStatus('Waiting')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filters.status === 'Waiting' ? 'bg-amber-500 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Pending
            </button>
          </div>
        )}

        {selects.map((select) => (
          <FilterSelect
            key={select.key}
            label={select.label}
            value={filters[select.key]}
            options={select.options}
            onChange={(value) => onFilterChange(select.key, value)}
          />
        ))}
      </div>

      {activeCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
          {activeKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key, 'all')}
              className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-medium flex items-center gap-1 hover:bg-neutral-200 transition-colors"
            >
              <span>{filters[key]}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 underline underline-offset-2 px-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
