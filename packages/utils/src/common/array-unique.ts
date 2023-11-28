type ArrayUniqueElement = string | number

export function arrayUnique(array: ArrayUniqueElement[]): ArrayUniqueElement[] {
  return [...new Set(array)]
}
