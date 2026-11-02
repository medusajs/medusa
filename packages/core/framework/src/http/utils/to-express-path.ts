/**
 * Converts the Express 4 wildcard syntax of a matcher to the Express 5 one.
 * Each bare `*` becomes an optional named wildcard, so `/admin/products/*`
 * keeps matching `/admin/products/` and any nested path, as it did in Express 4.
 */
export function toExpressPath<T extends string | RegExp>(matcher: T): T {
  if (typeof matcher !== "string") {
    return matcher
  }

  let index = 0
  return matcher.replace(
    /(?<!\{)\*(?![A-Za-z_$])/g,
    () => `{*splat${index++}}`
  ) as T
}
