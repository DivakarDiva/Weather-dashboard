import {
  Compass,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Umbrella,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CurrentWeather, TemperatureUnit } from "@/types/weather";
import { formatTime } from "@/utils/dateUtils";
import { formatVisibility, formatWind } from "@/utils/unitUtils";
import { uvLabel, visibilityLabel, windDirectionLabel } from "@/utils/weatherUtils";

interface WeatherDetailsProps {
  current: CurrentWeather;
  unit: TemperatureUnit;
  timezone: string;
}

interface DetailItem {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
}

export function WeatherDetails({ current, unit, timezone }: WeatherDetailsProps) {
  const items: DetailItem[] = [
    {
      icon: Droplets,
      label: "Humidity",
      value: `${Math.round(current.humidity)}%`,
      note: current.humidity > 70 ? "Humid air" : "Comfortable",
    },
    {
      icon: Wind,
      label: "Wind",
      value: formatWind(current.windSpeed, unit),
      note: `From ${windDirectionLabel(current.windDirection)}`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${current.pressure} hPa`,
      note: current.pressure >= 1013 ? "Above average" : "Below average",
    },
    {
      icon: Eye,
      label: "Visibility",
      value: formatVisibility(current.visibility, unit),
      note: visibilityLabel(current.visibility),
    },
    {
      icon: Sun,
      label: "UV index",
      value: `${Math.round(current.uvIndex)}`,
      note: uvLabel(current.uvIndex),
    },
    {
      icon: Umbrella,
      label: "Precipitation",
      value: `${Math.round(current.precipitationProbability)}%`,
      note: "Chance today",
    },
    {
      icon: Sunrise,
      label: "Sunrise",
      value: current.sunrise ? formatTime(current.sunrise, timezone) : "—",
      note: "Local time",
    },
    {
      icon: Sunset,
      label: "Sunset",
      value: current.sunset ? formatTime(current.sunset, timezone) : "—",
      note: "Local time",
    },
  ];

  return (
    <section aria-labelledby="details-heading">
      <h2 id="details-heading" className="mb-3 text-lg font-semibold">
        Today&apos;s details
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.label}
            className="glass-card p-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              {item.label === "Wind" && <Compass className="size-3" aria-hidden="true" />}
              {item.note}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
