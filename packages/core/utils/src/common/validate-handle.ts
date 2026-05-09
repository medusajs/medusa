/**
 * Helper method to validate entity "handle" to be URL friendly.
 *
 * Supports Unicode characters from any language script (Persian, Arabic,
 * Japanese, Chinese, Korean, Russian, etc.) following modern web standards.
 *
 * @example
 * isValidHandle("my-product-123") // true
 * isValidHandle("کتاب-فارسی") // true
 * isValidHandle("私の-製品") // true
 * isValidHandle("我的-产品") // true
 * isValidHandle("my product") // false (spaces not allowed)
 * isValidHandle("-product") // false (leading hyphen)
 */
export const isValidHandle = (value: string): boolean => {
  // Allow any letter from any language (\p{L}), numbers (\p{N}), and hyphens
  // Must start and end with letter/number, cannot have consecutive hyphens
  // Matches behavior of WordPress, WooCommerce, and modern ecommerce platforms
  return /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value)
}