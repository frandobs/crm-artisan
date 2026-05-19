function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center justify-between mb-1">
        <div className="h-3 w-20 bg-neutral-200 rounded" />
        <div className="h-5 w-16 bg-neutral-200 rounded-full" />
      </div>
      <div className="h-4 w-48 bg-neutral-200 rounded mb-2" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-36 bg-neutral-200 rounded" />
        <div className="h-3 w-28 bg-neutral-200 rounded" />
      </div>
    </div>
  )
}

export default function QuotesLoading() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="screen-header">
        <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
        <div className="ml-auto h-9 w-9 bg-neutral-200 rounded-md animate-pulse" />
      </div>
      <div className="px-4 pt-4 pb-2 flex gap-2">
        {[40, 52, 44, 68, 68].map((w, i) => (
          <div key={i} className="h-6 bg-neutral-200 rounded-full animate-pulse shrink-0" style={{ width: w }} />
        ))}
      </div>
      <div className="px-4 pt-2 flex flex-col gap-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
