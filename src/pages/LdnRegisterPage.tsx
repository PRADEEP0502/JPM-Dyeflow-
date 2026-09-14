import { LdnItem, RecordFilters } from '../types';
import { FilterBar, FilterSelectConfig } from '../components/common/FilterBar';
import { LdnTable } from '../components/ldn/LdnTable';
import { LdnCardList } from '../components/ldn/LdnCardList';

interface LdnRegisterPageProps {
  totalCount: number;
  filteredData: LdnItem[];
  filters: RecordFilters;
  selects: FilterSelectConfig[];
  onFilterChange: (key: keyof RecordFilters, value: string) => void;
  onClearFilters: () => void;
  onSelect: (item: LdnItem) => void;
}

export function LdnRegisterPage({
  totalCount,
  filteredData,
  filters,
  selects,
  onFilterChange,
  onClearFilters,
  onSelect,
}: LdnRegisterPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
            LDN Register
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-mono">
              {filteredData.length}
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered lab samples matched against ERP bulk orders</p>
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
        <LdnTable data={filteredData} mode="all" onSelect={onSelect} />
        <LdnCardList data={filteredData} onSelect={onSelect} />
      </div>
    </div>
  );
}
