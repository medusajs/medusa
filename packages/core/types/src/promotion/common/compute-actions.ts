import { BigNumberInput } from "../../totals"

/**
 * A compute action informs you what adjustment must be made to a cart item or shipping method.
 */
export type ComputeActions =
  | AddItemAdjustmentAction
  | RemoveItemAdjustmentAction
  | AddShippingMethodAdjustment
  | RemoveShippingMethodAdjustment
  | CampaignBudgetExceededAction
  | PromotionLimitExceededAction

/**
 * These computed action types can affect a campaign's budget.
 */
export type UsageComputedActions = {
  /**
   * The amount (of usage or money) to adjust the campaign budget by.
   */
  amount: BigNumberInput

  /**
   * The promotion's code.
   */
  code: string
}

/**
 * This action indicates that the promotions within a campaign can no longer be used
 * as the campaign budget has been exceeded.
 */
export interface CampaignBudgetExceededAction {
  /**
   * The type of action.
   */
  action: "campaignBudgetExceeded"

  /**
   * The promotion's code.
   */
  code: string
}

/**
 * This action indicates that a promotion usage limit has been exceeded.
 */
export interface PromotionLimitExceededAction {
  /**
   * The type of action.
   */
  action: "promotionLimitExceeded"

  /**
   * The promotion's code.
   */
  code: string
}

/**
 * This action indicates that an adjustment must be made to an item. For example, removing $5 off its amount.
 */
export interface AddItemAdjustmentAction {
  /**
   * The type of action.
   */
  action: "addItemAdjustment"

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The amount to remove off the item's total.
   */
  amount: BigNumberInput

  /**
   * Whether the promotion amount includes tax.
   */
  is_tax_inclusive?: boolean

  /**
   * The promotion's code.
   */
  code: string

  /**
   * The promotion's description.
   */
  description?: string
}

/**
 * This action indicates that an adjustment must be removed from a line item. For example, remove the $5 discount applied before.
 */
export interface RemoveItemAdjustmentAction {
  /**
   * The type of action.
   */
  action: "removeItemAdjustment"

  /**
   * The associated adjustment's ID.
   */
  adjustment_id: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The promotion's description.
   */
  description?: string

  /**
   * The promotion's code.
   */
  code: string
}

/**
 * This action indicates that an adjustment must be made on a shipping method. For example, make the shipping method free.
 */
export interface AddShippingMethodAdjustment {
  /**
   * The type of action.
   */
  action: "addShippingMethodAdjustment"

  /**
   * The associated shipping method's ID.
   */
  shipping_method_id: string

  /**
   * The amount to remove off the shipping method's total.
   */
  amount: BigNumberInput

  /**
   * The promotion's code.
   */
  code: string

  /**
   * The promotion's description.
   */
  description?: string
}

/**
 * This action indicates that an adjustment must be removed from a shipping method. For example, remove the free shipping discount applied before.
 */
export interface RemoveShippingMethodAdjustment {
  /**
   * The type of action
   */
  action: "removeShippingMethodAdjustment"

  /**
   * The associated adjustment's ID.
   */
  adjustment_id: string

  /**
   * The associated shipping method's ID.
   */
  shipping_method_id: string

  /**
   * The promotion's code.
   */
  code: string
}

/**
 * An action's adjustment line.
 */
export interface ComputeActionAdjustmentLine extends Record<string, unknown> {
  /**
   * The ID of the compute action's adjustment line.
   */
  id: string

  /**
   * The promotion's code.
   */
  code: string
}

/**
 * A cart's line item passed in the context when computing actions.
 */
export interface ComputeActionItemLine extends Record<string, unknown> {
  /**
   * The ID of the item line.
   */
  id: string

  /**
   * The quantity of the line item.
   */
  quantity: BigNumberInput

  /**
   * The subtotal of the line item.
   */
  subtotal: BigNumberInput

  /**
   * The total of the line item.
   */
  original_total: BigNumberInput

  /**
   * Whether the line item is discountable.
   */
  is_discountable: boolean

  /**
   * The adjustments applied before on the line item.
   */
  adjustments?: ComputeActionAdjustmentLine[]

  /**
   * The product ID of the line item. Our default promotion rules rely on the product ID to apply the promotion.
   */
  product?: {
    id: string

    collection_id?: string

    tags?: {
      id: string
    }[]

    categories?: {
      id: string
    }[]

    type_id?: string
  }
}

/**
 * A cart's shipping method passed in the content when computing actions.
 */
export interface ComputeActionShippingLine extends Record<string, unknown> {
  /**
   * The ID of the shipping method.
   */
  id: string

  /**
   * The subtotal of the shipping method.
   */
  subtotal: BigNumberInput

  /**
   * The total of the shipping method.
   */
  original_total: BigNumberInput

  /**
   * The adjustments applied before on the shipping method.
   */
  adjustments?: ComputeActionAdjustmentLine[]

  /**
   * The shipping option type associated with the shipping method.
   */
  shipping_option?: {
    /**
     * The ID of the shipping option type associated with the shipping method.
     */
    shipping_option_type_id?: string
  }
}

/**
 * The context provided when computing actions of promotions.
 */
export interface ComputeActionContext extends Record<string, unknown> {
  /**
   * The cart's currency
   */
  currency_code: string

  /**
   * The customer associated with the cart.
   */
  customer?: {
    id: string

    /**
     * The customer groups the customer belongs to.
     */
    groups?: {
      id: string
    }[]
  }

  /**
   * The region associated with the cart.
   */
  region?: {
    id: string
  }
  /**
   * The shipping address associated with the cart.
   */
  shipping_address?: {
    country_code: string
  }

  sales_channel_id?: string

  /**
   * The cart's email
   *
   * @since 2.11.0
   */
  email?: string

  /**
   * The cart's line items.
   */
  items?: ComputeActionItemLine[]

  /**
   * The cart's shipping methods.
   */
  shipping_methods?: ComputeActionShippingLine[]
}

/**
 * Options to configure how actions are computed.
 */
export interface ComputeActionOptions {
  /**
   * Whether to apply promotions having their `is_automatic` field enabled
   * automatically. If not provided, the automatic promotions are applied.
   */
  prevent_auto_promotions?: boolean

  /**
   * Whether to skip the usage limit checks.
   * Useful when recomputing adjustment for promotions that are already applied as a part of edit/exchange flows.
   *
   */
  skip_usage_limit_checks?: boolean
}
