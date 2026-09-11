import { ReactNode } from 'react';
import { MiniBarChart } from './MiniBarChart';

interface TrendPanelProps {
  title: string;
  description: string;
  data: { label: string; value: number }[];
  barClassName: string;
  valueSuffix?: string;
  footnote?: ReactNode;
}

export function TrendPanel({ title, description, data, barClassName, valueSuffix, footnote }: TrendPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-xs h-full">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      <p className="text-xs text-neutral-500 mt-0.5">{description}</p>

      <div className="mt-6">
        <MiniBarChart data={data} barClassName={barClassName} valueSuffix={valueSuffix} />
      </div>

      {footnote && <p className="text-[11px] text-neutral-400 mt-4 pt-3 border-t border-neutral-100">{footnote}</p>}
    </div>
  );
}
