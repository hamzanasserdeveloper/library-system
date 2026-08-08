export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-10" aria-busy="true" aria-label="Loading">
      <div className="pb-4">
        <div className="h-44 animate-pulse rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 sm:h-56" />
        <div className="mx-auto -mt-12 h-24 w-24 animate-pulse rounded-full bg-muted ring-4 ring-background" />
        <div className="mx-auto mt-4 h-6 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-muted" />
        <div className="mx-auto mt-8 grid w-full max-w-md grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>

      <section>
        <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex w-full flex-col items-center gap-3">
              <div className="aspect-[7/10] w-full max-w-[240px] animate-pulse rounded-lg bg-muted" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
