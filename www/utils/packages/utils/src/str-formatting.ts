export function kebabToSnake(str: string): string {
  return str.replaceAll("-", "_")
}

export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.substring(1).toLowerCase()}`
}

export function wordsToCamel(str: string): string {
  return `${str.charAt(0).toLowerCase()}${str
    .substring(1)
    .replaceAll(/\s([a-zA-Z])/g, (captured) => captured.toUpperCase())}`
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
}

export function snakeToWords(str: string): string {
  return str.replaceAll("_", " ").toLowerCase()
}

export function snakeToPascal(str: string): string {
  return str
    .split("_")
    .map((word) => capitalize(word))
    .join("")
}

export function kebabToTitle(str: string): string {
  return str
    .split("-")
    .map((word) => capitalize(word))
    .join(" ")
}

export function kebabToCamel(str: string): string {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word
      }
      return `${word.charAt(0).toUpperCase()}${word.substring(1)}`
    })
    .join("")
}

export function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((word) => capitalize(word))
    .join("")
}

export function wordsToKebab(str: string): string {
  return str
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("-")
}

export function wordsToPascal(str: string): string {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join("")
}

export function pascalToCamel(str: string): string {
  return `${str.charAt(0).toLowerCase()}${str.substring(1)}`
}

export function pascalToWords(str: string): string {
  return str.replaceAll(/([A-Z])/g, " $1")
}

/**
 * Remove parts of the name such as DTO, Filterable, etc...
 *
 * @param {string} str - The name to format.
 * @returns {string} The normalized name.
 */
export function normalizeName(str: string): string {
  return str
    .replace(/^(create|update|delete|upsert)/i, "")
    .replace(/DTO$/, "")
    .replace(/^Filterable/, "")
    .replace(/Props$/, "")
    .replace(/^I([A-Z])/, "$1")
    .replace(/ModuleService$/, "")
}
