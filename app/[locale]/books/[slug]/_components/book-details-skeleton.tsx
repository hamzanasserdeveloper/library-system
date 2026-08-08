export function BookDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative flex min-h-[540px] overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <div className="w-[42%] animate-pulse bg-muted sm:w-[38%]" />
          <div className="flex w-[58%] flex-col gap-5 p-5 sm:w-[62%] sm:p-9">
            <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="mt-2 space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className="mt-auto h-11 w-40 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
