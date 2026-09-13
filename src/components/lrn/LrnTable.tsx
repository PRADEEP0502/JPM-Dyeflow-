import { LdnItem, LrnRecord } from '../../types';
import { LDN_DATA } from '../../data/mockData';
import { StatusBadge } from '../ldn/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { daysBetween, parseDisplayDate } from '../../utils/format';

interface LrnTableProps {
  data: LrnRecord[];
  onSelect: (item: LdnItem) => void;
}

export function LrnTable({ data, onSelect }: LrnTableProps) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wide">
            <th className="py-3.5 px-5 font-semibold">LRN No</th>
            <th className="py-3.5 px-5 font-semibold">Date</th>
            <th className="py-3.5 px-5 font-semibold">Party / Customer</th>
            <th className="py-3.5 px-5 font-semibold">Buyer</th>
            <th className="py-3.5 px-5 font-semibold">Fabric</th>
            <th className="py-3.5 px-5 font-semibold">Colour</th>
            <th className="py-3.5 px-5 font-semibold">Match Source</th>
            <th className="py-3.5 px-5 font-semibold">Linked LDN</th>
            <th className="py-3.5 px-5 font-semibold text-center">Age</th>
            <th className="py-3.5 px-5 font-semibold text-center">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={10}>
                <EmptyState />
              </td>
            </tr>
          ) : (
            data.map((lrn) => {
              const linkedLdn = LDN_DATA.find((ldn) => ldn.lrnNo === lrn.lrnNo);
              const ageDays = linkedLdn
                ? daysBetween(parseDisplayDate(lrn.date), parseDisplayDate(linkedLdn.deliveredDate))
                : null;

              return (
                <tr
                  key={lrn.lrnNo}
                  onClick={() => linkedLdn && onSelect(linkedLdn)}
                  className="hover:bg-neutral-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-5 font-mono font-medium text-neutral-900">{lrn.lrnNo}</td>
                  <td className="py-4 px-5 text-neutral-500 font-mono text-xs">{lrn.date}</td>
                  <td className="py-4 px-5 font-semibold text-neutral-900">{lrn.party}</td>
                  <td className="py-4 px-5 text-neutral-600 text-xs">{lrn.buyer}</td>
                  <td className="py-4 px-5 text-neutral-600 text-xs">{lrn.fabric}</td>
                  <td className="py-4 px-5 text-neutral-700">
                    <div className="flex items-center gap-2.5">
                      {linkedLdn?.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-neutral-200 shrink-0 shadow-2xs"
                          style={{ backgroundColor: linkedLdn.colorHex }}
                        />
                      )}
                      <span className="text-xs font-medium">{lrn.colour}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-neutral-600 text-xs">{lrn.matchSource}</td>
                  <td className="py-4 px-5 font-mono text-xs">
                    {linkedLdn ? (
                      <span className="font-semibold text-neutral-700">{linkedLdn.ldnNo}</span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center font-mono text-xs text-neutral-600">
                    {ageDays !== null ? `${ageDays}d` : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="py-4 px-5 text-center">
                    {linkedLdn ? (
                      <StatusBadge result={linkedLdn.result} />
                    ) : (
                      <span className="text-neutral-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
