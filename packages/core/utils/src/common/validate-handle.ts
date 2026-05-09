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
  if (!value || value.length === 0) return false

  // Reject if any uppercase ASCII letters exist (A-Z)
  if (/[A-Z]/.test(value)) {
    return false
  }

  // Allow only:
  // \p{Ll} = lowercase letters (a-z, and lowercase from other scripts)
  // \p{Lo} = case-less letters (Arabic, Persian, Chinese, Japanese, Korean, etc.)
  // \p{N} = numbers (0-9 and numbers from other scripts)
  // Hyphens (not at start/end, no consecutive)
  // Note: .toLowerCase() is NOT applied to preserve case rejection
  return /^[\p{Ll}\p{Lo}\p{N}]+(?:-[\p{Ll}\p{Lo}\p{N}]+)*$/u.test(value)
}
