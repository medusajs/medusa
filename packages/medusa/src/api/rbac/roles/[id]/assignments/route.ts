import {
  assignRolesWorkflow,
  unassignRolesWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
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
  AdminCreateRoleAssignmentsType,
  AdminGetRoleAssignmentsParamsType,
  AdminRemoveRoleAssignmentsType,
} from "../../validators"

/**
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<undefined, AdminGetRoleAssignmentsParamsType>,
  res: MedusaResponse<HttpTypes.AdminRbacRoleAssignmentListResponse>
) => {
  const roleId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: assignments, metadata } = await query.graph({
    entity: "rbac_role_assignment",
    fields: req.queryConfig.fields,
    filters: {
      role_id: roleId,
      ...req.filterableFields,
    },
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    assignments,
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
  req: AuthenticatedMedusaRequest<AdminCreateRoleAssignmentsType>,
  res: MedusaResponse<HttpTypes.AdminRbacRoleAssignmentsResponse>
) => {
  const roleId = req.params.id
  const {
    reference,
    reference_ids: referenceIds,
    scope: assignmentScope,
    scope_id: assignmentScopeId,
  } = req.validatedBody

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

  const scope =
    assignmentScope && assignmentScopeId
      ? { type: assignmentScope, id: assignmentScopeId }
      : undefined

  await assignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      granting_scope: req.rbac_context?.scope,
      assignments: referenceIds.map((referenceId) => ({
        role_id: roleId,
        reference,
        reference_id: referenceId,
        scope,
      })),
    },
  })

  const { data: assignments } = await query.graph({
    entity: "rbac_role_assignment",
    fields: req.queryConfig.fields,
    filters: { role_id: roleId, reference },
  })

  res.status(200).json({ assignments })
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest<AdminRemoveRoleAssignmentsType>,
  res: MedusaResponse<HttpTypes.AdminRbacRoleAssignmentsDeleteResponse>
) => {
  const roleId = req.params.id
  const {
    reference,
    reference_ids: referenceIds,
    scope: assignmentScope,
    scope_id: assignmentScopeId,
  } = req.validatedBody

  const scope =
    assignmentScope && assignmentScopeId
      ? { type: assignmentScope, id: assignmentScopeId }
      : undefined

  await unassignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      granting_scope: req.rbac_context?.scope,
      assignments: referenceIds.map((referenceId) => ({
        role_id: roleId,
        reference,
        reference_id: referenceId,
        scope,
      })),
    },
  })

  res.status(200).json({
    ids: referenceIds,
    object: "role_assignment",
    deleted: true,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
