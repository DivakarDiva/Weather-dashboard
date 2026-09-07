import type { GeoLocation } from "@/types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly kind:
      | "not_found"
      | "network"
      | "rate_limit"
      | "invalid_key"
      | "unavailable" = "unavailable",
  ) {
    super(message);
    this.name = "WeatherServiceError";
  }
}

interface RawGeoResult {
  id?: number;
  name?: string;
  admin1?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

function normalizeGeoResult(raw: RawGeoResult): GeoLocation | null {
  if (
    typeof raw.name !== "string" ||
    typeof raw.latitude !== "number" ||
    typeof raw.longitude !== "number"
  ) {
    return null;
  }
  return {
    id: `${raw.id ?? `${raw.latitude},${raw.longitude}`}`,
    name: raw.name,
    region: typeof raw.admin1 === "string" ? raw.admin1 : "",
    country: typeof raw.country === "string" ? raw.country : "",
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
  };
}

async function request(url: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, signal ? { signal } : {});
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
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
  if (response.status === 401 || response.status === 403) {
    throw new WeatherServiceError(
      "The weather service rejected this request. Please try again later.",
      "invalid_key",
    );
  }
  if (!response.ok) {
    throw new WeatherServiceError(
      "The weather service is temporarily unavailable. Please try again shortly.",
      "unavailable",
    );
  }
  return response.json();
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const data = (await request(
    `${GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`,
    signal,
  )) as { results?: RawGeoResult[] };

  const results = Array.isArray(data.results) ? data.results : [];
  return results
    .map(normalizeGeoResult)
    .filter((item): item is GeoLocation => item !== null);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeoLocation> {
  try {
    const data = (await request(
      `${REVERSE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    )) as { city?: string; locality?: string; principalSubdivision?: string; countryName?: string };

    const name = data.city || data.locality || data.principalSubdivision || "My location";
    return {
      id: `${latitude.toFixed(3)},${longitude.toFixed(3)}`,
      name,
      region: data.principalSubdivision ?? "",
      country: data.countryName ?? "",
      latitude,
      longitude,
    };
  } catch {
    return {
      id: `${latitude.toFixed(3)},${longitude.toFixed(3)}`,
      name: "My location",
      region: "",
      country: "",
      latitude,
      longitude,
    };
  }
}
