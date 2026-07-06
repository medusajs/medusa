import { format, formatDistance, sub } from "date-fns";

export function getRelativeDate(date: string | Date): string {
  const now = new Date();

  return formatDistance(sub(new Date(date), { minutes: 0 }), now, {
    addSuffix: true,
    includeSeconds: false,
  });
}

export function formatDate(
  date?: string | Date | null,
  withTime = true
): string {
  if (!date) {
    return "-";
  }

  if (withTime) {
    return format(new Date(date), "dd MMM, yyyy, HH:mm:ss");
  }

  return format(new Date(date), "dd MMM, yyyy");
}
