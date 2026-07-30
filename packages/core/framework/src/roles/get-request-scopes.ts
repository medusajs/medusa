import type { RbacScope } from "@medusajs/types"
import { getScopeResolver } from "@medusajs/utils"

/**
 * The minimal request shape needed to resolve and memoize the request's scope
 * set: the memoization slot, plus whatever the application's scope resolver
 * reads off the request.
 */
export type RequestWithRbacScopes = {
  rbacScopes?: RbacScope[] | Promise<RbacScope[]>
}

/**
 * Resolves the scope set the current request acts within, memoized on the
 * request object.
 *
 * Precedence:
 * 1. `req.rbacScopes` already assigned (by earlier application middleware or a
 *    previous call) — returned as-is.
 * 2. The application's registered scope resolver (`defineScopeResolver`),
 *    invoked once with the request; its result is normalized to an array
 *    (`undefined` -> `[]`) and memoized.
 * 3. No resolver registered — the request is unscoped (`[]`), so only unscoped
 *    roles apply.
 *
 * Resolver errors propagate: a broken tenancy resolver should fail the request
 * loudly rather than silently degrade to unscoped.
 */
export function getRequestScopes(
  req: RequestWithRbacScopes
): Promise<RbacScope[]> {
  if (req.rbacScopes) {
    const promise = Promise.resolve(req.rbacScopes)
    req.rbacScopes = promise
    return promise
  }

  const resolver = getScopeResolver()

  // Invoke inside the promise chain so a synchronously-throwing resolver
  // rejects the memoized promise instead of throwing out of this accessor.
  const promise = resolver
    ? Promise.resolve()
        .then(() => resolver({ req }))
        .then((result) => {
          if (!result) {
            return []
          }
          return Array.isArray(result) ? result : [result]
        })
    : Promise.resolve([])

  req.rbacScopes = promise
  return promise
}

/**
 * Resolves the single scope the current request acts within: the first — most
 * specific — entry of the request's scope set, or `undefined` when the request
 * is unscoped. Use where a single scope ref is expected (e.g. the scope
 * constraint stored on a role assignment).
 */
export async function getRequestScope(
  req: RequestWithRbacScopes
): Promise<RbacScope | undefined> {
  const [scope] = await getRequestScopes(req)
  return scope
}
