import { Clock, X } from "lucide-react";
import type { GeoLocation } from "@/types/weather";
import { cn } from "@/lib/utils";

interface RecentLocationsProps {
  recents: GeoLocation[];
  activeId?: string | undefined;
  onSelect: (location: GeoLocation) => void;
  onRemove: (location: GeoLocation) => void;
  onClear: () => void;
}

export function RecentLocations({
  recents,
  activeId,
  onSelect,
  onRemove,
  onClear,
}: RecentLocationsProps) {
  if (recents.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="flex flex-wrap items-center gap-2">
      <h2
        id="recent-heading"
        className="inline-flex items-center gap-1.5 pr-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        <Clock className="size-3.5" aria-hidden="true" />
        Recent
      </h2>
      {recents.map((location) => (
        <span
          key={location.id}
          className={cn(
            "glass-card inline-flex items-center gap-1 py-1 pr-1 pl-3 text-sm",
            location.id === activeId && "border-primary/50 ring-1 ring-primary/40",
          )}
        >
          <button
            type="button"
            onClick={() => onSelect(location)}
            className="focus-ring rounded-md py-0.5"
          >
            {location.name}
            {location.country ? (
              <span className="text-muted-foreground">, {location.country}</span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => onRemove(location)}
            aria-label={`Remove ${location.name} from recent places`}
            className="focus-ring rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="focus-ring rounded-md px-2 py-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </section>
  );
}
