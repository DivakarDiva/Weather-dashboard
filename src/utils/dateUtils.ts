export function formatTime(iso: string, timeZone?: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

export function formatHour(iso: string, timeZone?: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    timeZone,
  });
}

export function formatDayName(iso: string, timeZone?: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "short", timeZone });
}

export function formatLongDate(iso: string, timeZone?: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone,
  });
}

export function isSameHour(a: string, b: Date): boolean {
  const date = new Date(a);
  return (
    date.getFullYear() === b.getFullYear() &&
    date.getMonth() === b.getMonth() &&
    date.getDate() === b.getDate() &&
    date.getHours() === b.getHours()
  );
}
