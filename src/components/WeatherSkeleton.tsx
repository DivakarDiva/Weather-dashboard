function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

export function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading weather…</span>
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="w-full space-y-3">
            <Block className="h-7 w-56" />
            <Block className="h-4 w-40" />
            <Block className="h-20 w-44" />
            <Block className="h-4 w-64" />
          </div>
          <Block className="size-28 rounded-full" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Block key={index} className="h-24" />
        ))}
      </div>

      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <Block key={index} className="h-32 w-24 shrink-0" />
        ))}
      </div>

      <Block className="h-64" />

      <div className="flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <Block key={index} className="h-14" />
        ))}
      </div>
    </div>
  );
}
