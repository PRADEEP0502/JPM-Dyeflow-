import { useId } from 'react';
import { useEnter } from '../../hooks/useEnter';
import { AnimatedNumber } from './AnimatedNumber';

interface LineTrendChartProps {
  data: { label: string; value: number }[];
  colorClassName?: string; // e.g. 'text-blue-500' — line, dots and fill all inherit via currentColor
  valueSuffix?: string;
}

const WIDTH = 100;
const HEIGHT = 40;
const PADDING_X = 4;
const PADDING_TOP = 4;
const BASELINE = HEIGHT - 6;

function niceMaxOf(value: number): number {
  return Math.max(10, Math.ceil(value / 10) * 10);
}

/** Smooths a polyline into quadratic-bezier curve segments — no charting library needed. */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

export function LineTrendChart({ data, colorClassName = 'text-blue-500', valueSuffix = '' }: LineTrendChartProps) {
  const entered = useEnter();
  const gradientId = useId();
  const maxValue = Math.max(1, ...data.map((datum) => datum.value));
  const niceMax = niceMaxOf(maxValue);
  const stepX = data.length > 1 ? (WIDTH - PADDING_X * 2) / (data.length - 1) : 0;

  const points = data.map((datum, index) => ({
    x: PADDING_X + index * stepX,
    y: BASELINE - (datum.value / niceMax) * (BASELINE - PADDING_TOP),
  }));

  const linePath = buildSmoothPath(points);
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${BASELINE} L ${points[0].x.toFixed(2)} ${BASELINE} Z` : '';

  const pathLength = points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + Math.hypot(point.x - previous.x, point.y - previous.y) * 1.15;
  }, 0);

  const yTicks = [0, niceMax / 2, niceMax];
  const topPercent = (y: number) => (y / HEIGHT) * 100;

  return (
    <div>
      <div className="relative h-32">
        <div className="absolute left-0 top-0 bottom-0 w-6">
          {yTicks
            .slice()
            .reverse()
            .map((tick) => (
              <span
                key={tick}
                className="absolute -translate-y-1/2 text-[10px] text-neutral-300 font-mono"
                style={{ top: `${topPercent(BASELINE - (tick / niceMax) * (BASELINE - PADDING_TOP))}%` }}
              >
                {tick}
              </span>
            ))}
        </div>

        <div className={`absolute left-6 right-0 top-0 bottom-0 ${colorClassName}`}>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.28} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            {yTicks.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={WIDTH}
                y1={BASELINE - (tick / niceMax) * (BASELINE - PADDING_TOP)}
                y2={BASELINE - (tick / niceMax) * (BASELINE - PADDING_TOP)}
                stroke="#f1f5f9"
                strokeDasharray="1.5,1.5"
                strokeWidth={0.4}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {areaPath && (
              <path
                d={areaPath}
                fill={`url(#${gradientId})`}
                stroke="none"
                className="transition-opacity duration-700"
                style={{ opacity: entered ? 1 : 0, transitionDelay: '250ms' }}
              />
            )}
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength || undefined}
              strokeDashoffset={entered ? 0 : pathLength}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
            {points.map((point, index) => {
              const isCurrent = index === points.length - 1;
              return (
                <g key={index}>
                  {isCurrent && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={3.2}
                      fill="currentColor"
                      opacity={entered ? 0.18 : 0}
                      className="transition-opacity duration-500"
                    />
                  )}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCurrent ? 2.1 : 1.6}
                    fill="currentColor"
                    stroke="white"
                    strokeWidth={0.8}
                    className="transition-opacity duration-300"
                    style={{ opacity: entered ? 1 : 0, transitionDelay: `${700 + index * 60}ms` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML overlay: hover targets + tooltips, aligned to the same viewBox coordinates */}
          {points.map((point, index) => (
            <div
              key={index}
              className="group absolute top-0 bottom-0 -translate-x-1/2"
              style={{ left: `${(point.x / WIDTH) * 100}%`, width: `${(WIDTH / data.length / WIDTH) * 100}%` }}
            >
              <div
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 bg-neutral-900 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg z-20"
                style={{ top: `${(point.y / HEIGHT) * 100}%`, transform: 'translate(-50%, calc(-100% - 12px))' }}
              >
                {data[index].value}
                {valueSuffix} · {data[index].label}
                <span className="absolute left-1/2 -translate-x-1/2 top-full w-1.5 h-1.5 bg-neutral-900 rotate-45 -mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-1 pl-6">
        {data.map((datum, index) => (
          <div key={datum.label} className="flex-1 text-center">
            <div className="text-xs font-semibold text-neutral-800">
              <AnimatedNumber value={datum.value} durationMs={700} />
              {valueSuffix}
            </div>
            <div
              className={`text-[10px] mt-0.5 ${
                index === data.length - 1 ? 'text-neutral-600 font-semibold' : 'text-neutral-400'
              }`}
            >
              {datum.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
