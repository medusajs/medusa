/**
 * Check if a value is defined
 * @param value
 */
export const isDefined = <T>(
  value: T | undefined | null | ""
): value is Exclude<T, undefined | null | ""> => {
  return value !== undefined && value !== null && value !== ""
}
