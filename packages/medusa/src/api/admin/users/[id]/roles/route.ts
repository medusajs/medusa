import {
  assignActorRolesWorkflow,
  removeActorRolesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetUserRolesParams>,
  res: MedusaResponse
) => {
  const userId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: links, metadata } = await query.graph({
    entity: "user_rbac_role",
    fields: req.queryConfig?.fields,
    filters: { ...req.filterableFields, user_id: userId },
    pagination: req.queryConfig?.pagination || {},
  })

  const roles = links.map((link: any) => link.rbac_role)

  res.status(200).json({
    roles,
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
  req: AuthenticatedMedusaRequest<HttpTypes.AdminAssignUserRoles>,
  res: MedusaResponse
) => {
  const userId = req.params.id
  const { roles } = req.validatedBody
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [user],
  } = await query.graph({
    entity: "user",
    fields: ["id"],
    filters: { id: userId },
  })

  if (!user) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `User with id "${userId}" not found`
    )
  }

  await assignActorRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      granted_actor: "user",
      granted_actor_id: userId,
      role_id: roles,
    },
  })

  const { data: links } = await query.graph({
    entity: "user_rbac_role",
    fields: ["rbac_role.*"],
    filters: { user_id: userId },
  })

  const userRoles = links.map((link: any) => link.rbac_role)

  res.status(200).json({ roles: userRoles })
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminRemoveUserRoles>,
  res: MedusaResponse
) => {
  const userId = req.params.id
  const { roles } = req.validatedBody
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [user],
  } = await query.graph({
    entity: "user",
    fields: ["id"],
    filters: { id: userId },
  })

  if (!user) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `User with id "${userId}" not found`
    )
  }

  await removeActorRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      granted_actor: "user",
      granted_actor_id: userId,
      role_id: roles,
    },
  })

  res.status(200).json({
    ids: roles,
    object: "user_role",
    deleted: true,
  })
}
