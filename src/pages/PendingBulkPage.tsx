import { useMemo } from 'react';
import { LdnItem, RecordFilters } from '../types';
import { FilterBar, FilterSelectConfig } from '../components/common/FilterBar';
import { LdnTable } from '../components/ldn/LdnTable';
import { LdnCardList } from '../components/ldn/LdnCardList';

interface PendingBulkPageProps {
  filteredData: LdnItem[];
  filters: RecordFilters;
  selects: FilterSelectConfig[];
  onFilterChange: (key: keyof RecordFilters, value: string) => void;
  onClearFilters: () => void;
  onSelect: (item: LdnItem) => void;
}

export function PendingBulkPage({
  filteredData,
  filters,
  selects,
  onFilterChange,
  onClearFilters,
  onSelect,
}: PendingBulkPageProps) {
  const sortedData = useMemo(
    () => [...filteredData].sort((a, b) => b.daysWaiting - a.daysWaiting),
    [filteredData]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
            Awaiting Bulk Order
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-mono">
              {sortedData.length}
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered samples with no bulk order logged in ERP yet</p>
        </div>

        <FilterBar
          filters={filters}
          selects={selects}
          onFilterChange={onFilterChange}
          onClearAll={onClearFilters}
          totalCount={sortedData.length}
          showStatusToggle={false}
        />
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] transition-shadow duration-200 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
        <LdnTable data={sortedData} mode="waiting" onSelect={onSelect} />
        <LdnCardList data={sortedData} onSelect={onSelect} />
      </div>
    </div>
  );
}
