/**
 * A scope an authenticated request acts within, identified by the scope
 * entity's type and id (e.g. `{ type: "organization", id: "org_123" }`).
 */
export interface RbacScopeRef {
  type: string
  id: string
}

/**
 * The scopes a resolver derives for a request: a single scope, several (e.g. a
 * hierarchy chain such as repository -> team -> organization), or `undefined`
 * for an unscoped request.
 */
export type ScopeResolverResult = RbacScopeRef | RbacScopeRef[] | undefined

/**
 * Derives the scope set a request acts within. Receives the incoming
 * `MedusaRequest` (typed loosely here since the HTTP types live in
 * `@medusajs/framework`).
 *
 * Scope MUST be derived server-side, from the same source the handler uses to
 * bound data access (e.g. a path param, the authenticated tenant).
 */
export type ScopeResolver<TReq = any> = (args: {
  req: TReq
}) => ScopeResolverResult | Promise<ScopeResolverResult>

/**
 * Global holder for the application's single scope resolver.
 */
const ScopeResolverHolder: { resolver?: ScopeResolver } =
  global.RbacScopeResolverHolder ?? {}

global.RbacScopeResolverHolder ??= ScopeResolverHolder

/**
 * Register the application's scope resolver, used to derive the scope set a
 * request acts within before RBAC permission checks. An application registers
 * exactly one resolver — a second registration throws at boot, since two
 * resolvers competing over tenancy is a conflict to surface, not to merge.
 *
 * The resolver runs lazily, once per request (memoized), before the first
 * permission check. Returning `undefined` marks the request unscoped: only
 * unscoped roles apply. Requests whose scope set was already assigned by
 * earlier application middleware skip the resolver.
 *
 * @param resolver - Derives the request's scope(s) from the incoming request.
 *
 * @example
 * ```ts
 * // src/policies/scope-resolver.ts — discovered at boot
 * defineScopeResolver(async ({ req }) => {
 *   // tenant apps: tenant id landed on the request at authentication time
 *   const tenantId = req.auth_context?.app_metadata?.tenant_id
 *   if (tenantId) {
 *     return { type: "organization", id: tenantId }
 *   }
 *
 *   // org-nested routes: derive from the same param the handler queries by
 *   if (req.params?.org_id) {
 *     return { type: "organization", id: req.params.org_id }
 *   }
 *
 *   return undefined // unscoped request
 * })
 * ```
 */
export function defineScopeResolver<TReq = any>(
  resolver: ScopeResolver<TReq>
): void {
  if (typeof resolver !== "function") {
    throw new Error("Scope resolver must be a function")
  }

  const existing = ScopeResolverHolder.resolver
  if (existing && existing !== (resolver as ScopeResolver)) {
    throw new Error(
      "A scope resolver is already registered. An application can only register one scope resolver."
    )
  }

  ScopeResolverHolder.resolver = resolver
}

/**
 * Return the registered scope resolver, or `undefined` when none is registered
 * (every request is then unscoped unless middleware assigns scopes directly).
 */
export function getScopeResolver(): ScopeResolver | undefined {
  return ScopeResolverHolder.resolver
}

export { ScopeResolverHolder }
