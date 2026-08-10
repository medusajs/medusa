import {
  deleteRbacPoliciesWorkflow,
  updateRbacPoliciesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  MedusaError,
} from "@medusajs/framework/utils"

import RbacFeatureFlag from "../../../../feature-flags/rbac"

/**
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<undefined, HttpTypes.AdminRbacPolicyParams>,
  res: MedusaResponse<HttpTypes.AdminRbacPolicyResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: policies } = await query.graph({
    entity: "rbac_policy",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const policy = policies[0]

  if (!policy) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Policy with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ policy })
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUpdateRbacPolicy>,
  res: MedusaResponse<HttpTypes.AdminRbacPolicyResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existing } = await query.graph({
    entity: "rbac_policy",
    filters: { id: req.params.id },
    fields: ["id"],
  })

  const existingPolicy = existing[0]
  if (!existingPolicy) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Policy with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateRbacPoliciesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const { data: policies } = await query.graph({
    entity: "rbac_policy",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  const policy = policies[0]

  res.status(200).json({ policy })
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminRbacPolicyDeleteResponse>
) => {
  const id = req.params.id

  await deleteRbacPoliciesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "rbac_policy",
    deleted: true,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
