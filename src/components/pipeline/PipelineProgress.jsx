import React from 'react';
import { PIPELINE_STEPS, getStepIndex } from '@/lib/pipelineSteps';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PipelineProgress({ currentStatus, onStepClick }) {
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max px-2">
        {PIPELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const isClickable = idx <= currentIndex && onStepClick;

          return (
            <React.Fragment key={step.key}>
              <button
                onClick={() => isClickable && onStepClick(step.key)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-1.5 relative group",
                  isClickable && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border-2",
                    isCompleted && "bg-accent border-accent text-accent-foreground",
                    isCurrent && "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                    isFuture && "bg-secondary border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap transition-colors",
                    isCompleted && "text-accent",
                    isCurrent && "text-primary",
                    isFuture && "text-muted-foreground"
                  )}
                >
                  {step.shortLabel}
                </span>
              </button>
              {idx < PIPELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-12 mt-[-14px] transition-colors duration-300",
                    idx < currentIndex ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}