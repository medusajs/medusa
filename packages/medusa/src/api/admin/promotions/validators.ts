import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  PromotionRuleOperator,
  PromotionType,
} from "@medusajs/utils"
import { z, ZodObject } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { CreateCampaign } from "../campaigns/validators"

export type AdminGetPromotionParamsType = z.infer<
  typeof AdminGetPromotionParams
>
export const AdminGetPromotionParams = createSelectParams()

export type AdminGetPromotionsParamsType = z.infer<
  typeof AdminGetPromotionsParams
>
export const AdminGetPromotionsParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(
    z.object({
      q: z.string().optional(),
      code: z.union([z.string(), z.array(z.string())]).optional(),
      campaign_id: z.union([z.string(), z.array(z.string())]).optional(),
      application_method: z
        .object({
          currency_code: z.union([z.string(), z.array(z.string())]).optional(),
        })
        .optional(),
      created_at: createOperatorMap().optional(),
      updated_at: createOperatorMap().optional(),
      deleted_at: createOperatorMap().optional(),
      $and: z.lazy(() => AdminGetPromotionsParams.array()).optional(),
      $or: z.lazy(() => AdminGetPromotionsParams.array()).optional(),
    })
  )
  .strict()

export type AdminGetPromotionRuleParamsType = z.infer<
  typeof AdminGetPromotionRuleParams
>
export const AdminGetPromotionRuleParams = z.object({
  promotion_type: z.string().optional(),
  application_method_type: z.string().optional(),
})

export type AdminGetPromotionRuleTypeParamsType = z.infer<
  typeof AdminGetPromotionRuleTypeParams
>
export const AdminGetPromotionRuleTypeParams = createSelectParams().merge(
  z.object({
    promotion_type: z.string().optional(),
    application_method_type: z.string().optional(),
  })
)

export type AdminGetPromotionsRuleValueParamsType = z.infer<
  typeof AdminGetPromotionsRuleValueParams
>
export const AdminGetPromotionsRuleValueParams = createFindParams({
  limit: 100,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export type AdminCreatePromotionRuleType = z.infer<
  typeof AdminCreatePromotionRule
>
export const AdminCreatePromotionRule = z
  .object({
    operator: z.nativeEnum(PromotionRuleOperator),
    description: z.string().nullish(),
    attribute: z.string(),
    values: z.union([z.string(), z.array(z.string())]),
  })
  .strict()

export type AdminUpdatePromotionRuleType = z.infer<
  typeof AdminUpdatePromotionRule
>
export const AdminUpdatePromotionRule = z
  .object({
    id: z.string(),
    operator: z.nativeEnum(PromotionRuleOperator).optional(),
    description: z.string().nullish(),
    attribute: z.string().optional(),
    values: z.union([z.string(), z.array(z.string())]),
  })
  .strict()

export type AdminCreateApplicationMethodType = z.infer<
  typeof AdminCreateApplicationMethod
>
export const AdminCreateApplicationMethod = z
  .object({
    description: z.string().nullish(),
    value: z.number(),
    currency_code: z.string().nullish(),
    max_quantity: z.number().nullish(),
    type: z.nativeEnum(ApplicationMethodType),
    target_type: z.nativeEnum(ApplicationMethodTargetType),
    allocation: z.nativeEnum(ApplicationMethodAllocation).optional(),
    target_rules: z.array(AdminCreatePromotionRule).optional(),
    buy_rules: z.array(AdminCreatePromotionRule).optional(),
    apply_to_quantity: z.number().nullish(),
    buy_rules_min_quantity: z.number().nullish(),
  })
  .strict()

export type AdminUpdateApplicationMethodType = z.infer<
  typeof AdminUpdateApplicationMethod
>
export const AdminUpdateApplicationMethod = z
  .object({
    description: z.string().nullish(),
    value: z.number().optional(),
    max_quantity: z.number().nullish(),
    currency_code: z.string().nullish(),
    type: z.nativeEnum(ApplicationMethodType).optional(),
    target_type: z.nativeEnum(ApplicationMethodTargetType).optional(),
    allocation: z.nativeEnum(ApplicationMethodAllocation).optional(),
    target_rules: z.array(AdminCreatePromotionRule).optional(),
    buy_rules: z.array(AdminCreatePromotionRule).optional(),
    apply_to_quantity: z.number().nullish(),
    buy_rules_min_quantity: z.number().nullish(),
  })
  .strict()

const promoRefinement = (promo) => {
  if (promo.campaign && promo.campaign_id) {
    return false
  }

  if (promo.type === PromotionType.BUYGET) {
    const appMethod = promo.application_method
    return (
      (appMethod?.buy_rules?.length ?? 0) > 0 &&
      appMethod?.apply_to_quantity !== undefined &&
      appMethod?.buy_rules_min_quantity !== undefined
    )
  }

  return true
}

export type AdminCreatePromotionType = z.infer<typeof CreatePromotion>
export const CreatePromotion = z
  .object({
    code: z.string(),
    is_automatic: z.boolean().optional(),
    type: z.nativeEnum(PromotionType),
    campaign_id: z.string().nullish(),
    campaign: CreateCampaign.optional(),
    application_method: AdminCreateApplicationMethod,
    rules: z.array(AdminCreatePromotionRule).optional(),
  })
  .strict()

export const AdminCreatePromotion = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return CreatePromotion.extend({
      additional_data: z.record(z.unknown()).nullish(),
    }).refine(promoRefinement, {
      message:
        "Buyget promotions require at least one buy rule and quantities to be defined",
    })
  }

  return CreatePromotion.extend({
    additional_data: additionalDataValidator,
  }).refine(promoRefinement, {
    message:
      "Buyget promotions require at least one buy rule and quantities to be defined",
  })
}

export type AdminUpdatePromotionType = z.infer<typeof UpdatePromotion>
export const UpdatePromotion = z
  .object({
    code: z.string().optional(),
    is_automatic: z.boolean().optional(),
    type: z.nativeEnum(PromotionType).optional(),
    campaign_id: z.string().nullish(),
    campaign: CreateCampaign.optional(),
    application_method: AdminUpdateApplicationMethod.optional(),
    rules: z.array(AdminCreatePromotionRule).optional(),
  })
  .strict()

export const AdminUpdatePromotion = (
  additionalDataValidator?: ZodObject<any, any>
) => {
  if (!additionalDataValidator) {
    return UpdatePromotion.extend({
      additional_data: z.record(z.unknown()).nullish(),
    }).refine(promoRefinement, {
      message:
        "Buyget promotions require at least one buy rule and quantities to be defined",
    })
  }

  return UpdatePromotion.extend({
    additional_data: additionalDataValidator,
  }).refine(promoRefinement, {
    message:
      "Buyget promotions require at least one buy rule and quantities to be defined",
  })
}
