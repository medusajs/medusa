/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { LineItem } from "./LineItem"
import type { Order } from "./Order"
import type { OrderItemChange } from "./OrderItemChange"
import type { PaymentCollection } from "./PaymentCollection"

/**
 * Order edit allows modifying items in an order, such as adding, updating, or deleting items from the original order. Once the order edit is confirmed, the changes are reflected on the original order.
 */
export interface OrderEdit {
  /**
   * The order edit's ID
   */
  id: string
  /**
   * The ID of the order that is edited
   */
  order_id: string
  /**
   * The details of the order that this order edit was created for.
   */
  order?: Order | null
  /**
   * The details of all the changes on the original order's line items.
   */
  changes?: Array<OrderItemChange>
  /**
   * An optional note with additional details about the order edit.
   */
  internal_note: string | null
  /**
   * The unique identifier of the user or customer who created the order edit.
   */
  created_by: string
  /**
   * The unique identifier of the user or customer who requested the order edit.
   */
  requested_by: string | null
  /**
   * The date with timezone at which the edit was requested.
   */
  requested_at: string | null
  /**
   * The unique identifier of the user or customer who confirmed the order edit.
   */
  confirmed_by: string | null
  /**
   * The date with timezone at which the edit was confirmed.
   */
  confirmed_at: string | null
  /**
   * The unique identifier of the user or customer who declined the order edit.
   */
  declined_by: string | null
  /**
   * The date with timezone at which the edit was declined.
   */
  declined_at: string | null
  /**
   * An optional note why  the order edit is declined.
   */
  declined_reason: string | null
  /**
   * The unique identifier of the user or customer who cancelled the order edit.
   */
  canceled_by: string | null
  /**
   * The date with timezone at which the edit was cancelled.
   */
  canceled_at: string | null
  /**
   * The total of subtotal
   */
  subtotal?: number
  /**
   * The total of discount
   */
  discount_total?: number
  /**
   * The total of the shipping amount
   */
  shipping_total?: number
  /**
   * The total of the gift card amount
   */
  gift_card_total?: number
  /**
   * The total of the gift card tax amount
   */
  gift_card_tax_total?: number
  /**
   * The total of tax
   */
  tax_total?: number
  /**
   * The total amount of the edited order.
   */
  total?: number
  /**
   * The difference between the total amount of the order and total amount of edited order.
   */
  difference_due?: number
  /**
   * The status of the order edit.
   */
  status: "confirmed" | "declined" | "requested" | "created" | "canceled"
  /**
   * The details of the cloned items from the original order with the new changes. Once the order edit is confirmed, these line items are associated with the original order.
   */
  items?: Array<LineItem>
  /**
   * The ID of the payment collection
   */
  payment_collection_id: string | null
  /**
   * The details of the payment collection used to authorize additional payment if necessary.
   */
  payment_collection?: PaymentCollection | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
}
