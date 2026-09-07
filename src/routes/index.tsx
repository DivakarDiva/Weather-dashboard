import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { Header } from "@/components/Header";
import { CurrentWeather } from "@/components/CurrentWeather";
import { WeatherDetails } from "@/components/WeatherDetails";
import { HourlyForecast } from "@/components/HourlyForecast";
import { TemperatureChart } from "@/components/TemperatureChart";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { RecentLocations } from "@/components/RecentLocations";
import { WeatherSkeleton } from "@/components/WeatherSkeleton";
import { EmptyState, ErrorState } from "@/components/StateMessages";

import { useTheme } from "@/hooks/useTheme";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useRecentLocations } from "@/hooks/useRecentLocations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { themeForWeather } from "@/utils/weatherUtils";
import type { GeoLocation, TemperatureUnit } from "@/types/weather";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyline Weather — Live Forecast, Hourly & 7-Day Outlook" },
      {
        name: "description",
        content:
          "Check live conditions, an hourly temperature trend and a 7-day forecast for any city, with dark mode and °C/°F switching.",
      },
      { property: "og:title", content: "Skyline Weather — Live Forecast & 7-Day Outlook" },
      {
        property: "og:description",
        content:
          "Live conditions, hourly trends and a 7-day forecast for any city in the world.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const LOCATION_KEY = "weather.activeLocation";
const UNIT_KEY = "weather.unit";

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>(UNIT_KEY, "celsius");
  const [storedLocation, setStoredLocation, storageReady] =
    useLocalStorage<GeoLocation | null>(LOCATION_KEY, null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const { recents, addRecent, removeRecent, clearRecents } = useRecentLocations();

  useEffect(() => {
    if (storageReady && storedLocation && !location) setLocation(storedLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageReady, storedLocation]);

  const selectLocation = useCallback(
    (next: GeoLocation) => {
      setLocation(next);
      setStoredLocation(next);
      addRecent(next);
    },
    [addRecent, setStoredLocation],
  );

  const {
    locate,
    loading: locating,
    error: locationError,
    clearError,
  } = useGeolocation(selectLocation);
  const { data, loading, error, retry } = useWeather(location);

  const scene = data
    ? themeForWeather(data.current.kind, data.current.isDay)
    : theme === "dark"
      ? "night"
      : "clear";

  return (
    <div data-scene={scene} className="scene-surface min-h-screen">
      <Header
        onSelectLocation={selectLocation}
        onLocate={() => {
          clearError();
          locate();
        }}
        locating={locating}
        unit={unit}
        onUnitChange={setUnit}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <RecentLocations
          recents={recents}
          activeId={location?.id}
          onSelect={selectLocation}
          onRemove={removeRecent}
          onClear={clearRecents}
        />

        {locationError ? (
          <p
            role="status"
            className="glass-card flex items-start gap-2 p-3 text-sm text-muted-foreground"
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
            {locationError}
          </p>
        ) : null}

        {!location ? (
          <EmptyState onLocate={locate} locating={locating} />
        ) : loading && !data ? (
          <WeatherSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : data ? (
          <>
            <CurrentWeather
              current={data.current}
              unit={unit}
              timezone={data.timezone}
            />
            <WeatherDetails
              current={data.current}
              unit={unit}
              timezone={data.timezone}
            />
            <HourlyForecast hours={data.hourly} unit={unit} timezone={data.timezone} />
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <TemperatureChart
                  hours={data.hourly}
                  unit={unit}
                  timezone={data.timezone}
                />
              </div>
              <div className="lg:col-span-2">
                <WeeklyForecast
                  days={data.daily}
                  unit={unit}
                  timezone={data.timezone}
                />
              </div>
            </div>
          </>
        ) : null}

        <footer className="pt-4 pb-2 text-center text-xs text-muted-foreground">
          Weather data by Open-Meteo · Updated every visit
        </footer>
      </main>
    </div>
  );
}
