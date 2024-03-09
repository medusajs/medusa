/**
 * Prefixes an array of strings with a specified string
 * @param array
 * @param prefix
 */
export function prefixArrayItems(array: string[], prefix: string): string[] {
  return array.map((arrEl) => `${prefix}${arrEl}`)
}
