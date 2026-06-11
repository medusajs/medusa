import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  PromotionRuleOperator,
  PromotionStatus,
  PromotionType,
} from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { applyAndAndOrOperators } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"
import { CreateCampaign } from "../campaigns/validators"

/**
 * Parameters for retrieving a single promotion.
 */
export type AdminGetPromotionParamsType = z.infer<
  typeof AdminGetPromotionParams
>
/**
 * Validation schema for parameters when retrieving a single promotion.
 * Includes field selection capabilities.
 */
export const AdminGetPromotionParams = createSelectParams()

/**
 * Filter fields schema for retrieving promotions.
 * Defines the available query parameters for filtering promotion lists.
 */
export const AdminGetPromotionsParamsFields = z.object({
  q: z.string().optional(),
  code: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  id: z
    .union([z.string(), z.array(z.string()), createOperatorMap()])
    .optional(),
  campaign_id: z.union([z.string(), z.array(z.string())]).optional(),
  application_method: z
    .object({
      currency_code: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

/**
 * Parameters for retrieving a list of promotions with pagination and filtering.
 */
export type AdminGetPromotionsParamsType = z.infer<
  typeof AdminGetPromotionsParams
>
/**
 * Validation schema for parameters when retrieving a list of promotions.
 * Supports pagination, field selection, filtering, and logical operators.
 */
export const AdminGetPromotionsParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetPromotionsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetPromotionsParamsFields))
  .strict()

/**
 * Parameters for retrieving promotion rules.
 */
export type AdminGetPromotionRuleParamsType = z.infer<
  typeof AdminGetPromotionRuleParams
>
/**
 * Validation schema for parameters when retrieving promotion rules.
 * Used to filter rules by promotion type and application method configuration.
 */
export const AdminGetPromotionRuleParams = z.object({
  promotion_type: z.string().optional(),
  application_method_type: z.string().optional(),
  application_method_target_type: z.string().optional(),
})

/**
 * Parameters for retrieving promotion rule types with field selection.
 */
export type AdminGetPromotionRuleTypeParamsType = z.infer<
  typeof AdminGetPromotionRuleTypeParams
>
/**
 * Validation schema for parameters when retrieving promotion rule types.
 * Combines field selection capabilities with rule type filtering.
 */
export const AdminGetPromotionRuleTypeParams = createSelectParams().merge(
  z.object({
    promotion_type: z.string().optional(),
    application_method_type: z.string().optional(),
    application_method_target_type: z.string().optional(),
  })
)

/**
 * Parameters for retrieving promotion rule values with pagination and filtering.
 */
export type AdminGetPromotionsRuleValueParamsType = z.infer<
  typeof AdminGetPromotionsRuleValueParams
>
/**
 * Validation schema for parameters when retrieving promotion rule values.
 * Supports pagination and filtering by search query, value, and target type.
 */
export const AdminGetPromotionsRuleValueParams = createFindParams({
  limit: 100,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
    application_method_target_type: z.string().optional(),
  })
)

/**
 * Data required to create a promotion rule.
 */
export type AdminCreatePromotionRuleType = z.infer<
  typeof AdminCreatePromotionRule
>
/**
 * Validation schema for creating a promotion rule.
 * Defines the operator, attribute, and values that determine rule conditions.
 */
export const AdminCreatePromotionRule = z
  .object({
    operator: z.nativeEnum(PromotionRuleOperator),
    description: z.string().nullish(),
    attribute: z.string(),
    values: z.union([z.string(), z.array(z.string())]),
  })
  .strict()

/**
 * Data required to update a promotion rule.
 */
export type AdminUpdatePromotionRuleType = z.infer<
  typeof AdminUpdatePromotionRule
>
/**
 * Validation schema for updating a promotion rule.
 * Includes the rule ID and optional fields for modification.
 */
export const AdminUpdatePromotionRule = z
  .object({
    id: z.string(),
    operator: z.nativeEnum(PromotionRuleOperator).optional(),
    description: z.string().nullish(),
    attribute: z.string().optional(),
    values: z.union([z.string(), z.array(z.string())]),
  })
  .strict()

/**
 * Data required to create an application method for a promotion.
 */
export type AdminCreateApplicationMethodType = z.infer<
  typeof AdminCreateApplicationMethod
>
/**
 * Validation schema for creating a promotion application method.
 * Defines how a promotion discount is calculated and applied.
 */
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

/**
 * Data required to update an application method for a promotion.
 */
export type AdminUpdateApplicationMethodType = z.infer<
  typeof AdminUpdateApplicationMethod
>
/**
 * Validation schema for updating a promotion application method.
 * All fields are optional to support partial updates.
 */
export const AdminUpdateApplicationMethod = z
  .object({
    description: z.string().nullish(),
    value: z.number().optional(),
    max_quantity: z.number().nullish(),
    currency_code: z.string().nullish(),
    type: z.nativeEnum(ApplicationMethodType).optional(),
    target_type: z.nativeEnum(ApplicationMethodTargetType).optional(),
    allocation: z.nativeEnum(ApplicationMethodAllocation).optional(),
    apply_to_quantity: z.number().nullish(),
    buy_rules_min_quantity: z.number().nullish(),
  })
  .strict()

/**
 * Validation refinement function for promotion data.
 * Ensures business rule consistency for promotion creation.
 * 
 * @param promo - The promotion data to validate
 * @returns True if validation passes, false otherwise
 */
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

/**
 * Data required to create a promotion.
 */
export type AdminCreatePromotionType = z.infer<typeof CreatePromotion>
/**
 * Base validation schema for creating a promotion.
 * Contains core promotion fields without additional business logic.
 */
export const CreatePromotion = z
  .object({
    code: z.string(),
    is_automatic: z.boolean().optional(),
    type: z.nativeEnum(PromotionType),
    is_tax_inclusive: z.boolean().optional(),
    status: z.nativeEnum(PromotionStatus).default(PromotionStatus.DRAFT),
    campaign_id: z.string().nullish(),
    campaign: CreateCampaign.optional(),
    application_method: AdminCreateApplicationMethod,
    rules: z.array(AdminCreatePromotionRule).optional(),
    limit: z.number().int().min(1).nullable().optional(),
  })
  .strict()

/**
 * Validation schema for creating a promotion with business rule enforcement.
 * Includes refinements for buyget promotions and automatic promotion limits.
 */
export const AdminCreatePromotion = WithAdditionalData(
  CreatePromotion,
  (schema) => {
    return schema
      .refine(promoRefinement, {
        message:
          "Buyget promotions require at least one buy rule and quantities to be defined",
      })
      .refine(
        (data) => {
          // Automatic promotions cannot have a limit
          if (
            data.is_automatic &&
            data.limit !== null &&
            data.limit !== undefined
          ) {
            return false
          }
          return true
        },
        {
          message: "Automatic promotions cannot have a usage limit",
          path: ["limit"],
        }
      )
  }
)

/**
 * Data required to update a promotion.
 */
export type AdminUpdatePromotionType = z.infer<typeof UpdatePromotion>
/**
 * Base validation schema for updating a promotion.
 * All fields are optional to support partial updates.
 */
export const UpdatePromotion = z
  .object({
    code: z.string().optional(),
    is_automatic: z.boolean().optional(),
    is_tax_inclusive: z.boolean().optional(),
    type: z.nativeEnum(PromotionType).optional(),
    status: z.nativeEnum(PromotionStatus).optional(),
    campaign_id: z.string().nullish(),
    application_method: AdminUpdateApplicationMethod.optional(),
    limit: z.number().int().min(1).nullable().optional(),
  })
  .strict()

/**
 * Validation schema for updating a promotion with business rule enforcement.
 * Unlike creation, this schema does not enforce buyget rules since buy rules
 * are managed through dedicated endpoints and validated by the promotion module.
 */
export const AdminUpdatePromotion = WithAdditionalData(
  UpdatePromotion,
  (schema) => {
    // Unlike create, the update payload is partial: buy rules live on the
    // persisted promotion and are managed through dedicated endpoints (e.g.
    // `/admin/promotions/:id/buy-rules/batch`), so the create-time buyget
    // refinement is intentionally not applied here. Buyget consistency is
    // still validated by the promotion module against the persisted values.
    return schema
      .refine(
        (data) => {
          // Automatic promotions cannot have a limit
          if (
            data.is_automatic &&
            data.limit !== null &&
            data.limit !== undefined
          ) {
            return false
          }
          return true
        },
        {
          message: "Automatic promotions cannot have a usage limit",
          path: ["limit"],
        }
      )
  }
)
