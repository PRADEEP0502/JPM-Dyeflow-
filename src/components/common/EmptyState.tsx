import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  hint?: string;
}

/** Shared empty-result state for the record tables and mobile card lists. */
export function EmptyState({
  title = 'No records match your filters',
  hint = 'Try clearing the search, status or date range filters.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 px-6 text-center">
      <span className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
        <SearchX className="w-5 h-5 text-neutral-400" />
      </span>
      <span className="text-sm font-medium text-neutral-700">{title}</span>
      <span className="text-xs text-neutral-400 max-w-xs">{hint}</span>
    </div>
  );
}
