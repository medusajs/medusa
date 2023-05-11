/**
 * Move to a new build query utils
 */

export function deduplicateIfNecessary<T = any>(collection: T | T[]): T | T[] {
  return Array.isArray(collection) ? [...new Set(collection)] : collection
}
