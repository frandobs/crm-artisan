export default function QuoteDetailLoading() {
  return (
    <div className="flex flex-col min-h-full bg-white animate-pulse">
      <div className="screen-header gap-3">
        <div className="w-6 h-6 bg-neutral-200 rounded" />
        <div className="h-6 w-32 bg-neutral-200 rounded" />
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="card flex flex-col gap-3">
          <div className="h-5 w-48 bg-neutral-200 rounded" />
          <div className="h-px bg-neutral-200" />
          <div className="h-3 w-36 bg-neutral-200 rounded" />
          <div className="h-3 w-28 bg-neutral-200 rounded" />
          <div className="h-3 w-32 bg-neutral-200 rounded" />
        </div>
        <div className="card">
          <div className="h-3 w-20 bg-neutral-200 rounded mb-3" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-4 w-16 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
