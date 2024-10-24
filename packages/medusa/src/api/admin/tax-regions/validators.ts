import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetTaxRegionParamsType = z.infer<
  typeof AdminGetTaxRegionParams
>
export const AdminGetTaxRegionParams = createSelectParams()

export const AdminGetTaxRegionsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  country_code: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  province_code: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  parent_id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  created_by: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetTaxRegionsParamsType = z.infer<
  typeof AdminGetTaxRegionsParams
>
export const AdminGetTaxRegionsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetTaxRegionsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetTaxRegionsParamsFields))

export type AdminCreateTaxRegionType = z.infer<typeof AdminCreateTaxRegion>
export const AdminCreateTaxRegion = z.object({
  country_code: z.string(),
  province_code: z.string().nullish(),
  parent_id: z.string().nullish(),
  default_tax_rate: z
    .object({
      rate: z.number().optional(),
      code: z.string(),
      name: z.string(),
      is_combinable: z.boolean().optional(),
      metadata: z.record(z.unknown()).nullish(),
    })
    .optional(),
  metadata: z.record(z.unknown()).nullish(),
})

export type AdminUpdateTaxRegionType = z.infer<typeof AdminUpdateTaxRegion>
export const AdminUpdateTaxRegion = z.object({
  province_code: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})
