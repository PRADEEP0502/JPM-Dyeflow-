import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

/** Compact dropdown for one filter dimension. `all` renders as "All {label}". */
export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const isActive = value !== 'all';

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 ${
          isActive
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
        }`}
      >
        <option value="all">All {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
          isActive ? 'text-white/80' : 'text-neutral-400'
        }`}
      />
    </div>
  );
}
