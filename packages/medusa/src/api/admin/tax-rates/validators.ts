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
      .optional(),
    is_default: z.union([z.literal("true"), z.literal("false")]).optional(),
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
  rate: z.number().optional(),
  code: z.string().optional(),
  rules: z.array(AdminCreateTaxRateRule).optional(),
  name: z.string(),
  is_default: z.boolean().optional(),
  is_combinable: z.boolean().optional(),
  tax_region_id: z.string(),
  metadata: z.record(z.unknown()).nullish(),
})

export type AdminUpdateTaxRateType = z.infer<typeof AdminUpdateTaxRate>
export const AdminUpdateTaxRate = z.object({
  rate: z.number().optional(),
  code: z.string().nullish(),
  rules: z.array(AdminCreateTaxRateRule).optional(),
  name: z.string().optional(),
  is_default: z.boolean().optional(),
  is_combinable: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
