import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetShippingProfileParamsType = z.infer<
  typeof AdminGetShippingProfileParams
>
export const AdminGetShippingProfileParams = createSelectParams()

export const AdminGetShippingProfilesParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  q: z.string().optional(),
  type: z.string().optional(),
  name: z.string().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetShippingProfilesParamsType = z.infer<
  typeof AdminGetShippingProfilesParams
>
export const AdminGetShippingProfilesParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetShippingProfilesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetShippingProfilesParamsFields))

export type AdminCreateShippingProfileType = z.infer<
  typeof AdminCreateShippingProfile
>
export const AdminCreateShippingProfile = z
  .object({
    name: z.string(),
    type: z.string(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export type AdminUpdateShippingProfileType = z.infer<
  typeof AdminUpdateShippingProfile
>
export const AdminUpdateShippingProfile = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
