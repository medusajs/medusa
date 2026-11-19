import type { PolicyAction } from "@medusajs/types"
import { MedusaModule } from "@medusajs/modules-sdk"
import { MedusaError, Modules, permissionKey } from "@medusajs/utils"
import { isGranted, listRolePermissions } from "../../policies/has-permission"
import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "../types"
import { resolveRoles } from "../utils/resolve-roles"

/**
 * A middleware guarding a route with RBAC policies. The policies it checks are
 * exposed on the middleware itself, so a route's guards can be inspected
 * without running it.
 */
export type AuthorizeMiddleware = ((
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void>) & { policies: PolicyAction[] }

/**
 * Creates a middleware guarding a route with the given RBAC policies.
 *
 * The actor's roles are resolved for the scope the request acts within, which
 * the application sets on `req.rbac_context.scope` from a middleware of its
 * own. That middleware must run before this one: register it on a less
 * specific matcher. Without a scope, only unscoped role assignments are
 * considered.
 *
 * The roles' permissions are fetched once per request. On success, they are
 * exposed on `req.rbac_context.permissions` for the route handler and the
 * middlewares downstream. It is a no-op when RBAC is disabled.
 *
 * @param policies - Single policy or array of policies guarding the route
 *
 * @example
 * ```ts
 * export default defineMiddlewares({
 *   routes: [
 *     {
 *       matcher: "/admin/products",
 *       methods: ["POST"],
 *       middlewares: [
 *         authorize({ resource: "product", operation: "create" }),
 *         validateAndTransformBody(AdminCreateProduct),
 *       ],
 *     },
 *   ],
 * })
 * ```
 */
export function authorize(
  policies: PolicyAction | PolicyAction[]
): AuthorizeMiddleware {
  const policyList = Array.isArray(policies) ? policies : [policies]

  const authorizeMiddleware = async (
    req: AuthenticatedMedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    if (!MedusaModule.isInstalled(Modules.RBAC) || !policyList.length) {
      return next()
    }

    req.rbac_context ??= {}

    /**
     * The policies are recorded on the request before they are checked,
     * because the query config middlewares read them to filter the requested
     * fields. Those middlewares must therefore be registered after this one.
     */
    req.rbac_context = {
      ...req.rbac_context,
      policies: [...(req.rbac_context.policies ?? []), ...policyList],
    }

    if (!req.auth_context?.actor_id) {
      throw new MedusaError(MedusaError.Types.FORBIDDEN, "Forbidden")
    }

    const roleIds =
      req.rbac_context.role_ids ??
      (await resolveRoles({
        authContext: req.auth_context,
        container: req.scope,
        scope: req.rbac_context.scope,
      }))

    if (!roleIds.length) {
      throw new MedusaError(MedusaError.Types.FORBIDDEN, "Forbidden")
    }

    const permissions =
      req.rbac_context.permissions ??
      (await listRolePermissions({
        roles: roleIds,
        container: req.scope,
      }))
    const permissionSet = new Set(permissions)

    const hasAccess = policyList.every((policy) =>
      [policy.operation]
        .flat()
        .every((operation) =>
          isGranted(permissionSet, policy.resource, operation)
        )
    )

    if (!hasAccess) {
      const policyKeys = policyList
        .map((policy) =>
          permissionKey(policy.resource, [policy.operation].flat().join(","))
        )
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        `Insufficient permissions. Required policies: ${policyKeys}`
      )
    }

    req.rbac_context = {
      ...req.rbac_context,
      role_ids: roleIds,
      permissions,
    }

    return next()
  }

  authorizeMiddleware.policies = policyList

  return authorizeMiddleware
}

/**
 * Creates a middleware guarding a route with the given RBAC policies only when
 * the predicate holds for the request, for example when the body includes a
 * field that creates another resource. Otherwise, the request continues
 * without being checked.
 *
 * @param predicate - Whether the request must be checked against the policies.
 * @param policies - Single policy or array of policies guarding the route.
 *
 * @example
 * ```ts
 * export default defineMiddlewares({
 *   routes: [
 *     {
 *       matcher: "/admin/promotions",
 *       methods: ["POST"],
 *       middlewares: [
 *         authorize({ resource: "promotion", operation: "create" }),
 *         validateAndTransformBody(AdminCreatePromotion),
 *         authorizeIfNecessary(
 *           (req) => !!req.validatedBody.campaign,
 *           { resource: "campaign", operation: "create" }
 *         ),
 *       ],
 *     },
 *   ],
 * })
 * ```
 */
export function authorizeIfNecessary<TBody = unknown>(
  predicate: (
    req: AuthenticatedMedusaRequest<TBody>
  ) => boolean | Promise<boolean>,
  policies: PolicyAction | PolicyAction[]
) {
  const authorizeMiddleware = authorize(policies)

  return async (
    req: AuthenticatedMedusaRequest<TBody>,
    res: MedusaResponse,
    next: MedusaNextFunction
  ): Promise<void> => {
    if (!(await predicate(req))) {
      return next()
    }

    return authorizeMiddleware(req, res, next)
  }
}
