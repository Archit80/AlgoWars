import React from 'react';

const Bar = ({ className = '' }: { className?: string }) => (
  <div className={`bg-slate-100 rounded animate-pulse ${className}`} />
);

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-white w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Bar className="w-12 h-12 rounded-md" />
            <div>
              <Bar className="w-64 h-8" />
              <Bar className="w-40 h-4 mt-2" />
            </div>
          </div>
          <Bar className="w-28 h-10 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="px-8 py-12 rounded-lg bg-white border border-slate-200 shadow-sm">
              <Bar className="w-24 h-24 rounded-md mx-auto mb-4" />
              <Bar className="w-40 h-6 mx-auto mb-6" />
              <div className="space-y-3 mt-4">
                <Bar className="h-4" />
                <Bar className="h-4" />
                <Bar className="h-4" />
              </div>
            </div>

            <div className="px-6 py-8 rounded-lg bg-white border border-slate-200 shadow-sm">
              <Bar className="w-32 h-6 mb-4" />
              <div className="space-y-3">
                <Bar className="h-4" />
                <Bar className="h-4" />
                <Bar className="h-4" />
                <Bar className="h-4" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="px-8 py-10 rounded-lg bg-white border border-slate-200 shadow-sm">
              <Bar className="w-48 h-6 mb-4" />
              <div className="space-y-3">
                <Bar className="h-10" />
                <Bar className="h-10" />
                <Bar className="h-10" />
                <Bar className="h-10" />
              </div>
            </div>

            <div className="p-8 rounded-lg bg-white border border-slate-200 shadow-sm">
              <Bar className="w-40 h-6 mb-4" />
              <div className="flex gap-4 mb-6">
                <Bar className="w-40 h-10" />
                <Bar className="w-40 h-10" />
                <Bar className="w-40 h-10" />
              </div>
              <div className="space-y-3">
                <Bar className="h-10" />
                <Bar className="h-10" />
                <Bar className="h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
