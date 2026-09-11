import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type StatTone = 'neutral' | 'positive' | 'warning';

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  sublabel: string;
  trend?: string;
  tone?: StatTone;
  onClick?: () => void;
}

const TONE_PILL: Record<StatTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  positive: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
};

export function StatCard({ label, value, unit, sublabel, trend, tone = 'neutral', onClick }: StatCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'text-left bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 w-full shadow-xs',
        onClick && 'hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer'
      )}
    >
      <div className="text-xs font-medium text-neutral-500 mb-2">{label}</div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
          {value}
          {unit && <span className="text-sm sm:text-base font-medium text-neutral-400 ml-1">{unit}</span>}
        </span>
        {trend && (
          <span className={cn('text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-full', TONE_PILL[tone])}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-xs text-neutral-400 mt-2">{sublabel}</div>
    </Component>
  );
}
