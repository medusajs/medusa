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
  defineFileConfig,
  FeatureFlag,
  MedusaError,
} from "@medusajs/framework/utils"
import RbacFeatureFlag from "../../../../../feature-flags/rbac"
import {
  AdminAssignRoleUsersType,
  AdminRemoveRoleUsersType,
} from "../../validators"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    HttpTypes.AdminRbacRoleUserListParams
  >,
  res: MedusaResponse
) => {
  const roleId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { user_id } = req.filterableFields

  const { data: assignments, metadata } = await query.graph({
    entity: "rbac_role_assignment",
    fields: ["reference_id"],
    filters: {
      role_id: roleId,
      reference: "user",
      ...(user_id ? { reference_id: user_id } : {}),
    },
    pagination: req.queryConfig?.pagination || {},
  })

  const referenceIds = assignments.map(
    (assignment: any) => assignment.reference_id
  )

  let users: any[] = []
  if (referenceIds.length) {
    const { data } = await query.graph({
      entity: "user",
      fields: req.queryConfig?.fields,
      filters: { id: referenceIds },
    })
    users = data
  }

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

  const scope = req.rbac_context?.scope

  await assignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      granting_scope: req.rbac_context?.scope,
      assignments: users.map((userId) => ({
        role_id: roleId,
        reference: "user",
        reference_id: userId,
        scope,
      })),
    },
  })

  const { data: assignments } = await query.graph({
    entity: "rbac_role_assignment",
    fields: ["reference_id"],
    filters: { role_id: roleId, reference: "user" },
  })

  const referenceIds = assignments.map(
    (assignment: any) => assignment.reference_id
  )

  let roleUsers: any[] = []
  if (referenceIds.length) {
    const { data } = await query.graph({
      entity: "user",
      fields: ["*"],
      filters: { id: referenceIds },
    })
    roleUsers = data
  }

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

  const scope = req.rbac_context?.scope

  await unassignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      granting_scope: req.rbac_context?.scope,
      assignments: users.map((userId) => ({
        role_id: roleId,
        reference: "user",
        reference_id: userId,
        scope,
      })),
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
