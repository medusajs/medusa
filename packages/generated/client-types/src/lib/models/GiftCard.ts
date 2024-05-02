/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Order } from "./Order"
import type { Region } from "./Region"

/**
 * Gift Cards are redeemable and represent a value that can be used towards the payment of an Order.
 */
export interface GiftCard {
  /**
   * The gift card's ID
   */
  id: string
  /**
   * The unique code that identifies the Gift Card. This is used by the Customer to redeem the value of the Gift Card.
   */
  code: string
  /**
   * The value that the Gift Card represents.
   */
  value: number
  /**
   * The remaining value on the Gift Card.
   */
  balance: number
  /**
   * The ID of the region this gift card is available in.
   */
  region_id: string
  /**
   * The details of the region this gift card is available in.
   */
  region?: Region | null
  /**
   * The ID of the order that the gift card was purchased in.
   */
  order_id: string | null
  /**
   * The details of the order that the gift card was purchased in.
   */
  order?: Order | null
  /**
   * Whether the Gift Card has been disabled. Disabled Gift Cards cannot be applied to carts.
   */
  is_disabled: boolean
  /**
   * The time at which the Gift Card can no longer be used.
   */
  ends_at: string | null
  /**
   * The gift card's tax rate that will be applied on calculating totals
   */
  tax_rate: number | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
