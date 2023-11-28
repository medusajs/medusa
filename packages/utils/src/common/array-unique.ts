type ArrayUniqueElement = string | number

export function arrayUnique<T = ArrayUniqueElement>(array: T[]): T[] {
  return [...new Set(array)]
}
