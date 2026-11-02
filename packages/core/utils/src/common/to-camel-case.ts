/** Converts a string to camelCase, leaving strings that are already camelCase unchanged. */
export function toCamelCase(str: string): string {
  return /^([a-zA-Z][a-zA-Z0-9]*)(([A-Z][a-z0-9]+)+)$/.test(str)
    ? str
    : str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}
