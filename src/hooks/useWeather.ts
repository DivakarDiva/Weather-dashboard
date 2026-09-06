import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather } from "@/services/weatherApi";
import { WeatherServiceError } from "@/services/geocodingApi";
import type { GeoLocation, WeatherBundle } from "@/types/weather";

export function useWeather(location: GeoLocation | null) {
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (target: GeoLocation) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const bundle = await fetchWeather(target);
      if (id === requestId.current) setData(bundle);
    } catch (caught) {
      if (id !== requestId.current) return;
      setData(null);
      setError(
        caught instanceof WeatherServiceError
          ? caught.message
          : "Something went wrong loading the weather. Please try again.",
      );
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!location) {
      setData(null);
      setError(null);
      return;
    }
    void load(location);
  }, [location, load]);

  const retry = useCallback(() => {
    if (location) void load(location);
  }, [location, load]);

  return { data, loading, error, retry };
}
