import { ProcessingTimeBucket } from '../../hooks/useLrnStats';

interface LabProcessingInsightProps {
  distribution: ProcessingTimeBucket[];
  avgProcessingDays: number;
}

export function LabProcessingInsight({ distribution, avgProcessingDays }: LabProcessingInsightProps) {
  const maxCount = Math.max(1, ...distribution.map((bucket) => bucket.count));

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-xs h-full">
      <h2 className="text-base font-semibold text-neutral-900">LRN → LDN Lab Time</h2>
      <p className="text-xs text-neutral-500 mt-0.5">Days from lab inward receipt to sample delivery</p>

      <div className="flex items-baseline gap-2 mt-5 mb-5">
        <span className="text-3xl font-semibold text-neutral-900 tracking-tight">{avgProcessingDays}</span>
        <span className="text-sm font-medium text-neutral-400">days avg</span>
      </div>

      <div className="space-y-2.5">
        {distribution.map((bucket) => (
          <div key={bucket.days} className="flex items-center gap-3">
            <span className="text-xs font-medium text-neutral-500 w-8 shrink-0">{bucket.days}d</span>
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${(bucket.count / maxCount) * 100}%` }}
                className="h-full rounded-full bg-blue-500"
              />
            </div>
            <span className="text-xs font-mono font-semibold text-neutral-900 w-6 text-right shrink-0">
              {bucket.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
