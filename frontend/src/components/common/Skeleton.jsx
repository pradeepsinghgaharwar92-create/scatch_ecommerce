import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="w-full max-w-[280px] bg-transparent flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[3/4] bg-zinc-200 dark:bg-zinc-900 rounded-2xl animate-pulse" />
      {/* Details Skeleton */}
      <div className="mt-3.5 px-1 flex justify-between items-start">
        <div className="flex-1 space-y-2 animate-pulse">
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="md:hidden w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex-shrink-0 animate-pulse" />
      </div>
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="max-w-7xl mx-auto p-10 grid md:grid-cols-2 gap-10 animate-pulse">
      <div className="h-[450px] bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      <div className="space-y-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  );
};
