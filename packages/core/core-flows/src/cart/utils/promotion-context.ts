const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

/**
 * Resolves the timezone used to evaluate day-of-week / time-of-day promotion
 * rules. Configurable via the `MEDUSA_PROMOTION_TIMEZONE` env var so the core
 * stays generic; defaults to UTC.
 */
export function getPromotionContextTimezone(): string {
  return process.env.MEDUSA_PROMOTION_TIMEZONE || "UTC"
}

/**
 * Computes the day-of-week (0 = Sunday .. 6 = Saturday) and the minutes since
 * midnight (0 .. 1439) for a given instant in the provided IANA timezone.
 *
 * Used to populate the `current_day_of_week` and `current_minutes` attributes
 * of the promotion rule evaluation context. Falls back to UTC if the timezone
 * is invalid.
 */
export function getTimeContext(
  now: Date,
  timeZone: string
): { current_day_of_week: number; current_minutes: number } {
  let parts: Intl.DateTimeFormatPart[]

  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(now)
  } catch {
    // Invalid timezone -> fall back to UTC
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      hour12: false,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(now)
  }

  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  const weekday = lookup("weekday")
  // `hour12: false` can render midnight as "24" in some environments.
  const hour = Number(lookup("hour")) % 24
  const minute = Number(lookup("minute"))

  return {
    current_day_of_week: WEEKDAY_TO_INDEX[weekday] ?? 0,
    current_minutes: hour * 60 + minute,
  }
}
