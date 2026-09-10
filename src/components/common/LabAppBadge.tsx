import React from 'react';
import { useDyeFlow } from '../../context/DyeFlowContext';
import { Layers, ArrowUpRight } from 'lucide-react';

interface LabAppBadgeProps {
  labAppNo: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  showBreakdown?: boolean;
}

export const LabAppBadge: React.FC<LabAppBadgeProps> = ({
  labAppNo,
  size = 'md',
  clickable = true,
  showBreakdown = false
}) => {
  const { openTraceFor } = useDyeFlow();

  // Parse: 8157-26/A -> Running: 8157, Year: 26, Shade: A
  const match = labAppNo.match(/^(\d+)-(\d+)\/([A-Z0-9]+)$/);
  const running = match ? match[1] : labAppNo;
  const year = match ? match[2] : '';
  const shade = match ? match[3] : '';

  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;
    e.stopPropagation();
    openTraceFor(labAppNo);
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-mono font-medium',
    md: 'text-xs px-2.5 py-1 font-mono font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-mono font-bold'
  }[size];

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleClick}
        disabled={!clickable}
        className={`group inline-flex items-center gap-1.5 rounded bg-slate-900 text-amber-300 border border-slate-700 ${sizeClasses} shadow-sm tracking-wider transition-all duration-150 ${
          clickable ? 'hover:bg-slate-800 hover:border-amber-400/50 cursor-pointer active:scale-95' : ''
        }`}
        title="Click to view full Lab → Bulk → Production → Delivery Trace"
      >
        <Layers className="w-3 h-3 text-amber-400/80 group-hover:text-amber-300 shrink-0" />
        <span>{labAppNo}</span>
        {clickable && (
          <ArrowUpRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 -ml-0.5 transition-transform" />
        )}
      </button>

      {showBreakdown && match && (
        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono">
          <span className="bg-slate-200/80 px-1 rounded text-slate-700 font-medium">#{running}</span>
          <span className="text-slate-400">·</span>
          <span className="bg-slate-200/80 px-1 rounded text-slate-700">Yr {year}</span>
          <span className="text-slate-400">·</span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300/50 px-1 rounded font-bold">Var {shade}</span>
        </div>
      )}
    </div>
  );
};
