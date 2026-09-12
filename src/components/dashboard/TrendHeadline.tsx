import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface TrendHeadlineProps {
  value: number;
  suffix?: string;
  delta: number;
  deltaSuffix?: string;
}

/** Latest-period stat + week-over-week change badge, shown in a TrendPanel's header. */
export function TrendHeadline({ value, suffix = '', delta, deltaSuffix = '' }: TrendHeadlineProps) {
  const toneClass = delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-neutral-400';
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <div className="text-right">
      <div className="text-xl font-semibold text-neutral-900 font-mono tracking-tight">
        <AnimatedNumber value={value} durationMs={700} />
        {suffix}
      </div>
      <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${toneClass}`}>
        <Icon className="w-3 h-3" />
        {delta > 0 ? '+' : ''}
        {delta}
        {deltaSuffix}
      </span>
    </div>
  );
}
