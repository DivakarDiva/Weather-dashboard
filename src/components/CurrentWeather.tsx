import { ArrowDown, ArrowUp } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import type { CurrentWeather as CurrentWeatherData, TemperatureUnit } from "@/types/weather";
import { formatLongDate, formatTime } from "@/utils/dateUtils";
import { formatTemperature, unitSuffix } from "@/utils/unitUtils";
import { buildSummary } from "@/utils/weatherUtils";

interface CurrentWeatherProps {
  current: CurrentWeatherData;
  unit: TemperatureUnit;
  timezone: string;
}

export function CurrentWeather({ current, unit, timezone }: CurrentWeatherProps) {
  const summary = buildSummary({
    condition: current.condition,
    high: unit === "fahrenheit" ? current.high * 1.8 + 32 : current.high,
    unitSuffix: unitSuffix(unit),
    precipitationProbability: current.precipitationProbability,
  });

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="glass-card scene-surface relative overflow-hidden p-6 sm:p-8"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1
            id="current-weather-heading"
            className="truncate text-2xl font-semibold sm:text-3xl"
          >
            {current.location}
            {current.country ? (
              <span className="text-muted-foreground">, {current.country}</span>
            ) : null}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatLongDate(current.time, timezone)} · {formatTime(current.time, timezone)}
          </p>

          <div className="mt-6 flex items-end gap-4">
            <p className="font-display text-6xl font-semibold leading-none sm:text-7xl">
              {formatTemperature(current.temperature, unit)}
            </p>
            <div className="pb-1.5 text-sm">
              <p className="font-medium text-foreground">{current.condition}</p>
              <p className="text-muted-foreground">
                Feels like {formatTemperature(current.feelsLike, unit)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ArrowUp className="size-4" aria-hidden="true" />
              High <span className="sr-only">temperature</span>
              <span className="font-medium text-foreground">
                {formatTemperature(current.high, unit)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowDown className="size-4" aria-hidden="true" />
              Low <span className="sr-only">temperature</span>
              <span className="font-medium text-foreground">
                {formatTemperature(current.low, unit)}
              </span>
            </span>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <WeatherIcon
            kind={current.kind}
            isDay={current.isDay}
            label={current.condition}
            className="size-32 sm:size-40"
          />
        </div>
      </div>
    </section>
  );
}
