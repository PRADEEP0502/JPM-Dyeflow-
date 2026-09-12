import { LdnItem } from '../../types';
import { StatusBadge } from './StatusBadge';
import { daysBetween, parseDisplayDate } from '../../utils/format';

interface LdnTableProps {
  data: LdnItem[];
  mode: 'all' | 'waiting';
  onSelect: (item: LdnItem) => void;
}

function conversionAge(item: LdnItem): number {
  if (item.bulkOrderDate) {
    return daysBetween(parseDisplayDate(item.deliveredDate), parseDisplayDate(item.bulkOrderDate));
  }
  return item.daysWaiting;
}

export function LdnTable({ data, mode, onSelect }: LdnTableProps) {
  const columnCount = mode === 'waiting' ? 8 : 10;

  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wide">
            <th className="py-3 px-4 font-medium">LDN No</th>
            <th className="py-3 px-4 font-medium">LRN No</th>
            <th className="py-3 px-4 font-medium">Customer</th>
            <th className="py-3 px-4 font-medium">Colour</th>
            <th className="py-3 px-4 font-medium">Fabric</th>
            <th className="py-3 px-4 font-medium">Delivered Date</th>
            {mode === 'waiting' ? (
              <th className="py-3 px-4 font-medium text-center">Days Elapsed</th>
            ) : (
              <>
                <th className="py-3 px-4 font-medium">Bulk Order</th>
                <th className="py-3 px-4 font-medium text-right">Bulk Qty</th>
                <th className="py-3 px-4 font-medium text-center">Age</th>
              </>
            )}
            <th className="py-3 px-4 font-medium text-center">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="py-10 text-center text-sm text-neutral-400">
                No records found matching criteria.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.ldnNo}
                onClick={() => onSelect(item)}
                className="hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-medium text-neutral-900">{item.ldnNo}</td>
                <td className="py-3.5 px-4 font-mono text-neutral-500 text-xs">{item.lrnNo}</td>
                <td className="py-3.5 px-4 font-medium text-neutral-900">{item.customer}</td>
                <td className="py-3.5 px-4 text-neutral-700">
                  <div className="flex items-center gap-2">
                    {item.colorHex && (
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-200 shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                      />
                    )}
                    <span className="text-xs">{item.colorName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-neutral-500 text-xs">{item.fabric}</td>
                <td className="py-3.5 px-4 text-neutral-500 font-mono text-xs">{item.deliveredDate}</td>
                {mode === 'waiting' ? (
                  <td className="py-3.5 px-4 text-center font-mono text-amber-700 font-medium text-xs">
                    {item.daysWaiting}d
                  </td>
                ) : (
                  <>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {item.bulkOrderNo ? (
                        <span className="font-medium text-emerald-700">{item.bulkOrderNo}</span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-neutral-900 text-xs">
                      {item.bulkQty || '—'}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-center font-mono font-medium text-xs ${
                        item.bulkOrderDate ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {conversionAge(item)}d
                    </td>
                  </>
                )}
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge result={item.result} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
