import { useEnter } from '../../hooks/useEnter';
import { cn } from '../../utils/cn';
import { AnimatedNumber } from './AnimatedNumber';

interface BarDatum {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: BarDatum[];
  /** Bar treatment for the current (most recent) period — should read as the richer/deeper shade. */
  barClassName?: string;
  /** Bar treatment for historical periods — a solid, lighter shade of the same hue (not a faded opacity hack). */
  mutedBarClassName?: string;
  valueSuffix?: string;
  /** When the values are already a bounded scale (e.g. a percentage), fix the axis max instead of deriving it. */
  axisMax?: number;
}

function niceMaxOf(value: number): number {
  return Math.max(10, Math.ceil(value / 10) * 10);
}

/** Small, dependency-free column chart used for the weekly trend panels. */
export function MiniBarChart({
  data,
  barClassName = 'bg-gradient-to-b from-blue-500 to-blue-700',
  mutedBarClassName = 'bg-gradient-to-b from-blue-200 to-blue-300',
  valueSuffix = '',
  axisMax,
}: MiniBarChartProps) {
  const entered = useEnter();
  const maxValue = Math.max(1, ...data.map((datum) => datum.value));
  const niceMax = axisMax ?? niceMaxOf(maxValue);
  const yTicks = [0, niceMax / 2, niceMax];

  return (
    <div className="relative h-32">
      <div className="absolute left-0 top-0 bottom-4 w-6">
        {yTicks
          .slice()
          .reverse()
          .map((tick) => (
            <span
              key={tick}
              className="absolute -translate-y-1/2 text-[10px] text-neutral-300 font-mono"
              style={{ top: `${100 - (tick / niceMax) * 100}%` }}
            >
              {tick}
            </span>
          ))}
      </div>

      <div className="absolute left-6 right-0 top-0 bottom-4">
        {[0, 0.5, 1].map((fraction) => (
          <div
            key={fraction}
            className="absolute left-0 right-0 border-t border-dashed border-neutral-100"
            style={{ top: `${(1 - fraction) * 100}%` }}
          />
        ))}

        <div className="relative flex items-end justify-between gap-3 h-full">
          {data.map((datum, index) => {
            const isCurrent = index === data.length - 1;
            const isFirst = index === 0;
            const isLast = index === data.length - 1;
            return (
              <div key={datum.label} className="group relative flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className={cn(
                    'pointer-events-none absolute -top-2 -translate-y-full opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 bg-neutral-900 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg z-30',
                    isFirst ? 'left-0' : isLast ? 'right-0' : 'left-1/2 -translate-x-1/2'
                  )}
                >
                  {datum.label} · {datum.value}
                  {valueSuffix}
                  <span
                    className={cn(
                      'absolute top-full w-1.5 h-1.5 bg-neutral-900 rotate-45 -mt-0.5',
                      isFirst ? 'left-3' : isLast ? 'right-3' : 'left-1/2 -translate-x-1/2'
                    )}
                  />
                </div>

                <span className="text-xs font-medium text-neutral-700">
                  <AnimatedNumber value={datum.value} durationMs={700} />
                  {valueSuffix}
                </span>
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: `${Math.max(3, (datum.value / niceMax) * 100)}%` }}
                >
                  <div
                    className={`w-full max-w-9 h-full origin-bottom transition-all duration-700 ease-out rounded-t-lg shadow-[0_6px_14px_-8px_rgba(15,23,42,0.35)] group-hover:brightness-110 ${
                      isCurrent ? barClassName : mutedBarClassName
                    } ${entered ? 'scale-y-100' : 'scale-y-0'} ${isCurrent ? 'ring-1 ring-white/40' : ''}`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute left-6 right-0 bottom-0 h-4 flex justify-between gap-3">
        {data.map((datum, index) => (
          <span
            key={datum.label}
            className={`flex-1 text-[10px] text-center leading-tight truncate ${
              index === data.length - 1 ? 'text-neutral-600 font-semibold' : 'text-neutral-400'
            }`}
          >
            {datum.label}
          </span>
        ))}
      </div>
    </div>
  );
}
