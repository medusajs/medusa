import {
  createRbacRolePoliciesWorkflow,
  deleteRbacRolePoliciesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  AdminAddRolePoliciesType,
  AdminRemoveRolePoliciesType,
} from "../../validators"

/**
 * @since 2.22.3
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminRbacPolicyListResponse>
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
 * @since 2.22.3
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminAddRolePoliciesType>,
  res: MedusaResponse<HttpTypes.AdminRbacRolePoliciesResponse>
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

  const { data } = await query.graph({
    entity: "rbac_role_policy",
    fields: req.queryConfig?.fields,
    filters: { id: result.map((r) => r.id) },
  })

  res.status(200).json({ policies: data })
}

/**
 * Detaches multiple policies from a role in one request. The actor must hold
 * every policy being detached, the same requirement as for attaching them.
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest<AdminRemoveRolePoliciesType>,
  res: MedusaResponse<HttpTypes.AdminRbacRolePoliciesDeleteResponse>
) => {
  const roleId = req.params.id
  const policyIds = Array.from(new Set(req.validatedBody.policies))
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: rolePolicies } = await query.graph({
    entity: "rbac_role_policy",
    fields: ["id", "policy_id"],
    filters: { role_id: roleId, policy_id: policyIds },
  })

  const attachedPolicyIds = new Set(rolePolicies.map((rp) => rp.policy_id))
  const missingPolicyIds = policyIds.filter((id) => !attachedPolicyIds.has(id))

  if (missingPolicyIds.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Policies with ids "${missingPolicyIds.join(
        ", "
      )}" are not attached to role "${roleId}"`
    )
  }

  await deleteRbacRolePoliciesWorkflow(req.scope).run({
    input: {
      role_policy_ids: rolePolicies.map((rp) => rp.id),
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
    },
  })

  res.status(200).json({
    ids: policyIds,
    object: "rbac_role_policy",
    deleted: true,
  })
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
