import { Crown, MoreHorizontal } from 'lucide-react';
import { CustomerStat } from '../../hooks/useLdnStats';
import { cn } from '../../utils/cn';
import { paletteFor } from '../../utils/palette';
import { useEnter } from '../../hooks/useEnter';
import { AnimatedNumber } from './AnimatedNumber';

interface BuyerConversionListProps {
  breakdown: CustomerStat[];
  activeCustomer: string;
  onSelectCustomer: (customer: string) => void;
  onViewAll: () => void;
}

export function BuyerConversionList({ breakdown, activeCustomer, onSelectCustomer, onViewAll }: BuyerConversionListProps) {
  const entered = useEnter();

  const topCustomer = breakdown.reduce<CustomerStat | null>((best, current) => {
    if (current.total === 0) return best;
    if (!best || current.conversionRate > best.conversionRate) return current;
    return best;
  }, null);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-5 sm:p-6 space-y-5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">Buyer-Wise Conversion</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered samples converted into bulk orders, by buyer account</p>
        </div>
        <div className="self-start sm:self-auto flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 font-mono">
            {breakdown.length} accounts
          </span>
          <button
            type="button"
            onClick={onViewAll}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            aria-label="View all LDN records"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {breakdown.map((customer, index) => {
          const color = paletteFor(index);
          return (
            <button
              key={customer.customer}
              type="button"
              onClick={() => onSelectCustomer(activeCustomer === customer.customer ? 'all' : customer.customer)}
              className={cn(
                'group w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20',
                activeCustomer === customer.customer
                  ? 'bg-neutral-50 border-neutral-400 ring-1 ring-neutral-400 shadow-sm'
                  : 'border-neutral-200/80 bg-white hover:bg-neutral-50/80 hover:border-neutral-300 hover:shadow-sm'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-neutral-900 text-sm">{customer.customer}</span>
                  {topCustomer?.customer === customer.customer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                      <Crown className="w-2.5 h-2.5" /> Top
                    </span>
                  )}
                  {customer.qtyKg > 0 && (
                    <span className={cn('font-mono text-xs px-2 py-0.5 rounded', color.soft, color.text)}>
                      <AnimatedNumber value={customer.qtyKg} durationMs={700} /> KG
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-neutral-500 flex items-center gap-1.5">
                  <span className="text-emerald-700 font-semibold text-sm">{customer.converted}</span>
                  <span className="text-neutral-300 font-normal">/</span>
                  <span className="text-neutral-600 font-medium">{customer.total} LDNs</span>
                  <span className="ml-2 font-semibold text-neutral-900 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs">
                    <AnimatedNumber value={customer.conversionRate} durationMs={700} />%
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -top-9 left-0 opacity-0 scale-95 -translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 bg-neutral-900 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg z-20">
                  {customer.converted} converted · {customer.total - customer.converted} pending ·{' '}
                  {customer.qtyKg.toLocaleString('en-IN')} KG confirmed
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${customer.conversionRate}%` }}>
                    <div
                      className={`h-full rounded-full origin-left transition-all duration-700 ease-out group-hover:brightness-110 ${
                        topCustomer?.customer === customer.customer
                          ? 'bg-emerald-600 shadow-[0_2px_8px_-2px_rgba(5,150,105,0.6)] ring-1 ring-white/50'
                          : 'bg-emerald-500/80'
                      } ${entered ? 'scale-x-100' : 'scale-x-0'}`}
                      style={{ transitionDelay: `${index * 60}ms` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
