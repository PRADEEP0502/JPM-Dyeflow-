import { LdnItem, LrnRecord, RecordFilters } from '../types';
import { FilterBar, FilterSelectConfig } from '../components/common/FilterBar';
import { LrnTable } from '../components/lrn/LrnTable';
import { LrnCardList } from '../components/lrn/LrnCardList';
import { LrnStats } from '../hooks/useLrnStats';

interface LrnRegisterPageProps {
  totalCount: number;
  filteredData: LrnRecord[];
  stats: LrnStats;
  filters: RecordFilters;
  selects: FilterSelectConfig[];
  onFilterChange: (key: keyof RecordFilters, value: string) => void;
  onClearFilters: () => void;
  onSelect: (item: LdnItem) => void;
}

export function LrnRegisterPage({
  totalCount,
  filteredData,
  stats,
  filters,
  selects,
  onFilterChange,
  onClearFilters,
  onSelect,
}: LrnRegisterPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
            LRN Register
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-mono">
              {filteredData.length}
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Lab inward entries received from customers before colour matching begins
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium">
              {stats.totalLrn} received
            </span>
            <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium">
              Avg. lab time: {stats.avgProcessingDays}d
            </span>
          </div>
        </div>

        <FilterBar
          filters={filters}
          selects={selects}
          onFilterChange={onFilterChange}
          onClearAll={onClearFilters}
          totalCount={totalCount}
        />
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] transition-shadow duration-200 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
        <LrnTable data={filteredData} onSelect={onSelect} />
        <LrnCardList data={filteredData} onSelect={onSelect} />
      </div>
    </div>
  );
}
