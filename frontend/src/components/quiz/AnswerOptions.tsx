"use client";
import { Check, Lock } from "lucide-react";
import { InlineText } from "./QuestionText";

interface AnswerOptionsProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  /** The answer has been submitted: the choice is frozen and shown as locked in */
  locked?: boolean;
  /** Temporarily not selectable (e.g. while a submission is in flight) */
  disabled?: boolean;
}

// Answer choices as a 2x2 grid (single column on narrow screens, where code options get cramped).
export default function AnswerOptions({
  options,
  selected,
  onSelect,
  locked = false,
  disabled = false,
}: AnswerOptionsProps) {
  const inactive = locked || disabled;

  return (
    <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option, idx) => {
        const isSelected = selected === option;
        const isLockedChoice = locked && isSelected;

        const stateClass = isLockedChoice
          ? "border-blue-700 bg-blue-50"
          : isSelected
            ? "border-blue-700 bg-blue-50"
            : "border-slate-300 bg-white";
        const interactionClass = inactive
          ? isLockedChoice ? "cursor-default" : "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-blue-400 hover:bg-blue-50";

        return (
          <button
            key={idx}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={inactive}
            onClick={() => onSelect(option)}
            className={`h-full w-full p-4 rounded-md border text-left shadow-sm transition-colors duration-150 ${stateClass} ${interactionClass}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-sm font-semibold ${
                  isSelected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 text-slate-600"
                }`}
              >
                {isLockedChoice ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
              </span>
              <span className="font-mono text-slate-900 break-words min-w-0 flex-1">
                <InlineText text={option} />
              </span>
              {isLockedChoice && (
                <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-700">
                  <Lock className="w-3 h-3" />
                  Locked in
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
