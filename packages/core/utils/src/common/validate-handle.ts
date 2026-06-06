/**
 * Helper method to validate entity "handle" to be URL friendly.
 *
 * Supports Unicode characters from any language script (Persian, Arabic,
 * Japanese, Chinese, Korean, Russian, etc.) following modern web standards.
 *
 * Handles must contain only:
 * - Lowercase letters from any language (\p{Ll})
 * - Case-less letters (Arabic, Persian, Chinese, Japanese, Korean) (\p{Lo})
 * - Numbers (\p{N})
 * - Hyphens (not at start or end, no consecutive hyphens)
 *
 * Uppercase ASCII letters (A-Z) are rejected to maintain consistency
 * with auto-generated handles (always lowercase) and prevent case-sensitive
 * duplicate issues with the database unique index.
 *
 * @example
 * isValidHandle("my-product-123") // true
 * isValidHandle("کتاب-فارسی") // true
 * isValidHandle("私の-製品") // true
 * isValidHandle("我的-产品") // true
 * isValidHandle("Hello-World") // false (contains uppercase)
 * isValidHandle("my product") // false (spaces not allowed)
 * isValidHandle("-product") // false (leading hyphen)
 */
export const isValidHandle = (value: string): boolean => {
  if (!value?.length) return false

  // Reject if any uppercase ASCII letters exist (A-Z)
  if (/[A-Z]/.test(value)) {
    return false
  }

  // Allow: lowercase letters, case-less letters, modifier letters, numbers
  return /^[\p{Ll}\p{Lo}\p{Lm}\p{N}]+(?:-[\p{Ll}\p{Lo}\p{Lm}\p{N}]+)*$/u.test(
    value
  )
}
