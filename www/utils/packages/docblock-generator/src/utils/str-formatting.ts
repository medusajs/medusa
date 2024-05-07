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
