import type { TemperatureUnit } from "@/types/weather";

export function toFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

export function toCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9);
}

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return unit === "fahrenheit" ? toFahrenheit(celsius) : celsius;
}

export function unitSuffix(unit: TemperatureUnit): string {
  return unit === "fahrenheit" ? "°F" : "°C";
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  return `${Math.round(convertTemperature(celsius, unit))}${unitSuffix(unit)}`;
}

export function formatWind(kmh: number, unit: TemperatureUnit): string {
  return unit === "fahrenheit"
    ? `${Math.round(kmh * 0.621371)} mph`
    : `${Math.round(kmh)} km/h`;
}

export function formatVisibility(metres: number, unit: TemperatureUnit): string {
  return unit === "fahrenheit"
    ? `${(metres / 1609.34).toFixed(1)} mi`
    : `${(metres / 1000).toFixed(1)} km`;
}
