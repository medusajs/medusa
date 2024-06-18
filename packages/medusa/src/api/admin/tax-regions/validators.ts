import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetTaxRegionParamsType = z.infer<
  typeof AdminGetTaxRegionParams
>
export const AdminGetTaxRegionParams = createSelectParams()

export type AdminGetTaxRegionsParamsType = z.infer<
  typeof AdminGetTaxRegionsParams
>
export const AdminGetTaxRegionsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    country_code: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .nullish(),
    province_code: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .nullish(),
    parent_id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .nullish(),
    created_by: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetTaxRegionsParams.array()).optional(),
    $or: z.lazy(() => AdminGetTaxRegionsParams.array()).optional(),
  })
)

export type AdminCreateTaxRegionType = z.infer<typeof AdminCreateTaxRegion>
export const AdminCreateTaxRegion = z.object({
  country_code: z.string(),
  province_code: z.string().nullish(),
  parent_id: z.string().nullish(),
  default_tax_rate: z
    .object({
      rate: z.number().nullish(),
      code: z.string().nullish(),
      name: z.string(),
      is_combinable: z.union([z.literal("true"), z.literal("false")]).nullish(),
      metadata: z.record(z.unknown()).optional(),
    })
    .optional(),
  metadata: z.record(z.unknown()).optional(),
})
