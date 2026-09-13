import { LdnItem, MatchResult } from '../types';
import { LdnFilterBar } from '../components/ldn/LdnFilterBar';
import { LdnTable } from '../components/ldn/LdnTable';
import { LdnCardList } from '../components/ldn/LdnCardList';

interface LdnRegisterPageProps {
  totalCount: number;
  filteredData: LdnItem[];
  statusFilter: 'all' | MatchResult;
  onStatusFilterChange: (value: 'all' | MatchResult) => void;
  customerFilter: string;
  onClearCustomer: () => void;
  onSelect: (item: LdnItem) => void;
}

export function LdnRegisterPage({
  totalCount,
  filteredData,
  statusFilter,
  onStatusFilterChange,
  customerFilter,
  onClearCustomer,
  onSelect,
}: LdnRegisterPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
            LDN Register
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-mono">
              {filteredData.length}
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered lab samples matched against ERP bulk orders</p>
        </div>

        <LdnFilterBar
          totalCount={totalCount}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          customerFilter={customerFilter}
          onClearCustomer={onClearCustomer}
        />
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] transition-shadow duration-200 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
        <LdnTable data={filteredData} mode="all" onSelect={onSelect} />
        <LdnCardList data={filteredData} onSelect={onSelect} />
      </div>
    </div>
  );
}
