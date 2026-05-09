/**
 * Helper method to create a to be URL friendly "handle" from
 * a string value.
 *
 * - Works by converting the value to lowercase
 * - Splits and remove accents from characters
 * - Removes all unallowed characters like a '"%$ and so on.
 */
export const toHandle = (value: string): string => {
  return value
    .toLowerCase()                          // Normalize to lowercase
    .replace(/ß/g, 'ss')                    // Convert German eszett to ss
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')     // Remove all characters except Unicode letters, numbers, spaces, underscores, and hyphens
    .replace(/[\s_]+/g, '-')                // Replace spaces and underscores with single hyphens
    .replace(/-+/g, '-')                    // Collapse multiple consecutive hyphens into one
    .replace(/^-|-$/g, '')                  // Trim leading and trailing hyphens
}
