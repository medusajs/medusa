import { getAssignableRolesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { defineFileConfig, FeatureFlag } from "@medusajs/framework/utils"

import RbacFeatureFlag from "../../../../../feature-flags/rbac"
import { AdminGetRbacRolesParamsType } from "../validators"

/**
 * Returns the subset of `rbac_role`s the authenticated actor is allowed to
 * assign.
 *
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<undefined, AdminGetRbacRolesParamsType>,
  res: MedusaResponse
) => {
  const { result } = await getAssignableRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      filters: req.filterableFields,
      pagination: req.queryConfig?.pagination,
    },
  })

  res.status(200).json(result)
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
