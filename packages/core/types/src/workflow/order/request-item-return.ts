import { BigNumberInput } from "../../totals"
import { CreateReturnItem } from "./create-return-order"

/**
 * The details of adding items to a return.
 */
export interface RequestItemReturnWorkflowInput {
  /**
   * The ID of the return to add the items to.
   */
  return_id: string
  /**
   * The ID of the claim associated with the return, if any.
   */
  claim_id?: string
  /**
   * The ID of the exchange associated with the return, if any.
   */
  exchange_id?: string
  /**
   * The items to add to the return.
   */
  items: CreateReturnItem[]
}

/**
 * The details of updating a requested item in a return.
 */
export interface UpdateRequestItemReturnWorkflowInput {
  /**
   * The ID of the return to update the item in.
   */
  return_id: string
  /**
   * The ID of the claim associated with the return, if any.
   */
  claim_id?: string
  /**
   * The ID of the exchange associated with the return, if any.
   */
  exchange_id?: string
  /**
   * The ID of the action associated with the item to update.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find an action with the name `RETURN_ITEM` using its `action` property,
   * and use the value of its `id` property.
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
     * An internal note viewed only by admin users.
     */
    internal_note?: string | null
    /**
     * The ID of the reason indicating why the item is being returned.
     */
    reason_id?: string | null
  }
}

/**
 * The details to return an item as part of an exchange.
 */
export interface OrderExchangeRequestItemReturnWorkflowInput {
  /**
   * The ID of the return that's associated with the exchange.
   */
  return_id: string
  /**
   * The ID of the location to return the items to.
   */
  location_id?: string
  /**
   * The ID of the exchange to add the inbound items to.
   */
  exchange_id: string
  /**
   * The items to return as part of the exchange.
   */
  items: CreateReturnItem[]
}
export interface DeleteOrderExchangeRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}

/**
 * The details of the items to be returned as part of the claim.
 */
export interface OrderClaimRequestItemReturnWorkflowInput {
  /**
   * The ID of the return that's associated with the claim.
   */
  return_id: string
  /**
   * The ID of the location to return the items to.
   */
  location_id?: string
  /**
   * The ID of the claim to add the items to.
   */
  claim_id: string
  /**
   * The items to add to the claim as inbound items.
   */
  items: CreateReturnItem[]
}

/**
 * The details of the item to be removed from the return.
 */
export interface DeleteRequestItemReturnWorkflowInput {
  /**
   * The ID of the return to remove the item from.
   */
  return_id: string
  /**
   * The ID of the action associated with the item to remove.
   * Every item has an `actions` property, whose value is an array of actions.
   * You can find an action with the name `RETURN_ITEM` using its `action` property,
   * and use the value of its `id` property.
   */
  action_id: string
}

/**
 * The details of the received item to be removed.
 *
 * @property return_id - The ID of the return to remove the item from.
 * @property action_id - The ID of the action associated with the item to remove.
 * Every item has an `actions` property, whose value is an array of actions.
 * You can find an action with the name `RECEIVE_RETURN_ITEM` using its `action` property,
 * and use the value of its `id` property.
 */
export interface DeleteRequestItemReceiveReturnWorkflowInput extends DeleteRequestItemReturnWorkflowInput {}

export interface DeleteOrderClaimRequestItemReturnWorkflowInput extends DeleteRequestItemReturnWorkflowInput {}
