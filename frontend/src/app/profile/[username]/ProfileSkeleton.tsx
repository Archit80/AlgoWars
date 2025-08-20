import React from 'react';
import { Space_Grotesk } from 'next/font/google';
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-neutral-950 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 animate-pulse" />
            <div>
              <div className={`w-64 h-8 rounded-md bg-zinc-800 animate-pulse ${spaceGrotesk.className}`} />
              <div className="w-40 h-4 mt-2 rounded-sm bg-zinc-800 animate-pulse" />
            </div>
          </div>
          <div className="w-28 h-10 rounded-md bg-zinc-800 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="px-8 py-16 rounded-2xl bg-neutral-900/50 shadow-sm shadow-black">
              <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto mb-4 animate-pulse" />
              <div className="w-40 h-6 mx-auto mb-6 bg-zinc-800 rounded animate-pulse" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="h-16 bg-zinc-800 rounded animate-pulse" />
                <div className="h-16 bg-zinc-800 rounded animate-pulse" />
                <div className="h-16 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>

            <div className="px-6 py-8 rounded-2xl bg-neutral-900/50 shadow-sm shadow-black">
              <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="px-8 py-12 rounded-2xl bg-neutral-900/50 shadow-sm shadow-black">
              <div className="w-48 h-6 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-32 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/50 shadow-sm shadow-black">
              <div className="w-40 h-6 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="flex gap-4 mb-6">
                <div className="w-40 h-10 bg-zinc-800 rounded animate-pulse" />
                <div className="w-40 h-10 bg-zinc-800 rounded animate-pulse" />
                <div className="w-40 h-10 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-zinc-800 rounded animate-pulse" />
                <div className="h-20 bg-zinc-800 rounded animate-pulse" />
                <div className="h-20 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
