import { getRequestScopes } from "@medusajs/framework"
import {
  assignRolesWorkflow,
  unassignRolesWorkflow,
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
  req: AuthenticatedMedusaRequest<undefined, HttpTypes.AdminGetUserRolesParams>,
  res: MedusaResponse
) => {
  const userId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { role_id } = req.filterableFields

  const { data: assignments, metadata } = await query.graph({
    entity: "rbac_role_assignment",
    fields: req.queryConfig?.fields,
    filters: {
      reference: "user",
      reference_id: userId,
      ...(role_id ? { role_id: role_id } : {}),
    },
    pagination: req.queryConfig?.pagination || {},
  })

  const roles = assignments.map((assignment: any) => assignment.role)

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

  await assignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      scope: await getRequestScopes(req),
      reference: "user",
      reference_id: userId,
      role_id: roles,
    },
  })

  const { data: assignments } = await query.graph({
    entity: "rbac_role_assignment",
    fields: ["role.*"],
    filters: { reference: "user", reference_id: userId },
  })

  const userRoles = assignments.map((assignment: any) => assignment.role)

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

  await unassignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      scope: await getRequestScopes(req),
      reference: "user",
      reference_id: userId,
      role_id: roles,
    },
  })

  res.status(200).json({
    ids: roles,
    object: "user_role",
    deleted: true,
  })
}
