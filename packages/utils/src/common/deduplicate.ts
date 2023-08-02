export function deduplicate<T = any>(collection: T[]): T[] {
  return [...new Set(collection)]
}
