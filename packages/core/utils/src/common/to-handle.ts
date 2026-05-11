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
    .toLowerCase()                          // Normalize to lowercase
    .replace(/ß/g, "ss")                    // Convert German eszett to ss
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")     // Remove all characters except Unicode letters, numbers, spaces, underscores, and hyphens
    .replace(/[\s_]+/g, "-")                // Replace spaces and underscores with single hyphens
    .replace(/-+/g, "-")                    // Collapse multiple consecutive hyphens into one
    .replace(/^-|-$/g, "")                  // Trim leading and trailing hyphens
  if (!handle) {
    handle = `product-${Math.random().toString(36).substring(2, 8)}`
  }
  return handle
}
