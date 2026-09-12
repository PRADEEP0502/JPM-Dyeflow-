import { ArrowRight, MoreHorizontal, TrendingUp } from 'lucide-react';
import { LdnStats } from '../../hooks/useLdnStats';
import { useEnter } from '../../hooks/useEnter';
import { AnimatedNumber } from './AnimatedNumber';

interface BulkQuantityPanelProps {
  stats: LdnStats;
  totalLrn: number;
  onReviewPending: () => void;
}

export function BulkQuantityPanel({ stats, totalLrn, onReviewPending }: BulkQuantityPanelProps) {
  const entered = useEnter();
  const scale = Math.max(1, totalLrn, stats.totalDelivered);

  const rows = [
    {
      label: 'LRN Received',
      value: totalLrn,
      barClass:
        'bg-violet-300 [background-image:repeating-linear-gradient(-45deg,#c4b5fd_0,#c4b5fd_1px,transparent_1px,transparent_5px),linear-gradient(to_right,#ddd6fe,#a78bfa)]',
      tooltip: `${totalLrn} lab inward entries received in total`,
    },
    {
      label: 'LDN Delivered',
      value: stats.totalDelivered,
      barClass: 'bg-gradient-to-r from-cyan-400 to-cyan-600',
      tooltip: `${stats.totalDelivered} of ${totalLrn} LRNs progressed to a delivered sample`,
    },
    {
      label: 'Converted Orders',
      value: stats.totalConverted,
      barClass: 'bg-gradient-to-r from-blue-400 to-blue-600',
      tooltip: `${stats.totalConverted} of ${stats.totalDelivered} delivered samples converted to a bulk order`,
    },
    {
      label: 'Pending Samples',
      value: stats.totalWaiting,
      barClass:
        'bg-orange-300 [background-image:repeating-linear-gradient(-45deg,#fb923c_0,#fb923c_1px,transparent_1px,transparent_5px),linear-gradient(to_right,#fdba74,#f97316)]',
      tooltip: `${stats.totalWaiting} of ${stats.totalDelivered} delivered samples still awaiting a bulk order`,
    },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-5 sm:p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] h-full flex flex-col justify-between space-y-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">Bulk Volume</h2>
          <button
            type="button"
            onClick={onReviewPending}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            aria-label="Review pending samples"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">Confirmed quantity from converted samples</p>

        <div className="flex items-center gap-2.5 mt-5 mb-6">
          <span className="text-5xl font-semibold text-neutral-900 tracking-tight">
            <AnimatedNumber value={stats.totalConfirmedQtyKg} durationMs={800} />
          </span>
          <span className="text-sm font-medium text-neutral-400">KG</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ml-1">
            <TrendingUp className="w-3 h-3" />
            <AnimatedNumber value={stats.conversionRate} durationMs={800} />%
          </span>
        </div>

        <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-3">Workflow breakdown</div>
        <div className="space-y-4">
          {rows.map((row, index) => {
            const percentOfScale = Math.round((row.value / scale) * 100);
            return (
              <div key={row.label} className="group relative">
                <div className="pointer-events-none absolute -top-9 left-0 opacity-0 scale-95 -translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 bg-neutral-900 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg z-20">
                  {row.tooltip}
                </div>

                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-600 font-medium">{row.label}</span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-mono font-semibold text-neutral-900">
                      <AnimatedNumber value={row.value} durationMs={700} />
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">{percentOfScale}%</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${percentOfScale}%` }}>
                    <div
                      className={`h-full rounded-full origin-left transition-all duration-700 ease-out shadow-[0_2px_8px_-2px_rgba(15,23,42,0.3)] group-hover:brightness-110 ${row.barClass} ${
                        entered ? 'scale-x-100' : 'scale-x-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onReviewPending}
        className="w-full py-3 px-4 rounded-xl bg-neutral-900 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30"
      >
        <span>Review {stats.totalWaiting} pending samples</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
