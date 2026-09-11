import { ArrowRight } from 'lucide-react';
import { LdnStats } from '../../hooks/useLdnStats';
import { paletteFor } from '../../utils/palette';

interface BulkQuantityPanelProps {
  stats: LdnStats;
  onReviewPending: () => void;
}

export function BulkQuantityPanel({ stats, onReviewPending }: BulkQuantityPanelProps) {
  const buyersWithVolume = stats.customerBreakdown
    .filter((customer) => customer.qtyKg > 0)
    .sort((a, b) => b.qtyKg - a.qtyKg);

  const maxQty = Math.max(1, ...buyersWithVolume.map((customer) => customer.qtyKg));

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-xs h-full flex flex-col justify-between space-y-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">Bulk Quantity</h2>
        <p className="text-xs text-neutral-500 mt-0.5">Confirmed volume from converted samples</p>

        <div className="flex items-baseline gap-2.5 mt-5 mb-6">
          <span className="text-4xl font-semibold text-neutral-900 tracking-tight">
            {stats.totalConfirmedQtyKg.toLocaleString('en-IN')}
          </span>
          <span className="text-sm font-medium text-neutral-400">KG</span>
        </div>

        <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-3">By buyer</div>
        <div className="space-y-3">
          {buyersWithVolume.map((customer, index) => {
            const color = paletteFor(index);
            return (
              <div key={customer.customer}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-700 font-medium truncate">{customer.customer}</span>
                  <span className={`font-mono font-semibold ${color.text}`}>
                    {customer.qtyKg.toLocaleString('en-IN')} KG
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(customer.qtyKg / maxQty) * 100}%` }}
                    className={`h-full rounded-full ${color.bar}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onReviewPending}
        className="w-full py-3 px-4 rounded-xl bg-neutral-900 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-sm"
      >
        <span>Review {stats.totalWaiting} pending samples</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
