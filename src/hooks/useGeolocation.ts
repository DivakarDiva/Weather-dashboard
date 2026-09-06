import { useCallback, useState } from "react";
import { reverseGeocode } from "@/services/geocodingApi";
import type { GeoLocation } from "@/types/weather";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  denied: boolean;
}

export function useGeolocation(onLocated: (location: GeoLocation) => void) {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    denied: false,
  });

  const locate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({
        loading: false,
        error: "Location isn't supported by this browser. Try searching instead.",
        denied: false,
      });
      return;
    }
    if (state.denied) {
      setState((previous) => ({
        ...previous,
        error:
          "Location access is blocked. Enable it in your browser settings, or search for a place.",
      }));
      return;
    }

    setState({ loading: true, error: null, denied: false });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          onLocated(location);
          setState({ loading: false, error: null, denied: false });
        } catch {
          setState({
            loading: false,
            error: "We found you, but couldn't load weather for your location.",
            denied: false,
          });
        }
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setState({
          loading: false,
          denied,
          error: denied
            ? "Location access was denied. You can search for a place instead."
            : "We couldn't determine your location. Please try searching.",
        });
      },
      { timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  }, [onLocated, state.denied]);

  const clearError = useCallback(
    () => setState((previous) => ({ ...previous, error: null })),
    [],
  );

  return { ...state, locate, clearError };
}
