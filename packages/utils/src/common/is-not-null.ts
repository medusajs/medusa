export function isNotNull<T>(val: T | null): val is T {
  return val !== null
}
