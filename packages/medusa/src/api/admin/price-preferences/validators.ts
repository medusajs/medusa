import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export const AdminGetPricePreferenceParams = createSelectParams()
export const AdminGetPricePreferencesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    attribute: z.union([z.string(), z.array(z.string())]).optional(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetPricePreferencesParams.array()).optional(),
    $or: z.lazy(() => AdminGetPricePreferencesParams.array()).optional(),
  })
)

export const AdminCreatePricePreference = z.object({
  attribute: z.string(),
  value: z.string(),
  is_tax_inclusive: z.boolean().optional(),
})

export type AdminCreatePricePreferencePriceType = z.infer<
  typeof AdminCreatePricePreference
>

export const AdminUpdatePricePreference = z.object({
  attribute: z.string().optional(),
  value: z.string().optional(),
  is_tax_inclusive: z.boolean().optional(),
})

export type AdminUpdatePricePreferenceType = z.infer<
  typeof AdminUpdatePricePreference
>
