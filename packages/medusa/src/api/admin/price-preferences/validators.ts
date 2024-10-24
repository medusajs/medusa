import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const AdminGetPricePreferenceParams = createSelectParams()

export const AdminGetPricePreferencesParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  attribute: z.union([z.string(), z.array(z.string())]).optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
})

export const AdminGetPricePreferencesParams = createFindParams({
  offset: 0,
  limit: 300,
})
  .merge(AdminGetPricePreferencesParamsFields)
  .merge(applyAndAndOrOperators(AdminGetPricePreferencesParamsFields))

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
