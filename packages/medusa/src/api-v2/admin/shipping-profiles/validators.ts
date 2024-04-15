import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export const AdminShippingProfileParams = createSelectParams()
export const AdminShippingProfilesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    type: z.string().optional(),
    name: z.string().optional(),
  })
)

export const AdminCreateShippingProfile = z
  .object({
    name: z.string(),
    type: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()

export type AdminCreateShippingProfileType = z.infer<
  typeof AdminCreateShippingProfile
>
