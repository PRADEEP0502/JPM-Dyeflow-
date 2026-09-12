import { useId } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { LdnStats } from '../../hooks/useLdnStats';
import { useEnter } from '../../hooks/useEnter';
import { AnimatedNumber } from './AnimatedNumber';

interface ConversionOverviewCardProps {
  stats: LdnStats;
  onViewAll: () => void;
  onViewConverted: () => void;
  onViewPending: () => void;
}

// Waterfall geometry, in a 0-100 x 0-50 coordinate space (percent-friendly).
const VIEW_W = 100;
const VIEW_H = 50;
const BASELINE = 44;
const TOP_PAD = 6;
const OUTER_PAD = 4;
const BAR_WIDTH = 15;
const MAX_BAR_HEIGHT = BASELINE - TOP_PAD;

function niceMaxOf(value: number): number {
  return Math.max(10, Math.ceil(value / 10) * 10);
}

export function ConversionOverviewCard({ stats, onViewAll, onViewConverted, onViewPending }: ConversionOverviewCardProps) {
  const entered = useEnter();
  const gradientId = useId();
  const blueGradientId = `${gradientId}-blue`;
  const orangeGradientId = `${gradientId}-orange`;
  const foundGradientId = `${gradientId}-found`;
  const connector0Id = `${gradientId}-connector-0`;
  const connector1Id = `${gradientId}-connector-1`;

  const stages = [
    {
      key: 'delivered',
      label: 'LDN Delivered',
      value: stats.totalDelivered,
      fill: `url(#${blueGradientId})`,
      tooltip: `${stats.totalDelivered} lab samples delivered to customers`,
      onClick: onViewAll,
    },
    {
      key: 'found',
      label: 'Bulk Orders Found',
      value: stats.totalConverted,
      fill: `url(#${foundGradientId})`,
      tooltip: `${stats.totalConverted} bulk orders | Conversion: ${stats.conversionRate}% | Drop-off: -${100 - stats.conversionRate}%`,
      onClick: onViewConverted,
    },
    {
      key: 'pending',
      label: 'Pending Conversion',
      value: stats.totalWaiting,
      fill: `url(#${orangeGradientId})`,
      tooltip: `${stats.totalWaiting} samples awaiting an ERP bulk order`,
      onClick: onViewPending,
    },
  ];

  const maxValue = Math.max(1, ...stages.map((stage) => stage.value));
  const niceMax = niceMaxOf(maxValue);
  const slotWidth = (VIEW_W - OUTER_PAD * 2) / stages.length;

  const geometry = stages.map((stage, index) => {
    const slotStart = OUTER_PAD + index * slotWidth;
    const barHeight = Math.max(3, (stage.value / niceMax) * MAX_BAR_HEIGHT);
    const top = BASELINE - barHeight;
    return {
      ...stage,
      x1: slotStart,
      x2: slotStart + BAR_WIDTH,
      top,
      centerPercent: ((slotStart + BAR_WIDTH / 2) / VIEW_W) * 100,
      slotLeftPercent: (slotStart / VIEW_W) * 100,
      slotWidthPercent: (slotWidth / VIEW_W) * 100,
    };
  });

  const yTicks = [0, niceMax / 4, niceMax / 2, (niceMax * 3) / 4, niceMax];
  const topPercent = (top: number) => (top / VIEW_H) * 100;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-5 sm:p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] h-full flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">Sample-to-Bulk Conversion</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Delivered lab samples resolved against ERP bulk orders</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
          aria-label="View all LDN records"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative h-56 sm:h-64 mt-6">
        {/* Y-axis scale, matching the reference's left-hand tick column */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10">
          {yTicks
            .slice()
            .reverse()
            .map((tick) => (
              <span
                key={tick}
                className="absolute -translate-y-1/2 text-[10px] text-neutral-300 font-mono"
                style={{ top: `${topPercent(BASELINE - (tick / niceMax) * MAX_BAR_HEIGHT)}%` }}
              >
                {tick}
              </span>
            ))}
        </div>

        <div className="absolute left-8 sm:left-10 right-0 top-0 bottom-0">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id={blueGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              <linearGradient id={orangeGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id={foundGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id={connector0Id} x1={geometry[0].x2} y1="0" x2={geometry[1].x1} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id={connector1Id} x1={geometry[1].x2} y1="0" x2={geometry[2].x1} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {yTicks.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={VIEW_W}
                y1={BASELINE - (tick / niceMax) * MAX_BAR_HEIGHT}
                y2={BASELINE - (tick / niceMax) * MAX_BAR_HEIGHT}
                stroke="#f1f5f9"
                strokeDasharray="1.5,1.5"
                strokeWidth={0.4}
              />
            ))}

            <g
              style={{
                transform: entered ? 'scaleY(1)' : 'scaleY(0)',
                transformBox: 'fill-box',
                transformOrigin: 'bottom',
                transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Diagonal connectors, drawn first so bars sit on top */}
              {geometry.length > 1 && (
                <polygon
                  points={`${geometry[0].x2},${geometry[0].top} ${geometry[1].x1},${geometry[1].top} ${geometry[1].x1},${BASELINE} ${geometry[0].x2},${BASELINE}`}
                  fill={`url(#${connector0Id})`}
                  opacity={0.95}
                />
              )}
              {geometry.length > 2 && (
                <polygon
                  points={`${geometry[1].x2},${geometry[1].top} ${geometry[2].x1},${geometry[2].top} ${geometry[2].x1},${BASELINE} ${geometry[1].x2},${BASELINE}`}
                  fill={`url(#${connector1Id})`}
                  opacity={0.95}
                />
              )}

              {geometry.map((stage) => (
                <rect
                  key={stage.key}
                  x={stage.x1}
                  y={stage.top}
                  width={BAR_WIDTH}
                  height={BASELINE - stage.top}
                  rx={1.5}
                  fill={stage.fill}
                />
              ))}
            </g>
          </svg>

          {/* HTML overlay: value labels, category labels, hover targets & tooltips */}
          {geometry.map((stage, index) => (
            <div key={stage.key}>
              <div
                className="absolute -translate-x-1/2 transition-opacity duration-500"
                style={{
                  left: `${stage.centerPercent}%`,
                  top: `${topPercent(stage.top)}%`,
                  transform: 'translate(-50%, calc(-100% - 8px))',
                  opacity: entered ? 1 : 0,
                  transitionDelay: `${index * 90 + 300}ms`,
                }}
              >
                <span className="text-sm sm:text-base font-semibold text-neutral-900 font-mono whitespace-nowrap">
                  <AnimatedNumber value={stage.value} durationMs={700} />
                </span>
              </div>

              <span
                className="absolute -translate-x-1/2 text-[11px] sm:text-xs text-neutral-500 text-center leading-tight whitespace-nowrap"
                style={{ left: `${stage.centerPercent}%`, top: `${topPercent(BASELINE) + 4}%` }}
              >
                {stage.label}
              </span>

              <div
                className="group absolute top-0 bottom-0"
                style={{ left: `${stage.slotLeftPercent}%`, width: `${stage.slotWidthPercent}%` }}
              >
                <button
                  type="button"
                  onClick={stage.onClick}
                  aria-label={stage.label}
                  className="absolute inset-0 cursor-pointer focus-visible:outline-none"
                />
                <div
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 bg-neutral-900 text-white text-[11px] font-medium rounded-lg px-3 py-2 whitespace-nowrap shadow-lg z-20"
                  style={{ top: `${topPercent(stage.top)}%`, transform: 'translate(-50%, calc(-100% - 26px))' }}
                >
                  {stage.tooltip}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-neutral-900 rotate-45 -mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-6 pt-4 border-t border-neutral-100 text-xs">
        <span className="flex items-center gap-1.5 text-neutral-500">
          <span className="w-2 h-2 rounded-sm bg-blue-600" /> Delivered
        </span>
        <span className="flex items-center gap-1.5 text-neutral-500">
          <span className="w-2 h-2 rounded-sm bg-emerald-700" /> Converted
        </span>
        <span className="flex items-center gap-1.5 text-neutral-500">
          <span className="w-2 h-2 rounded-sm bg-orange-600" /> Pending
        </span>
        <span className="ml-auto font-mono font-semibold text-neutral-900">
          <AnimatedNumber value={stats.conversionRate} durationMs={900} />% conversion rate
        </span>
      </div>

      <div
        className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 transition-all duration-500"
        style={{ opacity: entered ? 1 : 0, transform: entered ? 'translateY(0)' : 'translateY(6px)', transitionDelay: '750ms' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-xs font-semibold text-neutral-700">What would you like to explore next?</span>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-600 flex flex-wrap items-center gap-1">
          <span>I want to know what caused the drop-off from</span>
          <span className="font-semibold text-neutral-800">Bulk Orders Found</span>
          <span>to</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-medium font-mono">Pending Conversion</span>
        </div>
      </div>
    </div>
  );
}
