import { MedusaError } from "@medusajs/utils"
import { hasPermission } from "../../policies/has-permission"
import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
  MiddlewareFunction,
} from "../types"

export type PolicyAction = {
  resource: string
  operation: string | string[]
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

  const authContext = req.auth_context
  // Get roles from JWT token's app_metadata
  const roleIds = (authContext?.app_metadata?.roles as string[]) || []

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
