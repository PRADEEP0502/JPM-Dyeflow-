import { useMemo } from 'react';
import { LdnItem } from '../types';
import { LdnFilterBar } from '../components/ldn/LdnFilterBar';
import { LdnTable } from '../components/ldn/LdnTable';
import { LdnCardList } from '../components/ldn/LdnCardList';

interface PendingBulkPageProps {
  filteredData: LdnItem[];
  customerFilter: string;
  onClearCustomer: () => void;
  onSelect: (item: LdnItem) => void;
}

export function PendingBulkPage({ filteredData, customerFilter, onClearCustomer, onSelect }: PendingBulkPageProps) {
  const sortedData = useMemo(
    () => [...filteredData].sort((a, b) => b.daysWaiting - a.daysWaiting),
    [filteredData]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
            Awaiting Bulk Order
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-mono">
              {sortedData.length}
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered samples with no bulk order logged in ERP yet</p>
        </div>

        <LdnFilterBar
          totalCount={sortedData.length}
          statusFilter="Waiting"
          onStatusFilterChange={() => {}}
          customerFilter={customerFilter}
          onClearCustomer={onClearCustomer}
          showStatusToggle={false}
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <LdnTable data={sortedData} mode="waiting" onSelect={onSelect} />
        <LdnCardList data={sortedData} onSelect={onSelect} />
      </div>
    </div>
  );
}
