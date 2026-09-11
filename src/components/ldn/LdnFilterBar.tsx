import { X } from 'lucide-react';
import { MatchResult } from '../../types';

interface LdnFilterBarProps {
  totalCount: number;
  statusFilter: 'all' | MatchResult;
  onStatusFilterChange: (value: 'all' | MatchResult) => void;
  customerFilter: string;
  onClearCustomer: () => void;
  showStatusToggle?: boolean;
}

export function LdnFilterBar({
  totalCount,
  statusFilter,
  onStatusFilterChange,
  customerFilter,
  onClearCustomer,
  showStatusToggle = true,
}: LdnFilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {customerFilter !== 'all' && (
        <button
          type="button"
          onClick={onClearCustomer}
          className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium flex items-center gap-1.5"
        >
          <span>{customerFilter}</span>
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {showStatusToggle && (
        <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-white text-xs font-medium">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('Bulk Order Found')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'Bulk Order Found' ? 'bg-emerald-600 text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Matched
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('Waiting')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'Waiting' ? 'bg-amber-500 text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Waiting
          </button>
        </div>
      )}
    </div>
  );
}
