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
          ? "border-lime-400 bg-lime-500/25 ring-4 ring-lime-500/20 animate-in zoom-in-95 duration-300"
          : isSelected
            ? "border-lime-500 bg-lime-500/20"
            : "border-neutral-600";
        const interactionClass = inactive
          ? isLockedChoice ? "cursor-default" : "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-lime-500/50 hover:bg-neutral-800/50 active:scale-[0.98]";

        return (
          <button
            key={idx}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={inactive}
            onClick={() => onSelect(option)}
            className={`h-full w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${stateClass} ${interactionClass}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  isSelected ? "border-lime-500 bg-lime-500 text-black" : "border-neutral-600 text-white"
                }`}
              >
                {isLockedChoice ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
              </span>
              <span className="font-mono text-white break-words min-w-0 flex-1">
                <InlineText text={option} />
              </span>
              {isLockedChoice && (
                <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-lime-300">
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
