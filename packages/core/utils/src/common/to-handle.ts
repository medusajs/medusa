/**
 * Helper method to create a URL-friendly "handle" from a string value.
 *
 * - Converts the value to lowercase
 * - Preserves letters from any language (Persian, Arabic, Japanese, Chinese, Korean, Russian, etc.)
 * - Removes special characters (apostrophes, punctuation, symbols, etc.)
 * - Replaces spaces and underscores with hyphens
 * - Collapses multiple hyphens into a single hyphen
 * - Falls back to a random suffix if the result is empty
 *
 */
export const toHandle = (value: string): string => {
  let handle = value
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  if (!handle) {
    handle = `product-${Math.random().toString(36).substring(2, 8)}`
  }

  return handle
}
