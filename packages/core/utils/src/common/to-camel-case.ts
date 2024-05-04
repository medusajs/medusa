export function toCamelCase(str: string): string {
  return /^([a-z]+)(([A-Z]([a-z]+))+)$/.test(str)
    ? str
    : str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}
