import { ReactNode } from 'react';

interface TrendPanelProps {
  title: string;
  description: string;
  headline?: ReactNode;
  children: ReactNode;
  footnote?: ReactNode;
}

export function TrendPanel({ title, description, headline, children, footnote }: TrendPanelProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-5 sm:p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.15)] h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-10px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-wide">{title}</h2>
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        </div>
        {headline && <div className="shrink-0">{headline}</div>}
      </div>

      <div className="mt-6">{children}</div>

      {footnote && <p className="text-[11px] text-neutral-400 mt-4 pt-3 border-t border-neutral-100">{footnote}</p>}
    </div>
  );
}
