import React from "react";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <svg
        width={56}
        height={56}
        viewBox="0 0 50 50"
        className="animate-spin text-blue-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 1 0-15-15V5z"
        />
      </svg>
      <span className="text-slate-600 text-sm font-medium">Loading, please wait...</span>
    </div>
  );
}
