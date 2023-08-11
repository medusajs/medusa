/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimOrder } from "./ClaimOrder"
import type { FulfillmentItem } from "./FulfillmentItem"
import type { FulfillmentProvider } from "./FulfillmentProvider"
import type { Order } from "./Order"
import type { Swap } from "./Swap"
import type { TrackingLink } from "./TrackingLink"

/**
 * A Fulfillment is created once an admin can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a fulfillment provider, which typically integrates a third-party shipping service. Fulfillments can be associated with orders, claims, swaps, and returns.
 */
export interface Fulfillment {
  /**
   * The fulfillment's ID
   */
  id: string
  /**
   * The ID of the Claim that the Fulfillment belongs to.
   */
  claim_order_id: string | null
  /**
   * The details of the claim that the fulfillment may belong to.
   */
  claim_order?: ClaimOrder | null
  /**
   * The ID of the Swap that the Fulfillment belongs to.
   */
  swap_id: string | null
  /**
   * The details of the swap that the fulfillment may belong to.
   */
  swap?: Swap | null
  /**
   * The ID of the Order that the Fulfillment belongs to.
   */
  order_id: string | null
  /**
   * The details of the order that the fulfillment may belong to.
   */
  order?: Order | null
  /**
   * The ID of the Fulfillment Provider responsible for handling the fulfillment.
   */
  provider_id: string
  /**
   * The details of the fulfillment provider responsible for handling the fulfillment.
   */
  provider?: FulfillmentProvider | null
  /**
   * The ID of the stock location the fulfillment will be shipped from
   */
  location_id: string | null
  /**
   * The Fulfillment Items in the Fulfillment. These hold information about how many of each Line Item has been fulfilled.
   */
  items?: Array<FulfillmentItem>
  /**
   * The Tracking Links that can be used to track the status of the Fulfillment. These will usually be provided by the Fulfillment Provider.
   */
  tracking_links?: Array<TrackingLink>
  /**
   * The tracking numbers that can be used to track the status of the fulfillment.
   * @deprecated
   */
  tracking_numbers: Array<string>
  /**
   * This contains all the data necessary for the Fulfillment provider to handle the fulfillment.
   */
  data: Record<string, any>
  /**
   * The date with timezone at which the Fulfillment was shipped.
   */
  shipped_at: string | null
  /**
   * Flag for describing whether or not notifications related to this should be sent.
   */
  no_notification: boolean | null
  /**
   * The date with timezone at which the Fulfillment was canceled.
   */
  canceled_at: string | null
  /**
   * Randomly generated key used to continue the completion of the fulfillment in case of failure.
   */
  idempotency_key: string | null
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
