import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminGetUserParams = createSelectParams()

export type AdminGetUsersParamsType = z.infer<typeof AdminGetUsersParams>
export const AdminGetUsersParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    email: z.string().nullish(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
  })
)

export type AdminCreateUserType = z.infer<typeof AdminCreateUser>
export const AdminCreateUser = z.object({
  email: z.string(),
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  avatar_url: z.string().nullish(),
})

export type AdminUpdateUserType = z.infer<typeof AdminUpdateUser>
export const AdminUpdateUser = z.object({
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  avatar_url: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish().optional(),
})

export type AdminAssignUserRolesType = z.infer<typeof AdminAssignUserRoles>
export const AdminAssignUserRoles = z.object({
  roles: z.array(z.string().min(1)).min(1),
})

export type AdminRemoveUserRolesType = z.infer<typeof AdminRemoveUserRoles>
export const AdminRemoveUserRoles = z.object({
  roles: z.array(z.string().min(1)).min(1),
})

export const AdminGetUserRolesParamsFields = z.object({
  role_id: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetUserRolesParamsType = z.infer<
  typeof AdminGetUserRolesParams
>
export const AdminGetUserRolesParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(AdminGetUserRolesParamsFields)
