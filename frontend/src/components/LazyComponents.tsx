import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components with loading fallbacks
export const LazyFaultyTerminal = dynamic(
  () => import('./FaultyTerminal/FaultyTerminal'),
  {
    loading: () => (
      <div className="w-full h-full bg-neutral-900 animate-pulse rounded-lg" />
    ),
    ssr: false, // Disable SSR for WebGL component
  }
);

export const LazyLeaderboard = dynamic(
  () => import('./HOME/Leaderboard').then(mod => ({ default: mod.Leaderboard })),
  {
    loading: () => (
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-lg p-6">
        <div className="h-6 bg-neutral-800 rounded mb-4 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <div className="w-10 h-10 bg-neutral-800 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-neutral-800 rounded w-24 mb-2 animate-pulse" />
              <div className="h-3 bg-neutral-800 rounded w-16 animate-pulse" />
            </div>
            <div className="h-6 bg-neutral-800 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
    ),
  }
);

export const LazyOrb = dynamic(
  () => import('./Orb/Orb'),
  {
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-transparent" />,
    ssr: false,
  }
);

// Wrapper component with Suspense
export function LazyComponentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="w-full h-32 bg-neutral-800 animate-pulse rounded-lg" />}>
      {children}
    </Suspense>
  );
}
