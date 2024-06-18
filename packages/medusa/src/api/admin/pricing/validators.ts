import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type AdminGetPricingRuleTypeParamsType = z.infer<
  typeof AdminGetPricingRuleTypeParams
>
export const AdminGetPricingRuleTypeParams = createSelectParams()

export type AdminGetPricingRuleTypesParamsType = z.infer<
  typeof AdminGetPricingRuleTypesParams
>
export const AdminGetPricingRuleTypesParams = createFindParams({
  limit: 100,
  offset: 0,
}).merge(
  z.object({
    rule_attribute: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetPricingRuleTypesParams.array()).optional(),
    $or: z.lazy(() => AdminGetPricingRuleTypesParams.array()).optional(),
  })
)

export type AdminCreatePricingRuleTypeType = z.infer<
  typeof AdminCreatePricingRuleType
>
export const AdminCreatePricingRuleType = z
  .object({
    name: z.string(),
    rule_attribute: z.string(),
    default_priority: z.number(),
  })
  .strict()

export type AdminUpdatePricingRuleTypeType = z.infer<
  typeof AdminUpdatePricingRuleType
>
export const AdminUpdatePricingRuleType = z
  .object({
    name: z.string().nullish(),
    rule_attribute: z.string().nullish(),
    default_priority: z.number().nullish(),
  })
  .strict()
