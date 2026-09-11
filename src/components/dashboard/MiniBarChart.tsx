interface BarDatum {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: BarDatum[];
  barClassName?: string;
  valueSuffix?: string;
}

/** Small, dependency-free column chart used for the weekly trend panels. */
export function MiniBarChart({ data, barClassName = 'bg-blue-500', valueSuffix = '' }: MiniBarChartProps) {
  const maxValue = Math.max(1, ...data.map((datum) => datum.value));

  return (
    <div className="flex items-end justify-between gap-3 h-28">
      {data.map((datum) => (
        <div key={datum.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <span className="text-xs font-medium text-neutral-700">
            {datum.value}
            {valueSuffix}
          </span>
          <div className="w-full flex items-end justify-center h-full">
            <div
              className={`w-full max-w-9 rounded-t-md ${barClassName}`}
              style={{ height: `${Math.max(4, (datum.value / maxValue) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-400 text-center leading-tight">{datum.label}</span>
        </div>
      ))}
    </div>
  );
}
