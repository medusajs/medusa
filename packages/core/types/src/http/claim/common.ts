import { OperatorMap } from "../../dal"
import { ClaimReason, OrderClaimType } from "../../order"
import { BigNumberRawValue } from "../../totals"
import { FindParams } from "../common"
import {
  BaseOrder,
  BaseOrderShippingMethod,
  BaseOrderTransaction,
} from "../order/common"
import { BaseReturn } from "../return/common"

export interface BaseClaimItem {
  id: string
  claim_id: string
  order_id: string
  item_id: string
  quantity: number
  reason: ClaimReason
  raw_quantity: BigNumberRawValue
  metadata?: Record<string, unknown> | null
  created_at?: Date | string
  updated_at?: Date | string
}

export interface BaseClaim {
  /**
   * The claim's ID.
   */
  id: string
  /**
   * The claim's type.
   */
  type: OrderClaimType
  /**
   * The ID of the order this claim was created for.
   */
  order_id: string
  /**
   * The ID of the associated return.
   */
  return_id?: string
  /**
   * The claim's display ID.
   */
  display_id: number
  /**
   * The version of the order when the claim is applied.
   */
  order_version: string
  /**
   * The amount to be refunded due to this claim.
   */
  refund_amount?: number
  /**
   * The ID of the user that created this claim.
   */
  created_by?: string
  /**
   * The date the claim was created.
   */
  created_at: Date | string
  /**
   * The date the claim was updated.
   */
  updated_at: Date | string
  /**
   * The date the claim was canceled.
   */
  canceled_at: Date | string
  /**
   * The date the claim was deleted.
   */
  deleted_at?: Date | string
  /**
   * The claim's additional items if its `type` is `replace`.
   */
  additional_items: BaseClaimItem[]
  /**
   * The claim's items.
   */
  claim_items: BaseClaimItem[]
  /**
   * Whether to notify the customer about changes in the claim.
   */
  no_notification?: boolean
  /**
   * The order this claim was created for.
   */
  order?: BaseOrder
  /**
   * The associated return.
   */
  return?: BaseReturn
  /**
   * The shipping methods of the claim's additional items.
   */
  shipping_methods?: BaseOrderShippingMethod[]
  /**
   * The claim's transactions.
   */
  transactions?: BaseOrderTransaction[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface BaseClaimListParams extends FindParams {
  /**
   * Query or keywords to search the claim's searchable fields.
   */
  q?: string
  /**
   * Filter by ID(s).
   */
  id?: string | string[]
  /**
   * Retrieve the claims of the specified order ID(s).
   */
  order_id?: string | string[]
  /**
   * Filter by status(es).
   */
  status?: string | string[]
  /**
   * Filter by the claim's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the claim's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the claim's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
