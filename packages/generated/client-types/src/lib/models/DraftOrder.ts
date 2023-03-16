/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Order } from "./Order"

/**
 * Represents a draft order
 */
export interface DraftOrder {
  /**
   * The draft order's ID
   */
  id: string
  /**
   * The status of the draft order
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
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Cart | null
  /**
   * The ID of the order associated with the draft order.
   */
  order_id: string | null
  /**
   * An order object. Available if the relation `order` is expanded.
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
