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
 * Fulfillments are created once store operators can prepare the purchased goods. Fulfillments will eventually be shipped and hold information about how to track shipments. Fulfillments are created through a provider, which is typically an external shipping aggregator, shipping partner og 3PL, most plugins will have asynchronous communications with these providers through webhooks in order to automatically update and synchronize the state of Fulfillments.
 */
export interface Fulfillment {
  /**
   * The fulfillment's ID
   */
  id: string
  /**
   * The id of the Claim that the Fulfillment belongs to.
   */
  claim_order_id: string | null
  /**
   * A claim order object. Available if the relation `claim_order` is expanded.
   */
  claim_order?: ClaimOrder | null
  /**
   * The id of the Swap that the Fulfillment belongs to.
   */
  swap_id: string | null
  /**
   * A swap object. Available if the relation `swap` is expanded.
   */
  swap?: Swap | null
  /**
   * The id of the Order that the Fulfillment belongs to.
   */
  order_id: string | null
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Order | null
  /**
   * The id of the Fulfillment Provider responsible for handling the fulfillment
   */
  provider_id: string
  /**
   * Available if the relation `provider` is expanded.
   */
  provider?: FulfillmentProvider | null
  /**
   * The id of the stock location the fulfillment will be shipped from
   */
  location_id: string | null
  /**
   * The Fulfillment Items in the Fulfillment - these hold information about how many of each Line Item has been fulfilled. Available if the relation `items` is expanded.
   */
  items?: Array<FulfillmentItem>
  /**
   * The Tracking Links that can be used to track the status of the Fulfillment, these will usually be provided by the Fulfillment Provider. Available if the relation `tracking_links` is expanded.
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
