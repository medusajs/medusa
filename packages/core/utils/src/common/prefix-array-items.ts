/**
 * Prefixes an array of strings with a specified string
 * @param array
 * @param prefix
 */
export function prefixArrayItems(
  array: string[] | null | undefined,
  prefix: string
): string[] {
  if (!array) {
    return []
  }

  return array
    .filter((arrEl) => arrEl !== undefined)
    .map((arrEl) => `${prefix}${arrEl}`)
}
