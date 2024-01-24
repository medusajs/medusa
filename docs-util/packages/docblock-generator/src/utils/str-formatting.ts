export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`
}

export function camelToWords(str: string): string {
  return str
    .replaceAll(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase()
}

export function camelToTitle(str: string): string {
  return str
    .replaceAll(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ")
    .trim()
    .toLowerCase()
}

export function snakeToWords(str: string): string {
  return str.replaceAll("_", " ").toLowerCase()
}

/**
 * Remove parts of the name such as DTO, Filterable, etc...
 *
 * @param {string} str - The name to format.
 * @returns {string} The normalized name.
 */
export function normalizeName(str: string): string {
  return str
    .replace(/^(create|update|delete)/i, "")
    .replace(/DTO$/, "")
    .replace(/^Filterable/, "")
    .replace(/Props$/, "")
}
