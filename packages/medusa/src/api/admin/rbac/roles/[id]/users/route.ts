import {
  assignUserRolesWorkflow,
  removeUserRolesWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  MedusaError,
} from "@medusajs/framework/utils"
import RbacFeatureFlag from "../../../../../../feature-flags/rbac"
import {
  AdminAssignRoleUsersType,
  AdminRemoveRoleUsersType,
} from "../../validators"

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

  const { data: links, metadata } = await query.graph({
    entity: "user_rbac_role",
    fields: req.queryConfig?.fields,
    filters: { ...req.filterableFields, rbac_role_id: roleId },
    pagination: req.queryConfig?.pagination || {},
  })

  const users = links.map((link: any) => link.user)

  res.status(200).json({
    users,
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
  req: AuthenticatedMedusaRequest<AdminAssignRoleUsersType>,
  res: MedusaResponse
) => {
  const roleId = req.params.id
  const { users } = req.validatedBody
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [role],
  } = await query.graph({
    entity: "rbac_role",
    fields: ["id"],
    filters: { id: roleId },
  })

  if (!role) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Role with id "${roleId}" not found`
    )
  }

  await assignUserRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      role_id: roleId,
      user_ids: users,
    },
  })

  const { data: links } = await query.graph({
    entity: "user_rbac_role",
    fields: ["user.*"],
    filters: { rbac_role_id: roleId },
  })

  const roleUsers = links.map((link: any) => link.user)

  res.status(200).json({ users: roleUsers })
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest<AdminRemoveRoleUsersType>,
  res: MedusaResponse
) => {
  const roleId = req.params.id
  const { users } = req.validatedBody
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [role],
  } = await query.graph({
    entity: "rbac_role",
    fields: ["id"],
    filters: { id: roleId },
  })

  if (!role) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Role with id "${roleId}" not found`
    )
  }

  await removeUserRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      role_id: roleId,
      user_ids: users,
    },
  })

  res.status(200).json({
    ids: users,
    object: "role_user",
    deleted: true,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
