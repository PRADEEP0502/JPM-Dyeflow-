import { ChevronRight } from 'lucide-react';
import { LdnItem } from '../../types';
import { StatusBadge } from '../ldn/StatusBadge';

interface RecentActivityListProps {
  data: LdnItem[];
  onSelect: (item: LdnItem) => void;
}

/** Shows the most recently delivered LDNs — same underlying LDN_DATA, just sorted. */
export function RecentActivityList({ data, onSelect }: RecentActivityListProps) {
  const recent = [...data].sort((a, b) => a.daysWaiting - b.daysWaiting).slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-neutral-100">
        <h2 className="text-base font-semibold text-neutral-900">Recent LDN Activity</h2>
        <p className="text-xs text-neutral-500 mt-0.5">Most recently delivered lab samples</p>
      </div>

      <div className="divide-y divide-neutral-100">
        {recent.map((item) => (
          <button
            key={item.ldnNo}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-4 px-5 sm:px-6 py-3.5 text-left hover:bg-neutral-50/80 transition-colors"
          >
            {item.colorHex && (
              <span
                className="w-3 h-3 rounded-full border border-neutral-200 shrink-0"
                style={{ backgroundColor: item.colorHex }}
              />
            )}
            <div className="min-w-0 flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
              <span className="font-mono font-medium text-neutral-900 text-sm truncate">{item.ldnNo}</span>
              <span className="text-neutral-600 text-xs truncate hidden sm:block">{item.customer}</span>
              <span className="text-neutral-400 font-mono text-xs truncate hidden sm:block">
                {item.deliveredDate}
              </span>
              <span className="text-neutral-500 text-xs truncate">{item.daysWaiting}d ago</span>
            </div>
            <StatusBadge result={item.result} />
            <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
