import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetInviteParamsType = z.infer<typeof AdminGetInviteParams>
export const AdminGetInviteParams = createSelectParams()

export type AdminGetInvitesParamsType = z.infer<typeof AdminGetInvitesParams>
export const AdminGetInvitesParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    email: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetInvitesParams.array()).optional(),
    $or: z.lazy(() => AdminGetInvitesParams.array()).optional(),
  })
)

export type AdminGetInviteAcceptParamsType = z.infer<
  typeof AdminGetInviteAcceptParams
>
export const AdminGetInviteAcceptParams = createSelectParams().merge(
  z.object({
    token: z.string(),
  })
)

export type AdminCreateInviteType = z.infer<typeof AdminCreateInvite>
export const AdminCreateInvite = z
  .object({
    email: z.string(),
  })
  .strict()

export type AdminInviteAcceptType = z.infer<typeof AdminInviteAccept>
export const AdminInviteAccept = z
  .object({
    email: z.string().nullish(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
  })
  .strict()
