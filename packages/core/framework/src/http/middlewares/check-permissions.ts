import { MedusaError } from "@medusajs/utils"
import type { PolicyAction } from "@medusajs/types"
import { hasPermission } from "../../policies/has-permission"
import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
  MiddlewareFunction,
} from "../types"
import { resolveRoles } from "../utils/resolve-roles"

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

  const roleIds = await resolveRoles(req)

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
