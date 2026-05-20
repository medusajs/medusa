import { createRbacRolePoliciesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "@medusajs/framework/utils"
import RbacFeatureFlag from "../../../../../../feature-flags/rbac"
import { AdminAddRolePoliciesType } from "../../validators"

/**
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const roleId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: policies, metadata } = await query.graph({
    entity: "rbac_role_policy",
    fields: req.queryConfig?.fields,
    filters: { ...req.filterableFields, role_id: roleId },
    pagination: req.queryConfig?.pagination || {},
  })

  res.status(200).json({
    policies,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminAddRolePoliciesType>,
  res: MedusaResponse
) => {
  const roleId = req.params.id
  const { policies } = req.validatedBody
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const rolePolicies = policies.map((policyId) => ({
    role_id: roleId,
    policy_id: policyId,
  }))

  const { result } = await createRbacRolePoliciesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      policies: rolePolicies,
    },
  })

  // Get the created role-policy association
  const { data } = await query.graph({
    entity: "rbac_role_policy",
    fields: req.queryConfig?.fields,
    filters: { id: result[0].id },
  })

  res.status(200).json({ policies: data })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
