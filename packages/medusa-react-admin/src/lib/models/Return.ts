/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReturnItem } from './ReturnItem';
import type { ShippingMethod } from './ShippingMethod';

/**
 * Return orders hold information about Line Items that a Customer wishes to send back, along with how the items will be returned. Returns can be used as part of a Swap.
 */
export type Return = {
  /**
   * The return's ID
   */
  id?: string;
  /**
   * Status of the Return.
   */
  status?: 'requested' | 'received' | 'requires_action' | 'canceled';
  /**
   * The Return Items that will be shipped back to the warehouse. Available if the relation `items` is expanded.
   */
  items?: Array<ReturnItem>;
  /**
   * The ID of the Swap that the Return is a part of.
   */
  swap_id?: string;
  /**
   * A swap object. Available if the relation `swap` is expanded.
   */
  swap?: Record<string, any>;
  /**
   * The ID of the Order that the Return is made from.
   */
  order_id?: string;
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Record<string, any>;
  /**
   * The ID of the Claim that the Return is a part of.
   */
  claim_order_id?: string;
  /**
   * A claim order object. Available if the relation `claim_order` is expanded.
   */
  claim_order?: Record<string, any>;
  /**
   * The Shipping Method that will be used to send the Return back. Can be null if the Customer facilitates the return shipment themselves. Available if the relation `shipping_method` is expanded.
   */
  shipping_method?: Array<ShippingMethod>;
  /**
   * Data about the return shipment as provided by the Fulfilment Provider that handles the return shipment.
   */
  shipping_data?: Record<string, any>;
  /**
   * The amount that should be refunded as a result of the return.
   */
  refund_amount: number;
  /**
   * When set to true, no notification will be sent related to this return.
   */
  no_notification?: boolean;
  /**
   * Randomly generated key used to continue the completion of the return in case of failure.
   */
  idempotency_key?: string;
  /**
   * The date with timezone at which the return was received.
   */
  received_at?: string;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

