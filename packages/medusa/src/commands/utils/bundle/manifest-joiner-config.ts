/**
 * A module's joiner config as the build manifest stores it: plain data, and
 * nothing read from the build's environment.
 *
 * `databaseClientUrl` is the module's database URL, credentials included, as
 * the build resolved it. A lazy module sets its own from the run-time
 * configuration when it is registered, so the build's value is never used,
 * and it must not be written into the bundle.
 */
export function toManifestJoinerConfig<T extends Record<string, unknown>>(
  joinerConfig: T | null | undefined
): Omit<T, "databaseClientUrl"> | null {
  if (!joinerConfig) {
    return null
  }
  const { databaseClientUrl, ...rest } = JSON.parse(
    JSON.stringify(joinerConfig)
  )
  return rest
}
