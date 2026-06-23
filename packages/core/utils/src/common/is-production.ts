/**
 * Returns whether the current process is running in a production
 * environment based on `NODE_ENV`. Both `"production"` and the short
 * form `"prod"` are considered production.
 */
export function isProduction(): boolean {
  return ["production", "prod"].includes(process.env.NODE_ENV || "")
}
