import type { HourlyData } from "../types";

export function formatNumber(
  value: number | null | undefined,
  digits: number = 1
): string {
  if (value === null || value === undefined) {
    return "-";
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatKwhToMwhString(
  kwhValue: number | null | undefined,
  digits: number = 1
): string {
  if (kwhValue === null || kwhValue === undefined) return "-";
  return formatNumber(kwhValue / 1000, digits);
}

export function formatTime(isoString: string): string {
  if (!isoString || isoString === undefined) return "-";
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString || dateString === undefined) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function findPeakHour(list: HourlyData[], key: keyof HourlyData) {
  if (!list || list.length === 0) return null;

  return list.reduce((max, current) => {
    const currentVal = (current[key] as number) ?? 0;
    const maxVal = (max[key] as number) ?? 0;

    return currentVal > maxVal ? current : max;
  });
}
