export interface GeoLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export type WeatherKind =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export interface CurrentWeather {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  high: number;
  low: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  isDay: boolean;
  kind: WeatherKind;
  code: number;
  time: string;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  precipitationProbability: number;
  code: number;
  kind: WeatherKind;
  isDay: boolean;
}

export interface DailyPoint {
  date: string;
  max: number;
  min: number;
  code: number;
  kind: WeatherKind;
  condition: string;
  precipitationProbability: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  timezone: string;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
