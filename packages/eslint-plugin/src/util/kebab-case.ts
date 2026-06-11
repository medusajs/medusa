/**
 * Matches kebab-case: lowercase letters, digits, and hyphens; must start
 * with a letter and cannot end with or contain consecutive hyphens.
 */
export const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

/**
 * Converts an identifier to kebab-case. Handles camelCase, PascalCase,
 * snake_case, whitespace-separated, and consecutive-uppercase runs
 * (`myXMLParser` → `my-xml-parser`).
 */
export const toKebab = (input: string): string =>
  input
    .replace(/[_\s]+/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
