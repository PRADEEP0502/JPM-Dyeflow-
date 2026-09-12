import { Calendar } from 'lucide-react';
import { toInputDateValue } from '../../utils/format';

interface DateRangeControlProps {
  start: Date;
  end: Date;
  minDate: Date;
  maxDate: Date;
  onChange: (start: Date, end: Date) => void;
}

export function DateRangeControl({ start, end, minDate, maxDate, onChange }: DateRangeControlProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-600 shrink-0">
      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <input
        type="date"
        value={toInputDateValue(start)}
        min={toInputDateValue(minDate)}
        max={toInputDateValue(end)}
        onChange={(event) => {
          if (!event.target.value) return;
          const [y, m, d] = event.target.value.split('-').map(Number);
          onChange(new Date(y, m - 1, d), end);
        }}
        className="bg-transparent focus:outline-none w-[104px] font-mono text-xs text-neutral-600"
        aria-label="Range start date"
      />
      <span className="text-neutral-300">–</span>
      <input
        type="date"
        value={toInputDateValue(end)}
        min={toInputDateValue(start)}
        max={toInputDateValue(maxDate)}
        onChange={(event) => {
          if (!event.target.value) return;
          const [y, m, d] = event.target.value.split('-').map(Number);
          onChange(start, new Date(y, m - 1, d));
        }}
        className="bg-transparent focus:outline-none w-[104px] font-mono text-xs text-neutral-600"
        aria-label="Range end date"
      />
    </div>
  );
}
