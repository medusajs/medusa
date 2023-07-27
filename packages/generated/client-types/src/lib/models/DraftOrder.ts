/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Order } from "./Order"

/**
 * A draft order is created by an admin without direct involvement of the customer. Once its payment is marked as captured, it is transformed into an order.
 */
export interface DraftOrder {
  /**
   * The draft order's ID
   */
  id: string
  /**
   * The status of the draft order. It's changed to `completed` when it's transformed to an order.
   */
  status: "open" | "completed"
  /**
   * The draft order's display ID
   */
  display_id: string
  /**
   * The ID of the cart associated with the draft order.
   */
  cart_id: string | null
  /**
   * The details of the cart associated with the draft order.
   */
  cart?: Cart | null
  /**
   * The ID of the order created from the draft order when its payment is captured.
   */
  order_id: string | null
  /**
   * The details of the order created from the draft order when its payment is captured.
   */
  order?: Order | null
  /**
   * The date the draft order was canceled at.
   */
  canceled_at: string | null
  /**
   * The date the draft order was completed at.
   */
  completed_at: string | null
  /**
   * Whether to send the customer notifications regarding order updates.
   */
  no_notification_order: boolean | null
  /**
   * Randomly generated key used to continue the completion of the cart associated with the draft order in case of failure.
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
