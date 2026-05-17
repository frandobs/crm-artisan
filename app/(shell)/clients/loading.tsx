function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 w-36 bg-neutral-200 rounded mb-3" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-28 bg-neutral-200 rounded" />
        <div className="h-3 w-44 bg-neutral-200 rounded" />
        <div className="h-3 w-40 bg-neutral-200 rounded" />
      </div>
    </div>
  )
}

export default function ClientsLoading() {
  return (
    <div className="flex flex-col min-h-full">

      {/* Header skeleton */}
      <div className="screen-header">
        <div className="h-6 w-20 bg-neutral-200 rounded animate-pulse" />
        <div className="ml-auto h-9 w-9 bg-neutral-200 rounded-md animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="p-4 pb-2">
        <div className="h-[52px] bg-neutral-200 rounded-md animate-pulse" />
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
