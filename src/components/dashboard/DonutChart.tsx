interface DonutSegment {
  label: string;
  value: number;
  colorClass: string; // tailwind stroke-* class
  onClick?: () => void;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({ segments, centerValue, centerLabel, size = 168 }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let offsetSoFar = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="currentColor" className="text-neutral-100" strokeWidth="12" />
        {total > 0 &&
          segments.map((segment) => {
            const fraction = segment.value / total;
            const dashLength = fraction * CIRCUMFERENCE;
            const dashArray = `${dashLength} ${CIRCUMFERENCE - dashLength}`;
            const dashOffset = -offsetSoFar;
            offsetSoFar += dashLength;

            return (
              <circle
                key={segment.label}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                className={`${segment.colorClass} ${segment.onClick ? 'cursor-pointer' : ''}`}
                strokeWidth="12"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                onClick={segment.onClick}
              />
            );
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-semibold text-neutral-900 tracking-tight">{centerValue}</span>
        <span className="text-[11px] text-neutral-400 text-center px-4">{centerLabel}</span>
      </div>
    </div>
  );
}
