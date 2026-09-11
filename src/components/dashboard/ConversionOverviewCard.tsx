import { LdnStats } from '../../hooks/useLdnStats';
import { DonutChart } from './DonutChart';

interface ConversionOverviewCardProps {
  stats: LdnStats;
  onViewConverted: () => void;
  onViewPending: () => void;
}

export function ConversionOverviewCard({ stats, onViewConverted, onViewPending }: ConversionOverviewCardProps) {
  const maxCount = Math.max(1, stats.totalDelivered, stats.totalConverted, stats.totalWaiting);

  const funnelRows = [
    { label: 'LDN Delivered', value: stats.totalDelivered, barClass: 'bg-neutral-800', onClick: undefined as (() => void) | undefined },
    { label: 'Bulk Orders Found', value: stats.totalConverted, barClass: 'bg-emerald-500', onClick: onViewConverted },
    { label: 'Pending Conversion', value: stats.totalWaiting, barClass: 'bg-amber-500', onClick: onViewPending },
  ];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-xs h-full">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Sample-to-Bulk Conversion</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered lab samples resolved against ERP bulk orders</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-6">
        <DonutChart
          size={176}
          centerValue={`${stats.conversionRate}%`}
          centerLabel={`${stats.totalConverted} of ${stats.totalDelivered} converted`}
          segments={[
            { label: 'Converted', value: stats.totalConverted, colorClass: 'text-emerald-500', onClick: onViewConverted },
            { label: 'Pending', value: stats.totalWaiting, colorClass: 'text-amber-500', onClick: onViewPending },
          ]}
        />

        <div className="w-full flex-1 space-y-4">
          {funnelRows.map((row) => (
            <button
              key={row.label}
              type="button"
              onClick={row.onClick}
              disabled={!row.onClick}
              className={`w-full text-left group ${row.onClick ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-600 font-medium group-hover:text-neutral-900 transition-colors">
                  {row.label}
                </span>
                <span className="font-mono font-semibold text-neutral-900">{row.value}</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(row.value / maxCount) * 100}%` }}
                  className={`h-full rounded-full ${row.barClass}`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-neutral-100 text-xs">
        <span className="flex items-center gap-1.5 text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Converted
        </span>
        <span className="flex items-center gap-1.5 text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
        </span>
      </div>
    </div>
  );
}
