import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { z } from "zod"

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
    email: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
)

export type AdminCreateUserType = z.infer<typeof AdminCreateUser>
export const AdminCreateUser = z.object({
  email: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
})

export type AdminUpdateUserType = z.infer<typeof AdminUpdateUser>
export const AdminUpdateUser = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
})
