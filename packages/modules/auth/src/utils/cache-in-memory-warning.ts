import type { ICacheService, Logger } from "@medusajs/framework/types"

let hasLoggedInMemoryDefaultWarning = false

/**
 * Surface a startup warning when the auth module's `cache` dependency
 * resolved to the silent in-memory default.
 *
 * Background: the auth module reads OAuth state (setState/getState on
 * AuthIdentityProviderService) through `Modules.CACHE`. When a user has
 * migrated to `Modules.CACHING` but left `Modules.CACHE` undeclared, the
 * modules-sdk silently registers the in-memory default
 * (`@medusajs/medusa/cache-inmemory`) for `Modules.CACHE`. OAuth state
 * then lives in per-process memory, which breaks the OAuth callback on
 * any multi-instance deployment with no error or warning.
 *
 * The `ICacheService` interface (get/set/invalidate) does not surface
 * the difference, but the in-memory default implements an extra
 * `clear()` method that no production cache provider does. We
 * duck-type on that so users find the problem at boot instead of via
 * flaky OAuth callbacks in production.
 *
 * The function is exported separately so the detection logic can be
 * unit-tested without standing up the full MikroORM-based
 * `AuthModuleService` constructor.
 *
 * Note: a module-level flag deduplicates repeated calls (the integration
 * test runner invokes `onApplicationStart` once per test, which would
 * otherwise log the same warning hundreds of times per CI run). The
 * warning is for production startup, not for test introspection.
 */
export function warnIfAuthCacheIsInMemoryDefault(
  cache: ICacheService | undefined,
  logger: Logger | undefined
): void {
  if (hasLoggedInMemoryDefaultWarning) {
    return
  }
  if (!cache) {
    return
  }
  const looksLikeInMemoryDefault =
    typeof (cache as { clear?: unknown }).clear === "function"
  if (!looksLikeInMemoryDefault) {
    return
  }
  hasLoggedInMemoryDefaultWarning = true
  logger?.warn(
    "[auth] Modules.CACHE resolved to the in-memory default. OAuth " +
      "state set by setState/getState will be per-process; OAuth " +
      "callbacks will fail intermittently in any multi-instance " +
      "deployment. Either explicitly register Modules.CACHE against a " +
      "shared cache (e.g. @medusajs/cache-redis) or migrate the auth " +
      "module to read from Modules.CACHING. The issue tracker entry " +
      "linked from the original PR has the full discussion."
  )
}

/** @internal exposed for unit tests only */
export function _resetInMemoryDefaultWarningForTests(): void {
  hasLoggedInMemoryDefaultWarning = false
}
