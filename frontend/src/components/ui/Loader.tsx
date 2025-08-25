import React from "react";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <svg
        width={200}
        height={200}
        viewBox="0 0 50 50"
        className="animate-spin text-lime-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 1 0-15-15V5z"
        />
      </svg>
      <span className="text-lime-500 text-lg font-semibold mt-2">Welcome back, warrior!</span>
    </div>
  );
}
