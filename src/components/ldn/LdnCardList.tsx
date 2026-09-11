import { ChevronRight } from 'lucide-react';
import { LdnItem } from '../../types';
import { StatusBadge } from './StatusBadge';

interface LdnCardListProps {
  data: LdnItem[];
  onSelect: (item: LdnItem) => void;
}

export function LdnCardList({ data, onSelect }: LdnCardListProps) {
  return (
    <div className="sm:hidden divide-y divide-neutral-100">
      {data.length === 0 ? (
        <div className="p-6 text-center text-xs text-neutral-400">No records found matching criteria.</div>
      ) : (
        data.map((item) => (
          <div
            key={item.ldnNo}
            onClick={() => onSelect(item)}
            className="p-4 space-y-2.5 active:bg-neutral-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-mono font-medium text-neutral-900 text-sm">{item.ldnNo}</div>
                <div className="text-[11px] text-neutral-400 font-mono">{item.lrnNo}</div>
                <div className="font-medium text-neutral-900 text-xs mt-1">{item.customer}</div>
              </div>
              <StatusBadge result={item.result} daysWaiting={item.result === 'Waiting' ? item.daysWaiting : undefined} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-2.5 rounded-lg">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Colour</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {item.colorHex && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-neutral-200 shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                    />
                  )}
                  <span className="font-medium text-neutral-700 truncate">{item.colorName}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Fabric</span>
                <span className="font-medium text-neutral-700 truncate block mt-0.5">{item.fabric}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              {item.bulkOrderNo ? (
                <div className="font-mono text-xs">
                  <span className="text-emerald-700 font-medium mr-1.5">{item.bulkOrderNo}</span>
                  <span className="text-neutral-900 font-medium">{item.bulkQty}</span>
                </div>
              ) : (
                <span className="text-neutral-400 text-xs italic">Awaiting sales order entry</span>
              )}

              <span className="text-xs text-neutral-500 font-medium flex items-center gap-0.5">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
