import { createRbacPoliciesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  Modules,
} from "@medusajs/framework/utils"

/**
 * @ignore
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    HttpTypes.AdminRbacPolicyListParams
  >,
  res: MedusaResponse<HttpTypes.AdminRbacPolicyListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: policies, metadata } = await query.graph({
    entity: "rbac_policy",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
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
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateRbacPolicy>,
  res: MedusaResponse<HttpTypes.AdminRbacPolicyResponse>
) => {
  const input = [req.validatedBody]

  const { result } = await createRbacPoliciesWorkflow(req.scope).run({
    input: { policies: input },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: policies } = await query.graph({
    entity: "rbac_policy",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  const policy = policies[0]

  res.status(200).json({ policy })
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
