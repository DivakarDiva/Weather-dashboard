import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WeatherKind } from "@/types/weather";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  kind: WeatherKind;
  isDay?: boolean;
  className?: string;
  label?: string;
}

const ICONS: Record<WeatherKind, LucideIcon> = {
  clear: Sun,
  cloudy: CloudSun,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

export function WeatherIcon({ kind, isDay = true, className, label }: WeatherIconProps) {
  let Icon = ICONS[kind] ?? Cloud;
  if (!isDay && kind === "clear") Icon = Moon;
  if (!isDay && kind === "cloudy") Icon = Cloud;

  return (
    <Icon
      className={cn("text-primary", className)}
      strokeWidth={1.5}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    />
  );
}
