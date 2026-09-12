import { LdnItem, LrnRecord } from '../types';
import { LrnTable } from '../components/lrn/LrnTable';
import { LrnCardList } from '../components/lrn/LrnCardList';
import { LrnStats } from '../hooks/useLrnStats';

interface LrnRegisterPageProps {
  filteredData: LrnRecord[];
  stats: LrnStats;
  onSelect: (item: LdnItem) => void;
}

export function LrnRegisterPage({ filteredData, stats, onSelect }: LrnRegisterPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
            {stats.totalLrn} received
          </span>
          <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
            Avg. lab time: {stats.avgProcessingDays}d
          </span>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <LrnTable data={filteredData} onSelect={onSelect} />
        <LrnCardList data={filteredData} onSelect={onSelect} />
      </div>
    </div>
  );
}
