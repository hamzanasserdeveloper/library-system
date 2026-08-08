interface AuthSkeletonProps {
  fieldCount?: number;
}

export function AuthSkeleton({ fieldCount = 2 }: AuthSkeletonProps) {
  return (
    <div
      className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="relative min-h-[240px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#3b82c4_0%,#2397ca_45%,#0b7a8f_100%)] lg:min-h-[640px]">
        <div
          aria-hidden
          className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_18px)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 [background:radial-gradient(900px_420px_at_80%_-80px,rgba(255,255,255,0.35),transparent_60%)]"
        />
        <div className="relative p-8 sm:p-10">
          <div className="h-11 w-44 animate-pulse rounded-xl bg-white/25" />
          <div className="mt-16 hidden space-y-3 lg:block">
            <div className="h-3 w-24 animate-pulse rounded bg-white/25" />
            <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-white/25" />
            <div className="h-8 w-60 max-w-full animate-pulse rounded-lg bg-white/25" />
            <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-white/25" />
          </div>
          <div className="mt-12 hidden items-end gap-5 lg:flex">
            <div className="h-40 w-24 animate-pulse rounded-lg bg-white/25" />
            <div className="-mt-6 h-40 w-24 animate-pulse rounded-lg bg-white/25" />
            <div className="h-40 w-24 animate-pulse rounded-lg bg-white/25" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: fieldCount }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 animate-pulse rounded-xl bg-muted" />
              </div>
            ))}
          </div>
          <div className="mt-5 h-11 animate-pulse rounded-xl bg-muted" />
          <div className="mx-auto mt-6 h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
