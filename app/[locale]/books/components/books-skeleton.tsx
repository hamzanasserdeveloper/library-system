export function BooksSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-12">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex w-[45%] max-w-[240px] justify-center sm:w-[30%] lg:w-[22%]"
        >
          <div className="flex w-full max-w-[260px] flex-col">
            <div className="aspect-[7/10] w-full animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto mt-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mx-auto mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
