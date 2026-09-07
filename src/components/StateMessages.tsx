import { CloudOff, MapPin, RefreshCw, Search } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="glass-card flex flex-col items-center gap-4 p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <CloudOff className="size-7" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-lg font-semibold">We couldn't load the forecast</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </button>
      ) : null}
    </div>
  );
}

interface EmptyStateProps {
  onLocate: () => void;
  locating: boolean;
}

export function EmptyState({ onLocate, locating }: EmptyStateProps) {
  return (
    <div className="glass-card flex flex-col items-center gap-4 p-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Search className="size-7" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-semibold">Where would you like the forecast?</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Search for any city above, or share your location for an instant local
          forecast.
        </p>
      </div>
      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        <MapPin className="size-4" aria-hidden="true" />
        {locating ? "Locating…" : "Use my location"}
      </button>
    </div>
  );
}
