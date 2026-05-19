function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 w-40 bg-neutral-200 rounded" />
        <div className="h-5 w-16 bg-neutral-200 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-28 bg-neutral-200 rounded" />
        <div className="h-3 w-44 bg-neutral-200 rounded" />
        <div className="h-3 w-32 bg-neutral-200 rounded" />
      </div>
    </div>
  )
}

export default function JobsLoading() {
  return (
    <div className="flex flex-col min-h-full">

      {/* Header skeleton */}
      <div className="screen-header">
        <div className="h-6 w-12 bg-neutral-200 rounded animate-pulse" />
        <div className="ml-auto h-9 w-9 bg-neutral-200 rounded-md animate-pulse" />
      </div>

      {/* Filter chips skeleton */}
      <div className="px-4 pt-4 pb-2 flex gap-2">
        {[80, 64, 56, 80, 72].map((w, i) => (
          <div key={i} className="h-6 bg-neutral-200 rounded-full animate-pulse shrink-0" style={{ width: w }} />
        ))}
      </div>

      {/* Card skeletons */}
      <div className="px-4 pt-2 flex flex-col gap-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

    </div>
  )
}
