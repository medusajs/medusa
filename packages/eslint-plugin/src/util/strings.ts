/**
 * Matches kebab-case: lowercase letters, digits, and hyphens; must start
 * with a letter and cannot end with or contain consecutive hyphens.
 */
export const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

/**
 * Matches snake_case: lowercase letters, digits, and underscores; must start
 * with a letter.
 */
export const SNAKE_CASE_RE = /^[a-z][a-z0-9_]*$/

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

/**
 * Converts an identifier to snake_case. Handles camelCase, PascalCase,
 * kebab-case, whitespace-separated, dot-separated, and consecutive-uppercase
 * runs (`myXMLParser` → `my_xml_parser`). Any non-alphanumeric character
 * becomes a separator; runs of underscores collapse; leading/trailing
 * underscores are trimmed.
 */
export const toSnake = (input: string): string =>
  input
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
