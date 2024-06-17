import { BaseFilterable } from "../../dal"
import { PromotionDTO } from "./promotion"
import { CreatePromotionRuleDTO, PromotionRuleDTO } from "./promotion-rule"

/**
 * The application method's possible types.
 */
export type ApplicationMethodTypeValues = "fixed" | "percentage"

/**
 * The application method's possible target types.
 */
export type ApplicationMethodTargetTypeValues =
  | "order"
  | "shipping_methods"
  | "items"

/**
 * The application method's possible allocation values.
 */
export type ApplicationMethodAllocationValues = "each" | "across"

/**
 * The application method details.
 */
export interface ApplicationMethodDTO {
  /**
   * The ID of the application method.
   */
  id: string

  /**
   * The type of the application method indicating how
   * the associated promotion is applied.
   */
  type?: ApplicationMethodTypeValues

  /**
   * The target type of the application method indicating
   * whether the associated promotion is applied to the cart's items,
   * shipping methods, or the whole order.
   */
  target_type?: ApplicationMethodTargetTypeValues

  /**
   * The allocation value that indicates whether the associated promotion
   * is applied on each item in a cart or split between the items in the cart.
   */
  allocation?: ApplicationMethodAllocationValues

  /**
   * The discounted amount applied by the associated promotion based on the `type`.
   */
  value?: number

  /**
   * The currency code of the application method
   */
  currency_code?: string

  /**
   * The max quantity allowed in the cart for the associated promotion to be applied.
   */
  max_quantity?: number | null

  /**
   * The minimum quantity required for a `buyget` promotion to be applied.
   * For example, if the promotion is a "Buy 2 shirts get 1 free", the
   * value of this attribute is `2`.
   */
  buy_rules_min_quantity?: number | null

  /**
   * The quantity that results from matching the `buyget` promotion's condition.
   * For example, if the promotion is a "Buy 2 shirts get 1 free", the value
   * of this attribute is `1`.
   */
  apply_to_quantity?: number | null

  /**
   * The promotion of the application method.
   */
  promotion?: PromotionDTO | string

  /**
   * The target rules of the application method.
   */
  target_rules?: PromotionRuleDTO[]

  /**
   * The buy rules of the application method.
   */
  buy_rules?: PromotionRuleDTO[]
}

/**
 * The application method to be created.
 */
export interface CreateApplicationMethodDTO {
  /**
   * The type of the application method indicating how
   * the associated promotion is applied.
   */
  type: ApplicationMethodTypeValues

  /**
   * The target type of the application method indicating
   * whether the associated promotion is applied to the cart's items,
   * shipping methods, or the whole order.
   */
  target_type: ApplicationMethodTargetTypeValues

  /**
   * The allocation value that indicates whether the associated promotion
   * is applied on each item in a cart or split between the items in the cart.
   */
  allocation?: ApplicationMethodAllocationValues

  /**
   * The discounted amount applied by the associated promotion based on the `type`.
   */
  value?: number

  /**
   * Currency of the value to apply.
   */
  currency_code: string

  /**
   * The max quantity allowed in the cart for the associated promotion to be applied.
   */
  max_quantity?: number | null

  /**
   * The minimum quantity required for a `buyget` promotion to be applied.
   * For example, if the promotion is a "Buy 2 shirts get 1 free", the
   * value of this attribute is `2`.
   */
  buy_rules_min_quantity?: number | null

  /**
   * The quantity that results from matching the `buyget` promotion's condition.
   * For example, if the promotion is a "Buy 2 shirts get 1 free", the value
   * of this attribute is `1`.
   */
  apply_to_quantity?: number | null

  /**
   * The promotion of the application method.
   */
  promotion?: PromotionDTO | string

  /**
   * The target rules of the application method.
   */
  target_rules?: CreatePromotionRuleDTO[]

  /**
   * The buy rules of the application method.
   */
  buy_rules?: CreatePromotionRuleDTO[]
}

/**
 * The attributes to update in the application method.
 */
export interface UpdateApplicationMethodDTO {
  /**
   * The ID of the application method.
   */
  id?: string

  /**
   * The type of the application method indicating how
   * the associated promotion is applied.
   */
  type?: ApplicationMethodTypeValues

  /**
   * The target type of the application method indicating
   * whether the associated promotion is applied to the cart's items,
   * shipping methods, or the whole order.
   */
  target_type?: ApplicationMethodTargetTypeValues

  /**
   * The allocation value that indicates whether the associated promotion
   * is applied on each item in a cart or split between the items in the cart.
   */
  allocation?: ApplicationMethodAllocationValues

  /**
   * The discounted amount applied by the associated promotion based on the `type`.
   */
  value?: number

  /**
   * The currency code of the promotions application
   */
  currency_code?: string

  /**
   * The max quantity allowed in the cart for the associated promotion to be applied.
   */
  max_quantity?: number | null

  /**
   * The minimum quantity required for a `buyget` promotion to be applied.
   * For example, if the promotion is a "Buy 2 shirts get 1 free", the
   * value of this attribute is `2`.
   */
  buy_rules_min_quantity?: number | null

  /**
   * The quantity that results from matching the `buyget` promotion's condition.
   * For example, if the promotion is a "Buy 2 shirts get 1 free", the value
   * of this attribute is `1`.
   */
  apply_to_quantity?: number | null

  /**
   * The promotion of the application method.
   */
  promotion?: PromotionDTO | string
}

/**
 * The filters to apply on the retrieved application methods.
 */
export interface FilterableApplicationMethodProps
  extends BaseFilterable<FilterableApplicationMethodProps> {
  /**
   * The IDs to filter the application methods by.
   */
  id?: string[]

  /**
   * Filter the application methods by their type.
   */
  type?: ApplicationMethodTypeValues[]

  /**
   * Filter the application methods by their target type.
   */
  target_type?: ApplicationMethodTargetTypeValues[]

  /**
   * Filter the application methods by their allocation value.
   */
  allocation?: ApplicationMethodAllocationValues[]
}
