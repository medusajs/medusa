import { OrderLineItemDTO } from "../../order"
import { BigNumberInput } from "../../totals"
import {
  CreateFulfillmentAddressWorkflowDTO,
  CreateFulfillmentLabelWorkflowDTO,
} from "../fulfillment/create-fulfillment"

/**
 * The details of an item in the fulfillment.
 */
interface CreateOrderFulfillmentItem {
  /**
   * The ID of the order's item to fulfill.
   */
  id: string
  /**
   * The quantity of the item to fulfill.
   */
  quantity: BigNumberInput
}

/**
 * The details of the fulfillment to create.
 */
export interface CreateOrderFulfillmentWorkflowInput {
  /**
   * The ID of the order to create the fulfillment for.
   */
  order_id: string

  /**
   * The list of items in the order. If not provided, the order's items are used.
   */
  items_list?: OrderLineItemDTO[]

  /**
   * The ID of the user who created the fulfillment.
   */
  created_by?: string

  /**
   * A list of items to be fulfilled.
   */
  items: CreateOrderFulfillmentItem[]

  /**
   * The labels to associate with the order.
   */
  labels?: CreateFulfillmentLabelWorkflowDTO[]

  /**
   * Whether the notify the customer about the fulfillment.
   */
  no_notification?: boolean

  /**
   * The ID of the stock location to fulfill items from. If not provided, the workflow uses the ID
   * of the location associated with the shipping option used by the order's
   * shipping method.
   */
  location_id?: string | null

  /**
   * Custom k-value pairs related to the fulfillment.
   */
  metadata?: Record<string, any> | null

  /**
   * Shipping option to be used for the fulfillment.
   */
  shipping_option_id?: string

  /**
   * The recipient address to use for the fulfillment. It's merged over the
   * order's shipping address, allowing you to override recipient details
   * (such as the first and last name) sent to the fulfillment provider.
   */
  delivery_address?: CreateFulfillmentAddressWorkflowDTO

  /**
   * Whether the fulfillment should be shipped.
   */
  requires_shipping?: boolean
}
