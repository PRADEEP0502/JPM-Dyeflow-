import { ChevronRight } from 'lucide-react';

interface WorkflowStepperProps {
  avgProcessingDays?: number;
}

const STEPS = [
  { step: 1, title: 'LRN Received', description: 'Lab inward entry' },
  { step: 2, title: 'Lab Processing', description: 'Dye trial & shade match' },
  { step: 3, title: 'LDN Delivered', description: 'Sample handed to customer' },
  { step: 4, title: 'ERP Bulk Check', description: 'Converted / pending' },
] as const;

export function WorkflowStepper({ avgProcessingDays }: WorkflowStepperProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl px-5 py-3.5 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {STEPS.map(({ step, title, description }, index) => (
          <div key={step} className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
                {step}
              </span>
              <div className="leading-tight min-w-0">
                <div className="text-xs font-semibold text-neutral-900 truncate">{title}</div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {description}
                  {step === 2 && typeof avgProcessingDays === 'number' && avgProcessingDays > 0 && (
                    <span> · ~{avgProcessingDays}d avg</span>
                  )}
                </div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <ChevronRight className="hidden md:block w-4 h-4 text-neutral-300 ml-auto mr-1 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
