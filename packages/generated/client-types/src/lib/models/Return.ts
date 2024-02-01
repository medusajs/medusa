/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimOrder } from "./ClaimOrder"
import type { Order } from "./Order"
import type { ReturnItem } from "./ReturnItem"
import type { ShippingMethod } from "./ShippingMethod"
import type { Swap } from "./Swap"

/**
 * A Return holds information about Line Items that a Customer wishes to send back, along with how the items will be returned. Returns can also be used as part of a Swap or a Claim.
 */
export interface Return {
  /**
   * The return's ID
   */
  id: string
  /**
   * Status of the Return.
   */
  status: "requested" | "received" | "requires_action" | "canceled"
  /**
   * The details of the items that the customer is returning.
   */
  items?: Array<ReturnItem>
  /**
   * The ID of the swap that the return may belong to.
   */
  swap_id: string | null
  /**
   * The details of the swap that the return may belong to.
   */
  swap?: Swap | null
  /**
   * The ID of the claim that the return may belong to.
   */
  claim_order_id: string | null
  /**
   * The details of the claim that the return may belong to.
   */
  claim_order?: ClaimOrder | null
  /**
   * The ID of the order that the return was created for.
   */
  order_id: string | null
  /**
   * The details of the order that the return was created for.
   */
  order?: Order | null
  /**
   * The details of the Shipping Method that will be used to send the Return back. Can be null if the Customer will handle the return shipment themselves.
   */
  shipping_method?: ShippingMethod | null
  /**
   * Data about the return shipment as provided by the Fulfilment Provider that handles the return shipment.
   */
  shipping_data: Record<string, any> | null
  /**
   * The ID of the stock location the return will be added back.
   */
  location_id: string | null
  /**
   * The amount that should be refunded as a result of the return.
   */
  refund_amount: number
  /**
   * When set to true, no notification will be sent related to this return.
   */
  no_notification: boolean | null
  /**
   * Randomly generated key used to continue the completion of the return in case of failure.
   */
  idempotency_key: string | null
  /**
   * The date with timezone at which the return was received.
   */
  received_at: string | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
