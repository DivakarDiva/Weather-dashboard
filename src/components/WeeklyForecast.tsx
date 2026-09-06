import { Umbrella } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import type { DailyPoint, TemperatureUnit } from "@/types/weather";
import { formatDayName } from "@/utils/dateUtils";
import { formatTemperature } from "@/utils/unitUtils";

interface WeeklyForecastProps {
  days: DailyPoint[];
  unit: TemperatureUnit;
  timezone: string;
}

export function WeeklyForecast({ days, unit, timezone }: WeeklyForecastProps) {
  return (
    <section aria-labelledby="weekly-heading">
      <h2 id="weekly-heading" className="mb-3 text-lg font-semibold">
        7-day forecast
      </h2>
      <ul className="flex flex-col gap-2">
        {days.map((day, index) => (
          <li
            key={day.date}
            className="glass-card flex items-center gap-3 p-3.5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="w-14 shrink-0 text-sm font-semibold">
              {index === 0 ? "Today" : formatDayName(day.date, timezone)}
            </span>
            <WeatherIcon kind={day.kind} className="size-7 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
              {day.condition}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Umbrella className="size-3" aria-hidden="true" />
              {Math.round(day.precipitationProbability)}%
            </span>
            <span className="w-24 shrink-0 text-right text-sm">
              <span className="font-semibold">{formatTemperature(day.max, unit)}</span>
              <span className="text-muted-foreground">
                {" / "}
                {formatTemperature(day.min, unit)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
