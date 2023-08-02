/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Address } from "./Address"
import type { ClaimItem } from "./ClaimItem"
import type { Fulfillment } from "./Fulfillment"
import type { LineItem } from "./LineItem"
import type { Order } from "./Order"
import type { Return } from "./Return"
import type { ShippingMethod } from "./ShippingMethod"

/**
 * A Claim represents a group of faulty or missing items. It consists of claim items that refer to items in the original order that should be replaced or refunded. It also includes details related to shipping and fulfillment.
 */
export interface ClaimOrder {
  /**
   * The claim's ID
   */
  id: string
  /**
   * The claim's type
   */
  type: "refund" | "replace"
  /**
   * The status of the claim's payment
   */
  payment_status: "na" | "not_refunded" | "refunded"
  /**
   * The claim's fulfillment status
   */
  fulfillment_status:
    | "not_fulfilled"
    | "partially_fulfilled"
    | "fulfilled"
    | "partially_shipped"
    | "shipped"
    | "partially_returned"
    | "returned"
    | "canceled"
    | "requires_action"
  /**
   * The details of the items that should be replaced or refunded.
   */
  claim_items?: Array<ClaimItem>
  /**
   * The details of the new items to be shipped when the claim's type is `replace`
   */
  additional_items?: Array<LineItem>
  /**
   * The ID of the order that the claim comes from.
   */
  order_id: string
  /**
   * The details of the order that this claim was created for.
   */
  order?: Order | null
  /**
   * The details of the return associated with the claim if the claim's type is `replace`.
   */
  return_order?: Return | null
  /**
   * The ID of the address that the new items should be shipped to
   */
  shipping_address_id: string | null
  /**
   * The details of the address that new items should be shipped to.
   */
  shipping_address?: Address | null
  /**
   * The details of the shipping methods that the claim order will be shipped with.
   */
  shipping_methods?: Array<ShippingMethod>
  /**
   * The fulfillments of the new items to be shipped
   */
  fulfillments?: Array<Fulfillment>
  /**
   * The amount that will be refunded in conjunction with the claim
   */
  refund_amount: number | null
  /**
   * The date with timezone at which the claim was canceled.
   */
  canceled_at: string | null
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
  /**
   * Flag for describing whether or not notifications related to this should be send.
   */
  no_notification: boolean | null
  /**
   * Randomly generated key used to continue the completion of the cart associated with the claim in case of failure.
   */
  idempotency_key: string | null
}
