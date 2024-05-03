/**
 * The spec generates a pattern like this '^\d{3}-\d{2}-\d{4}$'
 * However, to use it in HTML or inside new RegExp() we need to
 * escape the pattern to become: '^\\d{3}-\\d{2}-\\d{4}$' in order
 * to make it a valid regexp string.
 *
 * Also, escape single quote characters, because the output uses single quotes for strings
 *
 * @param pattern
 */
export const getPattern = (pattern?: string): string | undefined => {
  // eslint-disable-next-line prettier/prettier
  return pattern?.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
}
