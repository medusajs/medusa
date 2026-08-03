/**
 * Transforms a value to a boolean or returns the default value
 * when original value cannot be casted to a boolean
 */
export function tryConvertToBoolean(value: unknown): boolean | undefined
export function tryConvertToBoolean<T>(
  value: unknown,
  defaultValue: T
): boolean | T
export function tryConvertToBoolean<T>(
  value: unknown,
  defaultValue?: T
): boolean | undefined | T {
  if (typeof value === "boolean") {
    return value
  }
  if (typeof value === "string") {
    const normalizedValue = value.toLowerCase()
    return normalizedValue === "true"
      ? true
      : normalizedValue === "false"
      ? false
      : defaultValue ?? undefined
  }
  return defaultValue ?? undefined
}
