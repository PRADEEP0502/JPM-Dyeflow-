import { Sparkles } from 'lucide-react';
import { useEnter } from '../../hooks/useEnter';
import { AnimatedNumber } from './AnimatedNumber';

interface InsightCardProps {
  headlineNumber: number;
  headlineSuffix?: string;
  headlineText: string;
  secondaryText: string;
  progressPercent: number;
}

export function InsightCard({
  headlineNumber,
  headlineSuffix = '',
  headlineText,
  secondaryText,
  progressPercent,
}: InsightCardProps) {
  const entered = useEnter();

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-[0_10px_24px_-10px_rgba(3,105,161,0.5)] h-full flex flex-col justify-between text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(3,105,161,0.55)]"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1.4px), linear-gradient(135deg, #1e3a8a 0%, #0369a1 30%, #0891b2 50%, #f59e0b 75%, #ea580c 100%)',
        backgroundSize: '16px 16px, 100% 100%',
      }}
    >
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/15">
          <Sparkles className="w-3 h-3" />
          Insight
        </span>

        <div className="text-4xl font-semibold tracking-tight mt-4">
          <AnimatedNumber value={headlineNumber} durationMs={900} />
          {headlineSuffix}
        </div>
        <p className="text-sm text-white/90 mt-2 leading-snug">{headlineText}</p>
        <p className="text-xs text-white/70 mt-3 leading-snug">{secondaryText}</p>
      </div>

      <div className="mt-6">
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full" style={{ width: `${progressPercent}%` }}>
            <div
              className={`h-full bg-white rounded-full origin-left transition-transform duration-700 ease-out ${
                entered ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
