import { z } from "@medusajs/framework/zod"
import { applyAndAndOrOperators } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetRbacRoleParamsType = z.infer<typeof AdminGetRbacRoleParams>
export const AdminGetRbacRoleParams = createSelectParams().merge(
  z.object({
    policies: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export const AdminGetRbacRolesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  parent_id: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetRbacRolesParamsType = z.infer<
  typeof AdminGetRbacRolesParams
>
export const AdminGetRbacRolesParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetRbacRolesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetRbacRolesParamsFields))

/**
 * Optional scope context for introspection endpoints. Both `scope` and
 * `scope_id` must be provided together to take effect; when present they
 * evaluate the actor's privileges within that scope instead of the request's
 * ambient scope set.
 */
export const RbacScopeParamsFields = z.object({
  scope: z.string().optional(),
  scope_id: z.string().optional(),
})

export type AdminGetAssignableRbacRolesParamsType = z.infer<
  typeof AdminGetAssignableRbacRolesParams
>
export const AdminGetAssignableRbacRolesParams = AdminGetRbacRolesParams.extend(
  RbacScopeParamsFields.shape
)

export type AdminCreateRbacRoleType = z.infer<typeof AdminCreateRbacRole>
export const AdminCreateRbacRole = z
  .object({
    name: z.string(),
    parent_id: z.string().nullish(),
    description: z.string().nullish(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
    policy_ids: z.array(z.string().min(1)).optional(),
  })
  .strict()

export type AdminUpdateRbacRoleType = z.infer<typeof AdminUpdateRbacRole>
export const AdminUpdateRbacRole = z
  .object({
    name: z.string().optional(),
    parent_id: z.string().nullish(),
    description: z.string().nullish(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export const AdminAddRolePoliciesType = z.object({
  policies: z.array(z.string().min(1)).min(1),
})

export type AdminAddRolePoliciesType = z.infer<typeof AdminAddRolePoliciesType>

export const AdminGetRoleUsersParamsFields = z.object({
  user_id: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetRoleUsersParamsType = z.infer<
  typeof AdminGetRoleUsersParams
>
export const AdminGetRoleUsersParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetRoleUsersParamsFields)
  .merge(applyAndAndOrOperators(AdminGetRoleUsersParamsFields))

export type AdminAssignRoleUsersType = z.infer<typeof AdminAssignRoleUsers>
export const AdminAssignRoleUsers = z.object({
  users: z.array(z.string().min(1)).min(1),
})

export type AdminRemoveRoleUsersType = z.infer<typeof AdminRemoveRoleUsers>
export const AdminRemoveRoleUsers = z.object({
  users: z.array(z.string().min(1)).min(1),
})

export const AdminGetRoleAssignmentsParamsFields = z.object({
  reference: z.union([z.string(), z.array(z.string())]).optional(),
  reference_id: z.union([z.string(), z.array(z.string())]).optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  scope_id: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetRoleAssignmentsParamsType = z.infer<
  typeof AdminGetRoleAssignmentsParams
>
export const AdminGetRoleAssignmentsParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .extend(AdminGetRoleAssignmentsParamsFields.shape)
  .extend(applyAndAndOrOperators(AdminGetRoleAssignmentsParamsFields).shape)

/**
 * Optional scope constraint stored on (or filtering) role assignments. Both
 * fields must be provided together.
 */
const assignmentScopeFields = {
  scope: z.string().min(1).optional(),
  scope_id: z.string().min(1).optional(),
}

const requireScopePair = (data: { scope?: string; scope_id?: string }) =>
  !data.scope === !data.scope_id

const scopePairError = {
  message: "scope and scope_id must be provided together",
}

export type AdminCreateRoleAssignmentsType = z.infer<
  typeof AdminCreateRoleAssignments
>
export const AdminCreateRoleAssignments = z
  .object({
    reference: z.string().min(1),
    reference_ids: z.array(z.string().min(1)).min(1),
    ...assignmentScopeFields,
  })
  .refine(requireScopePair, scopePairError)

export type AdminRemoveRoleAssignmentsType = z.infer<
  typeof AdminRemoveRoleAssignments
>
export const AdminRemoveRoleAssignments = z
  .object({
    reference: z.string().min(1),
    reference_ids: z.array(z.string().min(1)).min(1),
    ...assignmentScopeFields,
  })
  .refine(requireScopePair, scopePairError)
