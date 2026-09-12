import { ProcessingTimeBucket } from '../../hooks/useLrnStats';
import { useEnter } from '../../hooks/useEnter';
import { AnimatedNumber } from './AnimatedNumber';

interface LabProcessingInsightProps {
  distribution: ProcessingTimeBucket[];
  avgProcessingDays: number;
}

export function LabProcessingInsight({ distribution, avgProcessingDays }: LabProcessingInsightProps) {
  const entered = useEnter();
  const total = Math.max(1, distribution.reduce((sum, bucket) => sum + bucket.count, 0));
  const maxCount = Math.max(1, ...distribution.map((bucket) => bucket.count));
  const modeBucket = distribution.reduce<ProcessingTimeBucket | null>(
    (best, current) => (!best || current.count > best.count ? current : best),
    null
  );

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-5 sm:p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">LRN → LDN Lab Time</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Days from lab inward receipt to sample delivery</p>
        </div>
        {modeBucket && (
          <span className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap">
            Most common: {modeBucket.days}d
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-5 mb-5">
        <span className="text-3xl font-semibold text-neutral-900 tracking-tight">
          <AnimatedNumber value={avgProcessingDays} decimals={1} durationMs={800} />
        </span>
        <span className="text-sm font-medium text-neutral-400">days avg</span>
      </div>

      <div className="space-y-3">
        {distribution.map((bucket, index) => {
          const isMode = modeBucket?.days === bucket.days;
          const percent = Math.round((bucket.count / total) * 100);
          return (
            <div key={bucket.days} className="group relative flex items-center gap-3">
              <div
                className="pointer-events-none absolute left-8 opacity-0 scale-95 -translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 bg-neutral-900 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg z-20 -top-9"
              >
                {bucket.count} LRNs · {percent}% of total
              </div>

              <span className="text-xs font-medium text-neutral-500 w-8 shrink-0">{bucket.days}d</span>
              <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${(bucket.count / maxCount) * 100}%` }}>
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 origin-left transition-all duration-700 ease-out shadow-[0_2px_8px_-2px_rgba(37,99,235,0.5)] group-hover:brightness-110 ${
                      entered ? 'scale-x-100' : 'scale-x-0'
                    } ${isMode ? 'opacity-100 ring-1 ring-white/50' : 'opacity-60'}`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  />
                </div>
              </div>
              <span
                className={`text-xs font-mono w-6 text-right shrink-0 ${
                  isMode ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-500'
                }`}
              >
                <AnimatedNumber value={bucket.count} durationMs={600} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
