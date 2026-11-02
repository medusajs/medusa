/** Returns the string with its first character converted to upper case. */
export function upperCaseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
