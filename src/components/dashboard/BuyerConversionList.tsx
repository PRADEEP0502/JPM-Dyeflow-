import { CustomerStat } from '../../hooks/useLdnStats';
import { cn } from '../../utils/cn';

interface BuyerConversionListProps {
  breakdown: CustomerStat[];
  activeCustomer: string;
  onSelectCustomer: (customer: string) => void;
}

export function BuyerConversionList({ breakdown, activeCustomer, onSelectCustomer }: BuyerConversionListProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Buyer-Wise Conversion</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered samples converted into bulk orders, by buyer account</p>
        </div>
        <span className="self-start sm:self-auto text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 font-mono">
          {breakdown.length} accounts
        </span>
      </div>

      <div className="space-y-3">
        {breakdown.map((customer) => (
          <button
            key={customer.customer}
            type="button"
            onClick={() => onSelectCustomer(activeCustomer === customer.customer ? 'all' : customer.customer)}
            className={cn(
              'w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150',
              activeCustomer === customer.customer
                ? 'bg-neutral-50 border-neutral-400 ring-1 ring-neutral-400 shadow-sm'
                : 'border-neutral-200/80 bg-white hover:bg-neutral-50/80 hover:border-neutral-300'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-neutral-900 text-sm">{customer.customer}</span>
                {customer.qtyKg > 0 && (
                  <span className="font-mono text-neutral-500 text-xs px-2 py-0.5 rounded bg-neutral-100/80">
                    {customer.qtyKg.toLocaleString('en-IN')} KG
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-neutral-500 flex items-center gap-1.5">
                <span className="text-emerald-700 font-semibold text-sm">{customer.converted}</span>
                <span className="text-neutral-300 font-normal">/</span>
                <span className="text-neutral-600 font-medium">{customer.total} LDNs</span>
                <span className="ml-2 font-semibold text-neutral-900 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs">
                  {customer.conversionRate}%
                </span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div style={{ width: `${customer.conversionRate}%` }} className="h-full bg-emerald-600 rounded-full" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
