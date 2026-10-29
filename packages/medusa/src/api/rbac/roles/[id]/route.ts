import {
  deleteRbacRolesWorkflow,
  updateRbacRolesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"

import { AdminUpdateRbacRoleType } from "../validators"

/**
 * @ignore
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: roles } = await query.graph({
    entity: "rbac_role",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const role = roles[0]

  if (!role) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Role with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ role })
}

/**
 * @ignore
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateRbacRoleType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existing } = await query.graph({
    entity: "rbac_role",
    filters: { id: req.params.id },
    fields: ["id"],
  })

  const existingRole = existing[0]
  if (!existingRole) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Role with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateRbacRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const { data: roles } = await query.graph({
    entity: "rbac_role",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  const role = roles[0]

  res.status(200).json({ role })
}

/**
 * @ignore
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteRbacRolesWorkflow(req.scope).run({
    input: {
      ids: [id],
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
    },
  })

  res.status(200).json({
    id,
    object: "rbac_role",
    deleted: true,
  })
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
