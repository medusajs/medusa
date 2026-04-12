import { ClaimReason } from "../../order/mutations"
import { BigNumberInput } from "../../totals"

/**
 * The details of a line item to add to an order.
 */
interface NewItem {
  /**
   * The ID of the variant to add to the order.
   */
  variant_id?: string
  /**
   * The title of the item to add to the order.
   */
  title?: string
  /**
   * The quantity of the item to add to the order.
   */
  quantity: BigNumberInput
  /**
   * The price of a single quantity of the item.
   */
  unit_price?: BigNumberInput | null
  /**
   * The original price of the item before a promotion or sale.
   */
  compare_at_unit_price?: BigNumberInput | null
  /**
   * A note viewed by admins only related to the item.
   */
  internal_note?: string | null
  /**
   * Custom key-value pairs to store additional information about the item.
   */
  metadata?: Record<string, any> | null
}

/**
 * The details of an existing item in an order.
 */
interface ExistingItem {
  /**
   * The ID of the order item.
   */
  id: string
  /**
   * The item's quantity.
   */
  quantity: BigNumberInput
  /**
   * The price of a single quantity of the item.
   */
  unit_price?: BigNumberInput | null
  /**
   * The original price of the item before a promotion or sale.
   */
  compare_at_unit_price?: BigNumberInput | null
  /**
   * A note viewed by admins only related to the item.
   */
  internal_note?: string | null
  /**
   * Custom key-value pairs to store additional information about the item.
   */
  metadata?: Record<string, any> | null
}

/**
 * The details of the outbound or new items to add to an exchange.
 */
export interface OrderExchangeAddNewItemWorkflowInput {
  /**
   * The ID of the exchange to add the items to.
   */
  exchange_id: string
  /**
   * The items to add to the exchange.
   */
  items: NewItem[]
}

/**
 * The details of the outbound or new items to add to a claim.
 */
export interface OrderClaimAddNewItemWorkflowInput {
  /**
   * The ID of the claim to add the items to.
   */
  claim_id: string
  /**
   * The items to add to the claim.
   */
  items: NewItem[]
}

/**
 * The details of the items to add to an order edit.
 */
export interface OrderEditAddNewItemWorkflowInput {
  /**
   * The ID of the order to add the items to its edit.
   */
  order_id: string
  /**
   * The items to add to the order's edit.
   */
  items: NewItem[]
}

/**
 * The details of updating an order items' quantity in the order's edit.
 */
export interface OrderEditUpdateItemQuantityWorkflowInput {
  /**
   * The ID of the order to update the items in its edit.
   */
  order_id: string
  /**
   * The order items to update their quantity in the order's edit.
   */
  items: ExistingItem[]
}

/**
 * The details of the line items to add to the order.
 */
export interface OrderAddLineItemWorkflowInput {
  /**
   * The ID of the order to add the line items to.
   */
  order_id: string
  /**
   * The items to add to the order.
   */
  items: NewItem[]
}

/**
 * The details of the outbound or new item to update in an order.
 */
export interface UpdateExchangeAddNewItemWorkflowInput {
  /**
   * The ID of the exchange to update the item in.
   */
  exchange_id: string
  /**
   * The ID of the action associated with the item to update.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find the action with the name `ITEM_ADD` using the item's `action` property,
   * and use the value of the action's `id` property.
   */
  action_id: string
  /**
   * The data to update in the item.
   */
  data: {
    /**
     * The new quantity of the item.
     */
    quantity?: BigNumberInput
    /**
     * A note viewed by admins only related to the item.
     */
    internal_note?: string | null
  }
}

/**
 * The details of the item to update in an order edit.
 */
export interface UpdateOrderEditAddNewItemWorkflowInput {
  /**
   * The ID of the order to update the item in its edit.
   */
  order_id: string
  /**
   * The ID of the action associated with the item to update.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find the action with the name `ITEM_ADD` using the item's `action` property,
   * and use the value of the action's `id` property.
   */
  action_id: string
  /**
   * The details to update in the item.
   */
  data: {
    /**
     * The new quantity of the item.
     */
    quantity?: BigNumberInput
    /**
     * The price of a single quantity of the item.
     */
    unit_price?: BigNumberInput | null
    /**
     * The original price of the item before a promotion or sale.
     */
    compare_at_unit_price?: BigNumberInput | null
    /**
     * A note viewed by admins only related to the item.
     */
    internal_note?: string | null
  }
}

/**
 * The details to update an existing order item that was added previously to an order edit.
 */
export interface UpdateOrderEditItemQuantityWorkflowInput
  extends UpdateOrderEditAddNewItemWorkflowInput {}

/**
 * The details to update a claim's outbound item.
 */
export interface UpdateClaimAddNewItemWorkflowInput {
  /**
   * The ID of the claim to update the outbound item in.
   */
  claim_id: string
  /**
   * The ID of the action associated with the item to update.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find the action with the name `ITEM_ADD` using the item's `action` property,
   * and use the value of the action's `id` property.
   */
  action_id: string
  /**
   * The details to update in the outbound item.
   */
  data: {
    /**
     * The new quantity of the item.
     */
    quantity?: BigNumberInput
    /**
     * A note viewed by admins only related to the item.
     */
    internal_note?: string | null
  }
}

export interface OrderExchangeItemWorkflowInput {
  exchange_id: string
  items: ExistingItem[]
}

export interface UpdateExchangeAddItemWorkflowInput {
  exchange_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
  }
}

/**
 * The details of the order items to add to a claim.
 */
export interface OrderClaimItemWorkflowInput {
  /**
   * The ID of the claim to add the items to.
   */
  claim_id: string
  /**
   * The items to add to the claim.
   */
  items: (ExistingItem & {
    /**
     * The reason for adding the item to the claim.
     */
    reason?: ClaimReason
  })[]
}

/**
 * The details of the item to update in a claim.
 */
export interface UpdateClaimItemWorkflowInput {
  /**
   * The ID of the claim to update the item in.
   */
  claim_id: string
  /**
   * The ID of the action associated with the item to update.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find the action with the name `WRITE_OFF_ITEM` using its `action` property,
   * and use the value of its `id` property.
   */
  action_id: string
  data: {
    quantity?: BigNumberInput
    reason_id?: string | null
    internal_note?: string | null
  }
}

/**
 * The details of the outbound item to remove from an exchange.
 */
export interface DeleteOrderExchangeItemActionWorkflowInput {
  /**
   * The ID of the exchange to remove the item from.
   */
  exchange_id: string
  /**
   * The ID of the action associated with the item to remove.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find the action with the name `ITEM_ADD` using the item's `action` property,
   * and use the value of the action's `id` property.
   */
  action_id: string
}

/**
 * The details of the item to remove from a claim.
 */
export interface DeleteOrderClaimItemActionWorkflowInput {
  /**
   * The ID of the claim to remove the item from.
   */
  claim_id: string
  /**
   * The ID of the action associated with the item to remove.
   */
  action_id: string
}

/**
 * The details to remove an item previously added to an order edit.
 */
export interface DeleteOrderEditItemActionWorkflowInput {
  /**
   * The ID of the order to remove the item from its edit.
   */
  order_id: string
  /**
   * The ID of the action associated with the item to remove.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find the action with the name `ITEM_ADD` using the item's `action` property,
   * and use the value of the action's `id` property.
   */
  action_id: string
}
