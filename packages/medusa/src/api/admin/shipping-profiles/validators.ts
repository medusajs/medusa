import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetShippingProfileParamsType = z.infer<
  typeof AdminGetShippingProfileParams
>
export const AdminGetShippingProfileParams = createSelectParams()

export type AdminGetShippingProfilesParamsType = z.infer<
  typeof AdminGetShippingProfilesParams
>
export const AdminGetShippingProfilesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    q: z.string().optional(),
    type: z.string().nullish(),
    name: z.string().nullish(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetShippingProfilesParams.array()).optional(),
    $or: z.lazy(() => AdminGetShippingProfilesParams.array()).optional(),
  })
)

export type AdminCreateShippingProfileType = z.infer<
  typeof AdminCreateShippingProfile
>
export const AdminCreateShippingProfile = z
  .object({
    name: z.string(),
    type: z.string(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateShippingProfileType = z.infer<
  typeof AdminUpdateShippingProfile
>
export const AdminUpdateShippingProfile = z
  .object({
    name: z.string().nullish(),
    type: z.string().nullish(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
  })
  .strict()
