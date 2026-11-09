/**
 * Object keys that let a dotted path climb to `Object.prototype`
 * (`__proto__`, or `constructor` -> `prototype`). Any walk that builds nested
 * objects from user-controlled path segments must skip these to avoid
 * prototype pollution (CWE-1321).
 */
export const UNSAFE_PATH_KEYS = new Set([
  "__proto__",
  "constructor",
  "prototype",
])

export const isUnsafePathSegment = (segment: string): boolean =>
  UNSAFE_PATH_KEYS.has(segment)
