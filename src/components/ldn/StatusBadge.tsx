import { MatchResult } from '../../types';

interface StatusBadgeProps {
  result: MatchResult;
  /** When provided (mobile card view), shows elapsed days inline for waiting items. */
  daysWaiting?: number;
}

export function StatusBadge({ result, daysWaiting }: StatusBadgeProps) {
  if (result === 'Bulk Order Found') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Converted
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {typeof daysWaiting === 'number' ? `Pending (${daysWaiting}d)` : 'Pending'}
    </span>
  );
}
