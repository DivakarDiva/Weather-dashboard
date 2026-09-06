import { Umbrella } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import type { HourlyPoint, TemperatureUnit } from "@/types/weather";
import { formatHour } from "@/utils/dateUtils";
import { formatTemperature } from "@/utils/unitUtils";
import { cn } from "@/lib/utils";

interface HourlyForecastProps {
  hours: HourlyPoint[];
  unit: TemperatureUnit;
  timezone: string;
}

export function HourlyForecast({ hours, unit, timezone }: HourlyForecastProps) {
  return (
    <section aria-labelledby="hourly-heading">
      <h2 id="hourly-heading" className="mb-3 text-lg font-semibold">
        Hourly forecast
      </h2>
      <ul className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {hours.map((hour, index) => (
          <li
            key={hour.time}
            className={cn(
              "glass-card flex w-24 shrink-0 flex-col items-center gap-2 p-3 text-center transition-colors",
              index === 0 && "border-primary/50 ring-1 ring-primary/40",
            )}
          >
            <span className="text-xs font-medium text-muted-foreground">
              {index === 0 ? "Now" : formatHour(hour.time, timezone)}
            </span>
            <WeatherIcon kind={hour.kind} isDay={hour.isDay} className="size-7" />
            <span className="text-sm font-semibold">
              {formatTemperature(hour.temperature, unit)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Umbrella className="size-3" aria-hidden="true" />
              {Math.round(hour.precipitationProbability)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
