import { ChevronRight } from 'lucide-react';
import { LdnItem, LrnRecord } from '../../types';
import { LDN_DATA } from '../../data/mockData';
import { StatusBadge } from '../ldn/StatusBadge';

interface LrnCardListProps {
  data: LrnRecord[];
  onSelect: (item: LdnItem) => void;
}

export function LrnCardList({ data, onSelect }: LrnCardListProps) {
  return (
    <div className="sm:hidden divide-y divide-neutral-100">
      {data.length === 0 ? (
        <div className="p-6 text-center text-xs text-neutral-400">No records found matching criteria.</div>
      ) : (
        data.map((lrn) => {
          const linkedLdn = LDN_DATA.find((ldn) => ldn.lrnNo === lrn.lrnNo);

          return (
            <div
              key={lrn.lrnNo}
              onClick={() => linkedLdn && onSelect(linkedLdn)}
              className="p-4 space-y-2.5 active:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono font-medium text-neutral-900 text-sm">{lrn.lrnNo}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">{lrn.date}</div>
                  <div className="font-medium text-neutral-900 text-xs mt-1">{lrn.party}</div>
                </div>
                {linkedLdn && (
                  <StatusBadge
                    result={linkedLdn.result}
                    daysWaiting={linkedLdn.result === 'Waiting' ? linkedLdn.daysWaiting : undefined}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-2.5 rounded-lg">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Colour</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {linkedLdn?.colorHex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-200 shrink-0"
                        style={{ backgroundColor: linkedLdn.colorHex }}
                      />
                    )}
                    <span className="font-medium text-neutral-700 truncate">{lrn.colour}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Fabric</span>
                  <span className="font-medium text-neutral-700 truncate block mt-0.5">{lrn.fabric}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-neutral-500 text-xs">
                  {linkedLdn ? `Linked: ${linkedLdn.ldnNo}` : 'No linked LDN yet'}
                </span>
                <span className="text-xs text-neutral-500 font-medium flex items-center gap-0.5">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
