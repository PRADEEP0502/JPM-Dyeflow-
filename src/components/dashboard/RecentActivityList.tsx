import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { LdnItem } from '../../types';
import { StatusBadge } from '../ldn/StatusBadge';
import { useEnter } from '../../hooks/useEnter';

interface RecentActivityListProps {
  data: LdnItem[];
  onSelect: (item: LdnItem) => void;
  onViewAll: () => void;
}

/** Shows the most recently delivered LDNs — same underlying LDN_DATA, just sorted. */
export function RecentActivityList({ data, onSelect, onViewAll }: RecentActivityListProps) {
  const entered = useEnter();
  const recent = [...data].sort((a, b) => a.daysWaiting - b.daysWaiting).slice(0, 6);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] overflow-hidden transition-all duration-200 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">Recent LDN Activity</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Most recently delivered lab samples</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
          aria-label="View all LDN records"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-neutral-100">
        {recent.map((item, index) => (
          <button
            key={item.ldnNo}
            type="button"
            onClick={() => onSelect(item)}
            className={`group relative w-full flex items-center gap-4 pl-4 pr-5 sm:pr-6 py-3.5 text-left hover:bg-neutral-50/80 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900/20 ${
              entered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span
              className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full transition-transform duration-150 group-hover:scale-y-110 ${
                item.result === 'Bulk Order Found' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
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
