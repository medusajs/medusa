import { createRbacRolesWorkflow } from "@medusajs/core-flows"
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
import { AdminCreateRbacRoleType } from "./validators"

/**
 * @ignore
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminRbacRoleListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: roles, metadata } = await query.graph({
    entity: "rbac_role",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    roles,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

/**
 * @ignore
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateRbacRoleType>,
  res: MedusaResponse<HttpTypes.AdminRbacRoleResponse>
) => {
  const input = [req.validatedBody]

  const { result } = await createRbacRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      roles: input,
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: roles } = await query.graph({
    entity: "rbac_role",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  const role = roles[0]

  res.status(200).json({ role })
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
