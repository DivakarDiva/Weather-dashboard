import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { GeoLocation } from "@/types/weather";

const STORAGE_KEY = "weather.recentLocations";
const MAX_RECENT = 6;

function sameLocation(a: GeoLocation, b: GeoLocation): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < 0.01 && Math.abs(a.longitude - b.longitude) < 0.01
  );
}

export function useRecentLocations() {
  const [recents, setRecents] = useLocalStorage<GeoLocation[]>(STORAGE_KEY, []);

  const addRecent = useCallback(
    (location: GeoLocation) => {
      setRecents((previous) =>
        [location, ...previous.filter((item) => !sameLocation(item, location))].slice(
          0,
          MAX_RECENT,
        ),
      );
    },
    [setRecents],
  );

  const removeRecent = useCallback(
    (location: GeoLocation) => {
      setRecents((previous) => previous.filter((item) => !sameLocation(item, location)));
    },
    [setRecents],
  );

  const clearRecents = useCallback(() => setRecents([]), [setRecents]);

  return { recents, addRecent, removeRecent, clearRecents };
}
