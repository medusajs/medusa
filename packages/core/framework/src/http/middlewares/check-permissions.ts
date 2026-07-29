import { MedusaError, PolicyOperationValue } from "@medusajs/utils"
import { getRequestActorRoleIds } from "../../roles/get-request-actor-roles"
import { hasPermission } from "../../policies/has-permission"
import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
  MiddlewareFunction,
} from "../types"

/**
 * A `(resource, operation)` pair a route may be guarded by.
 *
 * `operation` is constrained to {@link PolicyOperationValue}, so modules that
 * augment `PolicyOperationRegistry` can guard routes with their own operations
 * and typos stay compile errors.
 */
export type PolicyAction = {
  resource: string
  operation: PolicyOperationValue | PolicyOperationValue[]
}

/**
 * Core permission checking logic for middleware and routes
 */
async function checkPermissions(
  policies: PolicyAction | PolicyAction[],
  req: AuthenticatedMedusaRequest
): Promise<void> {
  // Normalize policies to array
  const policyList = Array.isArray(policies) ? policies : [policies]

  if (!policyList.length) {
    return
  }

  // Resolve roles at request time (memoized per request) filtered to the request's scope set
  const roleIds = await getRequestActorRoleIds(req)

  if (!roleIds.length) {
    throw new MedusaError(MedusaError.Types.FORBIDDEN, "Forbidden")
  }

  const hasAccess = await hasPermission({
    roles: roleIds,
    actions: policyList,
    container: req.scope,
  })

  if (!hasAccess) {
    const policyKeys = policyList
      .map((p) => `${p.resource}:${p.operation}`)
      .join(", ")

    throw new MedusaError(
      MedusaError.Types.FORBIDDEN,
      `Insufficient permissions. Required policies: ${policyKeys}`
    )
  }
}

/**
 * Wraps a middleware or route handler with RBAC permission checking.
 * Checks if the authenticated user has the required policies before executing the handler.
 *
 * @param handler - The original middleware or route handler to wrap
 * @param policies - Single policy or array of policies to check
 * @returns Wrapped middleware or route function that checks permissions first
 */
export function wrapWithPoliciesCheck(
  handler: MiddlewareFunction,
  policies: PolicyAction | PolicyAction[]
): MiddlewareFunction {
  return async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    try {
      req.policies ??= []
      req.policies.push(...(Array.isArray(policies) ? policies : [policies]))

      await checkPermissions(policies, req)
      return handler(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}
