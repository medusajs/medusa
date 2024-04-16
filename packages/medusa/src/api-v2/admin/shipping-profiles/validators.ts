import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

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
    type: z.string().optional(),
    name: z.string().optional(),
  })
)

export type AdminCreateShippingProfileType = z.infer<
  typeof AdminCreateShippingProfile
>
export const AdminCreateShippingProfile = z
  .object({
    name: z.string(),
    type: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()
