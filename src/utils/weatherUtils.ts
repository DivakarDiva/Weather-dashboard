import type { WeatherKind } from "@/types/weather";

interface CodeInfo {
  label: string;
  kind: WeatherKind;
}

const WEATHER_CODES: Record<number, CodeInfo> = {
  0: { label: "Clear sky", kind: "clear" },
  1: { label: "Mainly clear", kind: "clear" },
  2: { label: "Partly cloudy", kind: "cloudy" },
  3: { label: "Overcast", kind: "cloudy" },
  45: { label: "Fog", kind: "fog" },
  48: { label: "Rime fog", kind: "fog" },
  51: { label: "Light drizzle", kind: "drizzle" },
  53: { label: "Drizzle", kind: "drizzle" },
  55: { label: "Heavy drizzle", kind: "drizzle" },
  56: { label: "Freezing drizzle", kind: "drizzle" },
  57: { label: "Freezing drizzle", kind: "drizzle" },
  61: { label: "Light rain", kind: "rain" },
  63: { label: "Rain", kind: "rain" },
  65: { label: "Heavy rain", kind: "rain" },
  66: { label: "Freezing rain", kind: "rain" },
  67: { label: "Freezing rain", kind: "rain" },
  71: { label: "Light snow", kind: "snow" },
  73: { label: "Snow", kind: "snow" },
  75: { label: "Heavy snow", kind: "snow" },
  77: { label: "Snow grains", kind: "snow" },
  80: { label: "Rain showers", kind: "rain" },
  81: { label: "Rain showers", kind: "rain" },
  82: { label: "Violent rain showers", kind: "rain" },
  85: { label: "Snow showers", kind: "snow" },
  86: { label: "Heavy snow showers", kind: "snow" },
  95: { label: "Thunderstorm", kind: "storm" },
  96: { label: "Thunderstorm with hail", kind: "storm" },
  99: { label: "Severe thunderstorm", kind: "storm" },
};

export function describeCode(code: number): CodeInfo {
  return WEATHER_CODES[code] ?? { label: "Unknown conditions", kind: "cloudy" };
}

export function weatherKind(code: number): WeatherKind {
  return describeCode(code).kind;
}

export function themeForWeather(kind: WeatherKind, isDay: boolean): string {
  if (!isDay) return "night";
  return kind;
}

export function uvLabel(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

export function visibilityLabel(metres: number): string {
  if (metres >= 10000) return "Excellent";
  if (metres >= 5000) return "Good";
  if (metres >= 2000) return "Moderate";
  return "Poor";
}

const COMPASS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

export function windDirectionLabel(degrees: number): string {
  const index = Math.round(((((degrees % 360) + 360) % 360) / 22.5)) % 16;
  return COMPASS[index] ?? "N";
}

export function buildSummary(params: {
  condition: string;
  high: number;
  unitSuffix: string;
  precipitationProbability: number;
}): string {
  const { condition, high, unitSuffix, precipitationProbability } = params;
  const rainPart =
    precipitationProbability >= 40
      ? ` There is a ${precipitationProbability}% chance of precipitation.`
      : "";
  return `${condition} today, with temperatures reaching ${Math.round(high)}${unitSuffix}.${rainPart}`;
}
