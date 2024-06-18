import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetTaxRateParamsType = z.infer<typeof AdminGetTaxRateParams>
export const AdminGetTaxRateParams = createSelectParams()

export type AdminGetTaxRatesParamsType = z.infer<typeof AdminGetTaxRatesParams>
export const AdminGetTaxRatesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    tax_region_id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .nullish(),
    is_default: z.union([z.literal("true"), z.literal("false")]).nullish(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetTaxRatesParams.array()).optional(),
    $or: z.lazy(() => AdminGetTaxRatesParams.array()).optional(),
  })
)

export type AdminCreateTaxRateRuleType = z.infer<typeof AdminCreateTaxRateRule>
export const AdminCreateTaxRateRule = z.object({
  reference: z.string(),
  reference_id: z.string(),
})

export type AdminCreateTaxRateType = z.infer<typeof AdminCreateTaxRate>
export const AdminCreateTaxRate = z.object({
  rate: z.number().nullish(),
  code: z.string().nullish(),
  rules: z.array(AdminCreateTaxRateRule).nullish(),
  name: z.string(),
  is_default: z.boolean().nullish(),
  is_combinable: z.boolean().nullish(),
  tax_region_id: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminUpdateTaxRateType = z.infer<typeof AdminUpdateTaxRate>
export const AdminUpdateTaxRate = z.object({
  rate: z.number().nullish(),
  code: z.string().nullish(),
  rules: z.array(AdminCreateTaxRateRule).nullish(),
  name: z.string().nullish(),
  is_default: z.boolean().nullish(),
  is_combinable: z.boolean().nullish(),
  metadata: z.record(z.unknown()).optional(),
})
