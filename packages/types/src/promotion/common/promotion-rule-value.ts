import { BaseFilterable } from "../../dal"
import { PromotionRuleDTO } from "./promotion-rule"

/**
 * The promotion rule value details.
 */
export interface PromotionRuleValueDTO {
  /**
   * The ID of the promotion rule value.
   */
  id: string

  /**
   * The value of the promotion rule value.
   */
  value?: string
}

/**
 * The promotion rule value to be created.
 */
export interface CreatePromotionRuleValueDTO {
  /**
   * The value of the promotion rule value.
   */
  value: string

  /**
   * The associated promotion rule.
   */
  promotion_rule: PromotionRuleDTO
}

/**
 * The attributes to update in the promotion rule value.
 */
export interface UpdatePromotionRuleValueDTO {
  /**
   * The ID of the promotion rule value.
   */
  id: string
}

/**
 * The filters to apply on the retrieved promotion rule values.
 */
export interface FilterablePromotionRuleValueProps
  extends BaseFilterable<FilterablePromotionRuleValueProps> {
  /**
   * The IDs to filter the promotion rule values by.
   */
  id?: string[]
}
