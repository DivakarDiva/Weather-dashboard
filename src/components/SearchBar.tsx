import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { searchLocations } from "@/services/geocodingApi";
import type { GeoLocation } from "@/types/weather";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  className?: string;
}

export function SearchBar({ onSelect, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setMessage(null);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    setSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const found = await searchLocations(trimmed, controller.signal);
        setResults(found);
        setActiveIndex(-1);
        setOpen(true);
        setMessage(
          found.length === 0
            ? "Couldn't find that location. Please check the spelling and try again."
            : null,
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setResults([]);
        setMessage(
          error instanceof Error
            ? error.message
            : "Search is unavailable right now. Please try again.",
        );
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(location: GeoLocation) {
    onSelect(location);
    setQuery("");
    setResults([]);
    setOpen(false);
    setMessage(null);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const target = results[activeIndex] ?? results[0];
      if (target) {
        event.preventDefault();
        choose(target);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) choose(results[0]);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search city, region, country or ZIP"
            aria-label="Search for a location"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            role="combobox"
            className="focus-ring h-12 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-ring/40"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
        >
          {searching ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      <p aria-live="polite" className="sr-only">
        {searching ? "Searching locations" : `${results.length} locations found`}
      </p>

      {open && (results.length > 0 || message) && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Location suggestions"
          className="glass-card absolute z-30 mt-2 max-h-72 w-full overflow-auto p-1.5"
        >
          {message && (
            <li className="px-3 py-3 text-sm text-muted-foreground">{message}</li>
          )}
          {results.map((location, index) => (
            <li key={location.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => choose(location)}
                className={cn(
                  "focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  index === activeIndex && "bg-accent",
                )}
              >
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">
                  <span className="font-medium text-foreground">{location.name}</span>
                  <span className="text-muted-foreground">
                    {location.region ? `, ${location.region}` : ""}
                    {location.country ? `, ${location.country}` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
