export function formatNumber(
  value: number | null | undefined,
  digits: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
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
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(date: string): string {}
