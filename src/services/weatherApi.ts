import type {
  DailyPoint,
  GeoLocation,
  HourlyPoint,
  WeatherBundle,
} from "@/types/weather";
import { describeCode, weatherKind } from "@/utils/weatherUtils";
import { WeatherServiceError } from "./geocodingApi";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { at: number; data: WeatherBundle }>();

interface RawForecast {
  timezone?: string;
  current?: Record<string, number>;
  hourly?: Record<string, unknown>;
  daily?: Record<string, unknown>;
}

function numberAt(source: unknown, index: number): number {
  return Array.isArray(source) && typeof source[index] === "number"
    ? (source[index] as number)
    : 0;
}

function stringAt(source: unknown, index: number): string {
  return Array.isArray(source) && typeof source[index] === "string"
    ? (source[index] as string)
    : "";
}

function buildUrl(location: GeoLocation): string {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility",
    hourly: "temperature_2m,precipitation_probability,weather_code,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });
  return `${FORECAST_URL}?${params.toString()}`;
}

function normalize(raw: RawForecast, location: GeoLocation): WeatherBundle {
  const current = raw.current ?? {};
  const hourlyRaw = raw.hourly ?? {};
  const dailyRaw = raw.daily ?? {};

  const cur = (key: string): number | undefined => {
    const value = current[key];
    return typeof value === "number" ? value : undefined;
  };

  const hourlyTimes = Array.isArray(hourlyRaw["time"])
    ? (hourlyRaw["time"] as string[])
    : [];
  const dailyTimes = Array.isArray(dailyRaw["time"]) ? (dailyRaw["time"] as string[]) : [];

  if (dailyTimes.length === 0) {
    throw new WeatherServiceError(
      "The weather service returned unexpected data. Please try again shortly.",
      "unavailable",
    );
  }

  const now = Date.now();
  const startIndex = Math.max(
    0,
    hourlyTimes.findIndex((time) => new Date(time).getTime() >= now - 60 * 60 * 1000),
  );

  const hourly: HourlyPoint[] = hourlyTimes
    .slice(startIndex, startIndex + 24)
    .map((time, offset) => {
      const index = startIndex + offset;
      const code = numberAt(hourlyRaw["weather_code"], index);
      return {
        time,
        temperature: numberAt(hourlyRaw["temperature_2m"], index),
        precipitationProbability: numberAt(
          hourlyRaw["precipitation_probability"],
          index,
        ),
        code,
        kind: weatherKind(code),
        isDay: numberAt(hourlyRaw["is_day"], index) === 1,
      };
    });

  const daily: DailyPoint[] = dailyTimes.map((date, index) => {
    const code = numberAt(dailyRaw["weather_code"], index);
    return {
      date,
      max: numberAt(dailyRaw["temperature_2m_max"], index),
      min: numberAt(dailyRaw["temperature_2m_min"], index),
      code,
      kind: weatherKind(code),
      condition: describeCode(code).label,
      precipitationProbability: numberAt(
        dailyRaw["precipitation_probability_max"],
        index,
      ),
    };
  });

  const code = cur("weather_code") ?? 0;
  const info = describeCode(code);
  const isDay = cur("is_day") === 1;

  return {
    timezone: raw.timezone ?? "auto",
    hourly,
    daily,
    current: {
      location: location.name,
      country: location.country,
      temperature: cur("temperature_2m") ?? 0,
      feelsLike: cur("apparent_temperature") ?? cur("temperature_2m") ?? 0,
      high: daily[0]?.max ?? 0,
      low: daily[0]?.min ?? 0,
      condition: info.label,
      description: info.label,
      humidity: cur("relative_humidity_2m") ?? 0,
      windSpeed: cur("wind_speed_10m") ?? 0,
      windDirection: cur("wind_direction_10m") ?? 0,
      pressure: Math.round(cur("surface_pressure") ?? 0),
      visibility: cur("visibility") ?? 0,
      uvIndex: numberAt(dailyRaw["uv_index_max"], 0),
      precipitationProbability: daily[0]?.precipitationProbability ?? 0,
      sunrise: stringAt(dailyRaw["sunrise"], 0),
      sunset: stringAt(dailyRaw["sunset"], 0),
      isDay,
      kind: info.kind,
      code,
      time: new Date().toISOString(),
    },
  };
}

export async function fetchWeather(location: GeoLocation): Promise<WeatherBundle> {
  const key = `${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data;

  let response: Response;
  try {
    response = await fetch(buildUrl(location));
  } catch {
    throw new WeatherServiceError(
      "We couldn't reach the weather service. Check your connection and try again.",
      "network",
    );
  }

  if (response.status === 429) {
    throw new WeatherServiceError(
      "Too many requests right now. Please wait a moment and try again.",
      "rate_limit",
    );
  }
  if (!response.ok) {
    throw new WeatherServiceError(
      "The weather service is temporarily unavailable. Please try again shortly.",
      "unavailable",
    );
  }

  const data = normalize((await response.json()) as RawForecast, location);
  cache.set(key, { at: Date.now(), data });
  return data;
}
