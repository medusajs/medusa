import { getAssignablePoliciesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { defineFileConfig, FeatureFlag } from "@medusajs/framework/utils"

import RbacFeatureFlag from "../../../../../feature-flags/rbac"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * Returns the subset of `rbac_policy` rows the authenticated actor is allowed to assign.
 *
 * Introspection may ask for a specific scope context via the `scope` +
 * `scope_id` query params (both required to take effect); otherwise the
 * request's ambient scope set applies.
 *
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    HttpTypes.AdminRbacPolicyListParams & { scope?: string; scope_id?: string }
  >,
  res: MedusaResponse
) => {
  const { scope, scope_id, ...filters } = req.filterableFields

  const rbacScope =
    scope && scope_id ? { type: scope, id: scope_id } : req.rbacScope

  const { result } = await getAssignablePoliciesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      scope: rbacScope,
      filters,
      pagination: req.queryConfig?.pagination,
    },
  })

  res.status(200).json(result)
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
